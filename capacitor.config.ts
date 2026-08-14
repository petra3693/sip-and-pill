/// <reference types="@capacitor/local-notifications" />
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lumenappstudio.sipandpill",
  appName: "Sip & Pill",
  webDir: "out",
  plugins: {
    LocalNotifications: {
      // iOS: show banners while the app is in the foreground.
      presentationOptions: ["badge", "sound", "banner", "list"],
    },
  },
};

export default config;
