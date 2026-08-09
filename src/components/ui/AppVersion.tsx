import { APP_VERSION } from "@/lib/constants";

export function AppVersion({ className = "" }: { className?: string }) {
  return (
    <p
      className={[
        "text-center text-[11px] font-medium lowercase tracking-wide text-[var(--muted)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      v{APP_VERSION}
    </p>
  );
}
