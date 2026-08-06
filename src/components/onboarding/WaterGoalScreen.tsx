"use client";

import { Button } from "@/components/ui/Button";
import { Icon, MascotImage } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { GLASS_SIZE_OPTIONS } from "@/lib/constants";
import { ONBOARDING_PROGRESS } from "@/lib/screens";

export function WaterGoalScreen() {
  const { prefs, updateWater, goToNextOnboarding } = useApp();
  const { dailyGoalMl, glassSizeMl } = prefs.water;
  const glasses = Math.max(1, Math.round(dailyGoalMl / glassSizeMl));

  const adjustGlasses = (delta: number) => {
    const nextGlasses = Math.min(16, Math.max(2, glasses + delta));
    updateWater({ dailyGoalMl: nextGlasses * glassSizeMl });
  };

  const setGlassSize = (size: number) => {
    updateWater({
      glassSizeMl: size,
      dailyGoalMl: glasses * size,
    });
  };

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS["water-goal"]}
      title="Set your water goal"
      footer={<Button onClick={goToNextOnboarding}>Confirm Goal</Button>}
    >
      <div className="rounded-[24px] bg-[var(--purple)] p-6 text-center text-white shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col items-center">
          <div className="animate-float">
            <MascotImage
              src="/mascots/drop-flexing.png"
              width={154}
              height={110}
              alt="Water drop flexing"
            />
          </div>
          <p className="mt-1 text-[32px] font-extrabold leading-none">
            {dailyGoalMl.toLocaleString()}
          </p>
          <p className="mt-1 text-[12px] font-bold">ml / Day</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => adjustGlasses(-1)}
            className="flex size-11 items-center justify-center rounded-[22px] bg-[var(--coral-muted)]"
            aria-label="Decrease glasses"
          >
            <Icon name="minus" size={20} />
          </button>
          <div className="min-w-[100px] text-center">
            <p className="text-[16px] font-extrabold">{glasses} Glasses</p>
            <p className="text-[12px] font-bold">{glassSizeMl}ml each</p>
          </div>
          <button
            type="button"
            onClick={() => adjustGlasses(1)}
            className="flex size-11 items-center justify-center rounded-[22px] bg-[var(--coral-muted)]"
            aria-label="Increase glasses"
          >
            <Icon name="plus" size={20} />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-[var(--border)] bg-white p-4">
        <p className="mb-2 text-[15px] font-bold text-[var(--ink)]">
          What size is your glass?
        </p>
        <div className="flex gap-1.5">
          {GLASS_SIZE_OPTIONS.map((size) => {
            const selected = glassSizeMl === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setGlassSize(size)}
                className={[
                  "flex-1 rounded-full px-1 py-2 text-[13px] font-bold transition-all",
                  selected
                    ? "bg-[var(--purple)] text-white"
                    : "border border-[var(--border)] bg-white text-[var(--ink)]",
                ].join(" ")}
              >
                {size}ml
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[24px] bg-[var(--tip)] p-4">
        <Icon name="lightbulb" size={36} className="mt-0.5" />
        <p className="text-[14px] font-normal leading-5 text-[var(--ink)]">
          Tip: 8 glasses of water per day is recommended for most adults.
        </p>
      </div>
    </ScreenShell>
  );
}
