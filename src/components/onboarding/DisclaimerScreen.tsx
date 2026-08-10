"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MedicalDisclaimer } from "@/components/ui/MedicalDisclaimer";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";
import { ONBOARDING_PROGRESS } from "@/lib/screens";

export function DisclaimerScreen() {
  const {
    prefs,
    acknowledgeMedicalDisclaimer,
    goToNextOnboarding,
    setScreen,
  } = useApp();
  const t = useT();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (!accepted) return;
    acknowledgeMedicalDisclaimer();
    if (prefs.onboardingComplete) {
      setScreen("home");
      return;
    }
    goToNextOnboarding();
  };

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.disclaimer}
      title={t("medicalDisclaimerTitle")}
      footer={
        <Button onClick={handleContinue} disabled={!accepted}>
          {t("continue")}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-[14px] font-semibold leading-5 text-[var(--muted)]">
          {t("medicalDisclaimerIntro")}
        </p>
        <MedicalDisclaimer />
        <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1 size-5 shrink-0 accent-[var(--purple)]"
          />
          <span className="text-[14px] font-bold leading-5 text-[var(--ink)]">
            {t("medicalDisclaimerAccept")}
          </span>
        </label>
      </div>
    </ScreenShell>
  );
}
