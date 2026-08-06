import Link from "next/link";
import Reveal from "@/components/Reveal";
import { proofPoints } from "@/content/profile";

// Three headline results, directly under the hero. This is the first evidence a
// visitor meets, so it deliberately carries no section heading — the numbers are
// the message and a heading would only push them further down.
//
// No top padding: Hero already ends with pb-20/pb-32, and doubling that would
// drop the band below the fold on a laptop, which defeats the point of it.
export default function ProofBand() {
  return (
    <section
      aria-label="Selected results"
      className="mx-auto w-full max-w-(--container-page) px-6 pb-20 md:px-8 md:pb-28"
    >
      <ul className="grid gap-4 sm:grid-cols-3">
        {proofPoints.map((point, index) => (
          <Reveal key={point.slug} index={index} as="li" className="h-full">
            {/* Each tile links to the case study behind the number, so the band
                doubles as an entry point into the work rather than decoration. */}
            <Link
              href={`/work/${point.slug}`}
              className="hover-grow hover-grow--subtle group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card) hover:-translate-y-0.5 hover:border-accent"
            >
              {/* text-balance keeps the longest stat from breaking to a lone
                  trailing word — the three tiles sit side by side, so a ragged
                  one is obvious. */}
              <span className="type-card-stat text-balance text-accent-text">{point.stat}</span>
              <span className="type-small mt-3 text-text">{point.label}</span>
              {/* mt-auto pins the footnote to the bottom edge so all three line
                  up regardless of how many lines the label above it takes. */}
              <span className="type-label mt-auto pt-4 text-text-muted">{point.footnote}</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
