"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { TimePickerModal } from "@/components/ui/TimePickerModal";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";
import { formatStoredTime } from "@/lib/format";
import type { TranslationKey } from "@/lib/i18n";
import { ONBOARDING_PROGRESS } from "@/lib/screens";
import type { ReminderFrequency } from "@/types";

const FREQUENCIES: { value: ReminderFrequency; labelKey: TranslationKey }[] = [
  { value: "every-glass", labelKey: "everyGlass" },
  { value: "3x-daily", labelKey: "threeDaily" },
  { value: "2x-daily", labelKey: "twoDaily" },
  { value: "hourly", labelKey: "hourly" },
  { value: "custom", labelKey: "custom" },
];

const REMINDER_ICONS: Record<string, string> = {
  morning: "icon-morning",
  noon: "icon-noon",
  evening: "icon-evening",
  custom: "icon-custom",
};

const REMINDER_LABEL_KEYS: Record<string, TranslationKey> = {
  Morning: "morning",
  "Mid-morning": "midmorning",
  Noon: "noon",
  Afternoon: "afternoon",
  Evening: "evening",
  Night: "night",
  Custom: "custom",
};

export function RemindersScreen() {
  const {
    prefs,
    setReminderFrequency,
    setSoundEnabled,
    toggleReminderTime,
    updateReminderTime,
    completeOnboarding,
  } = useApp();
  const t = useT();
  const [editingId, setEditingId] = useState<string | null>(null);

  const showMedReminders = prefs.trackingMode !== "water";
  const medReminderTimes = showMedReminders ? prefs.reminders.times : [];
  const editing = medReminderTimes.find((item) => item.id === editingId);

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.reminders}
      title={t("dailyReminders")}
      footer={
        <Button onClick={completeOnboarding}>{t("finishSetup")}</Button>
      }
      className="relative"
    >
      <div className="flex flex-col gap-3">
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[0_8px_16px_rgba(92,77,154,0.08)]">
          <p className="mb-5 text-[14px] font-extrabold text-[var(--purple)]">
            {t("howOftenRemind")}
          </p>
          <div className="mb-5 flex gap-1">
            {FREQUENCIES.map((item) => {
              const selected = prefs.reminders.frequency === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setReminderFrequency(item.value)}
                  className={[
                    "flex-1 rounded-full px-1 py-1.5 text-[11px] font-bold transition-all",
                    selected
                      ? "bg-[var(--purple)] text-[var(--cta-ink)]"
                      : "bg-[var(--bg-peach)] text-[var(--ink)]",
                  ].join(" ")}
                >
                  {t(item.labelKey)}
                </button>
              );
            })}
          </div>
          <div className="flex min-h-7 items-center justify-between gap-3">
            <p className="text-[13px] font-bold leading-none text-[var(--ink)]">
              {t("soundNotification")}
            </p>
            <ToggleSwitch
              checked={prefs.reminders.soundEnabled}
              onChange={setSoundEnabled}
              ariaLabel={t("soundNotification")}
            />
          </div>
        </div>

        {showMedReminders && medReminderTimes.length > 0 ? (
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[0_8px_16px_rgba(92,77,154,0.08)]">
            <p className="mb-2.5 text-[14px] font-extrabold text-[var(--purple)]">
              {t("medicationReminders")}
            </p>
            <div className="flex flex-col gap-2">
              {medReminderTimes.map((item) => (
                <div
                  key={item.id}
                  className="flex min-h-10 items-center gap-3 py-1"
                >
                  <Icon
                    name={REMINDER_ICONS[item.icon ?? "custom"]}
                    size={32}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-normal text-[var(--muted)]">
                      {REMINDER_LABEL_KEYS[item.label]
                        ? t(REMINDER_LABEL_KEYS[item.label])
                        : item.label}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="text-[14px] font-extrabold text-[var(--ink)]">
                        {formatStoredTime(item.time, prefs.language)}
                      </p>
                      <button
                        type="button"
                        onClick={() => setEditingId(item.id)}
                        className="flex items-center gap-1 text-[12px] font-extrabold text-[var(--purple)]"
                        aria-label={t("editTime")}
                      >
                        {t("edit")}
                        <Icon name="edit" size={10} />
                      </button>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={item.enabled}
                    onChange={() => toggleReminderTime(item.id)}
                    ariaLabel={`${t("editTime")} ${formatStoredTime(item.time, prefs.language)}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <TimePickerModal
        open={Boolean(editing)}
        initialTime={editing?.time ?? "8:00 AM"}
        onClose={() => setEditingId(null)}
        onSave={(time) => {
          if (editingId) updateReminderTime(editingId, time);
        }}
      />
    </ScreenShell>
  );
}
