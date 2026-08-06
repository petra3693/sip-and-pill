"use client";

import { Button } from "@/components/ui/Button";
import { Icon, MascotImage } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { ONBOARDING_PROGRESS } from "@/lib/screens";
import type { TrackingMode } from "@/types";

interface TrackingOption {
  mode: TrackingMode;
  title: string;
  description: string;
  image: string;
}

const OPTIONS: TrackingOption[] = [
  {
    mode: "water",
    title: "Water Only",
    description: "Track daily water intake",
    image: "/mascots/drop-thumbs-up-card.png",
  },
  {
    mode: "meds",
    title: "Meds Only",
    description: "Never miss a dose",
    image: "/mascots/pill-confident-wink.png",
  },
  {
    mode: "both",
    title: "Both Water & Meds",
    description: "Full daily health companion",
    image: "/mascots/both-waving-card.png",
  },
];

export function TrackingScreen() {
  const { prefs, setTrackingMode, goToNextOnboarding } = useApp();

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.tracking}
      title="What would you like to track?"
      footer={<Button onClick={goToNextOnboarding}>Continue</Button>}
    >
      <div className="flex flex-col gap-4">
        {OPTIONS.map((option) => {
          const selected = prefs.trackingMode === option.mode;
          return (
            <button
              key={option.mode}
              type="button"
              onClick={() => setTrackingMode(option.mode)}
              className={[
                "relative flex h-[120px] w-full items-center gap-2 rounded-[24px] p-4 text-left transition-all duration-200",
                selected
                  ? "bg-[var(--purple)] text-white shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
                  : "border border-[var(--border)] bg-white text-[var(--ink)]",
              ].join(" ")}
            >
              {selected ? (
                <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-[12px] bg-[var(--coral-soft)]">
                  <Icon name="check" size={14} />
                </span>
              ) : null}
              <MascotImage src={option.image} width={100} height={100} alt="" />
              <div className="min-w-0 flex-1 pr-6">
                <p className="text-[16px] font-extrabold leading-snug">
                  {option.title}
                </p>
                <p
                  className={[
                    "mt-1 text-[14px] font-normal",
                    selected ? "text-white/85" : "text-[var(--muted)]",
                  ].join(" ")}
                >
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </ScreenShell>
  );
}
