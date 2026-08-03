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
          backgroundColor: "#0A1628",
          backgroundImage: "radial-gradient(ellipse 120% 80% at 50% -10%, #12203A 0%, transparent 60%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#0c9397" }} />
          <div style={{ fontSize: 24, color: "#7D91AD", letterSpacing: 4, textTransform: "uppercase" }}>
            Available now · Remote
          </div>
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, color: "#F2F6FA", marginTop: 24, display: "flex" }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 32, color: "#A8B8CC", marginTop: 24, maxWidth: 900, display: "flex" }}>
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
