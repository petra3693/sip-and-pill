interface ProgressBarProps {
  step: number;
  total?: number;
}

export function ProgressBar({ step, total = 6 }: ProgressBarProps) {
  return (
    <div
      className="flex w-full gap-1.5"
      aria-label={`Step ${step} of ${total}`}
    >
      {Array.from({ length: total }, (_, index) => {
        const filled = index < step;
        return (
          <div
            key={index}
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
