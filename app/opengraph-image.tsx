import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static OG image for the home page and as a fallback for any route that
// doesn't define its own. Deliberately plain (system sans-serif, not the
// site's actual Montserrat/Newsreader) — next/font's instances aren't
// available inside next/og's separate rendering context, and fetching font
// files just for a single static share-card image wasn't worth the added
// build complexity here.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          // Mirrors the light theme's tokens (--bg, --bg-grad-top and the warm
          // radial from .bg-gradient-layer in app/globals.css) so the share
          // card matches the page a visitor actually lands on.
          backgroundColor: "#FDF6F8",
          backgroundImage: "radial-gradient(ellipse 100% 60% at 50% 0%, #FFF0E0 0%, transparent 65%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#0d9488" }} />
          <div style={{ fontSize: 24, color: "#527093", letterSpacing: 4, textTransform: "uppercase" }}>
            Available now · Remote
          </div>
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, color: "#0F2647", marginTop: 24, display: "flex" }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 32, color: "#3D5878", marginTop: 24, maxWidth: 900, display: "flex" }}>
          {profile.tagline}
        </div>
        <div style={{ fontSize: 22, color: "#527093", marginTop: 28, display: "flex" }}>
          {profile.titles.join("  ·  ")}
        </div>
      </div>
    ),
    { ...size },
  );
}
