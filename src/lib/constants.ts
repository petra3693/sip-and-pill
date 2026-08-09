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

/** App version shown on splash + settings (keep in sync with package.json). */
export const APP_VERSION = "0.1.0";

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

/** Default clock + label for each medication dose slot. */
export const MED_SLOT_REMINDER_DEFAULTS: Record<
  MedTimeSlot,
  { label: string; time: string; icon: NonNullable<ReminderTime["icon"]> }
> = {
  morning: { label: "Morning", time: "8:00 AM", icon: "morning" },
  midmorning: { label: "Mid-morning", time: "10:00 AM", icon: "morning" },
  noon: { label: "Noon", time: "12:30 PM", icon: "noon" },
  afternoon: { label: "Afternoon", time: "3:00 PM", icon: "noon" },
  evening: { label: "Evening", time: "8:00 PM", icon: "evening" },
  night: { label: "Night", time: "10:00 PM", icon: "evening" },
};

/**
 * Build medication reminder rows for the first `timesPerDay` slots.
 * Preserves prior time/enabled when the same slot id already exists.
 */
export function buildMedReminders(
  timesPerDay: number,
  previous: ReminderTime[] = [],
): ReminderTime[] {
  const count = Math.min(
    MAX_MED_TIMES_PER_DAY,
    Math.max(1, Math.round(timesPerDay)),
  );
  return MED_TIME_SLOTS.slice(0, count).map((slot) => {
    const defaults = MED_SLOT_REMINDER_DEFAULTS[slot];
    const id = `rem-${slot}`;
    const prev =
      previous.find((item) => item.id === id) ??
      previous.find((item) => item.label === defaults.label);
    return {
      id,
      label: defaults.label,
      time: prev?.time ?? defaults.time,
      enabled: prev?.enabled ?? true,
      icon: defaults.icon,
    };
  });
}

export const DEFAULT_REMINDERS: ReminderSchedule = {
  frequency: "3x-daily",
  soundEnabled: true,
  vibrationEnabled: true,
  times: buildMedReminders(3),
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  onboardingComplete: false,
  language: "en",
  theme: "dark",
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

/** Integer glass count implied by a daily goal and glass size. */
export function glassesFromGoal(dailyGoalMl: number, glassSizeMl: number): number {
  const size = Math.max(1, glassSizeMl);
  const maxGlasses = Math.max(1, Math.floor(MAX_WATER_ML / size));
  const minGlasses = Math.max(1, Math.ceil(MIN_WATER_ML / size));
  return Math.min(
    maxGlasses,
    Math.max(minGlasses, Math.round(dailyGoalMl / size)),
  );
}

/**
 * Keep daily goal as an exact multiple of glass size (tracking is per glass).
 * Also clamps logged glasses if the goal shrinks.
 */
export function normalizeWaterSettings(water: {
  dailyGoalMl: number;
  glassSizeMl: number;
  glassesLoggedToday: number;
}): {
  dailyGoalMl: number;
  glassSizeMl: number;
  glassesLoggedToday: number;
} {
  const glassSizeMl = GLASS_SIZE_OPTIONS.includes(
    water.glassSizeMl as (typeof GLASS_SIZE_OPTIONS)[number],
  )
    ? water.glassSizeMl
    : GLASS_SIZE_OPTIONS.reduce((best, size) =>
        Math.abs(size - water.glassSizeMl) < Math.abs(best - water.glassSizeMl)
          ? size
          : best,
      );
  const glasses = glassesFromGoal(water.dailyGoalMl, glassSizeMl);
  const dailyGoalMl = glasses * glassSizeMl;
  const glassesLoggedToday = Math.min(
    glasses,
    Math.max(0, Math.round(water.glassesLoggedToday)),
  );
  return { dailyGoalMl, glassSizeMl, glassesLoggedToday };
}
