// Bordered callout stating what Kenneth did and did not do on a case study.
// Every /work/[slug] page renders one.
export default function RoleAttribution({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-border-strong bg-surface p-6">
      <p className="type-label">My role</p>
      <p className="type-body mt-2 max-w-none">{text}</p>
    </div>
  );
}
