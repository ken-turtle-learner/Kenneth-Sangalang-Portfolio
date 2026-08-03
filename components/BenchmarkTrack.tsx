import Label from "@/components/Label";
import StatCounter from "@/components/StatCounter";

type BenchmarkTrackProps = {
  label: string;
  // Numeric result value driving the count-up, e.g. 50.78.
  value: number;
  suffix?: string;
  // Bar fill width as a 0-100 percentage. Callers (see components/Proof.tsx)
  // pre-compute this rather than BenchmarkTrack inferring it from `value`,
  // since a raw click-rate percentage (e.g. 3.83%) would render as an
  // almost-invisible sliver — the caller normalizes each row's scale so the
  // bar stays visually meaningful regardless of the metric's absolute size.
  fillPercent: number;
  // Position (0-100) of the comparison tick mark — the industry median or
  // pre-launch baseline. Omitted for rows with no comparison figure.
  tickPercent?: number;
  // e.g. "median 33.78% · ▲ +17.0 pts" or "across 705 sends, 12 months".
  comparisonText: string;
};

// The site's signature metric instrument: a horizontal track showing
// Kenneth's result as a filled bar against a tick mark for the industry
// median/baseline, instead of a bare stat. This is a Server Component —
// the actual fill/count-up animation is driven by CSS keyed off the
// ancestor Reveal's `.reveal--visible` class (see the .benchmark-bar-fill
// rule in app/globals.css), so no client-side state is needed here.
export default function BenchmarkTrack({
  label,
  value,
  suffix = "%",
  fillPercent,
  tickPercent,
  comparisonText,
}: BenchmarkTrackProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-3 flex items-end gap-4">
        <div className="benchmark-track relative h-3 flex-1 rounded-full bg-surface">
          <div
            className="benchmark-bar-fill h-full rounded-full bg-accent"
            style={{ "--fill": `${fillPercent}%` } as React.CSSProperties}
          />
          {tickPercent === undefined ? null : (
            <div
              className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-border-strong"
              style={{ left: `${tickPercent}%` }}
              aria-hidden="true"
            />
          )}
        </div>
        <StatCounter value={value} suffix={suffix} />
      </div>
      <p className="type-small mt-2">{comparisonText}</p>
    </div>
  );
}
