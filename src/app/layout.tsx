import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sip & Pill — Water & Meds Tracker",
  description:
    "A friendly offline companion to track water intake and medications.",
  applicationName: "Sip & Pill",
  appleWebApp: {
    capable: true,
    // Screens override via applyScreenChrome; translucent enables edge-to-edge.
    statusBarStyle: "black-translucent",
    title: "Sip & Pill",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // Neutral default — each screen sets theme-color for its own surface.
  themeColor: "#fff8f6",
  viewportFit: "cover",
};

/**
 * Root stays neutral. No global status-bar color blocks.
 * Legacy tint nodes are stripped if an older build left them behind.
 */
const BOOT_CLEANUP_SCRIPT = `
(function () {
  try {
    document.getElementById("sip-safari-tint-top")?.remove();
    document.getElementById("sip-safari-tint-bottom")?.remove();
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_CLEANUP_SCRIPT }} />
      </head>
      <body className={`${outfit.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
