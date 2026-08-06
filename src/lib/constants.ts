import type {
  LanguageOption,
  Medication,
  ReminderSchedule,
  UserPreferences,
} from "@/types";

export const STORAGE_KEY = "sip-and-pill-prefs-v2";

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
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export const GLASS_SIZE_OPTIONS = [150, 200, 250, 330, 500] as const;

export const DEFAULT_MEDICATIONS: Medication[] = [
  {
    id: "med-1",
    name: "Blood pressure med",
    dosage: "1 tablet",
    timeSlot: "morning",
    takenToday: false,
  },
  {
    id: "med-2",
    name: "Diabetes med",
    dosage: "1 tablet",
    timeSlot: "morning",
    takenToday: false,
  },
  {
    id: "med-3",
    name: "Vitamin D",
    dosage: "1 Capsule",
    timeSlot: "noon",
    takenToday: false,
  },
  {
    id: "med-4",
    name: "Cholesterol med",
    dosage: "1 tablet",
    timeSlot: "evening",
    takenToday: false,
  },
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
  medications: DEFAULT_MEDICATIONS,
  reminders: DEFAULT_REMINDERS,
  notifications: {
    waterReminders: true,
    pillAlarms: false,
  },
  lastLogDate: "",
};

export const TIME_SLOT_LABELS: Record<
  "morning" | "noon" | "evening" | "night",
  string
> = {
  morning: "Morning",
  noon: "Noon",
  evening: "Evening",
  night: "Night",
};

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
