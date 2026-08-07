"use client";

import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "@/components/dashboard/BottomNav";
import {
  CelebrationOverlay,
  type CelebrationKind,
} from "@/components/ui/CelebrationOverlay";
import { Icon } from "@/components/ui/Icon";
import { RadialProgress } from "@/components/ui/RadialProgress";
import { useApp } from "@/context/AppContext";
import { useScreenChrome } from "@/hooks/useScreenChrome";
import { useT } from "@/hooks/useT";
import { CHROME_PEACH } from "@/lib/chrome";
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
  useScreenChrome("light");

  const {
    prefs,
    logGlass,
    toggleMedicationTaken,
    markCelebrationShown,
  } = useApp();
  const t = useT();
  const showWater = prefs.trackingMode !== "meds";
  const showMeds = prefs.trackingMode !== "water";

  const maxGlasses = Math.max(
    1,
    Math.round(prefs.water.dailyGoalMl / prefs.water.glassSizeMl),
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

  const displayName = prefs.name.trim() || t("friend");

  const greeting = useMemo(
    () => t("hiName", { name: displayName }),
    [displayName, t],
  );

  const dismissCelebration = () => {
    if (!activeCelebration) return;
    markCelebrationShown(activeCelebration);
    if (activeCelebration === "both") {
      markCelebrationShown("water");
      markCelebrationShown("meds");
    }
    setActiveCelebration(null);
  };

  return (
    <div
      className="relative flex h-full min-h-0 flex-col"
      style={{
        backgroundColor: CHROME_PEACH,
        backgroundImage: "none",
        background: CHROME_PEACH,
      }}
    >
      <div className="safe-top min-h-0 flex-1 overflow-y-auto px-6 pb-4 scrollbar-hide">
        <header className="mb-5 pt-1 text-center">
          <h1 className="break-words px-1 text-[2rem] font-extrabold leading-snug text-[var(--ink)]">
            {greeting}
          </h1>
        </header>

        {showWater ? (
          <section className="rounded-[24px] bg-[var(--purple)] p-6 text-white shadow-[0_10px_24px_rgba(0,0,0,0.08)] animate-fade-in">
            <p className="text-center text-[12px] font-bold uppercase tracking-wide text-white/80">
              {t("hydrationLevel")}
            </p>
            <div className="mt-4 flex justify-center">
              <RadialProgress percent={waterPercent} />
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => logGlass(-1)}
                disabled={logged <= 0}
                className="flex size-11 items-center justify-center rounded-[22px] bg-[var(--coral-muted)] disabled:opacity-40"
                aria-label={t("removeGlass")}
              >
                <Icon name="minus" size={20} />
              </button>
              <div className="text-center">
                <p className="text-[23px] font-bold text-[var(--coral-soft)]">
                  {t("glassesOf", { logged, max: maxGlasses })}
                </p>
                <p className="text-[15px] font-bold text-white">
                  {mlLogged.toLocaleString()} /{" "}
                  {prefs.water.dailyGoalMl.toLocaleString()} ml
                </p>
              </div>
              <button
                type="button"
                onClick={() => logGlass(1)}
                disabled={logged >= maxGlasses}
                className="flex size-11 items-center justify-center rounded-[22px] bg-[var(--coral-muted)] disabled:opacity-40"
                aria-label={t("addGlass")}
              >
                <Icon name="plus" size={20} />
              </button>
            </div>
          </section>
        ) : null}

        {showMeds ? (
          <section className="mt-5 rounded-[24px] border border-[var(--border)] bg-white p-4 animate-fade-in">
            <h2 className="mb-4 text-[16px] font-extrabold text-[var(--ink)]">
              {t("medicationCompanion")}
            </h2>
            <div className="flex flex-col gap-2.5">
              {prefs.medications.length === 0 ? (
                <p className="py-4 text-center text-[14px] font-semibold text-[var(--muted)]">
                  {t("noMedsYet")}
                </p>
              ) : (
                prefs.medications.map((med) => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => toggleMedicationTaken(med.id)}
                    className="flex w-full items-center gap-3 rounded-[16px] bg-[#fff8f6] p-2.5 text-left transition active:scale-[0.99]"
                  >
                    <span
                      className={[
                        "flex size-8 items-center justify-center rounded-lg",
                        med.takenToday
                          ? "bg-[var(--privacy)]"
                          : "bg-[var(--coral-muted)]",
                      ].join(" ")}
                    >
                      <Icon name="pill" size={18} />
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
                        "flex size-[34px] shrink-0 items-center justify-center rounded-[22px]",
                        med.takenToday
                          ? "bg-[var(--success)]"
                          : "bg-[#d9d2d0]",
                      ].join(" ")}
                      aria-label={
                        med.takenToday ? t("markedTaken") : t("notTakenYet")
                      }
                    >
                      <Icon name="check" size={14} />
                    </span>
                  </button>
                ))
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
