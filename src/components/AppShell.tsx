"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { HomeScreen } from "@/components/dashboard/HomeScreen";
import { SettingsScreen } from "@/components/dashboard/SettingsScreen";
import { LanguageScreen } from "@/components/onboarding/LanguageScreen";
import { MedicationsScreen } from "@/components/onboarding/MedicationsScreen";
import { NameScreen } from "@/components/onboarding/NameScreen";
import { RemindersScreen } from "@/components/onboarding/RemindersScreen";
import { SplashScreen } from "@/components/onboarding/SplashScreen";
import { TrackingScreen } from "@/components/onboarding/TrackingScreen";
import { WaterGoalScreen } from "@/components/onboarding/WaterGoalScreen";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { useApp } from "@/context/AppContext";
import type { AppScreen } from "@/types";

export function renderScreen(screen: AppScreen): ReactNode {
  switch (screen) {
    case "splash":
      return <SplashScreen />;
    case "language":
      return <LanguageScreen />;
    case "name":
      return <NameScreen />;
    case "tracking":
      return <TrackingScreen />;
    case "water-goal":
      return <WaterGoalScreen />;
    case "medications":
      return <MedicationsScreen />;
    case "reminders":
      return <RemindersScreen />;
    case "home":
      return <HomeScreen />;
    case "settings":
      return <SettingsScreen />;
    default:
      return null;
  }
}

/** Single-screen mobile app shell used on `/`. */
export function AppShell() {
  const { screen, hydrated, resetAllData } = useApp();
  const isSplash = screen === "splash";

  if (!hydrated) {
    return (
      <PhoneFrame dark>
        <div className="flex h-full items-center justify-center">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/20" />
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame dark={isSplash}>
      <div key={screen} className="relative h-full animate-screen-in">
        {renderScreen(screen)}

        {process.env.NODE_ENV === "development" ? (
          <div className="pointer-events-none absolute bottom-2 left-2 right-2 z-50 flex justify-center gap-2 sm:bottom-3">
            <Link
              href="/gallery"
              className="pointer-events-auto rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white/90 backdrop-blur"
            >
              Gallery
            </Link>
            <button
              type="button"
              onClick={resetAllData}
              className="pointer-events-auto rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white/90 backdrop-blur"
            >
              Restart flow
            </button>
          </div>
        ) : null}
      </div>
    </PhoneFrame>
  );
}
