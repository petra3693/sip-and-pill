"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { HomeGauge } from "@/components/dashboard/HomeGauge";
import {
  CelebrationOverlay,
  type CelebrationKind,
} from "@/components/ui/CelebrationOverlay";
import { MaskIcon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useApp } from "@/context/AppContext";
import { useDashboardChrome } from "@/hooks/useDashboardChrome";
import { useT } from "@/hooks/useT";
import { glassesFromGoal } from "@/lib/constants";
import type { TranslationKey } from "@/lib/i18n";
import type { MedTimeSlot } from "@/types";

const SLOT_LABEL_KEYS: Record<MedTimeSlot, TranslationKey> = {
  morning: "morning",
  midmorning: "midmorning",
  noon: "noon",
  afternoon: "afternoon",
  evening: "evening",
  night: "night",
};

export function HomeScreen() {
  useDashboardChrome();

  const {
    prefs,
    logGlass,
    toggleMedicationTaken,
    markCelebrationShown,
  } = useApp();
  const t = useT();
  const showWater = prefs.trackingMode !== "meds";
  const showMeds = prefs.trackingMode !== "water";

  const maxGlasses = glassesFromGoal(
    prefs.water.dailyGoalMl,
    prefs.water.glassSizeMl,
  );
  const logged = prefs.water.glassesLoggedToday;
  const mlLogged = logged * prefs.water.glassSizeMl;
  const waterPercent = Math.min(
    100,
    (mlLogged / prefs.water.dailyGoalMl) * 100,
  );

  const medsComplete =
    prefs.medications.length > 0 &&
    prefs.medications.every((med) => med.takenToday);
  const waterComplete = showWater && waterPercent >= 100;
  const medsGoalComplete = showMeds && medsComplete;

  const [activeCelebration, setActiveCelebration] =
    useState<CelebrationKind | null>(null);

  useEffect(() => {
    const flags = prefs.celebrations;
    const bothDone = waterComplete && medsGoalComplete;

    if (bothDone && !flags.both) {
      setActiveCelebration("both");
      return;
    }
    if (waterComplete && !medsGoalComplete && !flags.water) {
      setActiveCelebration("water");
      return;
    }
    if (medsGoalComplete && !waterComplete && !flags.meds) {
      setActiveCelebration("meds");
    }
  }, [waterComplete, medsGoalComplete, prefs.celebrations]);

  const dismissCelebration = () => {
    if (!activeCelebration) return;
    markCelebrationShown(activeCelebration);
    if (activeCelebration === "both") {
      markCelebrationShown("water");
      markCelebrationShown("meds");
    }
    setActiveCelebration(null);
  };

  const selectGlasses = (count: number) => {
    logGlass(count - logged);
  };

  return (
    <div className="screen-bg relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="relative z-10 safe-top min-h-0 flex-1 overflow-y-auto px-5 pb-16 scrollbar-hide">
        <header className="mb-2 flex items-center gap-3 pt-1">
          <p className="min-w-0 flex-1 text-[17px] font-extrabold leading-snug text-[var(--ink)]">
            {t("hiName", {
              name: prefs.name.trim() || t("friend"),
            })}
          </p>
          <ThemeToggle />
        </header>

        {showWater ? (
          <section className="home-gauge-panel animate-fade-in">
            <HomeGauge
              percent={waterPercent}
              logged={logged}
              maxGlasses={maxGlasses}
              onAdjust={logGlass}
              onSelectGlasses={selectGlasses}
            />
            <p className="mt-1 text-center text-[13px] font-semibold text-[var(--muted)]">
              {t("glassesOf", { logged, max: maxGlasses })}
            </p>
          </section>
        ) : null}

        {showMeds ? (
          <section className="mt-5 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4 animate-fade-in backdrop-blur-sm">
            <h2 className="mb-4 text-[16px] font-extrabold text-[var(--ink)]">
              {t("medicationCompanion")}
            </h2>
            <div className="flex flex-col gap-2.5">
              {prefs.medications.length === 0 ? (
                <p className="py-4 text-center text-[14px] font-semibold text-[var(--muted)]">
                  {t("noMedsYet")}
                </p>
              ) : (
                prefs.medications.map((med) => {
                  const status = med.takenToday
                    ? t("markedTaken")
                    : t("notTakenYet");
                  return (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => toggleMedicationTaken(med.id)}
                    aria-pressed={med.takenToday}
                    aria-label={`${med.name}, ${status}`}
                    className="flex min-h-11 w-full items-center gap-3 rounded-[16px] bg-[var(--surface-muted)] p-2.5 text-left transition active:scale-[0.99]"
                  >
                    <span
                      className={[
                        "flex size-8 items-center justify-center rounded-lg",
                        med.takenToday
                          ? "bg-[var(--privacy)] text-[var(--success)]"
                          : "bg-[var(--coral-muted)] text-[var(--coral)]",
                      ].join(" ")}
                      aria-hidden
                    >
                      <MaskIcon name="pill" size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-extrabold text-[var(--ink)]">
                        {med.name}
                      </p>
                      <p className="text-[12px] font-bold text-[var(--muted)]">
                        {med.dosage} • {t(SLOT_LABEL_KEYS[med.timeSlot])}
                      </p>
                    </div>
                    <span
                      className={[
                        "flex size-11 shrink-0 items-center justify-center rounded-full border-2",
                        med.takenToday
                          ? "border-[var(--success)] bg-[var(--success)] text-white"
                          : "border-[var(--border)] bg-transparent text-transparent",
                      ].join(" ")}
                      aria-hidden
                    >
                      {med.takenToday ? (
                        <MaskIcon name="check" size={14} />
                      ) : (
                        <span className="size-3.5 rounded-full border-2 border-[var(--muted)]" />
                      )}
                    </span>
                  </button>
                  );
                })
              )}
            </div>
          </section>
        ) : null}
      </div>

      <BottomNav />

      {activeCelebration ? (
        <CelebrationOverlay
          kind={activeCelebration}
          onDismiss={dismissCelebration}
        />
      ) : null}
    </div>
  );
}
