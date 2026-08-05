// Small pill used for tech stack labels and skills — mono type, outlined,
// never filled (teal fills are reserved for primary actions/accents).
//
// className exists for the one caller that needs per-instance styling:
// TechStrip tags its pills `repel-item` so components/RepelField.tsx can move
// them. SkillsMatrix and WorkLightbox pass nothing and are unaffected.
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
