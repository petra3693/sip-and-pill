"use client";

import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";

interface BottomNavProps {
  /** When true, no top radius / shadow gap above the bar (home flush layout). */
  flush?: boolean;
}

/** Bottom tab bar — About | Home (round, elevated) | Settings. */
export function BottomNav({ flush = false }: BottomNavProps) {
  const { screen, setScreen } = useApp();
  const t = useT();

  const aboutActive = screen === "about";
  const homeActive = screen === "home";
  const settingsActive = screen === "settings";

  return (
    <nav
      aria-label={t("mainNav")}
      className={[
        "relative z-20 shrink-0 overflow-visible bg-[var(--surface)]",
        flush ? "" : "shadow-[0_-6px_20px_rgba(0,0,0,0.18)]",
      ].join(" ")}
    >
      <div
        className={[
          "relative overflow-visible",
          flush ? "" : "rounded-t-[16px]",
        ].join(" ")}
      >
        <div className="relative flex h-12 items-center overflow-visible">
          <button
            type="button"
            onClick={() => setScreen("about")}
            aria-current={aboutActive ? "page" : undefined}
            className={[
              "flex h-full flex-1 flex-col items-center justify-center gap-0.5 px-2 text-[13px] font-bold tracking-wide transition-colors",
              aboutActive ? "text-[var(--coral)]" : "text-[var(--muted)]",
            ].join(" ")}
          >
            {t("about")}
            <span
              aria-hidden
              className={[
                "h-0.5 w-5 rounded-full transition-colors",
                aboutActive ? "bg-[var(--coral)]" : "bg-transparent",
              ].join(" ")}
            />
          </button>

          <div className="relative h-12 w-24 shrink-0">
            <button
              type="button"
              onClick={() => setScreen("home")}
              aria-label={t("home")}
              aria-current={homeActive ? "page" : undefined}
              className={[
                "absolute bottom-0 left-1/2 flex size-24 -translate-x-1/2 items-center justify-center rounded-full transition-all active:scale-[0.96]",
                homeActive
                  ? "bg-[var(--purple)] text-white shadow-[0_8px_22px_rgba(92,77,154,0.4)]"
                  : "bg-[var(--surface-muted)] text-[var(--muted)] shadow-[0_6px_16px_rgba(0,0,0,0.2)]",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="inline-block size-8 shrink-0 bg-current"
                style={{
                  maskImage: "url(/icons/home.svg)",
                  WebkitMaskImage: "url(/icons/home.svg)",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setScreen("settings")}
            aria-current={settingsActive ? "page" : undefined}
            className={[
              "flex h-full flex-1 flex-col items-center justify-center gap-0.5 px-2 text-[13px] font-bold tracking-wide transition-colors",
              settingsActive ? "text-[var(--coral)]" : "text-[var(--muted)]",
            ].join(" ")}
          >
            {t("settings")}
            <span
              aria-hidden
              className={[
                "h-0.5 w-5 rounded-full transition-colors",
                settingsActive ? "bg-[var(--coral)]" : "bg-transparent",
              ].join(" ")}
            />
          </button>
        </div>
      </div>

      <div
        className="bg-[var(--surface)]"
        style={{ height: "env(safe-area-inset-bottom, 0px)" }}
        aria-hidden="true"
      />
    </nav>
  );
}
