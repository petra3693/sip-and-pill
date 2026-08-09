"use client";

import Link from "next/link";
import { renderScreen } from "@/components/AppShell";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { AppProvider } from "@/context/AppContext";
import { SCREEN_META } from "@/lib/screens";

function GalleryContent() {
  return (
    <div className="min-h-dvh overflow-x-auto bg-[#1a1428] p-12">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Dev tool
          </p>
          <h1 className="text-3xl font-extrabold text-white">Screen gallery</h1>
          <p className="mt-1 max-w-xl text-sm text-white/60">
            Static side-by-side preview of all 9 screens. The interactive app
            flow lives on the home route.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-[var(--coral)] px-5 py-2.5 text-sm font-bold text-[var(--cta-ink)]"
        >
          Open app flow →
        </Link>
      </div>

      <div className="inline-flex items-start gap-11">
        {SCREEN_META.map((screen) => (
          <div key={screen.id} className="flex flex-col gap-3">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-white/45">
              {screen.label}
            </p>
            <PhoneFrame dark={screen.dark} fixedHeight>
              {/* Preview only — clicks don't drive the live app */}
              <div className="pointer-events-none h-full overflow-hidden select-none">
                {renderScreen(screen.id)}
              </div>
            </PhoneFrame>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <AppProvider persist={false} demo>
      <GalleryContent />
    </AppProvider>
  );
}
