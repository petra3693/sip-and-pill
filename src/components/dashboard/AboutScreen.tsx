"use client";

import { useState } from "react";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SupportModal } from "@/components/dashboard/SupportModal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useApp } from "@/context/AppContext";
import { useScreenChrome } from "@/hooks/useScreenChrome";
import { useT } from "@/hooks/useT";
import { CHROME_PEACH } from "@/lib/chrome";

export function AboutScreen() {
  useScreenChrome("light");

  const { setScreen } = useApp();
  const t = useT();
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <div
      className="relative flex h-full min-h-0 flex-col"
      style={{
        backgroundColor: CHROME_PEACH,
        backgroundImage: "none",
        background: CHROME_PEACH,
      }}
    >
      <div className="safe-top min-h-0 flex-1 overflow-y-auto px-6 pb-4 scrollbar-hide">
        <header className="mb-4 flex items-center pt-1">
          <button
            type="button"
            onClick={() => setScreen("home")}
            className="flex size-11 shrink-0 items-center justify-center rounded-3xl bg-white outline outline-1 outline-offset-[-1px] outline-[#f2e8e4]"
            aria-label={t("backToHome")}
          >
            <Icon name="arrow-left" size={16} />
          </button>
          <h1 className="min-w-0 flex-1 px-2 text-center text-xl font-extrabold leading-6 text-[var(--ink)]">
            {t("about")}
          </h1>
          <span className="w-11 shrink-0" aria-hidden="true" />
        </header>

        <section className="mb-4 rounded-[24px] bg-[var(--purple)] p-5 text-white">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="heart" size={24} />
            <h2 className="text-[16px] font-black">{t("supportDeveloper")}</h2>
          </div>
          <p className="mb-4 text-[14px] font-normal leading-5 text-white/80">
            {t("supportBlurb")}
          </p>
          <Button onClick={() => setSupportOpen(true)}>
            {t("supportDeveloper")}
          </Button>
        </section>

        <section className="mb-4 rounded-[24px] border border-[var(--border)] bg-white px-4 py-[18px]">
          <h2 className="text-[16px] font-extrabold text-[var(--ink)]">
            {t("whyBuilt")}
          </h2>
          <p className="mt-2 text-[14px] font-normal leading-5 text-[var(--muted)]">
            {t("whyBuiltBlurb")}
          </p>
        </section>
      </div>

      <BottomNav />

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  );
}
