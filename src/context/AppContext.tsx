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
  buildMedReminders,
  clampWaterMl,
  createId,
  DEFAULT_PREFERENCES,
  DEFAULT_REMINDERS,
  notificationsFromSetup,
  todayKey,
} from "@/lib/constants";
import { translate } from "@/lib/i18n";
import { ONBOARDING_FLOW } from "@/lib/screens";
import {
  clearPreferences,
  loadPreferences,
  resetDailyProgress,
  savePreferences,
} from "@/lib/storage";
import type {
  AppScreen,
  AppTheme,
  CelebrationFlags,
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

const DASHBOARD_SCREENS = new Set<AppScreen>(["home", "about", "settings"]);

export function isDashboardScreen(screen: AppScreen): boolean {
  return DASHBOARD_SCREENS.has(screen);
}

interface AppContextValue {
  prefs: UserPreferences;
  screen: AppScreen;
  hydrated: boolean;
  setScreen: (screen: AppScreen) => void;
  goToNextOnboarding: () => void;
  goToPreviousOnboarding: () => void;
  setLanguage: (language: LanguageCode) => void;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
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
  updateReminderTime: (id: string, time: string) => void;
  /** Align medication reminder rows with the dose slots chosen on Meds screen. */
  syncMedReminders: (timesPerDay: number) => void;
  updateNotifications: (partial: Partial<NotificationSettings>) => void;
  markCelebrationShown: (kind: keyof Omit<CelebrationFlags, "date">) => void;
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
  lastLogDate: todayKey(),
  celebrations: {
    date: todayKey(),
    water: false,
    meds: false,
    both: false,
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

function previousOnboardingStep(
  current: OnboardingStep,
  trackingMode: TrackingMode
): OnboardingStep | null {
  const index = ONBOARDING_FLOW.indexOf(current);
  let prevIndex = index - 1;

  while (prevIndex >= 0) {
    const step = ONBOARDING_FLOW[prevIndex];
    if (step === "water-goal" && trackingMode === "meds") {
      prevIndex -= 1;
      continue;
    }
    if (step === "medications" && trackingMode === "water") {
      prevIndex -= 1;
      continue;
    }
    return step;
  }

  return null;
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
    // Always open on splash; Get Started routes to home if already set up.
    setScreen("splash");
    setHydrated(true);
  }, [demo, persist]);

  useEffect(() => {
    if (!hydrated || !persist || demo) {
      return;
    }
    savePreferences(prefs);
  }, [prefs, hydrated, persist, demo]);

  // Midnight daily reset while the app stays open.
  useEffect(() => {
    if (!hydrated || demo) return;

    const check = () => {
      setPrefs((prev) => {
        const next = resetDailyProgress(prev);
        return next === prev ? prev : next;
      });
    };

    check();
    const id = window.setInterval(check, 30_000);
    return () => window.clearInterval(id);
  }, [hydrated, demo]);

  // Dark by default everywhere. Light only on home / about / settings
  // when the user preference is light (persisted in prefs.theme).
  useEffect(() => {
    if (typeof document === "undefined") return;
    const lightOnDashboard =
      hydrated && isDashboardScreen(screen) && prefs.theme === "light";
    document.documentElement.classList.toggle("dark", !lightOnDashboard);
    try {
      window.localStorage.setItem("sip-theme", prefs.theme);
    } catch {
      // ignore quota / private mode
    }
  }, [hydrated, prefs.theme, screen]);

  const updatePrefs = useCallback(
    (updater: (prev: UserPreferences) => UserPreferences) => {
      setPrefs((prev) => updater(prev));
    },
    []
  );

  const goToNextOnboarding = useCallback(() => {
    if (screen === "splash" && prefs.onboardingComplete) {
      setScreen("home");
      return;
    }
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
  }, [prefs.trackingMode, prefs.onboardingComplete, screen]);

  const goToPreviousOnboarding = useCallback(() => {
    if (
      screen === "language" ||
      screen === "name" ||
      screen === "tracking" ||
      screen === "water-goal" ||
      screen === "medications" ||
      screen === "reminders"
    ) {
      const prev = previousOnboardingStep(screen, prefs.trackingMode);
      if (prev) setScreen(prev);
    }
  }, [prefs.trackingMode, screen]);

  const setLanguage = useCallback(
    (language: LanguageCode) => {
      updatePrefs((prev) => ({ ...prev, language }));
    },
    [updatePrefs]
  );

  const setTheme = useCallback(
    (theme: AppTheme) => {
      updatePrefs((prev) => ({ ...prev, theme }));
    },
    [updatePrefs]
  );

  const toggleTheme = useCallback(() => {
    updatePrefs((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  }, [updatePrefs]);

  const setName = useCallback(
    (name: string) => {
      updatePrefs((prev) => ({ ...prev, name }));
    },
    [updatePrefs]
  );

  const setTrackingMode = useCallback(
    (trackingMode: TrackingMode) => {
      updatePrefs((prev) => ({
        ...prev,
        trackingMode,
        notifications: notificationsFromSetup(
          trackingMode,
          prev.reminders.times,
        ),
      }));
    },
    [updatePrefs]
  );

  const updateWater = useCallback(
    (partial: Partial<WaterSettings>) => {
      updatePrefs((prev) => {
        const nextWater = { ...prev.water, ...partial };
        if (partial.dailyGoalMl != null) {
          nextWater.dailyGoalMl = clampWaterMl(partial.dailyGoalMl);
        }
        return {
          ...prev,
          water: nextWater,
          lastLogDate: todayKey(),
        };
      });
    },
    [updatePrefs]
  );

  const addMedication = useCallback(
    (timeSlot: MedTimeSlot, name?: string) => {
      updatePrefs((prev) => ({
        ...prev,
        medications: [
          ...prev.medications,
          {
            id: createId("med"),
            name: name ?? translate(prev.language, "newMedication"),
            dosage: translate(prev.language, "defaultDosage"),
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

  const updateReminderTime = useCallback(
    (id: string, time: string) => {
      updatePrefs((prev) => ({
        ...prev,
        reminders: {
          ...prev.reminders,
          times: prev.reminders.times.map((item) =>
            item.id === id ? { ...item, time } : item
          ),
        },
      }));
    },
    [updatePrefs]
  );

  const syncMedReminders = useCallback(
    (timesPerDay: number) => {
      updatePrefs((prev) => {
        const times = buildMedReminders(timesPerDay, prev.reminders.times);
        return {
          ...prev,
          reminders: {
            ...prev.reminders,
            times,
          },
          notifications: notificationsFromSetup(prev.trackingMode, times),
        };
      });
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

  const markCelebrationShown = useCallback(
    (kind: keyof Omit<CelebrationFlags, "date">) => {
      updatePrefs((prev) => ({
        ...prev,
        celebrations: {
          ...prev.celebrations,
          date: todayKey(),
          [kind]: true,
        },
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
      theme: "dark",
      lastLogDate: todayKey(),
      // Lock Settings toggles to what was chosen in the first-setup reminders flow.
      notifications: notificationsFromSetup(
        prev.trackingMode,
        prev.reminders.times,
      ),
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
      goToPreviousOnboarding,
      setLanguage,
      setTheme,
      toggleTheme,
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
      updateReminderTime,
      syncMedReminders,
      updateNotifications,
      markCelebrationShown,
      logGlass,
      completeOnboarding,
      resetAllData,
    }),
    [
      prefs,
      screen,
      hydrated,
      goToNextOnboarding,
      goToPreviousOnboarding,
      setLanguage,
      setTheme,
      toggleTheme,
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
      updateReminderTime,
      syncMedReminders,
      updateNotifications,
      markCelebrationShown,
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
