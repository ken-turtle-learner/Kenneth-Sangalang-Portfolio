import Image from "next/image";
import type { Figure as FigureData } from "@/content/case-studies";

// Static case study screenshot with a caption, used inside WorkLightbox.
// components/ExpandableFigure.tsx is the click-to-enlarge counterpart.
//
// Pass the image's real width/height — the defaults are a last-resort fallback
// and a wrong ratio distorts the render.
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
