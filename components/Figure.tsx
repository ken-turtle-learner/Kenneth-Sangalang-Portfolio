import Image from "next/image";
import type { Figure as FigureData } from "@/content/case-studies";

// Full-width case study screenshot with a real caption — alt text always
// describes what the screen shows (per the accessibility floor), never a
// generic "screenshot".
//
// width/height are the image's true pixel size and should be passed for every
// real asset. They used to be hardcoded to 1200x750 alongside object-cover,
// which silently center-cropped anything that wasn't 1.6:1 — both automation
// screenshots on the site are nearer 1.1:1, so each was losing its top and
// bottom rows of nodes. Every figure in the content file now passes its real
// dimensions, so the defaults are a last-resort fallback only.
export default function Figure({ src, alt, caption, width = 1200, height = 750 }: FigureData) {
  return (
    <figure>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={75}
        className="h-auto w-full rounded-xl border border-border"
      />
      <figcaption className="type-small mt-2">{caption}</figcaption>
    </figure>
  );
}
