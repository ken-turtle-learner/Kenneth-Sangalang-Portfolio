// Small uppercase mono eyebrow, above section headings and on case study cards.
export default function Label({ children }: { children: React.ReactNode }) {
  return <span className="type-label">{children}</span>;
}
