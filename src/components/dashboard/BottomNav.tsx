"use client";

import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";
import type { TranslationKey } from "@/lib/i18n";
import type { AppScreen } from "@/types";

interface NavItem {
  screen: AppScreen;
  labelKey: TranslationKey;
  icon: string;
}

const ITEMS: NavItem[] = [
  { screen: "home", labelKey: "home", icon: "/icons/home.svg" },
  { screen: "settings", labelKey: "settings", icon: "/icons/settings.svg" },
];

interface BottomNavProps {
  /** When true, no top radius / shadow gap above the bar (home flush layout). */
  flush?: boolean;
}

/** Bottom tab bar — fills to the home indicator with its own background. */
export function BottomNav({ flush = false }: BottomNavProps) {
  const { screen, setScreen } = useApp();
  const t = useT();

  return (
    <nav
      className={[
        "relative z-20 shrink-0 bg-white",
        // Soft upward blur — no hard grey hairline
        flush ? "" : "shadow-[0_-6px_20px_rgba(45,42,42,0.10)]",
      ].join(" ")}
    >
      <div className={flush ? "" : "overflow-hidden rounded-t-[16px]"}>
        <div className="flex h-[52px] items-stretch">
          {ITEMS.map((item) => {
            const active = screen === item.screen;
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => setScreen(item.screen)}
                className={[
                  "flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors",
                  active
                    ? "bg-[var(--purple)] text-white"
                    : "bg-white text-[var(--muted)]",
                  !flush && item.screen === "home" && active
                    ? "rounded-tl-[16px]"
                    : "",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="inline-block size-[18px] shrink-0 bg-current"
                  style={{
                    maskImage: `url(${item.icon})`,
                    WebkitMaskImage: `url(${item.icon})`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
                <span className="text-[11px] font-bold leading-none tracking-wide">
                  {t(item.labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Home-indicator strip — matches active tab colors edge-to-edge */}
      <div
        className="flex"
        style={{ height: "env(safe-area-inset-bottom, 0px)" }}
        aria-hidden="true"
      >
        {ITEMS.map((item) => {
          const active = screen === item.screen;
          return (
            <div
              key={item.screen}
              className={[
                "flex-1",
                active ? "bg-[var(--purple)]" : "bg-white",
              ].join(" ")}
            />
          );
        })}
      </div>
    </nav>
  );
}
