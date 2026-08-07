import { DEFAULT_PREFERENCES, LANGUAGES, STORAGE_KEY, todayKey } from "@/lib/constants";
import type { LanguageCode, UserPreferences } from "@/types";

const LANGUAGE_CODES = new Set(LANGUAGES.map((lang) => lang.code));

function normalizeLanguage(code: unknown): LanguageCode {
  if (typeof code === "string" && LANGUAGE_CODES.has(code as LanguageCode)) {
    return code as LanguageCode;
  }
  return DEFAULT_PREFERENCES.language;
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
      language: normalizeLanguage(parsed.language),
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
      celebrations: {
        ...DEFAULT_PREFERENCES.celebrations,
        ...parsed.celebrations,
      },
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
