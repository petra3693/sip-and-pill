"use client";

import { MaskIcon } from "@/components/ui/Icon";
import { RadialProgress } from "@/components/ui/RadialProgress";
import { useT } from "@/hooks/useT";

interface HomeGaugeProps {
  percent: number;
  logged: number;
  maxGlasses: number;
  onAdjust: (delta: number) => void;
  onSelectGlasses: (count: number) => void;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Arc from startAngle→endAngle (deg, math angles: 0 = east, CCW). */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  let sweep = endAngle - startAngle;
  if (sweep < 0) sweep += 360;
  const large = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

/** Circular water gauge — Nx beads linked like a pearl string. */
export function HomeGauge({
  percent,
  logged,
  maxGlasses,
  onAdjust,
  onSelectGlasses,
}: HomeGaugeProps) {
  const t = useT();
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const ringR = size / 2 - 18;
  const beadR = 15;
  const markerCount = Math.min(maxGlasses, 12);
  const markers = Array.from({ length: markerCount }, (_, i) => i + 1);
  // Arc stops at the bead edge so the string threads cleanly through each pearl.
  const halfGapDeg =
    (Math.asin(Math.min(0.95, beadR / ringR)) * 180) / Math.PI + 1.25;

  const markerAngle = (n: number) =>
    -90 + ((n - 0.5) / markerCount) * 360;

  return (
    <div className="relative mx-auto w-full max-w-[340px] px-2 pb-6 pt-2">
      <div className="relative mx-auto overflow-visible" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          {/* String segments between beads */}
          {markers.map((n) => {
            const start = markerAngle(n) + halfGapDeg;
            const end = markerAngle(n) + 360 / markerCount - halfGapDeg;
            return (
              <path
                key={`arc-${n}`}
                d={describeArc(cx, cy, ringR, start, end)}
                fill="none"
                stroke="var(--home-outer-ring)"
                strokeWidth={2}
                strokeLinecap="round"
              />
            );
          })}

          {/* Bead outlines — same stroke as the string */}
          {markers.map((n) => {
            const { x, y } = polar(cx, cy, ringR, markerAngle(n));
            return (
              <circle
                key={`bead-${n}`}
                cx={x}
                cy={y}
                r={beadR}
                fill="var(--background)"
                stroke="var(--home-outer-ring)"
                strokeWidth={2}
              />
            );
          })}
        </svg>

        {/* Nx labels inside beads */}
        {markers.map((n) => {
          const { x, y } = polar(cx, cy, ringR, markerAngle(n));
          const active = logged >= n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onSelectGlasses(n)}
              aria-pressed={active}
              aria-label={`${n}x`}
              className={[
                "absolute z-[1] flex size-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[11px] font-extrabold transition active:scale-95",
                active
                  ? "text-[var(--home-marker-active)]"
                  : "text-[var(--home-marker)]",
              ].join(" ")}
              style={{ left: x, top: y }}
            >
              {n}x
            </button>
          );
        })}

        <div className="absolute inset-0 flex items-center justify-center">
          <RadialProgress
            percent={percent}
            size={168}
            strokeWidth={16}
            ariaLabel={`${Math.round(percent)}% — ${t("glassesOf", { logged, max: maxGlasses })}`}
          />
        </div>

        <button
          type="button"
          onClick={() => onAdjust(-1)}
          disabled={logged <= 0}
          aria-label={t("removeGlass")}
          className="absolute bottom-[2%] left-[-2%] z-10 flex size-11 items-center justify-center rounded-full bg-[var(--home-adjust)] text-[var(--home-adjust-ink)] transition active:scale-[0.96] disabled:bg-[var(--home-adjust-disabled)] disabled:text-[var(--muted)]"
        >
          <MaskIcon name="minus" size={20} />
        </button>
        <button
          type="button"
          onClick={() => onAdjust(1)}
          disabled={logged >= maxGlasses}
          aria-label={t("addGlass")}
          className="absolute bottom-[2%] right-[-2%] z-10 flex size-11 items-center justify-center rounded-full bg-[var(--home-adjust)] text-[var(--home-adjust-ink)] transition active:scale-[0.96] disabled:bg-[var(--home-adjust-disabled)] disabled:text-[var(--muted)]"
        >
          <MaskIcon name="plus" size={20} />
        </button>
      </div>
    </div>
  );
}
