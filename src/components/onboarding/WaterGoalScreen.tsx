"use client";

import { Button } from "@/components/ui/Button";
import { Icon, MaskIcon, MascotImage } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";
import { MASCOTS } from "@/lib/assets";
import {
  glassesFromGoal,
  GLASS_SIZE_OPTIONS,
  MAX_WATER_ML,
  MIN_WATER_ML,
} from "@/lib/constants";
import { selectPlural } from "@/lib/format";
import { ONBOARDING_PROGRESS } from "@/lib/screens";
import { formatVolume, roundMl } from "@/lib/volume";

export function WaterGoalScreen() {
  const { prefs, updateWater, goToNextOnboarding } = useApp();
  const t = useT();
  const { dailyGoalMl, glassSizeMl } = prefs.water;
  const glasses = glassesFromGoal(dailyGoalMl, glassSizeMl);
  const maxGlasses = Math.max(1, Math.floor(MAX_WATER_ML / glassSizeMl));
  const minGlasses = Math.max(1, Math.ceil(MIN_WATER_ML / glassSizeMl));

  const adjustGlasses = (delta: number) => {
    const nextGlasses = Math.min(maxGlasses, Math.max(minGlasses, glasses + delta));
    updateWater({ dailyGoalMl: roundMl(nextGlasses * glassSizeMl) });
  };

  const setGlassSize = (size: number) => {
    updateWater({
      glassSizeMl: size,
      dailyGoalMl: roundMl(glasses * size),
    });
  };

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS["water-goal"]}
      title={t("setWaterGoal")}
      footer={
        <Button onClick={goToNextOnboarding}>{t("confirmGoal")}</Button>
      }
    >
      <div className="rounded-[24px] bg-[var(--purple)] p-6 text-center text-[var(--cta-ink)] shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col items-center">
          <div className="animate-flex">
            <MascotImage
              src={MASCOTS.dropFlexing}
              maxWidth={160}
              alt="Water drop flexing"
              blend="normal"
            />
          </div>
          <p className="mt-1 text-[32px] font-extrabold leading-none">
            {formatVolume(dailyGoalMl, prefs.volumeUnit, prefs.language).replace(
              / (ml|fl oz)$/i,
              "",
            )}
          </p>
          <p className="mt-1 text-[12px] font-bold">
            {prefs.volumeUnit === "fl_oz" ? t("volumeUnitFlOz") : t("mlPerDay")}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => adjustGlasses(-1)}
            className="flex size-11 items-center justify-center rounded-[22px] bg-[var(--coral-muted)] text-[var(--coral)]"
            aria-label={t("decreaseGlasses")}
          >
            <MaskIcon name="minus" size={20} />
          </button>
          <div className="min-w-[100px] text-center">
            <p className="text-[16px] font-extrabold">
              {selectPlural(prefs.language, glasses, {
                one: t("glassesCountOne", { count: glasses }),
                other: t("glassesCountOther", { count: glasses }),
              })}
            </p>
            <p className="text-[12px] font-bold">
              {formatVolume(glassSizeMl, prefs.volumeUnit, prefs.language)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => adjustGlasses(1)}
            className="flex size-11 items-center justify-center rounded-[22px] bg-[var(--coral-muted)] text-[var(--coral)]"
            aria-label={t("increaseGlasses")}
          >
            <MaskIcon name="plus" size={20} />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="mb-2 text-[15px] font-bold text-[var(--ink)]">
          {t("whatSizeGlass")}
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
                    ? "bg-[var(--purple)] text-[var(--cta-ink)]"
                    : "border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]",
                ].join(" ")}
              >
                {formatVolume(size, prefs.volumeUnit, prefs.language)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[24px] bg-[var(--tip)] p-4">
        <Icon name="lightbulb" size={36} className="mt-0.5" />
        <p className="text-[14px] font-normal leading-5 text-[var(--ink)]">
          {t("waterTip")}
        </p>
      </div>
    </ScreenShell>
  );
}
