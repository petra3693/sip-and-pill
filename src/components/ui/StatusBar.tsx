"use client";

import { useEffect, useState } from "react";

interface StatusBarProps {
  light?: boolean;
}

/** Minimal BatteryManager typing for navigator.getBattery(). */
interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function StatusBar({ light = false }: StatusBarProps) {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState(false);

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<BatteryManager>;
    };

    if (typeof nav.getBattery !== "function") {
      return;
    }

    let battery: BatteryManager | null = null;
    let cancelled = false;

    const sync = () => {
      if (!battery || cancelled) return;
      setBatteryLevel(Math.round(battery.level * 100));
      setBatteryCharging(battery.charging);
    };

    nav
      .getBattery()
      .then((b) => {
        if (cancelled) return;
        battery = b;
        sync();
        b.addEventListener("levelchange", sync);
        b.addEventListener("chargingchange", sync);
      })
      .catch(() => {
        /* Unavailable — keep visual fallback */
      });

    return () => {
      cancelled = true;
      if (battery) {
        battery.removeEventListener("levelchange", sync);
        battery.removeEventListener("chargingchange", sync);
      }
    };
  }, []);

  const ink = light ? "text-white" : "text-[var(--ink)]";
  const fill = light ? "bg-white" : "bg-[var(--ink)]";
  const border = light ? "border-white" : "border-[var(--ink)]";

  const displayLevel = batteryLevel ?? 100;
  const batteryFillWidth = Math.max(2, Math.round((displayLevel / 100) * 18));

  return (
    <div
      className={`flex h-11 shrink-0 items-center justify-between px-6 ${light ? "" : "pb-2 pt-3"}`}
    >
      <p className={`min-w-[52px] text-[15px] font-bold tabular-nums ${ink}`}>
        {time}
      </p>

      <div
        className="flex items-center gap-1.5"
        aria-label={
          batteryLevel != null
            ? `Battery ${displayLevel}%${batteryCharging ? ", charging" : ""}`
            : undefined
        }
      >
        <div className="flex h-[14px] items-end gap-[2px]" aria-hidden="true">
          <span className={`h-[4px] w-[3px] rounded-[1px] ${fill}`} />
          <span className={`h-[7px] w-[3px] rounded-[1px] ${fill}`} />
          <span className={`h-[10px] w-[3px] rounded-[1px] ${fill}`} />
          <span className={`h-[14px] w-[3px] rounded-[1px] ${fill}`} />
        </div>

        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          className={ink}
          aria-hidden="true"
        >
          <path
            d="M8 11.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
            fill="currentColor"
          />
          <path
            d="M4.4 9.2a5.1 5.1 0 0 1 7.2 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M2.2 6.6a8.2 8.2 0 0 1 11.6 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        <div className="flex items-center gap-0.5" aria-hidden="true">
          <div
            className={`box-border flex h-3 w-6 items-center rounded-[3px] border-[1.5px] p-px ${border}`}
          >
            <div
              className={`h-full rounded-[1px] ${fill} ${batteryCharging ? "opacity-90" : ""}`}
              style={{ width: batteryFillWidth }}
            />
          </div>
          <span className={`h-[5px] w-[1.5px] rounded-r-full ${fill}`} />
        </div>
      </div>
    </div>
  );
}
