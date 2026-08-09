"use client";

import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";

interface BottomNavProps {
  /** When true, no top radius / shadow gap above the bar (home flush layout). */
  flush?: boolean;
}

/** Bottom tab bar — About | Home (round) | Settings. */
export function BottomNav({ flush = false }: BottomNavProps) {
  const { screen, setScreen } = useApp();
  const t = useT();

  const aboutActive = screen === "about";
  const homeActive = screen === "home";
  const settingsActive = screen === "settings";

  return (
    <nav
      className={[
        "relative z-20 shrink-0 bg-white",
        flush ? "" : "shadow-[0_-6px_20px_rgba(45,42,42,0.10)]",
      ].join(" ")}
    >
      <div className={flush ? "" : "overflow-hidden rounded-t-[16px]"}>
        <div className="relative flex h-12 items-center">
          <button
            type="button"
            onClick={() => setScreen("about")}
            className={[
              "flex h-full flex-1 items-center justify-center px-2 text-[13px] font-bold tracking-wide transition-colors",
              aboutActive ? "text-[var(--purple)]" : "text-[var(--muted)]",
            ].join(" ")}
          >
            {t("about")}
          </button>

          <div className="flex w-[72px] shrink-0 items-center justify-center">
            <button
              type="button"
              onClick={() => setScreen("home")}
              aria-label={t("home")}
              className={[
                "flex size-12 items-center justify-center rounded-full transition-all active:scale-[0.96]",
                homeActive
                  ? "bg-[var(--purple)] text-white shadow-[0_6px_16px_rgba(92,77,154,0.35)]"
                  : "bg-[#f0ebe8] text-[var(--muted)]",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="inline-block size-[20px] shrink-0 bg-current"
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
            className={[
              "flex h-full flex-1 items-center justify-center px-2 text-[13px] font-bold tracking-wide transition-colors",
              settingsActive ? "text-[var(--purple)]" : "text-[var(--muted)]",
            ].join(" ")}
          >
            {t("settings")}
          </button>
        </div>
      </div>

      <div
        className="bg-white"
        style={{ height: "env(safe-area-inset-bottom, 0px)" }}
        aria-hidden="true"
      />
    </nav>
  );
}
