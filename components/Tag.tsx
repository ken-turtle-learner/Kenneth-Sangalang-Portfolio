// Small pill used for tech stack labels and skills — mono type, outlined,
// never filled (teal fills are reserved for primary actions/accents).
export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="type-tag inline-flex items-center rounded-full border border-border px-3 py-1 text-text-secondary">
      {children}
    </span>
  );
}
