"use client";

import { useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { translate, type TranslationKey } from "@/lib/i18n";

export function useT() {
  const { prefs } = useApp();

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate(prefs.language, key, vars),
    [prefs.language]
  );

  return t;
}
