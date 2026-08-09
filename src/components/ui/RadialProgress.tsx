interface RadialProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  /** Accessible name for the progressbar (defaults to percent). */
  ariaLabel?: string;
}

export function RadialProgress({
  percent,
  size = 180,
  strokeWidth = 14,
  label,
  sublabel,
  ariaLabel,
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;
  const rounded = Math.round(clamped);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      aria-label={ariaLabel ?? `${rounded}%`}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden
        style={{ filter: "drop-shadow(var(--progress-glow))" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--progress-track)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--progress-ring)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" aria-hidden>
        <span className="text-[42px] font-extrabold leading-none text-[var(--home-gauge-text)]">
          {rounded}%
        </span>
        {label ? (
          <span className="mt-1 text-[13px] font-semibold text-[var(--muted)]">
            {label}
          </span>
        ) : null}
        {sublabel ? (
          <span className="mt-0.5 text-[11px] font-medium text-[var(--muted)]">
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
