import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card for the home page, and the fallback for routes with no OG image
// of their own. Uses system sans-serif rather than the site fonts: next/font
// instances aren't available inside next/og's rendering context.
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
          // Hardcoded copies of the light theme's --bg and warm radial from
          // globals.css — keep in sync if those tokens change.
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
