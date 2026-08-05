import Image from "next/image";
import Label from "@/components/Label";
import type { CaseStudy } from "@/content/case-studies";

type WorkCardProps = {
  study: CaseStudy;
  onOpen: () => void;
};

// One clickable card for the 2-column Featured Work grid. Whole card is a button
// so the entire image + content area opens the lightbox. Studies with no usable
// thumbnail (CS2 has no figure at all; CS4 has one but opts out via cardVisual)
// fall back to a colored tile showing the headlineMetric stat instead of a
// broken-image placeholder.
export default function WorkCard({ study, onOpen }: WorkCardProps) {
  // Two escape hatches from the default "first figure" thumbnail:
  // cardVisual: "metric" opts a study out of the figure thumbnail entirely even
  // though it has figures — CS4's is a dense automation screenshot that turns to
  // mush at this size, where its 50.78% stat reads instantly. cardFigureIndex
  // picks a different figure instead — CS3's figures are in flow order for the
  // stacked render, but its first screen is a text block at thumbnail size.
  const thumbnail =
    study.cardVisual === "metric" ? undefined : study.figures?.[study.cardFigureIndex ?? 0];

  return (
    <button
      type="button"
      onClick={onOpen}
      data-work-card-slug={study.slug}
      // hover-grow--subtle replaces what was transition-[transform,border-color]:
      // Tailwind v4's -translate-y-0.5 sets the standalone `translate` property,
      // so the old list transitioned a `transform` the card never touched and
      // the lift snapped. The class also adds a 1.02 scale on top of the lift.
      // h-full makes every card fill its grid row, so the four cards line up on
      // a common bottom edge instead of each ending at its own content height.
      // Requires the Reveal wrapper in WorkGrid to pass h-full too — that div,
      // not this button, is the actual grid item.
      className="hover-grow hover-grow--subtle group flex h-full flex-col rounded-2xl border border-border bg-surface shadow-(--shadow-card) hover:-translate-y-0.5 hover:border-accent"
    >
      {/* Image area: 16:7. Shorter than the 16:9 it used to be — the band was
          ~294px of a ~500px card, so it was the single biggest thing making
          these read as oversized.

          object-cover, so the screenshot fills the band edge to edge and is
          cropped to fit. These are UI captures with varying native ratios (one
          source is nearly square at 798×743), and under the object-contain this
          used to use, that one letterboxed down to under half the band width —
          a small floating image in a field of empty surface. Filling the band
          costs the edges of the flow, but the thumbnail is a visual hook into
          the lightbox, not the thing anyone reads the flow from.

          shrink-0 keeps the aspect ratio intact: this is a flex child now that
          the card is h-full, so without it the band could compress on a card
          whose body copy runs long. */}
      <div className="relative aspect-16/7 w-full shrink-0 overflow-hidden rounded-t-2xl">
        {thumbnail ? (
          <Image
            src={thumbnail.src}
            alt={thumbnail.alt}
            fill
            // Still 50vw: the grid is unchanged at 2 columns, only the card
            // height moved.
            sizes="(min-width: 640px) 50vw, 100vw"
            quality={75}
            className="object-cover"
          />
        ) : study.headlineMetric ? (
          // px-6 keeps the longest metric ("7 courses · 50 students", which
          // wraps to two lines) off the tile edges now that the band is short.
          <div className="flex h-full w-full items-center justify-center bg-accent-soft px-6">
            <span className="type-card-stat text-accent-text">{study.headlineMetric}</span>
          </div>
        ) : null}
      </div>

      {/* Body: discipline label, title, outcome summary. The type-card-* classes
          are a card-scale step down from type-h3/type-body — see the cascade
          note beside them in globals.css for why they're their own classes and
          not size utilities. */}
      <div className="flex flex-col p-5">
        <Label>{study.discipline}</Label>
        <h3 className="type-card-title mt-2 text-left">{study.title}</h3>
        <p className="type-card-body mt-2 text-left">{study.cardOutcome}</p>
      </div>
    </button>
  );
}
