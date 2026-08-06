import BenchmarkTrack from "@/components/BenchmarkTrack";
import Reveal from "@/components/Reveal";
import type { BenchmarkRow } from "@/content/case-studies";

type BenchmarkPanelProps = {
  rows: BenchmarkRow[];
  // Provenance line, e.g. the reporting window the numbers came from.
  footnote?: string;
};

// Each row is scaled against 1.3x its own larger value rather than a literal
// 0-100 axis, so a 3.83% click rate still renders as a readable bar. `|| 1`
// guards the all-zero rows (bounce, unsubscribe) against a NaN divisor.
function scaleRow(result: number, comparison?: number) {
  const max = Math.max(result, comparison ?? 0) * 1.3 || 1;
  return {
    fillPercent: (result / max) * 100,
    tickPercent: comparison === undefined ? undefined : (comparison / max) * 100,
  };
}

// The benchmark bar chart shown in a case study's Results block. Bars are
// sized from each row's numeric fields, so editing content/case-studies.ts
// moves the bars and the captions together.
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
