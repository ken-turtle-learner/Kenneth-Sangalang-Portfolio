import type { QuickFacts as QuickFactsData } from "@/content/case-studies";

const FIELDS: { key: keyof QuickFactsData; label: string }[] = [
  { key: "role", label: "Role" },
  { key: "company", label: "Company" },
  { key: "timeline", label: "Timeline" },
  { key: "team", label: "Team" },
  { key: "impact", label: "Impact" },
];

// The mono Role/Company/Timeline/Team/Impact strip at the top of every
// case study page. Server Component — plain data display.
export default function QuickFacts({ facts }: { facts: QuickFactsData }) {
  return (
    <dl className="grid gap-4 border-y border-border py-6 sm:grid-cols-5">
      {FIELDS.map(({ key, label }) => (
        <div key={key}>
          <dt className="type-label">{label}</dt>
          <dd className="type-small mt-1 text-text-secondary">{facts[key]}</dd>
        </div>
      ))}
    </dl>
  );
}
