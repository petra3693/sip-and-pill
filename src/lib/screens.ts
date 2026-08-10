import type { AppScreen, OnboardingStep } from "@/types";

/** Ordered onboarding flow (splash → … → reminders → home). */
export const ONBOARDING_FLOW: OnboardingStep[] = [
  "splash",
  "language",
  "name",
  "tracking",
  "disclaimer",
  "water-goal",
  "medications",
  "reminders",
];

/** Progress bar step (1–7) for onboarding screens that show the bar. */
export const ONBOARDING_PROGRESS: Partial<Record<AppScreen, number>> = {
  language: 1,
  name: 2,
  tracking: 3,
  disclaimer: 4,
  "water-goal": 5,
  medications: 6,
  reminders: 7,
};

export const ONBOARDING_TOTAL_STEPS = 7;

export const SCREEN_META: {
  id: AppScreen;
  label: string;
  dark?: boolean;
}[] = [
  { id: "splash", label: "Splash", dark: true },
  { id: "language", label: "Language" },
  { id: "name", label: "Name" },
  { id: "tracking", label: "Tracking" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "water-goal", label: "Water Goal" },
  { id: "medications", label: "Medications" },
  { id: "reminders", label: "Reminders" },
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "settings", label: "Settings" },
];
