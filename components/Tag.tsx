// Outlined mono pill for tech stack labels and skills. Never filled — teal
// fills are reserved for primary actions.
export default function Tag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`type-tag inline-flex items-center rounded-full border border-border px-3 py-1 text-text-secondary ${className}`}
    >
      {children}
    </span>
  );
}
