import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import {
  DEFAULT_PREFERENCES,
  LANGUAGES,
  normalizeWaterSettings,
  STORAGE_KEY,
  todayKey,
} from "@/lib/constants";
import { cancelAllLocalNotifications } from "@/lib/notifications";
import type { AppTheme, LanguageCode, UserPreferences, WaterReminderSlot } from "@/types";

const LANGUAGE_CODES = new Set(LANGUAGES.map((lang) => lang.code));
const THEME_KEY = "sip-theme";

function normalizeLanguage(code: unknown): LanguageCode {
  if (typeof code === "string" && LANGUAGE_CODES.has(code as LanguageCode)) {
    return code as LanguageCode;
  }
  return DEFAULT_PREFERENCES.language;
}

function normalizeTheme(value: unknown): AppTheme {
  // Default dark; only an explicit "light" preference opts out on dashboard.
  return value === "light" ? "light" : "dark";
}

function normalizeWaterTimes(value: unknown): WaterReminderSlot[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .map((slot) => {
      if (!slot || typeof slot !== "object") return null;
      const hour = Number((slot as { hour?: unknown }).hour);
      const minute = Number((slot as { minute?: unknown }).minute);
      if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
      return {
        hour: ((Math.round(hour) % 24) + 24) % 24,
        minute: ((Math.round(minute) % 60) + 60) % 60,
      };
    })
    .filter((slot): slot is WaterReminderSlot => slot !== null);
}

export function resetDailyProgress(prefs: UserPreferences): UserPreferences {
  const today = todayKey();
  if (prefs.lastLogDate === today) {
    // Keep celebration flags in sync with the current day.
    if (prefs.celebrations.date === today) {
      return prefs;
    }
    return {
      ...prefs,
      celebrations: {
        date: today,
        water: false,
        meds: false,
        both: false,
      },
    };
  }

  // New local calendar day (after midnight): zero water + med intake.
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
    celebrations: {
      date: today,
      water: false,
      meds: false,
      both: false,
    },
  };
}

function parsePreferencesRaw(raw: string): UserPreferences {
  const parsed = JSON.parse(raw) as Partial<UserPreferences>;
  const merged: UserPreferences = {
    ...DEFAULT_PREFERENCES,
    ...parsed,
    language: normalizeLanguage(parsed.language),
    theme: normalizeTheme(parsed.theme),
    medicalDisclaimerAccepted: Boolean(parsed.medicalDisclaimerAccepted),
    volumeUnit: parsed.volumeUnit === "fl_oz" ? "fl_oz" : "ml",
    water: normalizeWaterSettings({
      ...DEFAULT_PREFERENCES.water,
      ...parsed.water,
    }),
    reminders: {
      ...DEFAULT_PREFERENCES.reminders,
      ...parsed.reminders,
      times: parsed.reminders?.times ?? DEFAULT_PREFERENCES.reminders.times,
      waterTimes: normalizeWaterTimes(parsed.reminders?.waterTimes),
    },
    notifications: {
      ...DEFAULT_PREFERENCES.notifications,
      ...parsed.notifications,
    },
    medications: parsed.medications ?? DEFAULT_PREFERENCES.medications,
    celebrations: {
      ...DEFAULT_PREFERENCES.celebrations,
      ...parsed.celebrations,
    },
  };
  return resetDailyProgress(merged);
}

/**
 * Load prefs: localStorage first; on native, fall back to Capacitor Preferences
 * and re-hydrate localStorage when recovering from the native mirror.
 */
export async function loadPreferences(): Promise<UserPreferences> {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const localRaw = window.localStorage.getItem(STORAGE_KEY);
    if (localRaw) {
      return parsePreferencesRaw(localRaw);
    }

    if (Capacitor.isNativePlatform()) {
      try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value) {
          try {
            window.localStorage.setItem(STORAGE_KEY, value);
          } catch {
            // private mode — still return parsed prefs
          }
          return parsePreferencesRaw(value);
        }
      } catch {
        // Preferences unavailable
      }
    }

    return DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify(prefs);
  window.localStorage.setItem(STORAGE_KEY, payload);
  // Mirror into Capacitor Preferences when available (native persistence).
  void Preferences.set({ key: STORAGE_KEY, value: payload }).catch(() => {
    // Web / unavailable — localStorage is enough.
  });
}

export function clearPreferences(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  void Preferences.remove({ key: STORAGE_KEY }).catch(() => undefined);
}

/**
 * Guideline 5.1.1(v)/(ix): permanently erase all app-local user data.
 * Clears Web localStorage keys we own, Capacitor Preferences, and cancels notifications.
 * No IndexedDB is used by this app.
 */
export async function wipeAllLocalData(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(THEME_KEY);
    } catch {
      // private mode
    }
  }

  try {
    await Preferences.clear();
  } catch {
    try {
      await Preferences.remove({ key: STORAGE_KEY });
      await Preferences.remove({ key: THEME_KEY });
    } catch {
      // ignore
    }
  }

  await cancelAllLocalNotifications();
}
