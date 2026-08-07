"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useT } from "@/hooks/useT";
import { MAX_WATER_ML, MIN_WATER_ML } from "@/lib/constants";

interface NumberInputModalProps {
  open: boolean;
  title: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  suffix?: string;
  onClose: () => void;
  onSave: (value: number) => void;
}

export function NumberInputModal({
  open,
  title,
  label,
  value,
  min = MIN_WATER_ML,
  max = MAX_WATER_ML,
  suffix = "ml",
  onClose,
  onSave,
}: NumberInputModalProps) {
  const t = useT();
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    if (open) setDraft(String(value));
  }, [open, value]);

  const handleSave = () => {
    const parsed = Number(draft.replace(/[^\d]/g, ""));
    if (!Number.isFinite(parsed)) return;
    const clamped = Math.min(max, Math.max(min, Math.round(parsed)));
    onSave(clamped);
    onClose();
  };

  return (
    <Modal
      open={open}
      title={title}
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
      <label className="block">
        <span className="mb-2 block text-[12px] font-bold text-[var(--muted)]">
          {label}
        </span>
        <div className="flex h-14 items-center gap-2 rounded-3xl border border-[var(--border)] bg-[#fff8f6] px-4">
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[20px] font-extrabold text-[var(--ink)] outline-none"
          />
          <span className="text-[14px] font-bold text-[var(--muted)]">
            {suffix}
          </span>
        </div>
      </label>
    </Modal>
  );
}
