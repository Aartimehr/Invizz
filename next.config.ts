import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hosts a phone may use to open the dev server. Without these the dev server
  // refuses to send its scripts and nothing on the page responds to taps.
  allowedDevOrigins: [
    // This computer's local IP, for a phone on the same Wi-Fi or hotspot.
    "10.*.*.*", "192.168.*.*", "172.20.10.*",
    // Port-sharing tunnels.
    "**.devtunnels.ms", "**.ngrok-free.app", "**.ngrok.app", "**.trycloudflare.com", "**.app.github.dev", "**.loca.lt",
  ],
  // The page was called "How to Order" until October 2026; old links and bookmarks still land in the right place.
  redirects: () => [{ source: "/how-to-order", destination: "/try-customise", permanent: true }],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
