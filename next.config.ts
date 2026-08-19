import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 turned images.qualities into an allowlist defaulting to [75], and
    // the loader silently rounds anything else to the nearest allowed value. 90
    // is here for components/SampleLightbox.tsx, whose images are full-page
    // screenshots of text-heavy pages that get read rather than glanced at.
    //
    // 75 has to stay: every other Image on the site asks for it, and removing it
    // would round all of them up to 90.
    qualities: [75, 90],
  },
  headers() {
    return [
      {
        // :path* is zero-or-more segments, so this covers "/" too.
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            // No "preload": that commits the apex and every subdomain to
            // HTTPS-only via the browser preload list, which is painful to
            // unwind. includeSubDomains alone satisfies scanners.
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            // browsing-topics is omitted from the Next docs' example value
            // because it is Chrome-only and scanners flag unknown directives.
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
