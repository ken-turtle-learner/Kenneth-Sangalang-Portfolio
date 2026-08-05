"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SideProject from "@/components/SideProject";
import WorkCard from "@/components/WorkCard";
import WorkLightbox from "@/components/WorkLightbox";
import { caseStudies } from "@/content/case-studies";

// Provenance for the one study that renders benchmark bars. Lives here rather
// than in BenchmarkPanel so the panel stays reusable, and rather than in
// content/case-studies.ts because it describes the reporting window the
// numbers were pulled from, not the case study itself.
const BENCHMARK_FOOTNOTE = "Brave Leadership · Aug 2025 – Aug 2026 · ActiveCampaign";

// The home page's featured-work section: case studies in a 2-column grid with
// click-to-open lightbox, followed by a side project. Client component to manage
// the lightbox's open/close state and focus restoration.
export default function WorkGrid() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handleCardOpen = (slug: string) => {
    // Store a reference to the button that triggered the lightbox so we can
    // return focus to it when the modal closes.
    if (typeof window !== "undefined") {
      const button = document.querySelector(
        `button[data-work-card-slug="${slug}"]`
      ) as HTMLButtonElement | null;
      if (button) lastTriggerRef.current = button;
    }
    setActiveSlug(slug);
  };

  const handleLightboxClose = () => {
    setActiveSlug(null);
    // Return focus to the card that opened the lightbox.
    if (lastTriggerRef.current) {
      lastTriggerRef.current.focus();
    }
  };

  const activeStudy = caseStudies.find((s) => s.slug === activeSlug) ?? null;

  return (
    <Section id="work" heading="Featured work">
      {/* 2-column grid on desktop, 1-column on mobile */}
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {caseStudies.map((study, index) => (
          // h-full on the Reveal, not just on the card: this div is the grid
          // item, so it's what stretches to the row height. Without it the
          // card's own h-full resolves against a shrink-wrapped parent and
          // the cards keep their ragged bottom edges.
          <Reveal key={study.slug} index={index} className="h-full">
            <WorkCard study={study} onOpen={() => handleCardOpen(study.slug)} />
          </Reveal>
        ))}
      </div>

      <SideProject />

      {/* Lightbox modal — rendered once at the section level, not per-card */}
      <WorkLightbox study={activeStudy} onClose={handleLightboxClose} benchmarkFootnote={BENCHMARK_FOOTNOTE} />
    </Section>
  );
}
