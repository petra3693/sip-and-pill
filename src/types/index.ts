export type LanguageCode =
  | "en"
  | "hu"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ja"
  | "ko"
  | "ru";

export type TrackingMode = "water" | "meds" | "both";

export type MedTimeSlot = "morning" | "noon" | "evening" | "night";

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

export interface ReminderSchedule {
  frequency: ReminderFrequency;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  times: ReminderTime[];
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
  language: LanguageCode;
  name: string;
  trackingMode: TrackingMode;
  water: WaterSettings;
  medications: Medication[];
  reminders: ReminderSchedule;
  notifications: NotificationSettings;
  lastLogDate: string;
}

export type OnboardingStep =
  | "splash"
  | "language"
  | "name"
  | "tracking"
  | "water-goal"
  | "medications"
  | "reminders";

export type AppScreen = OnboardingStep | "home" | "settings";
