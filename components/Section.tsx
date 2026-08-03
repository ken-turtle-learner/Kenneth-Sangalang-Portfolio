import Label from "@/components/Label";

type SectionProps = {
  id: string;
  // Small mono eyebrow label shown above the heading (e.g. "FEATURED WORK").
  label?: string;
  heading?: string;
  // One-sentence subheading under the heading, saying what the section holds.
  // Every home page section carries one so the page reads consistently as
  // eyebrow -> heading -> subheading, and the h2 never has to do double duty
  // as both title and explanation.
  intro?: string;
  // For sections that render their own custom-styled heading instead of
  // using `heading` above (e.g. ContactCTA's large type-display "Let's
  // talk.", wrapped in its own Reveal) — pass the id you gave that heading
  // element so the <section> landmark still gets a name via
  // aria-labelledby. Ignored if `heading` is also provided.
  headingId?: string;
  // Centers the section header only. Body alignment stays the caller's job
  // via `className`, since a centered header over left-aligned content is a
  // common and deliberate combination here.
  align?: "left" | "center";
  children: React.ReactNode;
  className?: string;
};

// Shared wrapper for every home-page section: centers content in the
// container-page max-width, applies the one section rhythm (py-20 mobile /
// py-32 desktop) the design system specifies for *every* section, and wires
// up the aria-labelledby landmark pattern so screen readers announce each
// section by its heading.
export default function Section({
  id,
  label,
  heading,
  intro,
  headingId,
  align = "left",
  children,
  className = "",
}: SectionProps) {
  const computedHeadingId = `${id}-heading`;
  const labelledBy = heading ? computedHeadingId : headingId;
  const centered = align === "center";
  const hasHeader = Boolean(label || heading || intro);

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`mx-auto w-full max-w-(--container-page) px-6 py-20 md:px-8 md:py-32 ${className}`}
    >
      {hasHeader ? (
        <div className={centered ? "text-center" : ""}>
          {label ? <Label>{label}</Label> : null}
          {heading ? (
            <h2 id={computedHeadingId} className="type-h2 mt-2">
              {heading}
            </h2>
          ) : null}
          {/* max-w-2xl because .type-lead carries no measure of its own, and
              an intro line running the full container width reads badly.
              mx-auto is required on top of the parent's text-center: the
              width cap makes this a narrower block inside a wider one, and
              text-center only centers the text within that block, not the
              block itself. */}
          {intro ? <p className={`type-lead mt-4 max-w-2xl ${centered ? "mx-auto" : ""}`}>{intro}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
