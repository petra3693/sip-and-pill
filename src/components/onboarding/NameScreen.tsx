"use client";

import { Button } from "@/components/ui/Button";
import { MascotImage } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { ONBOARDING_PROGRESS } from "@/lib/screens";

export function NameScreen() {
  const { prefs, setName, goToNextOnboarding } = useApp();
  const canContinue = prefs.name.trim().length > 0;

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.name}
      footer={
        <div className="flex flex-col gap-4">
          <Button onClick={goToNextOnboarding} disabled={!canContinue}>
            Continue
          </Button>
          <p className="text-center text-base font-semibold leading-4 text-[var(--muted)]">
            100% Free • Offline • Private
          </p>
        </div>
      }
      contentClassName="flex flex-col items-center justify-between !pt-0"
    >
      <div className="flex h-80 w-full flex-col items-center justify-center">
        <MascotImage
          src="/mascots/both-waving-hello.png"
          width={317}
          height={317}
          alt="Sip and Pill mascots waving"
          className="animate-float rounded-2xl"
        />
      </div>

      <div className="w-full text-center">
        <h1 className="text-3xl font-extrabold leading-9 text-[var(--ink)]">
          Sip &amp; Pill
        </h1>
        <p className="mt-2 text-base font-bold leading-5 text-[var(--ink)]">
          Hello, how can I call you?
        </p>
      </div>

      <label className="mt-2 w-full">
        <span className="sr-only">Your name</span>
        <div className="flex h-14 items-center gap-4 rounded-3xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[var(--border)]">
          <input
            type="text"
            value={prefs.name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            maxLength={32}
            className="min-w-0 flex-1 bg-transparent text-base font-medium leading-5 text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
          />
          <span
            className="h-4 w-0.5 shrink-0 bg-[var(--coral-soft)]"
            aria-hidden
          />
        </div>
      </label>
    </ScreenShell>
  );
}
