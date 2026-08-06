import Image from "next/image";
import Label from "@/components/Label";
import type { CaseStudy } from "@/content/case-studies";

type WorkCardProps = {
  study: CaseStudy;
  onOpen: () => void;
};

// One clickable card in the Featured Work grid. The whole card is a button, so
// the image and text both open the lightbox. Studies with no usable thumbnail
// fall back to a tile showing their headlineMetric.
export default function WorkCard({ study, onOpen }: WorkCardProps) {
  // cardVisual: "metric" opts out of the thumbnail entirely; cardFigureIndex
  // picks a figure other than the first. See content/case-studies.ts.
  const thumbnail =
    study.cardVisual === "metric" ? undefined : study.figures?.[study.cardFigureIndex ?? 0];

  return (
    <button
      type="button"
      onClick={onOpen}
      data-work-card-slug={study.slug}
      // h-full needs the Reveal wrapper in WorkGrid to pass h-full too — that
      // div, not this button, is the grid item.
      className="hover-grow hover-grow--subtle group flex h-full flex-col rounded-2xl border border-border bg-surface shadow-(--shadow-card) hover:-translate-y-0.5 hover:border-accent"
    >
      {/* object-cover, so screenshots with varying native ratios fill the band
          edge to edge rather than letterboxing. shrink-0 keeps the ratio intact
          on cards whose body copy runs long. */}
      <div className="relative aspect-16/7 w-full shrink-0 overflow-hidden rounded-t-2xl">
        {thumbnail ? (
          <Image
            src={thumbnail.src}
            alt={thumbnail.alt}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            quality={75}
            className="object-cover"
          />
        ) : study.headlineMetric ? (
          <div className="flex h-full w-full items-center justify-center bg-accent-soft px-6">
            <span className="type-card-stat text-accent-text">{study.headlineMetric}</span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col p-5">
        <Label>{study.discipline}</Label>
        <h3 className="type-card-title mt-2 text-left">{study.title}</h3>
        <p className="type-card-body mt-2 text-left">{study.cardOutcome}</p>
      </div>
    </button>
  );
}
