"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createId,
  DEFAULT_PREFERENCES,
  DEFAULT_REMINDERS,
  todayKey,
} from "@/lib/constants";
import { ONBOARDING_FLOW } from "@/lib/screens";
import {
  clearPreferences,
  loadPreferences,
  savePreferences,
} from "@/lib/storage";
import type {
  AppScreen,
  LanguageCode,
  Medication,
  MedTimeSlot,
  NotificationSettings,
  OnboardingStep,
  ReminderFrequency,
  TrackingMode,
  UserPreferences,
  WaterSettings,
} from "@/types";

interface AppContextValue {
  prefs: UserPreferences;
  screen: AppScreen;
  hydrated: boolean;
  setScreen: (screen: AppScreen) => void;
  goToNextOnboarding: () => void;
  setLanguage: (language: LanguageCode) => void;
  setName: (name: string) => void;
  setTrackingMode: (mode: TrackingMode) => void;
  updateWater: (partial: Partial<WaterSettings>) => void;
  addMedication: (timeSlot: MedTimeSlot, name?: string) => void;
  updateMedication: (id: string, partial: Partial<Medication>) => void;
  removeMedication: (id: string) => void;
  toggleMedicationTaken: (id: string) => void;
  setReminderFrequency: (frequency: ReminderFrequency) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleReminderTime: (id: string) => void;
  updateNotifications: (partial: Partial<NotificationSettings>) => void;
  logGlass: (delta: number) => void;
  completeOnboarding: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const DEMO_PREFERENCES: UserPreferences = {
  ...DEFAULT_PREFERENCES,
  onboardingComplete: true,
  name: "Maria",
  language: "en",
  trackingMode: "both",
  water: {
    dailyGoalMl: 2000,
    glassSizeMl: 250,
    glassesLoggedToday: 5,
  },
  medications: [
    {
      id: "med-h1",
      name: "Vitamin D",
      dosage: "1 Capsule",
      timeSlot: "morning",
      takenToday: true,
    },
    {
      id: "med-h2",
      name: "Iron Supplement",
      dosage: "1 Tablet",
      timeSlot: "noon",
      takenToday: true,
    },
    {
      id: "med-h3",
      name: "Omega-3 Fish Oil",
      dosage: "2 Capsules",
      timeSlot: "evening",
      takenToday: false,
    },
  ],
  reminders: DEFAULT_REMINDERS,
  notifications: {
    waterReminders: true,
    pillAlarms: false,
  },
};

function nextOnboardingStep(
  current: OnboardingStep,
  trackingMode: TrackingMode
): AppScreen {
  const index = ONBOARDING_FLOW.indexOf(current);
  let nextIndex = index + 1;

  while (nextIndex < ONBOARDING_FLOW.length) {
    const step = ONBOARDING_FLOW[nextIndex];
    if (step === "water-goal" && trackingMode === "meds") {
      nextIndex += 1;
      continue;
    }
    if (step === "medications" && trackingMode === "water") {
      nextIndex += 1;
      continue;
    }
    return step;
  }

  return "home";
}

interface AppProviderProps {
  children: ReactNode;
  /** Persist prefs to localStorage (default true). */
  persist?: boolean;
  /** Seed demo data and skip hydration wait (for /gallery). */
  demo?: boolean;
}

export function AppProvider({
  children,
  persist = true,
  demo = false,
}: AppProviderProps) {
  const [prefs, setPrefs] = useState<UserPreferences>(
    demo ? DEMO_PREFERENCES : DEFAULT_PREFERENCES
  );
  const [screen, setScreen] = useState<AppScreen>(
    demo ? "home" : "splash"
  );
  const [hydrated, setHydrated] = useState(demo);

  useEffect(() => {
    if (demo || !persist) {
      setHydrated(true);
      return;
    }
    const loaded = loadPreferences();
    setPrefs(loaded);
    setScreen(loaded.onboardingComplete ? "home" : "splash");
    setHydrated(true);
  }, [demo, persist]);

  useEffect(() => {
    if (!hydrated || !persist || demo) {
      return;
    }
    savePreferences(prefs);
  }, [prefs, hydrated, persist, demo]);

  const updatePrefs = useCallback(
    (updater: (prev: UserPreferences) => UserPreferences) => {
      setPrefs((prev) => updater(prev));
    },
    []
  );

  const goToNextOnboarding = useCallback(() => {
    if (
      screen === "splash" ||
      screen === "language" ||
      screen === "name" ||
      screen === "tracking" ||
      screen === "water-goal" ||
      screen === "medications" ||
      screen === "reminders"
    ) {
      const next = nextOnboardingStep(screen, prefs.trackingMode);
      setScreen(next);
    }
  }, [prefs.trackingMode, screen]);

  const setLanguage = useCallback(
    (language: LanguageCode) => {
      updatePrefs((prev) => ({ ...prev, language }));
    },
    [updatePrefs]
  );

  const setName = useCallback(
    (name: string) => {
      updatePrefs((prev) => ({ ...prev, name }));
    },
    [updatePrefs]
  );

  const setTrackingMode = useCallback(
    (trackingMode: TrackingMode) => {
      updatePrefs((prev) => ({ ...prev, trackingMode }));
    },
    [updatePrefs]
  );

  const updateWater = useCallback(
    (partial: Partial<WaterSettings>) => {
      updatePrefs((prev) => ({
        ...prev,
        water: { ...prev.water, ...partial },
        lastLogDate: todayKey(),
      }));
    },
    [updatePrefs]
  );

  const addMedication = useCallback(
    (timeSlot: MedTimeSlot, name = "New medication") => {
      updatePrefs((prev) => ({
        ...prev,
        medications: [
          ...prev.medications,
          {
            id: createId("med"),
            name,
            dosage: "1 tablet",
            timeSlot,
            takenToday: false,
          },
        ],
      }));
    },
    [updatePrefs]
  );

  const updateMedication = useCallback(
    (id: string, partial: Partial<Medication>) => {
      updatePrefs((prev) => ({
        ...prev,
        medications: prev.medications.map((med) =>
          med.id === id ? { ...med, ...partial } : med
        ),
      }));
    },
    [updatePrefs]
  );

  const removeMedication = useCallback(
    (id: string) => {
      updatePrefs((prev) => ({
        ...prev,
        medications: prev.medications.filter((med) => med.id !== id),
      }));
    },
    [updatePrefs]
  );

  const toggleMedicationTaken = useCallback(
    (id: string) => {
      updatePrefs((prev) => ({
        ...prev,
        lastLogDate: todayKey(),
        medications: prev.medications.map((med) =>
          med.id === id ? { ...med, takenToday: !med.takenToday } : med
        ),
      }));
    },
    [updatePrefs]
  );

  const setReminderFrequency = useCallback(
    (frequency: ReminderFrequency) => {
      updatePrefs((prev) => ({
        ...prev,
        reminders: { ...prev.reminders, frequency },
      }));
    },
    [updatePrefs]
  );

  const setSoundEnabled = useCallback(
    (soundEnabled: boolean) => {
      updatePrefs((prev) => ({
        ...prev,
        reminders: {
          ...prev.reminders,
          soundEnabled,
          vibrationEnabled: soundEnabled,
        },
      }));
    },
    [updatePrefs]
  );

  const toggleReminderTime = useCallback(
    (id: string) => {
      updatePrefs((prev) => ({
        ...prev,
        reminders: {
          ...prev.reminders,
          times: prev.reminders.times.map((item) =>
            item.id === id ? { ...item, enabled: !item.enabled } : item
          ),
        },
      }));
    },
    [updatePrefs]
  );

  const updateNotifications = useCallback(
    (partial: Partial<NotificationSettings>) => {
      updatePrefs((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, ...partial },
      }));
    },
    [updatePrefs]
  );

  const logGlass = useCallback(
    (delta: number) => {
      updatePrefs((prev) => {
        const maxGlasses = Math.max(
          1,
          Math.round(prev.water.dailyGoalMl / prev.water.glassSizeMl)
        );
        const next = Math.min(
          maxGlasses,
          Math.max(0, prev.water.glassesLoggedToday + delta)
        );
        return {
          ...prev,
          lastLogDate: todayKey(),
          water: { ...prev.water, glassesLoggedToday: next },
        };
      });
    },
    [updatePrefs]
  );

  const completeOnboarding = useCallback(() => {
    updatePrefs((prev) => ({
      ...prev,
      onboardingComplete: true,
      lastLogDate: todayKey(),
    }));
    setScreen("home");
  }, [updatePrefs]);

  const resetAllData = useCallback(() => {
    if (persist && !demo) {
      clearPreferences();
    }
    setPrefs(demo ? DEMO_PREFERENCES : DEFAULT_PREFERENCES);
    setScreen(demo ? "home" : "splash");
  }, [demo, persist]);

  const value = useMemo<AppContextValue>(
    () => ({
      prefs,
      screen,
      hydrated,
      setScreen,
      goToNextOnboarding,
      setLanguage,
      setName,
      setTrackingMode,
      updateWater,
      addMedication,
      updateMedication,
      removeMedication,
      toggleMedicationTaken,
      setReminderFrequency,
      setSoundEnabled,
      toggleReminderTime,
      updateNotifications,
      logGlass,
      completeOnboarding,
      resetAllData,
    }),
    [
      prefs,
      screen,
      hydrated,
      goToNextOnboarding,
      setLanguage,
      setName,
      setTrackingMode,
      updateWater,
      addMedication,
      updateMedication,
      removeMedication,
      toggleMedicationTaken,
      setReminderFrequency,
      setSoundEnabled,
      toggleReminderTime,
      updateNotifications,
      logGlass,
      completeOnboarding,
      resetAllData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
