// A bordered callout stating plainly what Kenneth did and did not do on a
// given case study. Every /work/[slug] page renders one — per the plan's
// non-negotiable on not overclaiming, this is deliberately the most
// prominent honesty mechanism on the site, not a footnote. Server
// Component: static text, no interactivity.
export default function RoleAttribution({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-border-strong bg-surface p-6">
      <p className="type-label">My role</p>
      <p className="type-body mt-2 max-w-none">{text}</p>
    </div>
  );
}
