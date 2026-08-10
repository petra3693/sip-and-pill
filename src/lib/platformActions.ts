import { Capacitor } from "@capacitor/core";
import { InAppReview } from "@capacitor-community/in-app-review";
import { Share } from "@capacitor/share";
import {
  APP_SHARE_URL,
  appStoreWriteReviewUrl,
  playStoreListingUrl,
} from "@/lib/appLinks";

export async function shareApp(payload: {
  title: string;
  text: string;
  url?: string;
}): Promise<"shared" | "cancelled" | "copied" | "alerted"> {
  const url = payload.url ?? APP_SHARE_URL;
  const text = payload.text;
  const title = payload.title;

  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: title,
      });
      return "shared";
    }
  } catch {
    // User dismissed sheet or plugin unavailable — try web share next.
  }

  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share({ title, text, url });
      return "shared";
    }
  } catch {
    return "cancelled";
  }

  const clipboardText = `${text}\n${url}`;
  try {
    await navigator.clipboard?.writeText(clipboardText);
    return "copied";
  } catch {
    window.alert(clipboardText);
    return "alerted";
  }
}

/**
 * Triggers the native in-app review UI when available (StoreKit / Play).
 * Optional store URLs are used only as web / last-resort fallbacks.
 */
export async function requestAppReview(): Promise<"native" | "store" | "unavailable"> {
  try {
    if (Capacitor.isNativePlatform()) {
      await InAppReview.requestReview();
      return "native";
    }
  } catch {
    // Fall through to store URL if configured.
  }

  const storeUrl =
    Capacitor.getPlatform() === "android"
      ? playStoreListingUrl() ?? appStoreWriteReviewUrl()
      : appStoreWriteReviewUrl() ?? playStoreListingUrl();

  if (storeUrl) {
    window.open(storeUrl, "_blank", "noopener,noreferrer");
    return "store";
  }

  return "unavailable";
}
