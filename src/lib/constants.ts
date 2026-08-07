import type {
  LanguageOption,
  MedTimeSlot,
  NotificationSettings,
  ReminderSchedule,
  ReminderTime,
  TrackingMode,
  UserPreferences,
} from "@/types";

export const STORAGE_KEY = "sip-and-pill-prefs-v2";

/** Maximum daily water intake in milliliters. */
export const MAX_WATER_ML = 10_000;

/** Minimum daily water intake in milliliters. */
export const MIN_WATER_ML = 250;

/** Maximum medication dose times per day. */
export const MAX_MED_TIMES_PER_DAY = 6;

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hu", label: "Magyar", flag: "🇭🇺" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
];

export const GLASS_SIZE_OPTIONS = [150, 200, 250, 330, 500] as const;

export const MED_TIME_SLOTS: MedTimeSlot[] = [
  "morning",
  "midmorning",
  "noon",
  "afternoon",
  "evening",
  "night",
];

export const DEFAULT_REMINDERS: ReminderSchedule = {
  frequency: "3x-daily",
  soundEnabled: true,
  vibrationEnabled: true,
  times: [
    {
      id: "rem-1",
      label: "Morning",
      time: "8:00 AM",
      enabled: true,
      icon: "morning",
    },
    {
      id: "rem-2",
      label: "Noon",
      time: "12:30 PM",
      enabled: true,
      icon: "noon",
    },
    {
      id: "rem-3",
      label: "Evening",
      time: "8:00 PM",
      enabled: true,
      icon: "evening",
    },
    {
      id: "rem-4",
      label: "Custom",
      time: "11:00 AM",
      enabled: false,
      icon: "custom",
    },
  ],
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  onboardingComplete: false,
  language: "en",
  name: "",
  trackingMode: "both",
  water: {
    dailyGoalMl: 2000,
    glassSizeMl: 250,
    glassesLoggedToday: 0,
  },
  medications: [],
  reminders: DEFAULT_REMINDERS,
  notifications: {
    waterReminders: true,
    // Matches DEFAULT_REMINDERS (morning / noon / evening enabled).
    pillAlarms: true,
  },
  lastLogDate: "",
  celebrations: {
    date: "",
    water: false,
    meds: false,
    both: false,
  },
};

/**
 * Settings notification toggles derived from onboarding choices:
 * tracking mode + which medication reminder times were left on.
 */
export function notificationsFromSetup(
  trackingMode: TrackingMode,
  reminderTimes: ReminderTime[],
): NotificationSettings {
  const tracksWater = trackingMode !== "meds";
  const tracksMeds = trackingMode !== "water";
  const anyMedReminderOn = reminderTimes.some((time) => time.enabled);

  return {
    waterReminders: tracksWater,
    pillAlarms: tracksMeds && anyMedReminderOn,
  };
}

/** Local calendar date key for daily reset boundaries (midnight). */
export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function clampWaterMl(ml: number): number {
  return Math.min(MAX_WATER_ML, Math.max(MIN_WATER_ML, Math.round(ml)));
}
