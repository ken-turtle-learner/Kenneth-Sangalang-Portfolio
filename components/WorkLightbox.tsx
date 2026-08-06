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

// Fallback visual for a study with no canvas and no figures.
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

// The modal a Featured Work card opens: a summary of the case study, with a
// link through to its full /work/[slug] page. Handles escape, scroll lock,
// backdrop click, and moving focus into the panel.
export default function WorkLightbox({ study, onClose, benchmarkFootnote }: WorkLightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = study ? `lightbox-title-${study.slug}` : undefined;

  // Bound on the document so Escape works regardless of focus.
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

  useEffect(() => {
    if (!study) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [study]);

  useEffect(() => {
    if (!study || !panelRef.current) return;

    const focusableElements = panelRef.current.querySelectorAll(
      "button, a, input, [tabindex]:not([tabindex='-1'])"
    );
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }, [study]);

  if (!study) return null;

  // Only the backdrop itself closes — clicks inside the panel don't.
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
          <div>
            <Label>{study.discipline}</Label>
            <h2 id={titleId} className="type-h2 mt-2">
              {study.title}
            </h2>
            <p className="type-lead mt-4">{study.leadOutcome}</p>
          </div>

          <div className="max-w-2xl">
            <h3 className="type-h3">Problem</h3>
            <p className="type-body mt-3">{study.problem}</p>
          </div>

          <div className="max-w-2xl">
            <h3 className="type-h3">Solution</h3>
            <p className="type-body mt-3">{study.solution}</p>
          </div>

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

          {/* Visual, in order of preference: canvas, figures, facts fallback. */}
          {study.canvas ? (
            <div>
              <h3 className="type-h3 mb-4">The flow</h3>
              <AutomationCanvas steps={study.canvas} label={`${study.title} — automation flow`} compact />
            </div>
          ) : study.figures ? (
            <div className="space-y-4">
              {study.visualHeading ? <h3 className="type-h3 mb-4">{study.visualHeading}</h3> : null}
              {study.figures.map((figure) => (
                <Figure key={figure.src} {...figure} />
              ))}
              {study.creditLine ? <p className="type-small">{study.creditLine}</p> : null}
            </div>
          ) : (
            <LightboxFacts facts={study.quickFacts} />
          )}

          <div className="flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

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
