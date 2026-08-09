interface ProgressBarProps {
  step: number;
  total?: number;
}

export function ProgressBar({ step, total = 6 }: ProgressBarProps) {
  const clamped = Math.min(total, Math.max(0, step));

  return (
    <div
      className="flex w-full gap-1.5"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={clamped}
      aria-label={`Step ${clamped} of ${total}`}
    >
      {Array.from({ length: total }, (_, index) => {
        const filled = index < clamped;
        return (
          <div
            key={index}
            aria-hidden
            className={[
              "h-2 flex-1 rounded-full transition-colors duration-300",
              filled ? "bg-[var(--coral-soft)]" : "bg-[var(--border)]",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
