"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon, MaskIcon, MascotImage } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";
import { MASCOTS } from "@/lib/assets";
import { MAX_MED_TIMES_PER_DAY, MED_TIME_SLOTS } from "@/lib/constants";
import type { TranslationKey } from "@/lib/i18n";
import { ONBOARDING_PROGRESS } from "@/lib/screens";
import type { MedTimeSlot } from "@/types";

const SLOT_ICONS: Partial<Record<MedTimeSlot, string>> = {
  morning: "icon-morning",
  midmorning: "icon-morning",
  noon: "icon-noon",
  afternoon: "icon-noon",
  evening: "icon-evening",
  night: "icon-evening",
};

const SLOT_LABEL_KEYS: Record<MedTimeSlot, TranslationKey> = {
  morning: "morning",
  midmorning: "midmorning",
  noon: "noon",
  afternoon: "afternoon",
  evening: "evening",
  night: "night",
};

export function MedicationsScreen() {
  const {
    prefs,
    addMedication,
    updateMedication,
    removeMedication,
    syncMedReminders,
    goToNextOnboarding,
  } = useApp();
  const t = useT();

  const [timesPerDay, setTimesPerDay] = useState(() =>
    Math.min(
      MAX_MED_TIMES_PER_DAY,
      Math.max(1, new Set(prefs.medications.map((m) => m.timeSlot)).size),
    ),
  );

  const visibleSlots = useMemo(
    () => MED_TIME_SLOTS.slice(0, timesPerDay),
    [timesPerDay],
  );

  // Each visible slot starts with one default "New medication" field.
  useEffect(() => {
    for (const slot of visibleSlots) {
      if (!prefs.medications.some((med) => med.timeSlot === slot)) {
        addMedication(slot);
      }
    }
  }, [visibleSlots, prefs.medications, addMedication]);

  const handleContinue = () => {
    syncMedReminders(timesPerDay);
    goToNextOnboarding();
  };

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.medications}
      title={t("setMedications")}
      footer={<Button onClick={handleContinue}>{t("confirmGoal")}</Button>}
    >
      <div className="rounded-[24px] bg-[var(--purple)] p-6 text-center text-[var(--cta-ink)] shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
        <div className="flex justify-center">
          <MascotImage
            src={MASCOTS.pillSuperhero}
            maxWidth={168}
            alt="Pill superhero"
            blend="normal"
            className="animate-float"
          />
        </div>
        <div className="mt-2 flex items-center justify-center gap-9">
          <button
            type="button"
            onClick={() => setTimesPerDay((n) => Math.max(1, n - 1))}
            className="flex size-11 items-center justify-center rounded-full bg-[var(--coral-muted)] text-[var(--coral)]"
            aria-label={t("decreaseTimes")}
          >
            <MaskIcon name="minus" size={20} />
          </button>
          <div>
            <p className="text-[32px] font-extrabold leading-none">
              {timesPerDay}x
            </p>
            <p className="text-[12px] font-bold">{t("day")}</p>
          </div>
          <button
            type="button"
            onClick={() =>
              setTimesPerDay((n) => Math.min(MAX_MED_TIMES_PER_DAY, n + 1))
            }
            className="flex size-11 items-center justify-center rounded-full bg-[var(--coral-muted)] text-[var(--coral)]"
            aria-label={t("increaseTimes")}
          >
            <MaskIcon name="plus" size={20} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        {visibleSlots.map((slot) => {
          const meds = prefs.medications.filter((m) => m.timeSlot === slot);
          const label = t(SLOT_LABEL_KEYS[slot]);
          return (
            <section
              key={slot}
              className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-[14px] font-extrabold text-[var(--purple)]">
                  {label}
                </h3>
                <Icon name={SLOT_ICONS[slot] ?? "icon-custom"} size={17} />
              </div>
              <div className="flex flex-col gap-1.5">
                {meds.map((med) => {
                  const isDefaultName = med.name === t("newMedication");
                  return (
                    <div
                      key={med.id}
                      className="flex items-center gap-3 rounded-[12px] bg-[var(--surface-muted)] p-2.5"
                    >
                      <MaskIcon
                        name="med-pill"
                        size={28}
                        className="text-[var(--purple)]"
                      />
                      <input
                        type="text"
                        value={isDefaultName ? "" : med.name}
                        placeholder={t("newMedication")}
                        onChange={(event) =>
                          updateMedication(med.id, {
                            name: event.target.value,
                          })
                        }
                        className="min-w-0 flex-1 bg-transparent text-[14px] font-bold text-[var(--ink)] outline-none placeholder:text-[var(--ink)] placeholder:opacity-90"
                        aria-label={`${label} — ${t("medicationName")}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeMedication(med.id)}
                        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--coral)] text-[11px] font-bold leading-none text-white"
                        aria-label={t("deleteMed", {
                          name: med.name || t("newMedication"),
                        })}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => addMedication(slot)}
                className="mt-2.5 text-[13px] font-extrabold text-[var(--coral)]"
              >
                {t("addMedication")}
              </button>
            </section>
          );
        })}
      </div>
    </ScreenShell>
  );
}
