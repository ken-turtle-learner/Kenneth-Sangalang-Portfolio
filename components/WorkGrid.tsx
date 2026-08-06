"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SideProject from "@/components/SideProject";
import WorkCard from "@/components/WorkCard";
import WorkLightbox from "@/components/WorkLightbox";
import { caseStudies } from "@/content/case-studies";

// Provenance line under the benchmark bars. Describes the reporting window the
// numbers came from, so it lives here rather than in content/case-studies.ts.
const BENCHMARK_FOOTNOTE = "Brave Leadership · Aug 2025 – Aug 2026 · ActiveCampaign";

// The home page's featured-work section: case study cards in a 2-column grid
// that open a lightbox, followed by the side project.
export default function WorkGrid() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  // An anchor, not a button: WorkCard renders each card as a next/link so the
  // case study has a real, shareable URL. Keep this selector in step with it.
  const lastTriggerRef = useRef<HTMLAnchorElement | null>(null);

  const handleCardOpen = (slug: string) => {
    // Remember the triggering card so focus can return to it on close.
    if (typeof window !== "undefined") {
      const card = document.querySelector(
        `a[data-work-card-slug="${slug}"]`
      ) as HTMLAnchorElement | null;
      if (card) lastTriggerRef.current = card;
    }
    setActiveSlug(slug);
  };

  const handleLightboxClose = () => {
    setActiveSlug(null);
    if (lastTriggerRef.current) {
      lastTriggerRef.current.focus();
    }
  };

  const activeStudy = caseStudies.find((s) => s.slug === activeSlug) ?? null;

  return (
    <Section id="work" heading="Featured work">
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {caseStudies.map((study, index) => (
          // h-full on the Reveal, not just the card: this div is the grid item,
          // so it's what stretches to the row height.
          <Reveal key={study.slug} index={index} className="h-full">
            <WorkCard study={study} onOpen={() => handleCardOpen(study.slug)} />
          </Reveal>
        ))}
      </div>

      <SideProject />

      {/* One lightbox for the whole section, not one per card. */}
      <WorkLightbox study={activeStudy} onClose={handleLightboxClose} benchmarkFootnote={BENCHMARK_FOOTNOTE} />
    </Section>
  );
}
