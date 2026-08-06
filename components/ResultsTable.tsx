import type { BeforeAfterRow, BenchmarkRow } from "@/content/case-studies";

type ResultsTableProps = {
  resultsType: "benchmark" | "before-after" | "operational";
  benchmarkResults?: BenchmarkRow[];
  beforeAfterResults?: BeforeAfterRow[];
  metricsNote?: string;
};

// Renders one of three shapes depending on a study's `resultsType`: a
// benchmark comparison, a before/after, or — where there's no metric —
// the metricsNote paragraph instead of a table.
export default function ResultsTable({
  resultsType,
  benchmarkResults,
  beforeAfterResults,
  metricsNote,
}: ResultsTableProps) {
  if (resultsType === "operational") {
    return metricsNote ? <p className="type-body">{metricsNote}</p> : null;
  }

  if (resultsType === "before-after" && beforeAfterResults) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="type-label py-2 pr-4">
                Metric
              </th>
              <th scope="col" className="type-label py-2 pr-4">
                Before
              </th>
              <th scope="col" className="type-label py-2 pr-4">
                After
              </th>
              <th scope="col" className="type-label py-2">
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {beforeAfterResults.map((row) => (
              <tr key={row.label} className="border-b border-border">
                <td className="type-small py-2 pr-4 text-text-secondary">{row.label}</td>
                <td className="type-tag py-2 pr-4">{row.before}</td>
                <td className="type-tag py-2 pr-4 text-accent-text">{row.after}</td>
                <td className="type-tag py-2 text-accent-text">{row.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (resultsType === "benchmark" && benchmarkResults) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="type-label py-2 pr-4">
                Metric
              </th>
              <th scope="col" className="type-label py-2 pr-4">
                Result
              </th>
              <th scope="col" className="type-label py-2">
                vs. industry median
              </th>
            </tr>
          </thead>
          <tbody>
            {benchmarkResults.map((row) => (
              <tr key={row.label} className="border-b border-border">
                <td className="type-small py-2 pr-4 text-text-secondary">{row.label}</td>
                <td className="type-tag py-2 pr-4 text-accent-text">{row.result}</td>
                <td className="type-small py-2 text-text-muted">{row.comparison}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}
