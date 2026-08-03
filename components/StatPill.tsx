type StatPillProps = {
  value: string;
  label: string;
};

// One proof figure in the hero row. Deliberately renders a static string
// rather than reusing components/StatCounter: two of the three hero values
// aren't single numbers ("7 courses · 50 students", "5+ yrs"), and three
// simultaneous count-ups directly under the headline would compete with it
// for attention rather than support it. StatCounter still animates inside
// BenchmarkPanel, where a single number really is the point.
export default function StatPill({ value, label }: StatPillProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-(--shadow-card)">
      <p className="font-mono text-lg font-medium tabular-nums text-accent-text">{value}</p>
      <p className="type-small mt-1">{label}</p>
    </div>
  );
}
