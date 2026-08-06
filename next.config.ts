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
};

export default nextConfig;
