"use client";

import { Button } from "@/components/ui/Button";
import { MaskIcon } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";
import { LANGUAGES } from "@/lib/constants";
import { ONBOARDING_PROGRESS } from "@/lib/screens";
import type { LanguageCode } from "@/types";

export function LanguageScreen() {
  const { prefs, setLanguage, goToNextOnboarding } = useApp();
  const t = useT();

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.language}
      title={t("chooseLanguage")}
      footer={<Button onClick={goToNextOnboarding}>{t("continue")}</Button>}
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
                  ? "bg-[var(--purple)] text-[var(--cta-ink)]"
                  : "bg-[var(--surface)] text-[var(--ink)] outline outline-1 outline-offset-[-1px] outline-[var(--border)]",
              ].join(" ")}
            >
              <span className="text-xl" aria-hidden="true">
                {lang.flag}
              </span>
              <span className="flex-1 text-base font-bold">{lang.label}</span>
              {selected ? (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-[12px] bg-[var(--coral)] text-[var(--cta-ink)]">
                  <MaskIcon name="check" size={14} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </ScreenShell>
  );
}
