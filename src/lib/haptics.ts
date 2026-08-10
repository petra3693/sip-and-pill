import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

export type HapticKind = "light" | "medium" | "success" | "warning";

/** Fire haptic feedback on native; no-op on web / failures. */
export async function triggerHaptic(kind: HapticKind = "light"): Promise<void> {
  if (typeof window === "undefined") return;
  if (!Capacitor.isNativePlatform()) {
    try {
      if (kind === "success" || kind === "medium") {
        window.navigator?.vibrate?.(12);
      } else {
        window.navigator?.vibrate?.(8);
      }
    } catch {
      // ignore
    }
    return;
  }

  try {
    if (kind === "success") {
      await Haptics.notification({ type: NotificationType.Success });
      return;
    }
    if (kind === "warning") {
      await Haptics.notification({ type: NotificationType.Warning });
      return;
    }
    await Haptics.impact({
      style: kind === "medium" ? ImpactStyle.Medium : ImpactStyle.Light,
    });
  } catch {
    // Plugin unavailable — ignore.
  }
}
