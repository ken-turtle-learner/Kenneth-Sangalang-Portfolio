import Image from "next/image";
import Label from "@/components/Label";
import type { Sample, SampleGroup } from "@/content/samples";
import { highlightNumbers } from "@/lib/highlight-numbers";

// Aspect band, image fit, and `sizes` per group shape. Kept here rather than in
// content/samples.ts so the content file stays free of CSS.
//
// object-top on the two tall shapes is the point: a full-page screenshot cropped
// from the centre shows its middle third, which is the part nobody designed.
export const SHAPE_STYLES: Record<
  SampleGroup["shape"],
  { band: string; fit: string; sizes: string }
> = {
  wide: {
    band: "aspect-16/10",
    fit: "object-cover object-top",
    sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  },
  square: {
    band: "aspect-square",
    fit: "object-cover",
    sizes: "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  },
  tall: {
    band: "aspect-4/5",
    fit: "object-cover object-top",
    sizes: "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  },
};

type SampleTileProps = {
  sample: Sample;
  shape: SampleGroup["shape"];
  browserFrame?: boolean;
  onOpen: (sample: Sample, trigger: HTMLButtonElement) => void;
};

// Strips the protocol and any trailing slash, so the chrome bar reads
// "bravelead.com" rather than "https://bravelead.com/".
function displayDomain(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// One tile in the Work Samples gallery. A button, not a link: samples have no
// page of their own, so there's no URL worth right-clicking. That's the
// difference from components/WorkCard.tsx, which is an anchor precisely because
// each case study does have one.
export default function SampleTile({ sample, shape, browserFrame, onOpen }: SampleTileProps) {
  const style = SHAPE_STYLES[shape];
  const domain = sample.liveUrl ? displayDomain(sample.liveUrl) : null;

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={(event) => onOpen(sample, event.currentTarget)}
        className="hover-grow hover-grow--subtle group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border bg-surface shadow-(--shadow-card) hover:-translate-y-0.5 hover:border-accent"
      >
        {browserFrame ? (
          <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-border bg-surface-raised px-3">
            <span className="h-2 w-2 rounded-full bg-border-strong" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-border-strong" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-border-strong" aria-hidden="true" />
            {domain ? (
              <span className="type-tag ml-2 truncate text-text-muted">{domain}</span>
            ) : null}
          </div>
        ) : null}

        <div className={`relative w-full overflow-hidden ${style.band}`}>
          <Image
            src={sample.image.src}
            alt={sample.image.alt}
            fill
            sizes={style.sizes}
            quality={75}
            className={style.fit}
          />
        </div>

        {/* Appends to the button's accessible name, which would otherwise be the
            image alt alone and never say the tile is interactive. */}
        <span className="sr-only">
          {sample.title}, {sample.client}. Click to enlarge.
        </span>
      </button>

      <div className="mt-3">
        <Label>{sample.client}</Label>
        <h4 className="type-card-title mt-1">{sample.title}</h4>
        {/* The blurb sits here rather than in the lightbox alone so the row can
            be read without clicking anything. It's also the only place the teal
            number highlighting works: the lightbox caption is on a black scrim,
            where the light-mode accent is far too dark. */}
        <p className="type-small mt-1">{highlightNumbers(sample.blurb)}</p>
        {/* Outside the button: an anchor nested in a button is invalid HTML, and
            the button would swallow the click anyway. */}
        {sample.liveUrl ? (
          <a
            href={sample.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="type-label mt-1 inline-block hover:text-accent-text"
          >
            Live ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}
