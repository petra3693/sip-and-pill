import { Capacitor } from "@capacitor/core";
import {
  LocalNotifications,
  type ScheduleEvery,
} from "@capacitor/local-notifications";
import { parseTimeToMinutes } from "@/lib/time";
import type { UserPreferences } from "@/types";

const WATER_BASE_ID = 1000;
const PILL_BASE_ID = 2000;

export async function ensureNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      return true;
    }
    if (typeof Notification !== "undefined" && Notification.permission !== "denied") {
      const result = await Notification.requestPermission();
      return result === "granted";
    }
    return false;
  }

  try {
    const current = await LocalNotifications.checkPermissions();
    if (current.display === "granted") return true;
    if (current.display === "denied") return false;
    const requested = await LocalNotifications.requestPermissions();
    return requested.display === "granted";
  } catch {
    return false;
  }
}

function waterReminderSlots(frequency: UserPreferences["reminders"]["frequency"]): {
  hour: number;
  minute: number;
}[] {
  // Local wall-clock slots — not UTC absolute times (DST-safe).
  switch (frequency) {
    case "every-glass":
    case "hourly":
      return [8, 10, 12, 14, 16, 18, 20].map((hour) => ({ hour, minute: 0 }));
    case "3x-daily":
      return [
        { hour: 9, minute: 0 },
        { hour: 13, minute: 0 },
        { hour: 19, minute: 0 },
      ];
    case "2x-daily":
      return [
        { hour: 10, minute: 0 },
        { hour: 18, minute: 0 },
      ];
    case "custom":
    default:
      return [
        { hour: 9, minute: 0 },
        { hour: 15, minute: 0 },
        { hour: 20, minute: 0 },
      ];
  }
}

/**
 * Sync local notifications from prefs.
 * Uses repeating `on: { hour, minute }` schedules = local wall clock (DST-safe).
 * Call only after an explicit user action that enables reminders / finishes setup.
 */
export async function syncLocalNotifications(
  prefs: UserPreferences,
  copy: {
    waterTitle: string;
    waterBody: string;
    pillTitle: string;
    pillBody: string;
  },
): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const pending = await LocalNotifications.getPending();
    const ids = pending.notifications.map((n) => ({ id: n.id }));
    if (ids.length) {
      await LocalNotifications.cancel({ notifications: ids });
    }

    const notifications: {
      id: number;
      title: string;
      body: string;
      schedule: {
        on: { hour: number; minute: number };
        repeats: boolean;
        every?: ScheduleEvery;
        allowWhileIdle: boolean;
      };
    }[] = [];

    if (prefs.notifications.waterReminders && prefs.trackingMode !== "meds") {
      waterReminderSlots(prefs.reminders.frequency).forEach((slot, index) => {
        notifications.push({
          id: WATER_BASE_ID + index,
          title: copy.waterTitle,
          body: copy.waterBody,
          schedule: {
            on: { hour: slot.hour, minute: slot.minute },
            repeats: true,
            every: "day",
            allowWhileIdle: true,
          },
        });
      });
    }

    if (prefs.notifications.pillAlarms && prefs.trackingMode !== "water") {
      prefs.reminders.times
        .filter((item) => item.enabled)
        .forEach((item, index) => {
          const minutes = parseTimeToMinutes(item.time);
          const hour = Math.floor(minutes / 60) % 24;
          const minute = minutes % 60;
          notifications.push({
            id: PILL_BASE_ID + index,
            title: copy.pillTitle,
            body: copy.pillBody.replace("{name}", item.label),
            schedule: {
              on: { hour, minute },
              repeats: true,
              every: "day",
              allowWhileIdle: true,
            },
          });
        });
    }

    if (notifications.length === 0) return;
    await LocalNotifications.schedule({ notifications });
  } catch {
    // Scheduling failed — app remains usable offline without alarms.
  }
}

export async function cancelAllLocalNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const pending = await LocalNotifications.getPending();
    const ids = pending.notifications.map((n) => ({ id: n.id }));
    if (ids.length) {
      await LocalNotifications.cancel({ notifications: ids });
    }
  } catch {
    // ignore
  }
}
