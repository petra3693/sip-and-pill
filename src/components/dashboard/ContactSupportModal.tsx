"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useT } from "@/hooks/useT";
import { SUPPORT_EMAIL } from "@/lib/appLinks";

interface ContactSupportModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional sender name from prefs — not shown as email. */
  userName?: string;
}

export function ContactSupportModal({
  open,
  onClose,
  userName = "",
}: ContactSupportModalProps) {
  const t = useT();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) setMessage("");
  }, [open]);

  const canSend = message.trim().length > 0;

  const handleSend = () => {
    const body = message.trim();
    if (!body) return;

    const fromLine = userName.trim()
      ? `From: ${userName.trim()}\n\n`
      : "";
    const subject = encodeURIComponent(`Sip & Pill — ${t("contactSupport")}`);
    const encodedBody = encodeURIComponent(`${fromLine}${body}`);

    // Opens the device mail app; address is never shown in our UI.
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${encodedBody}`;
    onClose();
  };

  return (
    <Modal
      open={open}
      title={t("contactSupport")}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {t("cancel")}
          </Button>
          <Button onClick={handleSend} disabled={!canSend} className="flex-1">
            {t("sendMessage")}
          </Button>
        </div>
      }
    >
      <p className="mb-3 text-[13px] font-medium leading-5 text-[var(--muted)]">
        {t("contactSupportBlurb")}
      </p>
      <label className="block">
        <span className="mb-2 block text-[12px] font-bold text-[var(--muted)]">
          {t("yourMessage")}
        </span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          maxLength={2000}
          placeholder={t("yourMessagePlaceholder")}
          className="w-full resize-none rounded-3xl border border-[var(--border)] bg-[var(--bg-peach)] px-4 py-3 text-[15px] font-medium leading-5 text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
        />
      </label>
    </Modal>
  );
}
