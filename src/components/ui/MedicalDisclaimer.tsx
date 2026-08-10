"use client";

import { MEDICAL_DISCLAIMER_EN } from "@/lib/appLinks";
import { useT } from "@/hooks/useT";

interface MedicalDisclaimerProps {
  /** Compact card for Settings; fuller for onboarding. */
  compact?: boolean;
  className?: string;
}

/**
 * App Store medical disclaimer — always shown in English as the canonical
 * legal text; surrounding UI chrome uses the active language.
 */
export function MedicalDisclaimer({
  compact = false,
  className = "",
}: MedicalDisclaimerProps) {
  const t = useT();

  return (
    <aside
      className={[
        "rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)] text-left",
        compact ? "p-3.5" : "p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="note"
      aria-label={t("medicalDisclaimerTitle")}
    >
      <p
        className={[
          "font-extrabold text-[var(--ink)]",
          compact ? "mb-1.5 text-[12px]" : "mb-2 text-[13px]",
        ].join(" ")}
      >
        {t("medicalDisclaimerTitle")}
      </p>
      <p
        className={[
          "font-medium leading-5 text-[var(--muted)]",
          compact ? "text-[12px]" : "text-[13px]",
        ].join(" ")}
      >
        {MEDICAL_DISCLAIMER_EN}
      </p>
    </aside>
  );
}
