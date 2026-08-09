"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { Button } from "@/components/ui/Button";
import { MascotImage } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useApp } from "@/context/AppContext";
import { useDashboardChrome } from "@/hooks/useDashboardChrome";
import { useT } from "@/hooks/useT";
import { WEBSITE_URL } from "@/lib/appLinks";
import { MASCOTS } from "@/lib/assets";

export function AboutScreen() {
  useDashboardChrome();

  const { prefs, setScreen } = useApp();
  const t = useT();
  const isDark = prefs.theme === "dark";

  return (
    <div className="screen-bg relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="relative z-10 safe-top min-h-0 flex-1 overflow-y-auto px-6 pb-16 scrollbar-hide">
        <header className="mb-4 flex items-center pt-1">
          <button
            type="button"
            onClick={() => setScreen("home")}
            className="flex size-11 shrink-0 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]"
            aria-label={t("backToHome")}
          >
            <span
              aria-hidden
              className="inline-block size-4 bg-[var(--coral)]"
              style={{
                maskImage: "url(/icons/arrow-left.svg)",
                WebkitMaskImage: "url(/icons/arrow-left.svg)",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            />
          </button>
          <h1 className="min-w-0 flex-1 px-2 text-center text-xl font-extrabold leading-6 text-[var(--ink)]">
            {t("about")}
          </h1>
          <ThemeToggle />
        </header>

        <section className="mb-4 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-4 pb-5 pt-4">
          <div className="-mx-1 mb-1 flex justify-center">
            <MascotImage
              src={MASCOTS.bothReading}
              alt="Sip & Pill mascots"
              maxWidth={300}
              blend={isDark ? "normal" : "multiply"}
            />
          </div>
          <h2 className="text-center text-[16px] font-extrabold text-[var(--ink)]">
            {t("whyBuilt")}
          </h2>
          <p className="mt-2 text-center text-[14px] font-normal leading-5 text-[var(--muted)]">
            {t("whyBuiltBlurb")}
          </p>
        </section>

        <div className="mb-4">
          <Button
            onClick={() => {
              window.open(WEBSITE_URL, "_blank", "noopener,noreferrer");
            }}
            showArrow
          >
            {t("visitWebsite")}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
