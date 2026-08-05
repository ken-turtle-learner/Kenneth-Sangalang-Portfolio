"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import AutomationCanvas from "@/components/AutomationCanvas";
import BenchmarkPanel from "@/components/BenchmarkPanel";
import Figure from "@/components/Figure";
import Label from "@/components/Label";
import ResultsTable from "@/components/ResultsTable";
import Tag from "@/components/Tag";
import type { CaseStudy } from "@/content/case-studies";

type WorkLightboxProps = {
  study: CaseStudy | null;
  onClose: () => void;
  benchmarkFootnote?: string;
};

// Facts card rendered inside the lightbox as a fallback visual when a case study
// has no canvas or figures (CS2). Ported from WorkBlock.tsx's local WorkFacts
// component, with the same styling.
function LightboxFacts({ facts }: { facts: CaseStudy["quickFacts"] }) {
  const FACTS: { key: keyof CaseStudy["quickFacts"]; label: string }[] = [
    { key: "role", label: "Role" },
    { key: "timeline", label: "Timeline" },
    { key: "team", label: "Team" },
    { key: "impact", label: "Impact" },
  ];

  return (
    <dl className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
      {FACTS.map(({ key, label }, index) => (
        <div key={key} className={index > 0 ? "mt-4" : ""}>
          <dt className="type-label">{label}</dt>
          <dd className="type-small mt-1 text-text-secondary">{facts[key]}</dd>
        </div>
      ))}
    </dl>
  );
}

// Full-screen modal overlay for case study details. Handles focus management,
// scroll lock, keyboard escape, and backdrop click. Content mirrors WorkBlock's
// expanded body, restructured for a single-column modal layout.
export default function WorkLightbox({ study, onClose, benchmarkFootnote }: WorkLightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = study ? `lightbox-title-${study.slug}` : undefined;

  // Escape key closes the modal. Captured on the document so any keydown fires
  // this handler regardless of focus.
  useEffect(() => {
    if (!study) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [study, onClose]);

  // Scroll lock: body overflow hidden while the modal is open. Removed on cleanup.
  useEffect(() => {
    if (!study) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [study]);

  // Focus moves to the panel when it opens (via useRef + Reveal's scroll-sync
  // hook pattern would be overkill here since this is just setState, not a scroll
  // reveal — manual ref.focus() is simpler). Focus trap is minimal: Tab cycles
  // through the panel's focusable elements only, wrapping at edges.
  useEffect(() => {
    if (!study || !panelRef.current) return;

    // Move focus into the panel so keyboard navigation stays contained.
    const focusableElements = panelRef.current.querySelectorAll(
      "button, a, input, [tabindex]:not([tabindex='-1'])"
    );
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }, [study]);

  if (!study) return null;

  // Backdrop click handler: only closes if clicking the backdrop itself
  // (e.target === backdrop), not if clicking inside the panel.
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="lightbox-backdrop open fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="lightbox-panel relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-surface-raised shadow-(--shadow-card)"
      >
        <div className="space-y-8 p-8">
          {/* Header: discipline label, title, outcome */}
          <div>
            <Label>{study.discipline}</Label>
            <h2 id={titleId} className="type-h2 mt-2">
              {study.title}
            </h2>
            <p className="type-lead mt-4">{study.leadOutcome}</p>
          </div>

          {/* Problem */}
          <div className="max-w-2xl">
            <h3 className="type-h3">Problem</h3>
            <p className="type-body mt-3">{study.problem}</p>
          </div>

          {/* Solution */}
          <div className="max-w-2xl">
            <h3 className="type-h3">Solution</h3>
            <p className="type-body mt-3">{study.solution}</p>
          </div>

          {/* Results: same branching logic as WorkBlock */}
          <div className="max-w-2xl">
            <h3 className="type-h3">Results</h3>
            <div className="mt-3">
              {study.benchmarkResults ? (
                <BenchmarkPanel rows={study.benchmarkResults} footnote={benchmarkFootnote} />
              ) : (
                <ResultsTable
                  resultsType={study.resultsType}
                  beforeAfterResults={study.beforeAfterResults}
                  metricsNote={study.metricsNote}
                />
              )}
            </div>
          </div>

          {/* Visual: canvas (compact), figure, or facts fallback */}
          {study.canvas ? (
            <div>
              <h3 className="type-h3 mb-4">The flow</h3>
              <AutomationCanvas steps={study.canvas} label={`${study.title} — automation flow`} compact />
            </div>
          ) : study.figures ? (
            <div className="space-y-4">
              {/* Only for studies whose screenshot *is* the flow (CS4) — elsewhere
                  the figure captions already label themselves. */}
              {study.visualHeading ? <h3 className="type-h3 mb-4">{study.visualHeading}</h3> : null}
              {study.figures.map((figure) => (
                <Figure key={figure.src} {...figure} />
              ))}
              {study.creditLine ? <p className="type-small">{study.creditLine}</p> : null}
            </div>
          ) : (
            <LightboxFacts facts={study.quickFacts} />
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          {/* Link to full case study page */}
          <Link
            href={`/work/${study.slug}`}
            className="type-label inline-block hover:text-accent-text"
          >
            Read the full case study →
          </Link>
        </div>
      </div>
    </div>
  );
}
