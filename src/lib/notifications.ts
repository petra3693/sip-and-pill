import { Capacitor } from "@capacitor/core";
import {
  LocalNotifications,
  type LocalNotificationSchema,
  type PendingLocalNotificationSchema,
} from "@capacitor/local-notifications";
import { translate } from "@/lib/i18n";
import { formatTimeDisplay, parseTimeToMinutes } from "@/lib/time";
import type { LanguageCode, UserPreferences, WaterReminderSlot } from "@/types";

export const WATER_BASE_ID = 1000;
export const PILL_BASE_ID = 2000;
const ANDROID_CHANNEL_ID = "sip-reminders";

export type NotificationCopy = {
  waterTitle: string;
  waterBody: string;
  pillTitle: string;
  pillBody: string;
};

export type PendingReminderKind = "water" | "pills";

export type PendingReminder = {
  id: number;
  kind: PendingReminderKind;
  title: string;
  body: string;
  hour: number;
  minute: number;
  label: string;
  reminderId?: string;
  slotIndex: number;
};

type ReminderExtra = {
  kind: PendingReminderKind;
  hour: number;
  minute: number;
  at: string;
  label: string;
  reminderId?: string;
  slotIndex: number;
};

export function notificationCopy(language: LanguageCode): NotificationCopy {
  return {
    waterTitle: translate(language, "notificationWaterTitle"),
    waterBody: translate(language, "notificationWaterBody"),
    pillTitle: translate(language, "notificationPillTitle"),
    pillBody: translate(language, "notificationPillBody"),
  };
}

function isNative(): boolean {
  return typeof window !== "undefined" && Capacitor.isNativePlatform();
}

/** Next local wall-clock occurrence of hour:minute (always in the future). */
export function nextOccurrence(hour: number, minute: number, from = new Date()): Date {
  const at = new Date(from);
  at.setHours(hour, minute, 0, 0);
  if (at.getTime() <= from.getTime()) {
    at.setDate(at.getDate() + 1);
  }
  return at;
}

