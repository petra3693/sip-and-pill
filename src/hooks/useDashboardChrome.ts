"use client";

import { useApp } from "@/context/AppContext";
import { useScreenChrome } from "@/hooks/useScreenChrome";

/** Peach or night chrome for home / about / settings based on theme. */
export function useDashboardChrome(): void {
  const { prefs } = useApp();
  useScreenChrome(prefs.theme === "dark" ? "night" : "light");
}
