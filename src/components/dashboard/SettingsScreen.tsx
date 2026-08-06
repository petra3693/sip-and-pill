"use client";

import { BottomNav } from "@/components/dashboard/BottomNav";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { StatusBar } from "@/components/ui/StatusBar";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useApp } from "@/context/AppContext";

export function SettingsScreen() {
  const {
    prefs,
    setScreen,
    updateNotifications,
    updateWater,
    removeMedication,
    addMedication,
    resetAllData,
  } = useApp();

  const maxGlasses = Math.max(
    1,
    Math.round(prefs.water.dailyGoalMl / prefs.water.glassSizeMl)
  );

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset all data? This will clear your name, goals, medications, and logs."
    );
    if (confirmed) {
      resetAllData();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col screen-bg">
      <StatusBar />
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-0 scrollbar-hide">
        <header className="mb-4 flex items-center">
          <button
            type="button"
            onClick={() => setScreen("home")}
            className="flex size-11 items-center justify-center rounded-3xl bg-white outline outline-1 outline-offset-[-1px] outline-[#f2e8e4]"
            aria-label="Back to home"
          >
            <Icon name="arrow-left" size={16} />
          </button>
          <h1 className="flex-1 text-center text-xl font-extrabold leading-6 text-[var(--ink)]">
            Settings
          </h1>
          <span className="w-11" aria-hidden="true" />
        </header>

        <section className="mb-4 rounded-[24px] border border-[var(--border)] bg-white p-4">
          <h2 className="mb-4 text-[16px] font-extrabold text-[var(--ink)]">
            Notification Settings
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex min-h-7 items-center justify-between gap-3">
              <p className="text-[14px] font-normal leading-none text-[var(--ink)]">
                Water Drink Reminders
              </p>
              <ToggleSwitch
                checked={prefs.notifications.waterReminders}
                onChange={(checked) =>
                  updateNotifications({ waterReminders: checked })
                }
                ariaLabel="Toggle water drink reminders"
              />
            </div>
            <div className="flex min-h-7 items-center justify-between gap-3">
              <p className="text-[14px] font-normal leading-none text-[var(--ink)]">
                Pill Alarms
              </p>
              <ToggleSwitch
                checked={prefs.notifications.pillAlarms}
                onChange={(checked) =>
                  updateNotifications({ pillAlarms: checked })
                }
                ariaLabel="Toggle pill alarms"
              />
            </div>
          </div>
        </section>

        {prefs.trackingMode !== "meds" ? (
          <section className="mb-4 rounded-[24px] border border-[var(--border)] bg-white p-4">
            <h2 className="mb-4 text-[16px] font-extrabold text-[var(--ink)]">
              Water Settings
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-normal text-[var(--muted)]">
                    Daily Target
                  </p>
                  <p className="text-[14px] font-bold text-[var(--ink)]">
                    {prefs.water.dailyGoalMl.toLocaleString()} ml ({maxGlasses}{" "}
                    glasses)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateWater({
                      dailyGoalMl: Math.min(
                        16,
                        maxGlasses + 1
                      ) * prefs.water.glassSizeMl,
                    })
                  }
                  className="flex items-center gap-1 text-[12px] font-extrabold text-[var(--purple)]"
                >
                  Edit
                  <Icon name="edit" size={10} />
                </button>
              </div>
              <div className="h-px w-full bg-[var(--border)]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-normal text-[var(--muted)]">
                    Glass Size
                  </p>
                  <p className="text-[14px] font-bold text-[var(--ink)]">
                    {prefs.water.glassSizeMl} ml
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sizes = [150, 200, 250, 330, 500];
                    const idx = sizes.indexOf(prefs.water.glassSizeMl);
                    const next = sizes[(idx + 1) % sizes.length];
                    updateWater({
                      glassSizeMl: next,
                      dailyGoalMl: maxGlasses * next,
                    });
                  }}
                  className="flex items-center gap-1 text-[12px] font-extrabold text-[var(--purple)]"
                >
                  Edit
                  <Icon name="edit" size={10} />
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {prefs.trackingMode !== "water" ? (
          <section className="mb-4 rounded-[24px] border border-[var(--border)] bg-white p-4 opacity-60">
            <h2 className="mb-4 text-[16px] font-extrabold text-[var(--ink)]">
              Medications
            </h2>
            <div className="flex flex-col gap-1.5">
              {prefs.medications.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center gap-3.5 rounded-[10px] bg-[#eee] p-2"
                >
                  <p className="min-w-0 flex-1 text-[13px] font-bold text-[var(--ink)]">
                    {med.name}
                  </p>
                  <span className="flex items-center gap-1 text-[12px] font-extrabold text-[#787878]">
                    Edit
                    <Icon name="edit" size={10} />
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMedication(med.id)}
                    aria-label={`Delete ${med.name}`}
                  >
                    <Icon name="x-circle" size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addMedication("morning")}
              className="mt-4 text-[13px] font-extrabold text-[#9f9f9f]"
            >
              + Add medication
            </button>
          </section>
        ) : null}

        <section className="mb-4 rounded-[24px] bg-[var(--purple)] p-5 text-white">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="heart" size={24} />
            <h2 className="text-[16px] font-black">Support Developer</h2>
          </div>
          <p className="mb-4 text-[14px] font-normal leading-5 text-white/80">
            This app is 100% free, offline, and ad-free. If Sip &amp; Pill helps
            you stay healthy, consider supporting independent development!
          </p>
          <Button
            onClick={() =>
              window.alert("Thank you for supporting Sip & Pill!")
            }
          >
            Support Developer
          </Button>
        </section>

        <section className="mb-4 rounded-[24px] border border-[var(--border)] bg-white px-4 py-[18px]">
          <h2 className="text-[16px] font-extrabold text-[var(--ink)]">
            Why we built this
          </h2>
          <p className="mt-2 text-[14px] font-normal leading-5 text-[var(--muted)]">
            We built Sip &amp; Pill to help our friends and family manage their
            hydration and pill schedules simple and offline, without complex
            subscriptions or data tracking.
          </p>
        </section>

        <div className="mb-4 flex items-center gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--privacy)] p-4">
          <Icon name="shield" size={24} />
          <p className="text-[14px] font-extrabold leading-5 text-[var(--success)]">
            100% Offline - Your data stays on your phone
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="mb-2 flex w-full items-center justify-center gap-3 py-4"
        >
          <Icon name="trash" size={20} />
          <span className="text-[16px] font-black text-[#e24a4a]">
            Reset All Data
          </span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
