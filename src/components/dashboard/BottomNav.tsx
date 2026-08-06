"use client";

import { useApp } from "@/context/AppContext";
import type { AppScreen } from "@/types";

interface NavItem {
  screen: AppScreen;
  label: string;
  icon: string;
}

const ITEMS: NavItem[] = [
  { screen: "home", label: "Home", icon: "/icons/home.svg" },
  { screen: "settings", label: "Settings", icon: "/icons/settings.svg" },
];

export function BottomNav() {
  const { screen, setScreen } = useApp();

  return (
    <nav className="shrink-0 overflow-hidden rounded-t-[24px] bg-white shadow-[0_-10px_24px_rgba(0,0,0,0.07)]">
      <div className="flex h-16 items-stretch">
        {ITEMS.map((item) => {
          const active = screen === item.screen;
          return (
            <button
              key={item.screen}
              type="button"
              onClick={() => setScreen(item.screen)}
              className={[
                "flex flex-1 items-center justify-center gap-2 transition-colors",
                active
                  ? "bg-[var(--purple)] text-white"
                  : "bg-white text-[var(--muted)]",
                item.screen === "home" && active ? "rounded-tl-[24px]" : "",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="inline-block size-[23px] bg-current"
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
              <span className="text-[17px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
