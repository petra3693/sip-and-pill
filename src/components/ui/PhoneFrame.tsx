import type { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  dark?: boolean;
  className?: string;
  fixedHeight?: boolean;
}

export function PhoneFrame({
  children,
  dark = false,
  className = "",
  fixedHeight = false,
}: PhoneFrameProps) {
  return (
    <div
      className={[
        fixedHeight
          ? "relative flex h-[844px] w-[384px] shrink-0 flex-col overflow-hidden rounded-[32px] border border-[#f2e8e4] shadow-xl"
          : "flex min-h-dvh items-center justify-center bg-[#1a1428] p-0 sm:p-6",
        className,
      ].join(" ")}
    >
      {fixedHeight ? (
        <div
          className={[
            "relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden",
            dark ? "bg-[var(--purple)]" : "screen-bg",
          ].join(" ")}
        >
          {children}
        </div>
      ) : (
        <div
          className={[
            "relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden sm:h-[844px] sm:rounded-[32px] sm:border sm:border-[#f2e8e4] sm:shadow-2xl",
            dark ? "bg-[var(--purple)]" : "screen-bg",
          ].join(" ")}
        >
          <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
