import { parseTimeToMinutes } from "@/lib/time";
import type { LanguageCode } from "@/types";

const LOCALE_TAGS: Record<LanguageCode, string> = {
  en: "en-US",
  hu: "hu-HU",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
  ja: "ja-JP",
  ko: "ko-KR",
};

export function localeTag(language: LanguageCode): string {
  return LOCALE_TAGS[language] ?? "en-US";
}

/** Format clock time using the system/locale preference for 12h vs 24h. */
export function formatLocaleTime(
  hours: number,
  minutes: number,
  language: LanguageCode,
): string {
  const date = new Date();
  date.setHours(((hours % 24) + 24) % 24, ((minutes % 60) + 60) % 60, 0, 0);
  return new Intl.DateTimeFormat(localeTag(language), {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/** Format a stored reminder time string ("8:00 AM" / "08:00") for display. */
export function formatStoredTime(
  value: string,
  language: LanguageCode,
): string {
  const total = parseTimeToMinutes(value);
  return formatLocaleTime(Math.floor(total / 60), total % 60, language);
}

/**
 * Simple plural picker.
 * - English: one vs other
 * - Hungarian / Japanese / Korean: typically one form after numbers
 */
export function selectPlural(
  language: LanguageCode,
  count: number,
  forms: { one: string; other: string },
): string {
  if (language === "hu" || language === "ja" || language === "ko") {
    return forms.other;
  }
  return count === 1 ? forms.one : forms.other;
}
