import Label from "@/components/Label";
import StatCounter from "@/components/StatCounter";

type BenchmarkTrackProps = {
  label: string;
  // Numeric result driving the count-up, e.g. 50.78.
  value: number;
  suffix?: string;
  // Bar fill width, 0-100. Pre-computed by the caller (BenchmarkPanel) rather
  // than derived from `value`, so each row can be scaled to stay legible.
  fillPercent: number;
  // Position (0-100) of the comparison tick — the industry median or baseline.
  // Omitted for rows with nothing to compare against.
  tickPercent?: number;
  // e.g. "median 33.78% · ▲ +17.0 pts".
  comparisonText: string;
};

// One metric: a filled bar against a tick mark for the median or baseline.
// The fill animation is CSS, keyed off the ancestor Reveal's .reveal--visible
// class (see .benchmark-bar-fill in globals.css), so there's no state here.
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
