import { DEFAULT_PREFERENCES, STORAGE_KEY, todayKey } from "@/lib/constants";
import type { UserPreferences } from "@/types";

function resetDailyProgress(prefs: UserPreferences): UserPreferences {
  const today = todayKey();
  if (prefs.lastLogDate === today) {
    return prefs;
  }

  return {
    ...prefs,
    lastLogDate: today,
    water: {
      ...prefs.water,
      glassesLoggedToday: 0,
    },
    medications: prefs.medications.map((med) => ({
      ...med,
      takenToday: false,
    })),
  };
}

export function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    const merged: UserPreferences = {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      water: {
        ...DEFAULT_PREFERENCES.water,
        ...parsed.water,
      },
      reminders: {
        ...DEFAULT_PREFERENCES.reminders,
        ...parsed.reminders,
        times:
          parsed.reminders?.times ?? DEFAULT_PREFERENCES.reminders.times,
      },
      notifications: {
        ...DEFAULT_PREFERENCES.notifications,
        ...parsed.notifications,
      },
      medications: parsed.medications ?? DEFAULT_PREFERENCES.medications,
    };

    return resetDailyProgress(merged);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function clearPreferences(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
