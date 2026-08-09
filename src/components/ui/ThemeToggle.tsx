"use client";

import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useT";

/** Top-right theme control — line icons only, no filled badge background. */
export function ThemeToggle() {
  const { prefs, toggleTheme } = useApp();
  const t = useT();
  const isDark = prefs.theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("lightMode") : t("darkMode")}
      aria-pressed={isDark}
      className={[
        "flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] transition active:scale-[0.96]",
        isDark ? "text-[var(--coral)]" : "text-[var(--ink)]",
      ].join(" ")}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="block"
    >
      <path
        d="M16 7.666V9.3328M16 22.6672V24.334M10.1076 10.1076L11.2827 11.2827M20.7172 20.7172L21.8923 21.8923M7.666 16H9.3328M22.6672 16H24.334M11.2827 20.7172L10.1076 21.8923M21.8923 10.1076L20.7172 11.2827M19.3336 16C19.3336 17.8411 17.8411 19.3336 16 19.3336C14.1589 19.3336 12.6664 17.8411 12.6664 16C12.6664 14.1589 14.1589 12.6664 16 12.6664C17.8411 12.6664 19.3336 14.1589 19.3336 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="block"
    >
      <path
        d="M22.0678 20.4098C22.9208 19.2387 23.4163 17.8457 23.4944 16.3991C23.5127 16.0616 23.1119 15.8858 22.8252 16.0649C21.8664 16.6641 20.7328 16.9207 19.6094 16.7928C18.4859 16.6649 17.439 16.16 16.6395 15.3606C15.84 14.5612 15.3351 13.5144 15.2071 12.3911C15.0792 11.2679 15.3358 10.1344 15.9351 9.1757C16.1142 8.8899 15.9376 8.48828 15.6001 8.50661C14.1533 8.58485 12.7601 9.08045 11.589 9.93348C10.4178 10.7865 9.51892 11.9605 9.00084 13.3134C8.48276 14.6664 8.36772 16.1404 8.66961 17.5574C8.97151 18.9743 9.67743 20.2735 10.702 21.2978C11.7266 22.3222 13.026 23.0279 14.4432 23.3296C15.8603 23.6313 17.3346 23.5161 18.6876 22.9979C20.0407 22.4798 21.2147 21.5809 22.0678 20.4098Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