export function waterSlotsFromFrequency(
  frequency: UserPreferences["reminders"]["frequency"],
): WaterReminderSlot[] {
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

export function resolveWaterSlots(prefs: UserPreferences): WaterReminderSlot[] {
  if (Array.isArray(prefs.reminders.waterTimes)) {
    return prefs.reminders.waterTimes.map((slot) => ({
      hour: ((slot.hour % 24) + 24) % 24,
      minute: ((slot.minute % 60) + 60) % 60,
    }));
  }
  return waterSlotsFromFrequency(prefs.reminders.frequency);
}

function enabledPillTimes(prefs: UserPreferences) {
  return prefs.reminders.times.filter((item) => item.enabled);
}

/**
 * Daily wall-clock schedule.
 *
 * Capacitor maps `schedule.at` + `repeats` to a time-interval trigger
 * (repeats every N seconds until the first fire — not "every day at 9:00").
 * `on: { hour, minute, second }` is UNCalendarNotificationTrigger on iOS and
 * DateMatch on Android, which is the reliable daily path.
 */
function nativeDailySchedule(
  hour: number,
  minute: number,
): NonNullable<LocalNotificationSchema["schedule"]> {
  return {
    on: { hour, minute, second: 0 },
    allowWhileIdle: true,
  };
}

async function ensureAndroidChannel(): Promise<void> {
  if (Capacitor.getPlatform() !== "android") return;
  try {
    await LocalNotifications.createChannel({
      id: ANDROID_CHANNEL_ID,
      name: "Reminders",
      description: "Water and medication reminders",
      importance: 5,
      visibility: 1,
      vibration: true,
      lights: true,
    });
  } catch {
    // Channel APIs are Android-only.
  }
}

function buildNotification(input: {
  id: number;
  title: string;
  body: string;
  hour: number;
  minute: number;
  soundEnabled: boolean;
  kind: PendingReminderKind;
  label: string;
  slotIndex: number;
  reminderId?: string;
}): LocalNotificationSchema {
  const at = nextOccurrence(input.hour, input.minute);
  const extra: ReminderExtra = {
    kind: input.kind,
    hour: input.hour,
    minute: input.minute,
    at: at.toISOString(),
    label: input.label,
    slotIndex: input.slotIndex,
    reminderId: input.reminderId,
  };
  const notification: LocalNotificationSchema = {
    id: input.id,
    title: input.title,
    body: input.body,
    schedule: nativeDailySchedule(input.hour, input.minute),
    extra,
    threadIdentifier: input.kind,
  };

  if (input.soundEnabled) {
    notification.sound = "default";
  }

  if (Capacitor.getPlatform() === "android") {
    notification.channelId = ANDROID_CHANNEL_ID;
  }

  return notification;
}

function notificationsFromPrefs(
  prefs: UserPreferences,
  copy: NotificationCopy,
): LocalNotificationSchema[] {
  const notifications: LocalNotificationSchema[] = [];
  const soundEnabled = prefs.reminders.soundEnabled;

  if (prefs.notifications.waterReminders && prefs.trackingMode !== "meds") {
    resolveWaterSlots(prefs).forEach((slot, index) => {
      notifications.push(
        buildNotification({
          id: WATER_BASE_ID + index,
          title: copy.waterTitle,
          body: copy.waterBody,
          hour: slot.hour,
          minute: slot.minute,
          soundEnabled,
          kind: "water",
          label: "water",
          slotIndex: index,
        }),
      );
    });
  }

  if (prefs.notifications.pillAlarms && prefs.trackingMode !== "water") {
    enabledPillTimes(prefs).forEach((item, index) => {
      const minutes = parseTimeToMinutes(item.time);
      const hour = Math.floor(minutes / 60) % 24;
      const minute = minutes % 60;
      notifications.push(
        buildNotification({
          id: PILL_BASE_ID + index,
          title: copy.pillTitle,
          body: copy.pillBody.replace("{name}", item.label),
          hour,
          minute,
          soundEnabled,
          kind: "pills",
          label: item.label,
          slotIndex: index,
          reminderId: item.id,
        }),
      );
    });
  }

  return notifications;
}

export function remindersFromPrefs(prefs: UserPreferences): PendingReminder[] {
  return notificationsFromPrefs(prefs, notificationCopy(prefs.language))
    .map((item) => pendingFromSchema(item))
    .sort(comparePending);
}

function pendingFromSchema(
  item: Pick<LocalNotificationSchema, "id" | "title" | "body" | "extra">,
): PendingReminder {
  const extra = (item.extra ?? {}) as Partial<ReminderExtra>;
  const id = item.id;
  const kind: PendingReminderKind =
    extra.kind === "pills" || extra.kind === "water"
      ? extra.kind
      : id >= PILL_BASE_ID
        ? "pills"
        : "water";
  const hour =
    typeof extra.hour === "number"
      ? extra.hour
      : 8;
  const minute = typeof extra.minute === "number" ? extra.minute : 0;
  const slotIndex =
    typeof extra.slotIndex === "number"
      ? extra.slotIndex
      : kind === "pills"
        ? id - PILL_BASE_ID
        : id - WATER_BASE_ID;

  return {
    id,
    kind,
    title: item.title,
    body: item.body,
    hour,
    minute,
    label: extra.label ?? (kind === "water" ? "water" : item.title),
    reminderId: extra.reminderId,
    slotIndex,
  };
}

function comparePending(a: PendingReminder, b: PendingReminder): number {
  return a.hour * 60 + a.minute - (b.hour * 60 + b.minute) || a.id - b.id;
}

function readPendingHourMinute(
  notification: PendingLocalNotificationSchema,
): { hour: number; minute: number } | null {
  const extra = (notification.extra ?? {}) as Partial<ReminderExtra>;
  if (typeof extra.hour === "number" && typeof extra.minute === "number") {
    return { hour: extra.hour, minute: extra.minute };
  }
  const on = notification.schedule?.on;
  if (typeof on?.hour === "number" && typeof on.minute === "number") {
    return { hour: on.hour, minute: on.minute };
  }
  if (typeof extra.at === "string") {
    const date = new Date(extra.at);
    if (!Number.isNaN(date.getTime())) {
      return { hour: date.getHours(), minute: date.getMinutes() };
    }
  }
  const at = notification.schedule?.at;
  if (at instanceof Date && !Number.isNaN(at.getTime())) {
    return { hour: at.getHours(), minute: at.getMinutes() };
  }
  return null;
}

function mapNativePending(
  notification: PendingLocalNotificationSchema,
): PendingReminder | null {
  const clock = readPendingHourMinute(notification);
  if (!clock) return null;
  const extra = (notification.extra ?? {}) as Partial<ReminderExtra>;
  const id = notification.id;
  const kind: PendingReminderKind =
    extra.kind === "pills" || extra.kind === "water"
      ? extra.kind
      : id >= PILL_BASE_ID
        ? "pills"
        : "water";
  const slotIndex =
    typeof extra.slotIndex === "number"
      ? extra.slotIndex
      : kind === "pills"
        ? id - PILL_BASE_ID
        : id - WATER_BASE_ID;

  return {
    id,
    kind,
    title: notification.title,
    body: notification.body,
    hour: clock.hour,
    minute: clock.minute,
    label: extra.label ?? (kind === "water" ? "water" : notification.title),
    reminderId: extra.reminderId,
    slotIndex,
  };
}

/**
 * Request notification permission. On native iOS/Android this shows the OS
 * dialog via LocalNotifications. On web it uses the Notification API.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (!isNative()) {
    if (typeof Notification === "undefined") return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  }

  try {
    // Call requestPermissions() directly from the user-gesture (button tap).
    // Awaiting checkPermissions() first can drop iOS user-activation and hide the OS dialog.
    const requested = await LocalNotifications.requestPermissions();
    return requested.display === "granted";
  } catch (error) {
    console.warn("[notifications] permission request failed", error);
    return false;
  }
}

/** @deprecated Use `requestNotificationPermission`. */
export const ensureNotificationPermission = requestNotificationPermission;

export async function hasNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (!isNative()) {
    return typeof Notification !== "undefined" && Notification.permission === "granted";
  }

  try {
    const current = await LocalNotifications.checkPermissions();
    return current.display === "granted";
  } catch {
    return false;
  }
}

