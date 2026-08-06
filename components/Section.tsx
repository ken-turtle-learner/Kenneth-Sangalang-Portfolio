import Label from "@/components/Label";

type SectionProps = {
  // Doubles as the anchor target for nav links — see content/nav.ts.
  id: string;
  // Small mono eyebrow above the heading, e.g. "FEATURED WORK".
  label?: string;
  heading?: string;
  // One-sentence subheading under the heading.
  intro?: string;
  // For sections rendering their own custom heading instead of `heading`
  // (e.g. ContactCTA): pass that heading element's id so the landmark still
  // gets a name. Ignored when `heading` is provided.
  headingId?: string;
  // Centers the section header only — body alignment stays the caller's job.
  align?: "left" | "center";
  children: React.ReactNode;
  className?: string;
};

// Shared wrapper for every home-page section: page max-width, the site's
// section spacing rhythm, and the aria-labelledby landmark wiring.
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
          {/* mx-auto is needed on top of the parent's text-center: the width
              cap makes this a narrower block, and text-center only centers the
              text inside it, not the block itself. */}
          {intro ? <p className={`type-lead mt-4 max-w-2xl ${centered ? "mx-auto" : ""}`}>{intro}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
