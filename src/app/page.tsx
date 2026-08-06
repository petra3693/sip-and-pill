"use client";

import { AppShell } from "@/components/AppShell";
import { AppProvider } from "@/context/AppContext";

export default function HomePage() {
  return (
    <AppProvider persist>
      <AppShell />
    </AppProvider>
  );
}
