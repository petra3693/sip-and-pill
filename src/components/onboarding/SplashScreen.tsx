"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { useScreenChrome } from "@/hooks/useScreenChrome";
import { useT } from "@/hooks/useT";
import { MascotImage } from "@/components/ui/Icon";
import { MASCOTS } from "@/lib/assets";
import { CHROME_PURPLE } from "@/lib/chrome";

const BOOT_MS = 2400;

export function SplashScreen() {
  useScreenChrome("dark");

  const { goToNextOnboarding, prefs, screen } = useApp();
  const t = useT();
  const isBootSplash = prefs.onboardingComplete;

  // Returning users: brand boot, then auto-enter home (no CTA).
  useEffect(() => {
    if (!isBootSplash || screen !== "splash") return;

    const id = window.setTimeout(() => {
      goToNextOnboarding();
    }, BOOT_MS);

    return () => window.clearTimeout(id);
  }, [goToNextOnboarding, isBootSplash, screen]);

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col text-white"
      style={{
        backgroundColor: CHROME_PURPLE,
        backgroundImage: "none",
        background: CHROME_PURPLE,
      }}
    >
      <div className="safe-top flex min-h-0 flex-1 flex-col px-6 pb-8 safe-bottom">
        <div
          className={`flex min-h-0 flex-1 flex-col items-center justify-center gap-6 ${
            isBootSplash ? "animate-splash-boot" : ""
          }`}
        >
          <div className="size-64 shrink-0 rounded-full bg-[var(--yellow)] p-[6px]">
            <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-[var(--cream)]">
              <div className="flex w-[88%] max-w-[220px] items-center justify-center">
                <MascotImage
                  src={MASCOTS.splash}
                  alt="Sip and Pill mascots"
                  maxWidth={220}
                  blend="multiply"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-[var(--yellow)] px-4 py-1.5">
              <p className="text-xs font-bold uppercase text-[var(--purple)]">
                {t("dailyCompanion")}
              </p>
            </div>
            <h1 className="text-center text-4xl font-extrabold leading-10">
              Sip &amp; Pill
            </h1>
            <p className="text-center text-sm font-normal leading-5 text-[#eeecf7]">
              {t("tagline")}
            </p>
          </div>
        </div>

        {!isBootSplash ? (
          <div className="flex shrink-0 flex-col gap-4">
            <Button onClick={goToNextOnboarding} showArrow>
              {t("getStarted")}
            </Button>
            <p className="text-center text-base font-medium text-[#eeecf7]">
              {t("freeOfflinePrivate")}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
