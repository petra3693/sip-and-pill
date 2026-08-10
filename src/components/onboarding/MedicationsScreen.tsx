"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

function initialEnabledSlots(
  medications: { timeSlot: MedTimeSlot }[],
): Set<MedTimeSlot> {
  const fromMeds = MED_TIME_SLOTS.filter((slot) =>
    medications.some((med) => med.timeSlot === slot),
  );
  if (fromMeds.length > 0) return new Set(fromMeds);
  // Default: morning + noon + evening (common 3x/day), not first-N-only midmorning.
  return new Set<MedTimeSlot>(["morning", "noon", "evening"]);
}

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

  const [enabledSlots, setEnabledSlots] = useState<Set<MedTimeSlot>>(() =>
    initialEnabledSlots(prefs.medications),
  );

  const visibleSlots = useMemo(
    () => MED_TIME_SLOTS.filter((slot) => enabledSlots.has(slot)),
    [enabledSlots],
  );

  // Seed each enabled slot once when it first becomes visible — never re-create after delete.
  const seededSlotsRef = useRef<Set<MedTimeSlot>>(new Set());

  useEffect(() => {
    for (const slot of visibleSlots) {
      if (seededSlotsRef.current.has(slot)) continue;
      seededSlotsRef.current.add(slot);
      if (!prefs.medications.some((med) => med.timeSlot === slot)) {
        addMedication(slot);
      }
    }
    // Intentionally omit prefs.medications: re-running on med deletes would reseed.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed only when slots appear
  }, [visibleSlots, addMedication]);

  const toggleSlot = (slot: MedTimeSlot) => {
    setEnabledSlots((prev) => {
      const next = new Set(prev);
      if (next.has(slot)) {
        if (next.size <= 1) return prev; // keep at least one
        next.delete(slot);
      } else {
        if (next.size >= MAX_MED_TIMES_PER_DAY) return prev;
        next.add(slot);
      }
      return next;
    });
  };

  const handleContinue = () => {
    syncMedReminders(visibleSlots);
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
        <p className="mt-3 text-[32px] font-extrabold leading-none">
          {visibleSlots.length}x
        </p>
        <p className="mt-1 text-[12px] font-bold">{t("day")}</p>
        <p className="mt-3 text-[12px] font-semibold leading-4 opacity-90">
          {t("chooseMedTimes")}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {MED_TIME_SLOTS.map((slot) => {
            const on = enabledSlots.has(slot);
            const alone = on && enabledSlots.size === 1;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => toggleSlot(slot)}
                aria-pressed={on}
                disabled={alone}
                className={[
                  "rounded-full px-2.5 py-1.5 text-[11px] font-extrabold transition",
                  on
                    ? "bg-[var(--coral-muted)] text-[var(--coral)]"
                    : "bg-white/20 text-[var(--cta-ink)]",
                  alone ? "opacity-80" : "",
                ].join(" ")}
              >
                {t(SLOT_LABEL_KEYS[slot])}
              </button>
            );
          })}
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
