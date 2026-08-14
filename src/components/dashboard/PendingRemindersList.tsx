"use client";

import { useCallback, useEffect, useState } from "react";
import { TimePickerModal } from "@/components/ui/TimePickerModal";
import { Icon, MaskIcon } from "@/components/ui/Icon";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";
import { formatLocaleTime } from "@/lib/format";
import type { TranslationKey } from "@/lib/i18n";
import {
  listPendingReminders,
  type PendingReminder,
} from "@/lib/notifications";
import { formatTimeDisplay } from "@/lib/time";
import type { MedTimeSlot } from "@/types";

const REMINDER_LABEL_KEYS: Record<string, TranslationKey> = {
  Morning: "morning",
  "Mid-morning": "midmorning",
  Noon: "noon",
  Afternoon: "afternoon",
  Evening: "evening",
  Night: "night",
  Custom: "custom",
};

const LABEL_TO_SLOT: Record<string, MedTimeSlot> = {
  Morning: "morning",
  "Mid-morning": "midmorning",
  Noon: "noon",
  Afternoon: "afternoon",
  Evening: "evening",
  Night: "night",
};

function slotFromReminder(reminder: PendingReminder): MedTimeSlot | null {
  const fromId = reminder.reminderId?.replace(/^rem-/, "");
  if (
    fromId === "morning" ||
    fromId === "midmorning" ||
    fromId === "noon" ||
    fromId === "afternoon" ||
    fromId === "evening" ||
    fromId === "night"
  ) {
    return fromId;
  }
  return LABEL_TO_SLOT[reminder.label] ?? null;
}

export function PendingRemindersList() {
  const { prefs, updatePendingReminderTime, deletePendingReminder } = useApp();
  const t = useT();
  const [items, setItems] = useState<PendingReminder[]>([]);
  const [editing, setEditing] = useState<PendingReminder | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    const next = await listPendingReminders(prefs);
    setItems(next);
  }, [prefs]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const titleFor = (reminder: PendingReminder): string => {
    if (reminder.kind === "water") return t("reminderFluid");
    const slot = slotFromReminder(reminder);
    const meds = slot
      ? prefs.medications.filter((med) => med.timeSlot === slot)
      : [];
    if (meds.length > 0) {
      return meds.map((med) => med.name).join(", ");
    }
    const key = REMINDER_LABEL_KEYS[reminder.label];
    return key ? t(key) : reminder.label || reminder.title;
  };

  const handleSaveTime = async (time: string) => {
    if (!editing) return;
    const current = editing;
    setEditing(null);
    setBusyId(current.id);
    try {
      await updatePendingReminderTime(current, time);
      await refresh();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (reminder: PendingReminder) => {
    setBusyId(reminder.id);
    try {
      await deletePendingReminder(reminder);
      await refresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mt-4 border-t border-[var(--border)] pt-4">
      <p className="mb-3 text-[12px] font-extrabold uppercase tracking-wide text-[var(--purple)]">
        {t("activeReminders")}
      </p>
      {items.length === 0 ? (
        <p className="text-[13px] font-medium text-[var(--muted)]">
          {t("noActiveReminders")}
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((item) => {
            const title = titleFor(item);
            const when = `${t("reminderDaily")} · ${formatLocaleTime(
              item.hour,
              item.minute,
              prefs.language,
            )}`;
            const busy = busyId === item.id;
            return (
              <li
                key={item.id}
                className="flex min-h-11 items-center gap-2 rounded-[10px] bg-[var(--surface-muted)] p-2"
              >
                <Icon
                  name={item.kind === "pills" ? "pill" : "icon-custom"}
                  size={28}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-[var(--ink)]">
                    {title}
                  </p>
                  <p className="text-[12px] font-medium text-[var(--muted)]">
                    {when}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setEditing(item)}
                  className="flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full px-2 text-[12px] font-extrabold text-[var(--purple)] disabled:opacity-40"
                  aria-label={`${t("editTime")} ${title}`}
                >
                  {t("edit")}
                  <MaskIcon name="edit" size={12} />
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleDelete(item)}
                  aria-label={`${t("deleteReminder")} ${title}`}
                  className="flex size-11 items-center justify-center rounded-full text-[var(--danger)] disabled:opacity-40"
                >
                  <MaskIcon name="trash" size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <TimePickerModal
        open={Boolean(editing)}
        initialTime={
          editing
            ? formatTimeDisplay(editing.hour, editing.minute)
            : "8:00 AM"
        }
        title={t("setReminderTime")}
        onClose={() => setEditing(null)}
        onSave={(time) => {
          void handleSaveTime(time);
        }}
      />
    </div>
  );
}
