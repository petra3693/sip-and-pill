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
  createId,
  DEFAULT_PREFERENCES,
  DEFAULT_REMINDERS,
  msUntilNextLocalMidnight,
  normalizeWaterSettings,
  notificationsFromSetup,
  todayKey,
} from "@/lib/constants";
import { triggerHaptic } from "@/lib/haptics";
import { translate } from "@/lib/i18n";
import {
  ensureNotificationPermission,
  syncLocalNotifications,
} from "@/lib/notifications";
import { ONBOARDING_FLOW } from "@/lib/screens";
import {
  clearPreferences,
  loadPreferences,
  resetDailyProgress,
  savePreferences,
  wipeAllLocalData,
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
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";

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
  syncMedReminders: (enabledSlots: MedTimeSlot[]) => void;
  updateNotifications: (partial: Partial<NotificationSettings>) => void;
  markCelebrationShown: (kind: keyof Omit<CelebrationFlags, "date">) => void;
  logGlass: (delta: number) => void;
  acknowledgeMedicalDisclaimer: () => void;
  setVolumeUnit: (unit: UserPreferences["volumeUnit"]) => void;
  completeOnboarding: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const DEMO_PREFERENCES: UserPreferences = {
  ...DEFAULT_PREFERENCES,
  onboardingComplete: true,
  medicalDisclaimerAccepted: true,
  name: "Maria",
  language: "en",
  trackingMode: "both",
  volumeUnit: "ml",
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
    let cancelled = false;
    void (async () => {
      const loaded = await loadPreferences();
      if (cancelled) return;
      setPrefs(loaded);
      // Always open on splash; Get Started routes to home if already set up.
      setScreen("splash");
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [demo, persist]);

  // Existing installs that never saw the medical disclaimer must accept it once.
  useEffect(() => {
    if (!hydrated || demo) return;
    if (prefs.onboardingComplete && !prefs.medicalDisclaimerAccepted) {
      setScreen("disclaimer");
    }
  }, [
    hydrated,
    demo,
    prefs.onboardingComplete,
    prefs.medicalDisclaimerAccepted,
  ]);

  useEffect(() => {
    if (!hydrated || !persist || demo) {
      return;
    }
    savePreferences(prefs);
  }, [prefs, hydrated, persist, demo]);

  // Local-midnight daily cycle: zero water glasses + medication taken flags.
  useEffect(() => {
    if (!hydrated || demo) return;

    const applyDailyReset = () => {
      setPrefs((prev) => {
        const next = resetDailyProgress(prev);
        return next === prev ? prev : next;
      });
    };

    applyDailyReset();

    let midnightTimer = 0;
    const scheduleMidnight = () => {
      window.clearTimeout(midnightTimer);
      midnightTimer = window.setTimeout(() => {
        applyDailyReset();
        scheduleMidnight();
      }, msUntilNextLocalMidnight() + 100);
    };
    scheduleMidnight();

    // iOS/Android WebView may pause timers in background — catch resume.
    const onVisible = () => {
      if (document.visibilityState === "visible") applyDailyReset();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", applyDailyReset);
    window.addEventListener("pageshow", applyDailyReset);

    let removeCapApp: (() => void) | undefined;
    if (Capacitor.isNativePlatform()) {
      const sub = CapApp.addListener("appStateChange", ({ isActive }) => {
        if (isActive) applyDailyReset();
      });
      removeCapApp = () => {
        void sub.then((handle) => handle.remove());
      };
    }

    // Backup poll in case a single midnight timer was deferred.
    const backupId = window.setInterval(applyDailyReset, 60_000);

    return () => {
      window.clearTimeout(midnightTimer);
      window.clearInterval(backupId);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", applyDailyReset);
      window.removeEventListener("pageshow", applyDailyReset);
      removeCapApp?.();
    };
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
      // Always roll the day forward before mutating so midnight can't be skipped
      // by the first tap after the calendar date changes.
      setPrefs((prev) => updater(resetDailyProgress(prev)));
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
      screen === "disclaimer" ||
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
      screen === "disclaimer" ||
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
      updatePrefs((prev) => ({
        ...prev,
        water: normalizeWaterSettings({ ...prev.water, ...partial }),
        lastLogDate: todayKey(),
      }));
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
      void triggerHaptic("medium");
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
    (enabledSlots: MedTimeSlot[]) => {
      updatePrefs((prev) => {
        const slots =
          enabledSlots.length > 0 ? enabledSlots : (["morning"] as MedTimeSlot[]);
        const times = buildMedReminders(slots, prev.reminders.times);
        return {
          ...prev,
          // Drop meds for slots the user turned off (kept in UI until Continue).
          medications: prev.medications.filter((med) =>
            slots.includes(med.timeSlot),
          ),
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
      void (async () => {
        const enabling =
          partial.waterReminders === true || partial.pillAlarms === true;

        let permissionDenied = false;
        if (enabling) {
          // Never prompt on cold launch — only when the user turns a reminder ON.
          const granted = await ensureNotificationPermission();
          if (!granted) {
            permissionDenied = true;
          }
        }

        const holder: { current: UserPreferences | null } = { current: null };
        updatePrefs((prev) => {
          const nextNotifications = {
            ...prev.notifications,
            ...partial,
          };
          // Keep enabling flags off if OS permission was denied.
          if (permissionDenied) {
            if (partial.waterReminders === true) {
              nextNotifications.waterReminders = false;
            }
            if (partial.pillAlarms === true) {
              nextNotifications.pillAlarms = false;
            }
          }
          holder.current = {
            ...prev,
            notifications: nextNotifications,
          };
          return holder.current;
        });

        if (permissionDenied) {
          const lang = holder.current?.language ?? "en";
          window.alert(translate(lang, "notificationPermissionDenied"));
          return;
        }

        await Promise.resolve();
        if (holder.current) {
          await syncLocalNotifications(holder.current, {
            waterTitle: translate(
              holder.current.language,
              "notificationWaterTitle",
            ),
            waterBody: translate(
              holder.current.language,
              "notificationWaterBody",
            ),
            pillTitle: translate(
              holder.current.language,
              "notificationPillTitle",
            ),
            pillBody: translate(
              holder.current.language,
              "notificationPillBody",
            ),
          });
        }
      })();
    },
    [updatePrefs],
  );

  const markCelebrationShown = useCallback(
    (kind: keyof Omit<CelebrationFlags, "date">) => {
      void triggerHaptic("success");
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
      void triggerHaptic(delta > 0 ? "light" : "medium");
      updatePrefs((prev) => {
        const water = normalizeWaterSettings(prev.water);
        const maxGlasses = Math.max(
          1,
          Math.round(water.dailyGoalMl / water.glassSizeMl),
        );
        const next = Math.min(
          maxGlasses,
          Math.max(0, water.glassesLoggedToday + delta),
        );
        return {
          ...prev,
          lastLogDate: todayKey(),
          water: { ...water, glassesLoggedToday: next },
        };
      });
    },
    [updatePrefs]
  );

  const acknowledgeMedicalDisclaimer = useCallback(() => {
    updatePrefs((prev) => ({
      ...prev,
      medicalDisclaimerAccepted: true,
    }));
  }, [updatePrefs]);

  const setVolumeUnit = useCallback(
    (volumeUnit: UserPreferences["volumeUnit"]) => {
      updatePrefs((prev) => ({ ...prev, volumeUnit }));
    },
    [updatePrefs]
  );

  const completeOnboarding = useCallback(() => {
    void (async () => {
      const holder: { current: UserPreferences | null } = { current: null };
      updatePrefs((prev) => {
        const notifications = notificationsFromSetup(
          prev.trackingMode,
          prev.reminders.times,
        );
        holder.current = {
          ...prev,
          onboardingComplete: true,
          medicalDisclaimerAccepted: true,
          theme: "dark",
          lastLogDate: todayKey(),
          notifications,
        };
        return holder.current;
      });
      setScreen("home");

      const snapshot = holder.current;
      if (
        snapshot &&
        (snapshot.notifications.waterReminders ||
          snapshot.notifications.pillAlarms)
      ) {
        await ensureNotificationPermission();
        await syncLocalNotifications(snapshot, {
          waterTitle: translate(snapshot.language, "notificationWaterTitle"),
          waterBody: translate(snapshot.language, "notificationWaterBody"),
          pillTitle: translate(snapshot.language, "notificationPillTitle"),
          pillBody: translate(snapshot.language, "notificationPillBody"),
        });
      }
    })();
  }, [updatePrefs]);

  const resetAllData = useCallback(() => {
    void (async () => {
      if (persist && !demo) {
        await wipeAllLocalData();
        clearPreferences();
      }
      setPrefs(demo ? DEMO_PREFERENCES : DEFAULT_PREFERENCES);
      setScreen(demo ? "home" : "splash");
    })();
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
      acknowledgeMedicalDisclaimer,
      setVolumeUnit,
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
      acknowledgeMedicalDisclaimer,
      setVolumeUnit,
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
