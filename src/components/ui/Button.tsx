"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  showArrow?: boolean;
}

export function Button({
  children,
  variant = "primary",
  fullWidth = true,
  showArrow = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-[18px] font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-[var(--coral)] text-white shadow-[0_8px_16px_rgba(92,77,154,0.08)] hover:brightness-105",
    secondary:
      "bg-white text-[var(--purple)] border border-[var(--border)] shadow-sm",
    ghost: "bg-transparent text-[var(--purple)]",
    danger: "bg-transparent text-[#e24a4a] font-black",
  };

  return (
    <button
      type="button"
      className={[
        base,
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      {...props}
    >
      <span>
        {children}
        {showArrow ? " →" : ""}
      </span>
    </button>
  );
}
