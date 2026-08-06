import type { ReactNode } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBar } from "@/components/ui/StatusBar";

interface ScreenShellProps {
  children: ReactNode;
  step?: number;
  title?: string;
  footer?: ReactNode;
  dark?: boolean;
  className?: string;
  contentClassName?: string;
  showStatusBar?: boolean;
}

export function ScreenShell({
  children,
  step,
  title,
  footer,
  dark = false,
  className = "",
  contentClassName = "",
  showStatusBar = true,
}: ScreenShellProps) {
  return (
    <div
      className={[
        "flex h-full min-h-0 flex-col screen-bg",
        dark ? "bg-[var(--purple)] text-white" : "text-[var(--ink)]",
        className,
      ].join(" ")}
    >
      {showStatusBar ? <StatusBar /> : null}

      {typeof step === "number" ? (
        <div className="shrink-0 px-6">
          <ProgressBar step={step} />
          {title ? (
            <h1 className="text-left text-3xl font-extrabold leading-9 tracking-tight text-[var(--ink)]">
              {title}
            </h1>
          ) : null}
        </div>
      ) : null}

      <div
        className={[
          "min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-5 scrollbar-hide",
          contentClassName,
        ].join(" ")}
      >
        {children}
      </div>

      {footer ? (
        <div className="shrink-0 px-6 pb-8 pt-6">{footer}</div>
      ) : null}
    </div>
  );
}
