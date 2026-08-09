"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MascotImage } from "@/components/ui/Icon";
import { useT } from "@/hooks/useT";
import { MASCOTS } from "@/lib/assets";
import {
  clampDonationEur,
  COFFEE_EUR,
  DONATION_PRESETS_EUR,
  formatEuro,
  MAX_DONATION_EUR,
  MIN_DONATION_EUR,
} from "@/lib/donations";

type Step = "story" | "custom" | "confirm" | "thanks";
type SupportMode = "coffee" | "custom";

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  const t = useT();
  const [step, setStep] = useState<Step>("story");
  const [mode, setMode] = useState<SupportMode>("coffee");
  const [amount, setAmount] = useState(COFFEE_EUR);
  const [draft, setDraft] = useState(String(5));

  useEffect(() => {
    if (!open) return;
    setStep("story");
    setMode("coffee");
    setAmount(COFFEE_EUR);
    setDraft(String(5));
  }, [open]);

  if (!open) return null;

  const goCoffee = () => {
    setMode("coffee");
    setAmount(COFFEE_EUR);
    setStep("confirm");
  };

  const goCustom = () => {
    setMode("custom");
    setDraft(String(5));
    setStep("custom");
  };

  const continueFromCustom = () => {
    const next = clampDonationEur(Number(draft.replace(/[^\d]/g, "")));
    setAmount(next);
    setDraft(String(next));
    setStep("confirm");
  };

  const confirmDonation = () => {
    setStep("thanks");
  };

  return (
    <div
      className="absolute inset-0 z-[60] flex items-end justify-center bg-[rgba(26,20,40,0.55)] p-4 animate-fade-in sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={t("supportDeveloper")}
      onClick={onClose}
    >
      <div
        className="max-h-[min(92%,720px)] w-full max-w-sm overflow-y-auto rounded-[28px] bg-[var(--surface)] p-5 shadow-2xl animate-slide-up scrollbar-hide"
        onClick={(event) => event.stopPropagation()}
      >
        {step === "story" ? (
          <>
            <div className="mx-auto mb-2 flex justify-center">
              <MascotImage
                src={MASCOTS.pillHeart}
                maxWidth={160}
                alt=""
                blend="multiply"
              />
            </div>
            <h2 className="text-center text-[22px] font-extrabold leading-7 text-[var(--ink)]">
              {t("supportDeveloper")}
            </h2>
            <p className="mt-3 text-center text-[14px] font-medium leading-5 text-[var(--muted)]">
              {t("supportCharityBlurb")}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button onClick={goCoffee}>{t("inviteCoffee")}</Button>
              <Button variant="secondary" onClick={goCustom}>
                {t("giveAsYouLike")}
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="py-2 text-center text-[14px] font-bold text-[var(--muted)]"
              >
                {t("cancel")}
              </button>
            </div>
          </>
        ) : null}

        {step === "custom" ? (
          <>
            <h2 className="text-[20px] font-extrabold text-[var(--ink)]">
              {t("chooseAmount")}
            </h2>
            <p className="mt-1 text-[13px] font-medium text-[var(--muted)]">
              {t("giveAsYouLike")}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {DONATION_PRESETS_EUR.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDraft(String(preset))}
                  className={[
                    "rounded-full px-4 py-2 text-[14px] font-extrabold outline outline-1 outline-offset-[-1px] transition-colors",
                    draft === String(preset)
                      ? "bg-[var(--purple)] text-white outline-[var(--purple)]"
                      : "bg-[var(--bg-peach)] text-[var(--ink)] outline-[var(--border)]",
                  ].join(" ")}
                >
                  {formatEuro(preset)}
                </button>
              ))}
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-[12px] font-bold text-[var(--muted)]">
                {t("customAmountLabel")}
              </span>
              <div className="flex h-14 items-center gap-2 rounded-3xl border border-[var(--border)] bg-[var(--bg-peach)] px-4">
                <span className="text-[18px] font-extrabold text-[var(--purple)]">
                  €
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={MIN_DONATION_EUR}
                  max={MAX_DONATION_EUR}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-[20px] font-extrabold text-[var(--ink)] outline-none"
                />
              </div>
            </label>

            <div className="mt-5 flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setStep("story")}
                className="flex-1"
              >
                {t("back")}
              </Button>
              <Button onClick={continueFromCustom} className="flex-1">
                {t("continue")}
              </Button>
            </div>
          </>
        ) : null}

        {step === "confirm" ? (
          <>
            <div className="mx-auto mb-2 flex justify-center">
              <MascotImage
                src={MASCOTS.dropThumbsUp}
                maxWidth={140}
                alt=""
                blend="multiply"
              />
            </div>
            <h2 className="text-center text-[20px] font-extrabold text-[var(--ink)]">
              {t("confirmDonation")}
            </h2>
            <p className="mt-3 text-center text-[14px] font-medium leading-5 text-[var(--muted)]">
              {t("supportConfirmBlurb", { amount: formatEuro(amount) })}
            </p>
            <p className="mt-4 text-center text-[36px] font-black text-[var(--purple)]">
              {formatEuro(amount)}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button onClick={confirmDonation}>
                {t("donateAmount", { amount: formatEuro(amount) })}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setStep(mode === "custom" ? "custom" : "story")}
              >
                {t("back")}
              </Button>
            </div>
          </>
        ) : null}

        {step === "thanks" ? (
          <>
            <div className="mx-auto mb-2 flex justify-center">
              <MascotImage
                src={MASCOTS.bothHighFive}
                maxWidth={180}
                alt=""
                blend="multiply"
                className="animate-float"
              />
            </div>
            <h2 className="text-center text-[24px] font-black text-[var(--purple)]">
              {t("hurrah")}
            </h2>
            <p className="mt-2 text-center text-[15px] font-semibold leading-5 text-[var(--ink)]">
              {t("thankYouSupport")}
            </p>
            <div className="mt-5">
              <Button onClick={onClose}>{t("keepGoing")}</Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
