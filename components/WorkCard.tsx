import Image from "next/image";
import Label from "@/components/Label";
import type { CaseStudy } from "@/content/case-studies";

type WorkCardProps = {
  study: CaseStudy;
  onOpen: () => void;
};

// One clickable card for the 2-column Featured Work grid. Whole card is a button
// so the entire 3:4 image + content area opens the lightbox. For studies with no
// figure (CS2, CS4), the image slot falls back to a colored tile showing the
// headlineMetric stat instead of a broken-image placeholder.
export default function WorkCard({ study, onOpen }: WorkCardProps) {
  const thumbnail = study.figures?.[0];

  return (
    <button
      type="button"
      onClick={onOpen}
      data-work-card-slug={study.slug}
      className="group flex flex-col rounded-2xl border border-border bg-surface shadow-(--shadow-card) transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent"
    >
      {/* Image area: 16:10 aspect ratio. For studies without a figure, render the
          headlineMetric in a colored fallback tile instead of a broken image. */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
        {thumbnail ? (
          <Image
            src={thumbnail.src}
            alt={thumbnail.alt}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            quality={75}
            className="object-contain"
          />
        ) : study.headlineMetric ? (
          <div className="flex h-full w-full items-center justify-center bg-accent-soft">
            <span className="type-stat text-accent-text">{study.headlineMetric}</span>
          </div>
        ) : null}
      </div>

      {/* Body: discipline label, title (h3), outcome summary (body text) */}
      <div className="flex flex-col p-6">
        <Label>{study.discipline}</Label>
        <h3 className="type-h3 mt-2 text-left">{study.title}</h3>
        <p className="type-body mt-3 text-left">{study.cardOutcome}</p>
      </div>
    </button>
  );
}
