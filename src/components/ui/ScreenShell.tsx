"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useApp } from "@/context/AppContext";
import { useScreenChrome } from "@/hooks/useScreenChrome";
import { useT } from "@/hooks/useT";

interface ScreenShellProps {
  children: ReactNode;
  step?: number;
  title?: string;
  footer?: ReactNode;
  /** Optional note under the footer row (e.g. privacy line). */
  footerNote?: ReactNode;
  dark?: boolean;
  className?: string;
  contentClassName?: string;
  showBack?: boolean;
}

export function ScreenShell({
  children,
  step,
  title,
  footer,
  footerNote,
  dark = false,
  className = "",
  contentClassName = "",
  showBack,
}: ScreenShellProps) {
  useScreenChrome(dark ? "dark" : "light");

  const { goToPreviousOnboarding } = useApp();
  const t = useT();
  const canGoBack = showBack ?? typeof step === "number";

  return (
    <div
      className={[
        "h-full min-h-0 w-full overflow-y-auto scrollbar-hide",
        dark ? "bg-[var(--purple)] text-white" : "text-[var(--ink)]",
        className,
      ].join(" ")}
      style={{
        backgroundColor: dark ? "#5c4d9a" : "#fff8f6",
        backgroundImage: "none",
        background: dark ? "#5c4d9a" : "#fff8f6",
      }}
    >
      {/*
        Single normal-flow column: progress, title, content, and footer
        all scroll together — nothing sticky/fixed.
      */}
      <div className="flex min-h-full flex-col">
        {typeof step === "number" ? (
          <div className="safe-top w-full shrink-0 px-6 pt-2 pb-1">
            <ProgressBar step={step} />
          </div>
        ) : null}

        {title ? (
          <h1 className="shrink-0 px-6 pb-2 pt-7 text-left text-3xl font-extrabold leading-9 tracking-tight text-[var(--ink)]">
            {title}
          </h1>
        ) : null}

        <div
          className={[
            "flex min-h-0 flex-1 flex-col px-6",
            title ? "pt-2" : "pt-4",
            contentClassName,
          ].join(" ")}
        >
          {children}
        </div>

        {footer || canGoBack ? (
          <div className="safe-bottom shrink-0 px-6 pb-8 pt-6">
            <div className="flex items-center gap-3">
              {canGoBack ? (
                <button
                  type="button"
                  onClick={goToPreviousOnboarding}
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-[var(--ink)] shadow-sm outline outline-1 outline-offset-[-1px] outline-[var(--border)] transition-all duration-200 active:scale-[0.98]"
                  aria-label={t("back")}
                >
                  <Icon name="arrow-left" size={20} />
                </button>
              ) : null}

              {footer ? (
                <div className="min-w-0 flex-1 [&_button]:w-full">
                  {footer}
                </div>
              ) : null}
            </div>

            {footerNote ? <div className="mt-4">{footerNote}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
