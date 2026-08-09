"use client";

import { MascotImage } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useT } from "@/hooks/useT";
import { MASCOTS } from "@/lib/assets";

export type CelebrationKind = "water" | "meds" | "both";

interface CelebrationOverlayProps {
  kind: CelebrationKind;
  onDismiss: () => void;
}

const ASSETS: Record<CelebrationKind, { src: (typeof MASCOTS)[keyof typeof MASCOTS]; maxWidth: number }> = {
  water: { src: MASCOTS.dropCelebrating, maxWidth: 200 },
  meds: { src: MASCOTS.pillHeart, maxWidth: 200 },
  both: { src: MASCOTS.bothHighFive, maxWidth: 220 },
};

export function CelebrationOverlay({
  kind,
  onDismiss,
}: CelebrationOverlayProps) {
  const t = useT();
  const asset = ASSETS[kind];
  const message =
    kind === "water"
      ? t("waterComplete")
      : kind === "meds"
        ? t("medsComplete")
        : t("bothComplete");

  return (
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center bg-[rgba(26,20,40,0.55)] p-6 animate-fade-in"
      role="alertdialog"
      aria-label={t("hurrah")}
    >
      <div className="w-full max-w-sm rounded-[28px] bg-[var(--surface)] p-6 text-center shadow-2xl animate-celebrate">
        <div className="mx-auto mb-3 flex justify-center">
          <MascotImage
            src={asset.src}
            maxWidth={asset.maxWidth}
            alt=""
            blend="multiply"
            className="animate-float"
          />
        </div>
        <p className="text-[28px] font-black text-[var(--purple)]">
          {t("hurrah")}
        </p>
        <p className="mt-2 text-[15px] font-semibold leading-5 text-[var(--ink)]">
          {message}
        </p>
        <div className="mt-5">
          <Button onClick={onDismiss}>{t("keepGoing")}</Button>
        </div>
      </div>
    </div>
  );
}
