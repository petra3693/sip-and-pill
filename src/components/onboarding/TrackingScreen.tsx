"use client";

import { Button } from "@/components/ui/Button";
import { MaskIcon, MascotImage } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";
import { MASCOTS, type MascotAsset } from "@/lib/assets";
import { ONBOARDING_PROGRESS } from "@/lib/screens";
import type { TrackingMode } from "@/types";
import type { TranslationKey } from "@/lib/i18n";

interface TrackingOption {
  mode: TrackingMode;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  image: MascotAsset;
}

const OPTIONS: TrackingOption[] = [
  {
    mode: "water",
    titleKey: "waterOnly",
    descKey: "waterOnlyDesc",
    image: MASCOTS.dropThumbsUp,
  },
  {
    mode: "meds",
    titleKey: "medsOnly",
    descKey: "medsOnlyDesc",
    image: MASCOTS.pillWink,
  },
  {
    mode: "both",
    titleKey: "bothTrack",
    descKey: "bothTrackDesc",
    image: MASCOTS.bothWavingHello,
  },
];

export function TrackingScreen() {
  const { prefs, setTrackingMode, goToNextOnboarding } = useApp();
  const t = useT();

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.tracking}
      title={t("whatToTrack")}
      footer={<Button onClick={goToNextOnboarding}>{t("continue")}</Button>}
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
                "relative flex h-[120px] w-full items-center gap-3 rounded-[24px] p-4 text-left transition-all duration-200",
                selected
                  ? "bg-[var(--purple)] text-[var(--cta-ink)] shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
                  : "border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]",
              ].join(" ")}
            >
              {selected ? (
                <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-[12px] bg-[var(--coral)] text-[var(--cta-ink)]">
                  <MaskIcon name="check" size={14} />
                </span>
              ) : null}
              <MascotImage
                src={option.image}
                maxWidth={104}
                alt=""
                blend={selected ? "normal" : "multiply"}
              />
              <div className="min-w-0 flex-1 pr-6">
                <p className="text-[16px] font-extrabold leading-snug">
                  {t(option.titleKey)}
                </p>
                <p
                  className={[
                    "mt-1 text-[14px] font-normal",
                    selected ? "text-[var(--cta-ink)]/75" : "text-[var(--muted)]",
                  ].join(" ")}
                >
                  {t(option.descKey)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </ScreenShell>
  );
}
