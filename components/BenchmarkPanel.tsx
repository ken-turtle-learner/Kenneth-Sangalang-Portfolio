import BenchmarkTrack from "@/components/BenchmarkTrack";
import Reveal from "@/components/Reveal";
import type { BenchmarkRow } from "@/content/case-studies";

type BenchmarkPanelProps = {
  rows: BenchmarkRow[];
  // Provenance line, e.g. "Brave Leadership · Aug 2025 – Aug 2026 ·
  // ActiveCampaign". Optional so the panel can be reused without one.
  footnote?: string;
};

// Each row's bar/tick widths are normalized against roughly 1.3x the larger of
// its own two values, rather than plotted on a literal 0-100 scale — a raw
// 3.83% click rate would otherwise render as an almost-invisible sliver. This
// keeps every row legible regardless of the metric's real-world scale, while
// preserving the bar-vs-tick relationship that makes the "beating the
// benchmark" point.
//
// The `|| 1` guards the all-zero row (bounce/unsubscribe): without it the
// divisor would be 0 and every percentage would come out NaN.
function scaleRow(result: number, comparison?: number) {
  const max = Math.max(result, comparison ?? 0) * 1.3 || 1;
  return {
    fillPercent: (result / max) * 100,
    tickPercent: comparison === undefined ? undefined : (comparison / max) * 100,
  };
}

// The bar chart that used to be the home page's standalone "Proof" section.
// It now lives inside the work block for the case study it actually describes,
// so these numbers read as that project's evidence rather than as the whole
// portfolio's headline.
//
// Sizes its bars from the numeric fields on each row instead of hardcoded
// literals — the old Proof section kept both, which meant editing
// content/case-studies.ts changed the captions but silently left the bars
// where they were.
export default function BenchmarkPanel({ rows, footnote }: BenchmarkPanelProps) {
  return (
    <div>
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-10">
        {rows.map((row, index) => {
          const { fillPercent, tickPercent } = scaleRow(row.resultValue, row.comparisonValue);

          return (
            <Reveal key={row.label} index={index}>
              <BenchmarkTrack
                label={row.label}
                value={row.resultValue}
                fillPercent={fillPercent}
                tickPercent={tickPercent}
                comparisonText={row.comparison}
              />
            </Reveal>
          );
        })}
      </div>
      {footnote ? <p className="type-small mt-8">{footnote}</p> : null}
    </div>
  );
}
