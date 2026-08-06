"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { MascotImage } from "@/components/ui/Icon";
import { StatusBar } from "@/components/ui/StatusBar";
import { useApp } from "@/context/AppContext";

export function SplashScreen() {
  const { goToNextOnboarding } = useApp();

  return (
    <div className="flex h-full flex-col bg-[var(--purple)] text-white">
      <StatusBar light />
      <div className="flex flex-1 flex-col justify-between px-6 pb-8 pt-16">
        <div className="flex flex-col items-center gap-6">
          <div className="size-64 shrink-0 rounded-full bg-[var(--yellow)] p-[6px] animate-float">
            <div className="relative size-full overflow-hidden rounded-full bg-[var(--cream)]">
              <Image
                src="/mascots/splash-characters.png"
                alt="Sip and Pill mascots"
                fill
                sizes="256px"
                priority
                quality={100}
                className="object-cover object-center"
                style={{ imageRendering: "auto" }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-[var(--yellow)] px-4 py-1.5">
              <p className="text-xs font-bold uppercase text-[var(--purple)]">
                Your daily companion
              </p>
            </div>
            <h1 className="text-center text-4xl font-extrabold leading-10">
              Sip &amp; Pill
            </h1>
            <p className="text-center text-sm font-normal leading-5 text-[#eeecf7]">
              Stay hydrated, stay healthy!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-sm bg-white p-4 shadow-[0_8px_16px_rgba(92,77,154,0.08)] animate-slide-up">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[20px] outline outline-2 outline-offset-[-2px] outline-[var(--yellow)] bg-[var(--cream)]">
            <MascotImage
              src="/mascots/drop-thumbs-up.png"
              width={46}
              height={46}
              alt=""
              className="rounded-2xl"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-5 text-[var(--ink)]">
              &ldquo;Ready to track with me?&rdquo;
            </p>
            <p className="text-xs font-medium text-[var(--muted)]">
              I&apos;ll keep you hydrated and remind your meds!
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button onClick={goToNextOnboarding} showArrow>
            Get Started
          </Button>
          <p className="text-center text-base font-medium text-[#eeecf7]">
            100% Free • Offline • Private
          </p>
        </div>
      </div>
    </div>
  );
}
