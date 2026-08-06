"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { Icon, MascotImage } from "@/components/ui/Icon";
import { RadialProgress } from "@/components/ui/RadialProgress";
import { StatusBar } from "@/components/ui/StatusBar";
import { useApp } from "@/context/AppContext";
import { TIME_SLOT_LABELS } from "@/lib/constants";

export function HomeScreen() {
  const { prefs, logGlass, toggleMedicationTaken } = useApp();
  const showWater = prefs.trackingMode !== "meds";
  const showMeds = prefs.trackingMode !== "water";

  const maxGlasses = Math.max(
    1,
    Math.round(prefs.water.dailyGoalMl / prefs.water.glassSizeMl)
  );
  const logged = prefs.water.glassesLoggedToday;
  const mlLogged = logged * prefs.water.glassSizeMl;
  const waterPercent = Math.min(
    100,
    (mlLogged / prefs.water.dailyGoalMl) * 100
  );

  const displayName = prefs.name.trim() || "Friend";

  return (
    <div className="flex h-full min-h-0 flex-col screen-bg">
      <StatusBar />
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-6 scrollbar-hide">
        <header className="mb-5 flex items-center gap-6">
          <div className="flex size-28 items-center justify-center rounded-[20px]">
            <MascotImage
              src="/mascots/both-dancing.png"
              width={106}
              height={106}
              alt=""
              className="animate-float rounded-2xl"
            />
          </div>
          <div className="flex flex-col gap-3.5">
            <p className="text-sm font-bold uppercase leading-4 text-[var(--muted)]">
              Welcome back
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-[var(--ink)]">
              Hi, {displayName}!
            </h1>
          </div>
        </header>

        {showWater ? (
          <section className="rounded-[24px] bg-[var(--purple)] p-6 text-white shadow-[0_10px_24px_rgba(0,0,0,0.08)] animate-fade-in">
            <p className="text-center text-[12px] font-bold uppercase tracking-wide text-white/80">
              Hydration Level
            </p>
            <div className="mt-4 flex justify-center">
              <RadialProgress percent={waterPercent} />
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => logGlass(-1)}
                disabled={logged <= 0}
                className="flex size-11 items-center justify-center rounded-[22px] bg-[var(--coral-muted)] disabled:opacity-40"
                aria-label="Remove one glass"
              >
                <Icon name="minus" size={20} />
              </button>
              <div className="text-center">
                <p className="text-[23px] font-bold text-[var(--coral-soft)]">
                  {logged} of {maxGlasses} glasses
                </p>
                <p className="text-[15px] font-bold text-white">
                  {mlLogged.toLocaleString()} /{" "}
                  {prefs.water.dailyGoalMl.toLocaleString()} ml
                </p>
              </div>
              <button
                type="button"
                onClick={() => logGlass(1)}
                disabled={logged >= maxGlasses}
                className="flex size-11 items-center justify-center rounded-[22px] bg-[var(--coral-muted)] disabled:opacity-40"
                aria-label="Add one glass"
              >
                <Icon name="plus" size={20} />
              </button>
            </div>
          </section>
        ) : null}

        {showMeds ? (
          <section className="mt-5 rounded-[24px] border border-[var(--border)] bg-white p-4 animate-fade-in">
            <h2 className="mb-4 text-[16px] font-extrabold text-[var(--ink)]">
              Medication Companion
            </h2>
            <div className="flex flex-col gap-2.5">
              {prefs.medications.length === 0 ? (
                <p className="py-4 text-center text-[14px] font-semibold text-[var(--muted)]">
                  No medications yet. Add some in Settings.
                </p>
              ) : (
                prefs.medications.map((med) => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => toggleMedicationTaken(med.id)}
                    className="flex w-full items-center gap-3 rounded-[16px] bg-[#fff8f6] p-2.5 text-left transition active:scale-[0.99]"
                  >
                    <span
                      className={[
                        "flex size-8 items-center justify-center rounded-lg",
                        med.takenToday ? "bg-[var(--privacy)]" : "bg-[var(--coral-muted)]",
                      ].join(" ")}
                    >
                      <Icon name="pill" size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-extrabold text-[var(--ink)]">
                        {med.name}
                      </p>
                      <p className="text-[12px] font-bold text-[var(--muted)]">
                        {med.dosage} • {TIME_SLOT_LABELS[med.timeSlot]}
                      </p>
                    </div>
                    <span
                      className={[
                        "flex size-[34px] shrink-0 items-center justify-center rounded-[22px]",
                        med.takenToday
                          ? "bg-[var(--success)]"
                          : "bg-[#d9d2d0]",
                      ].join(" ")}
                      aria-label={
                        med.takenToday ? "Marked as taken" : "Not taken yet"
                      }
                    >
                      <Icon name="check" size={14} />
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>
        ) : null}
      </div>

      <BottomNav />
    </div>
  );
}
