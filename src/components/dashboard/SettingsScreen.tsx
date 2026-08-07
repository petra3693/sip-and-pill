"use client";

import { useState, type ReactNode } from "react";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { ContactSupportModal } from "@/components/dashboard/ContactSupportModal";
import { SupportModal } from "@/components/dashboard/SupportModal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { NumberInputModal } from "@/components/ui/NumberInputModal";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useApp } from "@/context/AppContext";
import { useScreenChrome } from "@/hooks/useScreenChrome";
import { useT } from "@/hooks/useT";
import { APP_SHARE_URL } from "@/lib/appLinks";
import { CHROME_PEACH } from "@/lib/chrome";
import {
  clampWaterMl,
  GLASS_SIZE_OPTIONS,
  LANGUAGES,
  MAX_WATER_ML,
  MIN_WATER_ML,
} from "@/lib/constants";
import type { TranslationKey } from "@/lib/i18n";
import type { LanguageCode } from "@/types";

type InfoModal = "privacy" | "terms" | "rate" | null;

function SettingsRow({
  label,
  onClick,
  trailing,
}: {
  label: string;
  onClick?: () => void;
  trailing?: ReactNode;
}) {
  const content = (
    <>
      <span className="min-w-0 flex-1 text-left text-[14px] font-semibold text-[var(--ink)]">
        {label}
      </span>
      {trailing ?? (
        <span className="text-[18px] font-bold text-[var(--muted)]" aria-hidden>
          ›
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 py-3.5 text-left transition active:opacity-70"
      >
        {content}
      </button>
    );
  }

  return <div className="flex w-full items-center gap-3 py-3.5">{content}</div>;
}

export function SettingsScreen() {
  useScreenChrome("light");

  const {
    prefs,
    setScreen,
    setLanguage,
    updateNotifications,
    updateWater,
    updateMedication,
    removeMedication,
    addMedication,
    resetAllData,
  } = useApp();
  const t = useT();

  const [editingGoal, setEditingGoal] = useState(false);
  const [editingGlass, setEditingGlass] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [medDraft, setMedDraft] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<InfoModal>(null);

  const maxGlasses = Math.max(
    1,
    Math.round(prefs.water.dailyGoalMl / prefs.water.glassSizeMl)
  );

  const waterEnabled = prefs.notifications.waterReminders;
  const pillsEnabled = prefs.notifications.pillAlarms;

  const handleReset = () => {
    const confirmed = window.confirm(t("resetConfirm"));
    if (confirmed) {
      resetAllData();
    }
  };

  const handleShareApp = async () => {
    const payload = {
      title: t("shareAppTitle"),
      text: t("shareAppMessage"),
      url: APP_SHARE_URL,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch {
      // User cancelled share sheet — ignore.
      return;
    }
    try {
      await navigator.clipboard?.writeText(
        `${payload.text}\n${payload.url}`,
      );
      window.alert(t("shareAppMessage"));
    } catch {
      window.alert(`${payload.text}\n${payload.url}`);
    }
  };

  const infoTitleKey: TranslationKey | null =
    infoModal === "privacy"
      ? "privacyPolicy"
      : infoModal === "terms"
        ? "termsOfUse"
        : infoModal === "rate"
          ? "rateApp"
          : null;

  const infoBody =
    infoModal === "privacy"
      ? t("privacyPolicyBody")
      : infoModal === "terms"
        ? t("termsOfUseBody")
        : infoModal === "rate"
          ? t("rateAppThanks")
          : "";

  const openMedEdit = (id: string, name: string) => {
    if (!pillsEnabled) return;
    setEditingMedId(id);
    setMedDraft(name);
  };

  const saveMedEdit = () => {
    if (!editingMedId) return;
    const next = medDraft.trim();
    if (next) updateMedication(editingMedId, { name: next });
    setEditingMedId(null);
  };

  return (
    <div
      className="relative flex h-full min-h-0 flex-col"
      style={{
        backgroundColor: CHROME_PEACH,
        backgroundImage: "none",
        background: CHROME_PEACH,
      }}
    >
      <div className="safe-top min-h-0 flex-1 overflow-y-auto px-6 pb-4 scrollbar-hide">
        <header className="mb-4 flex items-center pt-1">
          <button
            type="button"
            onClick={() => setScreen("home")}
            className="flex size-11 shrink-0 items-center justify-center rounded-3xl bg-white outline outline-1 outline-offset-[-1px] outline-[#f2e8e4]"
            aria-label={t("backToHome")}
          >
            <Icon name="arrow-left" size={16} />
          </button>
          <h1 className="min-w-0 flex-1 px-2 text-center text-xl font-extrabold leading-6 text-[var(--ink)]">
            {t("settings")}
          </h1>
          <span className="w-11 shrink-0" aria-hidden="true" />
        </header>

        <section className="mb-4 rounded-[24px] border border-[var(--border)] bg-white p-4">
          <div className="flex min-h-11 items-center justify-between gap-3">
            <label
              htmlFor="settings-language"
              className="text-[14px] font-semibold text-[var(--ink)]"
            >
              {t("language")}
            </label>
            <div className="relative min-w-0 shrink-0">
              <select
                id="settings-language"
                value={prefs.language}
                onChange={(e) =>
                  setLanguage(e.target.value as LanguageCode)
                }
                aria-label={t("chooseLanguage")}
                className="appearance-none rounded-2xl border border-[var(--border)] bg-[#f7f4f2] py-2.5 pl-3 pr-9 text-[14px] font-bold text-[var(--ink)] outline-none transition focus:border-[var(--purple)]"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted)]"
                aria-hidden
              >
                ▼
              </span>
            </div>
          </div>
        </section>

        <section className="mb-4 rounded-[24px] border border-[var(--border)] bg-white p-4">
          <h2 className="mb-4 text-[16px] font-extrabold text-[var(--ink)]">
            {t("notificationSettings")}
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex min-h-7 items-center justify-between gap-3">
              <p className="text-[14px] font-normal leading-none text-[var(--ink)]">
                {t("waterDrinkReminders")}
              </p>
              <ToggleSwitch
                checked={waterEnabled}
                onChange={(checked) =>
                  updateNotifications({ waterReminders: checked })
                }
                ariaLabel={t("waterDrinkReminders")}
              />
            </div>
            <div className="flex min-h-7 items-center justify-between gap-3">
              <p className="text-[14px] font-normal leading-none text-[var(--ink)]">
                {t("pillAlarms")}
              </p>
              <ToggleSwitch
                checked={pillsEnabled}
                onChange={(checked) =>
                  updateNotifications({ pillAlarms: checked })
                }
                ariaLabel={t("pillAlarms")}
              />
            </div>
          </div>
        </section>

        {prefs.trackingMode !== "meds" ? (
          <section
            className={[
              "mb-4 rounded-[24px] border border-[var(--border)] bg-white p-4 transition",
              waterEnabled ? "" : "pointer-events-none opacity-45",
            ].join(" ")}
          >
            <h2 className="mb-4 text-[16px] font-extrabold text-[var(--ink)]">
              {t("waterSettings")}
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-normal text-[var(--muted)]">
                    {t("dailyTarget")}
                  </p>
                  <p className="text-[14px] font-bold text-[var(--ink)]">
                    {prefs.water.dailyGoalMl.toLocaleString()} ml (
                    {t("glassesCount", { count: maxGlasses })})
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!waterEnabled}
                  onClick={() => setEditingGoal(true)}
                  className="flex items-center gap-1 text-[12px] font-extrabold text-[var(--purple)] disabled:opacity-40"
                  aria-label={t("editDailyGoal")}
                >
                  {t("edit")}
                  <Icon name="edit" size={10} />
                </button>
              </div>
              <div className="h-px w-full bg-[var(--border)]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-normal text-[var(--muted)]">
                    {t("glassSize")}
                  </p>
                  <p className="text-[14px] font-bold text-[var(--ink)]">
                    {prefs.water.glassSizeMl} ml
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!waterEnabled}
                  onClick={() => setEditingGlass(true)}
                  className="flex items-center gap-1 text-[12px] font-extrabold text-[var(--purple)] disabled:opacity-40"
                  aria-label={t("editGlassSize")}
                >
                  {t("edit")}
                  <Icon name="edit" size={10} />
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {prefs.trackingMode !== "water" ? (
          <section
            className={[
              "mb-4 rounded-[24px] border border-[var(--border)] bg-white p-4 transition",
              pillsEnabled ? "" : "pointer-events-none opacity-45",
            ].join(" ")}
          >
            <h2 className="mb-4 text-[16px] font-extrabold text-[var(--ink)]">
              {t("medications")}
            </h2>
            <div className="flex flex-col gap-1.5">
              {prefs.medications.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center gap-3.5 rounded-[10px] bg-[#eee] p-2"
                >
                  {editingMedId === med.id ? (
                    <input
                      value={medDraft}
                      onChange={(e) => setMedDraft(e.target.value)}
                      onBlur={saveMedEdit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveMedEdit();
                      }}
                      autoFocus
                      className="min-w-0 flex-1 rounded-lg bg-white px-2 py-1 text-[13px] font-bold text-[var(--ink)] outline-none"
                    />
                  ) : (
                    <p className="min-w-0 flex-1 text-[13px] font-bold text-[var(--ink)]">
                      {med.name}
                    </p>
                  )}
                  <button
                    type="button"
                    disabled={!pillsEnabled}
                    onClick={() => openMedEdit(med.id, med.name)}
                    className="flex items-center gap-1 text-[12px] font-extrabold text-[var(--purple)] disabled:text-[#787878]"
                  >
                    {t("edit")}
                    <Icon name="edit" size={10} />
                  </button>
                  <button
                    type="button"
                    disabled={!pillsEnabled}
                    onClick={() => removeMedication(med.id)}
                    aria-label={t("deleteMed", { name: med.name })}
                  >
                    <Icon name="x-circle" size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              disabled={!pillsEnabled}
              onClick={() => addMedication("morning")}
              className="mt-4 text-[13px] font-extrabold text-[var(--coral-soft)] disabled:text-[#9f9f9f]"
            >
              {t("addMedication")}
            </button>
          </section>
        ) : null}

        <section className="mb-4 rounded-[24px] bg-[var(--purple)] p-5 text-white">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="heart" size={24} />
            <h2 className="text-[16px] font-black">{t("supportDeveloper")}</h2>
          </div>
          <p className="mb-4 text-[14px] font-normal leading-5 text-white/80">
            {t("supportBlurb")}
          </p>
          <Button onClick={() => setSupportOpen(true)}>
            {t("supportDeveloper")}
          </Button>
        </section>

        <section className="mb-4 rounded-[24px] border border-[var(--border)] bg-white px-4 py-[18px]">
          <h2 className="text-[16px] font-extrabold text-[var(--ink)]">
            {t("whyBuilt")}
          </h2>
          <p className="mt-2 text-[14px] font-normal leading-5 text-[var(--muted)]">
            {t("whyBuiltBlurb")}
          </p>
        </section>

        <section className="mb-4 overflow-hidden rounded-[24px] border border-[var(--border)] bg-white px-4">
          <SettingsRow
            label={t("dataStoredLocally")}
            trailing={
              <Icon name="shield" size={20} className="opacity-80" />
            }
          />
          <div className="h-px bg-[var(--border)]" />
          <SettingsRow
            label={t("contactSupport")}
            onClick={() => setContactOpen(true)}
          />
          <div className="h-px bg-[var(--border)]" />
          <SettingsRow
            label={t("rateApp")}
            onClick={() => setInfoModal("rate")}
          />
          <div className="h-px bg-[var(--border)]" />
          <SettingsRow label={t("shareApp")} onClick={handleShareApp} />
          <div className="h-px bg-[var(--border)]" />
          <SettingsRow
            label={t("privacyPolicy")}
            onClick={() => setInfoModal("privacy")}
          />
          <div className="h-px bg-[var(--border)]" />
          <SettingsRow
            label={t("termsOfUse")}
            onClick={() => setInfoModal("terms")}
          />
        </section>

        <div className="mb-4 flex items-center gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--privacy)] p-4">
          <Icon name="shield" size={24} />
          <p className="text-[14px] font-extrabold leading-5 text-[var(--success)]">
            {t("offlinePrivacy")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="mb-2 flex w-full items-center justify-center gap-3 py-4"
        >
          <Icon name="trash" size={20} />
          <span className="text-[16px] font-black text-[#e24a4a]">
            {t("resetAllData")}
          </span>
        </button>
      </div>

      <BottomNav />

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />

      <ContactSupportModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        userName={prefs.name}
      />

      <Modal
        open={infoModal !== null}
        title={infoTitleKey ? t(infoTitleKey) : ""}
        onClose={() => setInfoModal(null)}
        footer={
          <Button onClick={() => setInfoModal(null)}>{t("close")}</Button>
        }
      >
        <p className="text-[14px] font-medium leading-5 text-[var(--muted)]">
          {infoBody}
        </p>
      </Modal>

      <NumberInputModal
        open={editingGoal}
        title={t("editDailyGoal")}
        label={t("dailyGoalMl")}
        value={prefs.water.dailyGoalMl}
        min={MIN_WATER_ML}
        max={MAX_WATER_ML}
        onClose={() => setEditingGoal(false)}
        onSave={(value) => updateWater({ dailyGoalMl: clampWaterMl(value) })}
      />

      <NumberInputModal
        open={editingGlass}
        title={t("editGlassSize")}
        label={t("glassSize")}
        value={prefs.water.glassSizeMl}
        min={GLASS_SIZE_OPTIONS[0]}
        max={GLASS_SIZE_OPTIONS[GLASS_SIZE_OPTIONS.length - 1]}
        onClose={() => setEditingGlass(false)}
        onSave={(value) => {
          const nearest =
            GLASS_SIZE_OPTIONS.reduce((best, size) =>
              Math.abs(size - value) < Math.abs(best - value) ? size : best
            );
          updateWater({
            glassSizeMl: nearest,
            dailyGoalMl: clampWaterMl(maxGlasses * nearest),
          });
        }}
      />
    </div>
  );
}