let listenersBound = false;

/**
 * Foreground delivery is configured in capacitor.config.ts
 * (`presentationOptions`). The listener keeps the plugin hooked so iOS
 * presents banners while the app is open.
 */
export async function initLocalNotificationListeners(): Promise<void> {
  if (!isNative() || listenersBound) return;
  listenersBound = true;

  try {
    await LocalNotifications.addListener("localNotificationReceived", () => {
      // Banner/sound/list come from presentationOptions.
    });
    await LocalNotifications.addListener(
      "localNotificationActionPerformed",
      () => {
        // Tap opens the app; Home is already the default screen.
      },
    );
  } catch (error) {
    listenersBound = false;
    console.warn("[notifications] listener setup failed", error);
  }
}

export async function cancelAllLocalNotifications(): Promise<void> {
  if (!isNative()) return;
  try {
    const pending = await LocalNotifications.getPending();
    const ids = pending.notifications.map((n) => ({ id: n.id }));
    if (ids.length) {
      await LocalNotifications.cancel({ notifications: ids });
    }
  } catch (error) {
    console.warn("[notifications] cancel failed", error);
  }
}

export async function cancelPendingReminder(id: number): Promise<void> {
  if (!isNative()) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id }] });
  } catch (error) {
    console.warn("[notifications] cancel by id failed", error);
  }
}

/**
 * Native pending list from `LocalNotifications.getPending()`.
 * On web (or if the plugin returns nothing while prefs still have reminders)
 * falls back to the locally derived schedule so Settings stays usable.
 */
export async function listPendingReminders(
  prefs: UserPreferences,
): Promise<PendingReminder[]> {
  const fromPrefs = remindersFromPrefs(prefs);

  if (!isNative()) return fromPrefs;

  try {
    const pending = await LocalNotifications.getPending();
    const mapped = pending.notifications
      .map(mapNativePending)
      .filter((item): item is PendingReminder => item !== null)
      .sort(comparePending);
    if (mapped.length > 0) return mapped;
  } catch (error) {
    console.warn("[notifications] getPending failed", error);
  }

  return fromPrefs;
}

