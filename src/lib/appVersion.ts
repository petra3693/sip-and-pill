import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { APP_BUILD, APP_VERSION } from "@/lib/constants";

export type AppVersionInfo = {
  version: string;
  build: string | null;
};

const WEB_FALLBACK: AppVersionInfo = {
  version: APP_VERSION,
  build: APP_BUILD,
};

/**
 * Native: CFBundleShortVersionString + CFBundleVersion (iOS) or
 * versionName + versionCode (Android) via Capacitor App.getInfo().
 * Web: package fallback — getInfo() is unimplemented in the browser.
 */
export async function getAppVersionInfo(): Promise<AppVersionInfo> {
  if (typeof window === "undefined") {
    return WEB_FALLBACK;
  }

  try {
    if (Capacitor.isNativePlatform()) {
      const info = await App.getInfo();
      const version = info.version?.trim() || APP_VERSION;
      const build = info.build?.trim() || APP_BUILD;
      return { version, build };
    }
  } catch {
    // Plugin missing or web unimplemented.
  }

  return WEB_FALLBACK;
}
