// Small uppercase mono eyebrow label (e.g. "PROOF", "EMAIL AUTOMATION").
// Used above section headings and as the discipline tag on case study cards.
export default function Label({ children }: { children: React.ReactNode }) {
  return <span className="type-label">{children}</span>;
}
