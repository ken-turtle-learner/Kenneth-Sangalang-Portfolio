import Image from "next/image";
import Link from "next/link";
import Label from "@/components/Label";
import Tag from "@/components/Tag";
import type { CaseStudy } from "@/content/case-studies";

// One featured-work card. The whole card is a single link (Link wraps
// everything, not just a "read more" at the bottom) so the click target is
// as large as possible. Studies with no headline metric (currently just the
// onboarding-flow case, which has no metrics at all) show a screenshot
// thumbnail in that slot instead, so the grid stays visually balanced.
export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  const thumbnail = study.headlineMetric ? null : study.figures?.[0];

  return (
    <Link
      href={`/work/${study.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent"
    >
      <Label>{study.discipline}</Label>
      <h3 className="type-h3 mt-2">{study.title}</h3>
      <p className="type-body mt-2 flex-1">{study.cardOutcome}</p>

      {study.headlineMetric ? (
        <p className="type-stat mt-4 text-accent">{study.headlineMetric}</p>
      ) : thumbnail ? (
        <Image
          src={thumbnail.src}
          alt={thumbnail.alt}
          width={400}
          height={250}
          quality={75}
          className="mt-4 h-32 w-full rounded-lg border border-border object-cover"
        />
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {study.tags.slice(0, 4).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <p className="type-label mt-4 text-accent-text group-hover:underline">Read case study →</p>
    </Link>
  );
}
