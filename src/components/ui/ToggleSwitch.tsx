"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={[
        "inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--purple)]",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "inline-flex h-7 w-12 items-center rounded-full p-0.5 transition-colors duration-200",
          checked
            ? "justify-end bg-[var(--coral-soft)]"
            : "justify-start bg-[var(--border)]",
        ].join(" ")}
      >
        <span className="block size-6 shrink-0 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform duration-200" />
      </span>
    </button>
  );
}
