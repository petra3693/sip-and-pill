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
        "inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--purple)]",
        checked ? "bg-[var(--coral-soft)] justify-end" : "bg-[#d9d2d0] justify-start",
      ].join(" ")}
    >
      <span className="block size-6 shrink-0 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform duration-200" />
    </button>
  );
}
