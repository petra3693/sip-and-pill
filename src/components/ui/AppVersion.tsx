"use client";

import { useEffect, useState } from "react";
import { useT } from "@/hooks/useT";
import { getAppVersionInfo, type AppVersionInfo } from "@/lib/appVersion";
import { APP_VERSION } from "@/lib/constants";

export function AppVersion({ className = "" }: { className?: string }) {
  const t = useT();
  const [info, setInfo] = useState<AppVersionInfo>({
    version: APP_VERSION,
    build: null,
  });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const next = await getAppVersionInfo();
      if (!cancelled) setInfo(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const label = info.build
    ? t("appVersionWithBuild", { version: info.version, build: info.build })
    : t("appVersion", { version: info.version });

  return (
    <p
      className={[
        "text-center text-[11px] font-medium tracking-wide text-[var(--muted)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </p>
  );
}
