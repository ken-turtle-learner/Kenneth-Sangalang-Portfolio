import Label from "@/components/Label";

type SectionProps = {
  id: string;
  // Small mono eyebrow label shown above the heading (e.g. "PROOF").
  label?: string;
  heading?: string;
  // For sections that render their own custom-styled heading instead of
  // using `heading` above (e.g. ContactCTA's large type-display "Let's
  // talk.", wrapped in its own Reveal) — pass the id you gave that heading
  // element so the <section> landmark still gets a name via
  // aria-labelledby. Ignored if `heading` is also provided.
  headingId?: string;
  children: React.ReactNode;
  className?: string;
};

// Shared wrapper for every home-page section: centers content in the
// container-page max-width, applies the one section rhythm (py-20 mobile /
// py-32 desktop) the design system specifies for *every* section, and wires
// up the aria-labelledby landmark pattern so screen readers announce each
// section by its heading.
export default function Section({ id, label, heading, headingId, children, className = "" }: SectionProps) {
  const computedHeadingId = `${id}-heading`;
  const labelledBy = heading ? computedHeadingId : headingId;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`mx-auto w-full max-w-(--container-page) px-6 py-20 md:px-8 md:py-32 ${className}`}
    >
      {label ? <Label>{label}</Label> : null}
      {heading ? (
        <h2 id={computedHeadingId} className="type-h2 mt-2">
          {heading}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
