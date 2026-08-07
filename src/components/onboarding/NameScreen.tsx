"use client";

import { Button } from "@/components/ui/Button";
import { MascotImage } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";
import { MASCOTS } from "@/lib/assets";
import { ONBOARDING_PROGRESS } from "@/lib/screens";

export function NameScreen() {
  const { prefs, setName, goToNextOnboarding } = useApp();
  const t = useT();
  const canContinue = prefs.name.trim().length > 0;

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.name}
      footer={
        <Button onClick={goToNextOnboarding} disabled={!canContinue}>
          {t("continue")}
        </Button>
      }
      footerNote={
        <p className="text-center text-base font-semibold leading-4 text-[var(--muted)]">
          {t("freeOfflinePrivate")}
        </p>
      }
      contentClassName="flex flex-col items-center justify-center !pt-0"
    >
      <div className="flex w-full flex-col items-center text-center">
        <MascotImage
          src={MASCOTS.bothWavingHello}
          maxWidth={200}
          alt="Sip and Pill mascots waving hello"
          blend="multiply"
        />

        <h1 className="mt-3 text-3xl font-extrabold leading-9 text-[var(--ink)]">
          Sip &amp; Pill
        </h1>
        <p className="mt-1.5 text-base font-bold leading-5 text-[var(--ink)]">
          {t("helloCallYou")}
        </p>

        <label className="mt-4 w-full">
          <span className="sr-only">{t("yourName")}</span>
          <div className="flex h-14 items-center rounded-3xl bg-white px-4 outline outline-1 outline-offset-[-1px] outline-[var(--border)]">
            <input
              type="text"
              value={prefs.name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("enterYourName")}
              maxLength={32}
              className="min-w-0 w-full flex-1 bg-transparent text-base font-medium leading-5 text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
            />
          </div>
        </label>
      </div>
    </ScreenShell>
  );
}
