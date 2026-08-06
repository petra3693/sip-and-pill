"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon, MascotImage } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { TIME_SLOT_LABELS } from "@/lib/constants";
import { ONBOARDING_PROGRESS } from "@/lib/screens";

const SLOTS = ["morning", "noon", "evening"] as const;

const SLOT_ICONS: Record<(typeof SLOTS)[number], string> = {
  morning: "icon-morning",
  noon: "icon-noon",
  evening: "icon-evening",
};

export function MedicationsScreen() {
  const {
    prefs,
    addMedication,
    updateMedication,
    removeMedication,
    goToNextOnboarding,
  } = useApp();

  const [timesPerDay, setTimesPerDay] = useState(() =>
    Math.max(1, new Set(prefs.medications.map((m) => m.timeSlot)).size)
  );

  const visibleSlots = SLOTS.slice(0, Math.min(3, Math.max(1, timesPerDay)));

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.medications}
      title="Set your medications"
      footer={<Button onClick={goToNextOnboarding}>Confirm Goal</Button>}
    >
      <div className="rounded-[24px] bg-[var(--purple)] p-6 text-center text-white shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
        <div className="flex justify-center animate-float">
          <MascotImage
            src="/mascots/pill-superhero.png"
            width={180}
            height={140}
            alt="Pill superhero"
          />
        </div>
        <div className="mt-2 flex items-center justify-center gap-9">
          <button
            type="button"
            onClick={() => setTimesPerDay((n) => Math.max(1, n - 1))}
            className="flex size-11 items-center justify-center rounded-[22px] bg-[var(--coral-muted)]"
            aria-label="Decrease times per day"
          >
            <Icon name="minus" size={20} />
          </button>
          <div>
            <p className="text-[32px] font-extrabold leading-none">
              {timesPerDay}x
            </p>
            <p className="text-[12px] font-bold">Day</p>
          </div>
          <button
            type="button"
            onClick={() => setTimesPerDay((n) => Math.min(3, n + 1))}
            className="flex size-11 items-center justify-center rounded-[22px] bg-[var(--coral-muted)]"
            aria-label="Increase times per day"
          >
            <Icon name="plus" size={20} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        {visibleSlots.map((slot) => {
          const meds = prefs.medications.filter((m) => m.timeSlot === slot);
          return (
            <section
              key={slot}
              className="rounded-[24px] border border-[var(--border)] bg-white p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-[14px] font-extrabold text-[var(--purple)]">
                  {TIME_SLOT_LABELS[slot]}
                </h3>
                <Icon name={SLOT_ICONS[slot]} size={17} />
              </div>
              <div className="flex flex-col gap-1.5">
                {meds.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center gap-3 rounded-[12px] bg-[#fff2ee] p-2.5"
                  >
                    <Icon name="med-pill" size={28} />
                    <input
                      type="text"
                      value={med.name}
                      onChange={(event) =>
                        updateMedication(med.id, { name: event.target.value })
                      }
                      className="min-w-0 flex-1 bg-transparent text-[14px] font-bold text-[var(--ink)] outline-none"
                      aria-label={`${TIME_SLOT_LABELS[slot]} medication name`}
                    />
                    <button
                      type="button"
                      onClick={() => removeMedication(med.id)}
                      className="flex size-6 items-center justify-center"
                      aria-label={`Remove ${med.name}`}
                    >
                      <Icon name="x-circle" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addMedication(slot)}
                className="mt-2.5 text-[13px] font-extrabold text-[var(--coral-soft)]"
              >
                + Add medication
              </button>
            </section>
          );
        })}
      </div>
    </ScreenShell>
  );
}
