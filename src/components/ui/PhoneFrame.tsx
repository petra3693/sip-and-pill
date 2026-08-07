import type { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  /** Gallery helper only — does not paint global chrome. */
  dark?: boolean;
  className?: string;
  fixedHeight?: boolean;
}

/**
 * Neutral viewport shell. No status-bar color here — each screen paints
 * its own full-bleed background edge-to-edge.
 */
export function PhoneFrame({
  children,
  className = "",
  fixedHeight = false,
}: PhoneFrameProps) {
  return (
    <div
      className={[
        fixedHeight
          ? "relative flex h-[844px] w-[384px] shrink-0 flex-col overflow-hidden rounded-[32px] border border-[#f2e8e4] bg-transparent shadow-xl"
          : [
              "fixed inset-0 z-10 flex w-full items-stretch justify-center bg-transparent",
              "h-[100dvh] min-h-[100dvh] min-h-[100svh] min-h-[-webkit-fill-available]",
              "sm:static sm:min-h-dvh sm:items-center sm:overflow-visible sm:bg-[#1a1428] sm:p-6",
            ].join(" "),
        className,
      ].join(" ")}
    >
      {fixedHeight ? (
        <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-transparent">
          <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </div>
      ) : (
        <div
          className={[
            "relative flex h-full min-h-0 w-full max-w-[430px] flex-col overflow-hidden bg-transparent",
            "sm:h-[844px] sm:rounded-[32px] sm:border sm:border-[#f2e8e4] sm:bg-[var(--bg-peach)] sm:shadow-2xl",
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
