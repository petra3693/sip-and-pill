import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // App Router lives under src/app — keep root `/` as the interactive flow.
  reactStrictMode: true,
  // Static export for Capacitor (ios/android webDir → out/).
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
