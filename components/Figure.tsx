import Image from "next/image";
import type { Figure as FigureData } from "@/content/case-studies";

// Full-width case study screenshot with a real caption — alt text always
// describes what the screen shows (per the accessibility floor), never a
// generic "screenshot". Not yet dropped into public/work/so-tool/, so this
// renders a broken-image box until Kenneth adds the files — same
// intentional wired-but-empty pattern as the Hero headshot.
export default function Figure({ src, alt, caption }: FigureData) {
  return (
    <figure>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={750}
        quality={75}
        className="w-full rounded-xl border border-border object-cover"
      />
      <figcaption className="type-small mt-2">{caption}</figcaption>
    </figure>
  );
}
