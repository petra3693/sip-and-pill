interface RadialProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export function RadialProgress({
  percent,
  size = 180,
  strokeWidth = 14,
  label,
  sublabel,
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ff6b6b"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[42px] font-extrabold leading-none text-white">
          {Math.round(clamped)}%
        </span>
        {label ? (
          <span className="mt-1 text-[13px] font-semibold text-white/80">
            {label}
          </span>
        ) : null}
        {sublabel ? (
          <span className="mt-0.5 text-[11px] font-medium text-white/55">
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
