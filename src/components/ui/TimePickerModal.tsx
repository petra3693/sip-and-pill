"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useT } from "@/hooks/useT";
import { formatTimeDisplay, parseTimeToMinutes } from "@/lib/time";

interface TimePickerModalProps {
  open: boolean;
  initialTime: string;
  title?: string;
  onClose: () => void;
  onSave: (time: string) => void;
}

export function TimePickerModal({
  open,
  initialTime,
  title,
  onClose,
  onSave,
}: TimePickerModalProps) {
  const t = useT();
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (!open) return;
    const total = parseTimeToMinutes(initialTime);
    setHours(Math.floor(total / 60) % 24);
    setMinutes(total % 60);
  }, [open, initialTime]);

  const handleSave = () => {
    onSave(formatTimeDisplay(hours, minutes));
    onClose();
  };

  return (
    <Modal
      open={open}
      title={title ?? t("setReminderTime")}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} className="flex-1">
            {t("save")}
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-center gap-3">
        <label className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-bold uppercase text-[var(--muted)]">
            HH
          </span>
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="h-12 w-20 rounded-2xl border border-[var(--border)] bg-[#fff8f6] text-center text-[20px] font-extrabold text-[var(--ink)] outline-none"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, "0")}
              </option>
            ))}
          </select>
        </label>
        <span className="pt-5 text-[24px] font-extrabold text-[var(--ink)]">
          :
        </span>
        <label className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-bold uppercase text-[var(--muted)]">
            MM
          </span>
          <select
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="h-12 w-20 rounded-2xl border border-[var(--border)] bg-[#fff8f6] text-center text-[20px] font-extrabold text-[var(--ink)] outline-none"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, "0")}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-4 text-center text-[14px] font-bold text-[var(--purple)]">
        {formatTimeDisplay(hours, minutes)}
      </p>
    </Modal>
  );
}
