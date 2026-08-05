"use client";

import { useState } from "react";
import Link from "next/link";
import AutomationCanvas from "@/components/AutomationCanvas";
import BenchmarkPanel from "@/components/BenchmarkPanel";
import Figure from "@/components/Figure";
import Label from "@/components/Label";
import ResultsTable from "@/components/ResultsTable";
import Tag from "@/components/Tag";
import type { CaseStudy } from "@/content/case-studies";

type WorkBlockProps = {
  study: CaseStudy;
  // Provenance line passed through to BenchmarkPanel, for the one study that
  // renders bars.
  benchmarkFootnote?: string;
};

const FACTS: { key: keyof CaseStudy["quickFacts"]; label: string }[] = [
  { key: "role", label: "Role" },
  { key: "timeline", label: "Timeline" },
  { key: "team", label: "Team" },
  { key: "impact", label: "Impact" },
];

// Vertical facts card for the aside column. Deliberately not components/
// QuickFacts: that one is a full-bleed sm:grid-cols-5 strip for the top of a
// case study page, and its media query is viewport-based — dropped into a
// 20rem column it would still try to lay five columns across 320px.
function WorkFacts({ facts }: { facts: CaseStudy["quickFacts"] }) {
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

// One case study on the home page. Collapsed by default — shows only the title,
// outcome, and a toggle button. Clicking expands inline to show Problem,
// Solution, Results, tags, and the aside column (canvas/figure/facts). The detail
// page (/work/[slug]) renders the full case study independently without this
// collapse behavior.
export default function WorkBlock({ study, benchmarkFootnote }: WorkBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const thumbnail = study.figures?.[0];
  const detailsId = `${study.slug}-details`;

  return (
    <article className={`grid gap-10 border-t border-border pt-12 ${expanded ? "lg:grid-cols-[1fr_20rem] lg:gap-16" : ""}`}>
      <div>
        <Label>{study.discipline}</Label>
        <h3 className="type-h3 mt-2">{study.title}</h3>
        <p className="type-lead mt-3">{study.cardOutcome}</p>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={detailsId}
          className="type-label mt-6 inline-block text-accent-text hover:underline"
        >
          {expanded ? "Hide details ↑" : "Show details ↓"}
        </button>

        {expanded ? (
          <div id={detailsId}>
            <h4 className="type-h4 mt-8">Problem</h4>
            <p className="type-body mt-2">{study.problem}</p>

            <h4 className="type-h4 mt-6">Solution</h4>
            <p className="type-body mt-2">{study.solution}</p>

            <h4 className="type-h4 mt-6">Results</h4>
            <div className="mt-3">
              {study.benchmarkResults ? (
                // Bars *instead of* ResultsTable, not alongside it: ResultsTable's
                // benchmark branch renders the same five rows, so showing both put
                // every number on the page twice. The bar-against-tick form is the
                // one that makes "above median" readable at a glance; the table is
                // still there on the detail page for anyone who wants the figures.
                <BenchmarkPanel rows={study.benchmarkResults} footnote={benchmarkFootnote} />
              ) : (
                // Everything else defers to ResultsTable's own resultsType
                // branching. For the two operational studies that means rendering
                // metricsNote verbatim — stating plainly that no metric exists,
                // rather than dropping the heading and letting the absence look
                // like an oversight.
                <ResultsTable
                  resultsType={study.resultsType}
                  beforeAfterResults={study.beforeAfterResults}
                  metricsNote={study.metricsNote}
                />
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            <Link
              href={`/work/${study.slug}`}
              className="type-label mt-6 inline-block text-accent-text hover:underline"
            >
              Read the full case study →
            </Link>
          </div>
        ) : null}
      </div>

      {expanded ? (
        <aside>
          {study.canvas ? (
            <>
              <h4 className="type-h4 mb-4">The flow</h4>
              {/* compact: the 11-email sequence is 23 steps, which would render
                  a ~2000px column here. The detail page draws every step. */}
              <AutomationCanvas steps={study.canvas} label={`${study.title} — automation flow`} compact />
            </>
          ) : thumbnail ? (
            <Figure src={thumbnail.src} alt={thumbnail.alt} caption={thumbnail.caption} />
          ) : (
            <WorkFacts facts={study.quickFacts} />
          )}
        </aside>
      ) : null}
    </article>
  );
}
