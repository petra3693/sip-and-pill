import type { CSSProperties, ReactNode } from "react";

type SafeEdge = "top" | "right" | "bottom" | "left";

interface SafeAreaProps {
  children: ReactNode;
  className?: string;
  /** Which edges get safe-area inset padding (RN SafeAreaView equivalent). */
  edges?: SafeEdge[];
  style?: CSSProperties;
}

/**
 * Web equivalent of React Native's SafeAreaView.
 * Pads content away from notch / home indicator while the parent
 * background can still paint full-bleed behind the status bar.
 */
export function SafeArea({
  children,
  className = "",
  edges = ["top", "bottom"],
  style,
}: SafeAreaProps) {
  const insetStyle: CSSProperties = {};
  if (edges.includes("top")) {
    insetStyle.paddingTop = "env(safe-area-inset-top, 0px)";
  }
  if (edges.includes("right")) {
    insetStyle.paddingRight = "env(safe-area-inset-right, 0px)";
  }
  if (edges.includes("bottom")) {
    insetStyle.paddingBottom = "env(safe-area-inset-bottom, 0px)";
  }
  if (edges.includes("left")) {
    insetStyle.paddingLeft = "env(safe-area-inset-left, 0px)";
  }

  return (
    <div
      className={["flex h-full min-h-0 w-full flex-col", className].join(" ")}
      style={{ ...insetStyle, ...style }}
    >
      {children}
    </div>
  );
}
