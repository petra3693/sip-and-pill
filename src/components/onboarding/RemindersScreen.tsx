"use client";

import { Button } from "@/components/ui/Button";
import { Icon, MascotImage } from "@/components/ui/Icon";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useApp } from "@/context/AppContext";
import { ONBOARDING_PROGRESS } from "@/lib/screens";
import type { ReminderFrequency } from "@/types";

const FREQUENCIES: { value: ReminderFrequency; label: string }[] = [
  { value: "every-glass", label: "Every glass" },
  { value: "3x-daily", label: "3x daily" },
  { value: "2x-daily", label: "2x daily" },
  { value: "hourly", label: "Hourly" },
  { value: "custom", label: "Custom" },
];

const REMINDER_ICONS: Record<string, string> = {
  morning: "icon-morning",
  noon: "icon-noon",
  evening: "icon-evening",
  custom: "icon-custom",
};

export function RemindersScreen() {
  const {
    prefs,
    setReminderFrequency,
    setSoundEnabled,
    toggleReminderTime,
    completeOnboarding,
  } = useApp();

  return (
    <ScreenShell
      step={ONBOARDING_PROGRESS.reminders}
      title="Daily Reminders"
      footer={<Button onClick={completeOnboarding}>Finish Setup</Button>}
    >
      <div className="flex justify-center pb-1 animate-float">
        <MascotImage
          src="/mascots/both-reading.png"
          width={218}
          height={117}
          alt="Mascots reading together"
        />
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <div className="rounded-[24px] border border-[var(--border)] bg-white p-3.5 shadow-[0_8px_16px_rgba(92,77,154,0.08)]">
          <p className="mb-5 text-[14px] font-extrabold text-[var(--purple)]">
            How often should I remind you?
          </p>
          <div className="mb-5 flex gap-1">
            {FREQUENCIES.map((item) => {
              const selected = prefs.reminders.frequency === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setReminderFrequency(item.value)}
                  className={[
                    "flex-1 rounded-full px-1 py-1.5 text-[11px] font-bold transition-all",
                    selected
                      ? "bg-[var(--purple)] text-white"
                      : "bg-[#fff8f6] text-[var(--ink)]",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex min-h-7 items-center justify-between gap-3">
            <p className="text-[13px] font-bold leading-none text-[var(--ink)]">
              Sound notification
            </p>
            <ToggleSwitch
              checked={prefs.reminders.soundEnabled}
              onChange={setSoundEnabled}
              ariaLabel="Toggle sound notification"
            />
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--border)] bg-white p-3.5 shadow-[0_8px_16px_rgba(92,77,154,0.08)]">
          <p className="mb-2.5 text-[14px] font-extrabold text-[var(--purple)]">
            Medication Reminders
          </p>
          <div className="flex flex-col gap-2">
            {prefs.reminders.times.map((item) => (
              <div
                key={item.id}
                className="flex min-h-10 items-center gap-3 py-1"
              >
                <Icon
                  name={REMINDER_ICONS[item.icon ?? "custom"]}
                  size={32}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-normal text-[var(--muted)]">
                    {item.label}
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-[14px] font-extrabold text-[var(--ink)]">
                      {item.time}
                    </p>
                    <span className="flex items-center gap-1 text-[12px] font-extrabold text-[var(--purple)]">
                      Edit
                      <Icon name="edit" size={10} />
                    </span>
                  </div>
                </div>
                <ToggleSwitch
                  checked={item.enabled}
                  onChange={() => toggleReminderTime(item.id)}
                  ariaLabel={`Toggle reminder at ${item.time}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
