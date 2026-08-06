"use client";

import { Button } from "@/components/ui/Button";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { LANGUAGES } from "@/lib/constants";
import { ONBOARDING_PROGRESS } from "@/lib/screens";
import type { LanguageCode } from "@/types";

export function LanguageScreen() {
  const { prefs, setLanguage, goToNextOnboarding } = useApp();

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.language}
      title="Choose Language"
      footer={<Button onClick={goToNextOnboarding}>Continue</Button>}
    >
      <div className="flex flex-col gap-2">
        {LANGUAGES.map((lang) => {
          const selected = prefs.language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code as LanguageCode)}
              className={[
                "flex h-12 w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-200",
                selected
                  ? "bg-[var(--purple)] text-white"
                  : "bg-white text-[var(--ink)] outline outline-1 outline-offset-[-1px] outline-[var(--border)]",
              ].join(" ")}
            >
              <span className="text-xl" aria-hidden="true">
                {lang.flag}
              </span>
              <span className="flex-1 text-base font-bold">{lang.label}</span>
              {selected ? (
                <span className="flex size-5 items-center justify-center rounded-[10px] bg-[var(--coral-soft)]">
                  <span className="block size-3 rounded-sm bg-white" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </ScreenShell>
  );
}
