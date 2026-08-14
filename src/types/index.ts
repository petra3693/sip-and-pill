export type LanguageCode =
  | "en"
  | "hu"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ja"
  | "ko";

export type TrackingMode = "water" | "meds" | "both";

export type AppTheme = "light" | "dark";

export type MedTimeSlot =
  | "morning"
  | "midmorning"
  | "noon"
  | "afternoon"
  | "evening"
  | "night";

export interface CelebrationFlags {
  /** Local date key (YYYY-MM-DD) when celebrations were last cleared. */
  date: string;
  water: boolean;
  meds: boolean;
  both: boolean;
}

export type ReminderFrequency =
  | "every-glass"
  | "3x-daily"
  | "2x-daily"
  | "hourly"
  | "custom";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  timeSlot: MedTimeSlot;
  takenToday: boolean;
}

export interface ReminderTime {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
  icon?: "morning" | "noon" | "evening" | "custom";
}

export interface WaterReminderSlot {
  hour: number;
  minute: number;
}

export interface ReminderSchedule {
  frequency: ReminderFrequency;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  times: ReminderTime[];
  /**
   * Custom water reminder clock times. When omitted, slots are derived from
   * `frequency`. An empty array means the user removed every water reminder.
   */
  waterTimes?: WaterReminderSlot[];
}

export interface WaterSettings {
  dailyGoalMl: number;
  glassSizeMl: number;
  glassesLoggedToday: number;
}

export interface NotificationSettings {
  waterReminders: boolean;
  pillAlarms: boolean;
}

export interface UserPreferences {
  onboardingComplete: boolean;
  /** User acknowledged the medical disclaimer during onboarding. */
  medicalDisclaimerAccepted: boolean;
  language: LanguageCode;
  /** Dashboard theme (home / about / settings). Defaults to dark after onboarding. */
  theme: AppTheme;
  name: string;
  trackingMode: TrackingMode;
  /** Display unit; values are always stored in milliliters. */
  volumeUnit: "ml" | "fl_oz";
  water: WaterSettings;
  medications: Medication[];
  reminders: ReminderSchedule;
  notifications: NotificationSettings;
  /** Local calendar date (YYYY-MM-DD) of the current daily log period. */
  lastLogDate: string;
  celebrations: CelebrationFlags;
}

export type OnboardingStep =
  | "splash"
  | "language"
  | "name"
  | "tracking"
  | "disclaimer"
  | "water-goal"
  | "medications"
  | "reminders";

export type AppScreen = OnboardingStep | "home" | "settings" | "about";
