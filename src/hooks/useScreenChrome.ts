"use client";

import { useLayoutEffect } from "react";
import {
  applyScreenChrome,
  type ScreenSurface,
} from "@/lib/chrome";

/**
 * Each screen owns its status-bar / edge chrome.
 * Mount this in the screen component — not in the root shell.
 */
export function useScreenChrome(surface: ScreenSurface): void {
  useLayoutEffect(() => {
    applyScreenChrome({ surface });
  }, [surface]);
}