export function prefsWithUpdatedPendingTime(
  prefs: UserPreferences,
  reminder: PendingReminder,
  hour: number,
  minute: number,
): UserPreferences {
  if (reminder.kind === "water") {
    const slots = resolveWaterSlots(prefs).map((slot, index) =>
      index === reminder.slotIndex ? { hour, minute } : slot,
    );
    return {
      ...prefs,
      reminders: {
        ...prefs.reminders,
        waterTimes: slots,
      },
    };
  }

  const targetId =
    reminder.reminderId ??
    enabledPillTimes(prefs)[reminder.slotIndex]?.id;
  if (!targetId) return prefs;

  return {
    ...prefs,
    reminders: {
      ...prefs.reminders,
      times: prefs.reminders.times.map((item) =>
        item.id === targetId
          ? { ...item, time: formatTimeDisplay(hour, minute) }
          : item,
      ),
    },
  };
}

export function prefsWithDeletedPending(
  prefs: UserPreferences,
  reminder: PendingReminder,
): UserPreferences {
  if (reminder.kind === "water") {
    const waterTimes = resolveWaterSlots(prefs).filter(
      (_, index) => index !== reminder.slotIndex,
    );
    return {
      ...prefs,
      reminders: {
        ...prefs.reminders,
        waterTimes,
      },
      notifications: {
        ...prefs.notifications,
        waterReminders: waterTimes.length > 0 && prefs.notifications.waterReminders,
      },
    };
  }

  const targetId =
    reminder.reminderId ??
    enabledPillTimes(prefs)[reminder.slotIndex]?.id;
  if (!targetId) return prefs;

  const times = prefs.reminders.times.map((item) =>
    item.id === targetId ? { ...item, enabled: false } : item,
  );
  return {
    ...prefs,
    reminders: {
      ...prefs.reminders,
      times,
    },
    notifications: {
      ...prefs.notifications,
      pillAlarms: times.some((item) => item.enabled) && prefs.notifications.pillAlarms,
    },
  };
}

export async function reschedulePendingReminder(
  prefs: UserPreferences,
  reminder: PendingReminder,
  hour: number,
  minute: number,
): Promise<void> {
  if (!isNative()) return;

  const copy = notificationCopy(prefs.language);
  const scheduled = notificationsFromPrefs(prefs, copy).find(
    (item) => item.id === reminder.id,
  );
  const payload =
    scheduled ??
    buildNotification({
      id: reminder.id,
      title: reminder.kind === "water" ? copy.waterTitle : copy.pillTitle,
      body:
        reminder.kind === "water"
          ? copy.waterBody
          : copy.pillBody.replace("{name}", reminder.label),
      hour,
      minute,
      soundEnabled: prefs.reminders.soundEnabled,
      kind: reminder.kind,
      label: reminder.label,
      slotIndex: reminder.slotIndex,
      reminderId: reminder.reminderId,
    });

  try {
    await cancelPendingReminder(reminder.id);
    await ensureAndroidChannel();
    await LocalNotifications.schedule({ notifications: [payload] });
  } catch (error) {
    console.warn("[notifications] reschedule failed", error);
  }
}

/**
 * Replace pending local notifications from the current prefs.
 * Call after an explicit user action (enable reminder / finish setup)
 * and again when the app returns to the foreground.
 */
export async function syncLocalNotifications(
  prefs: UserPreferences,
  copy: NotificationCopy = notificationCopy(prefs.language),
): Promise<void> {
  if (!isNative()) return;

  try {
    await cancelAllLocalNotifications();

    const remindersOn =
      (prefs.notifications.waterReminders && prefs.trackingMode !== "meds") ||
      (prefs.notifications.pillAlarms && prefs.trackingMode !== "water");

    if (!remindersOn) return;

    const granted = await hasNotificationPermission();
    if (!granted) return;

    await ensureAndroidChannel();

    const notifications = notificationsFromPrefs(prefs, copy);
    if (notifications.length === 0) return;

    await LocalNotifications.schedule({ notifications });
  } catch (error) {
    console.warn("[notifications] schedule failed", error);
  }
}
