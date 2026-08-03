import Label from "@/components/Label";

type SectionProps = {
  id: string;
  label?: string;
  heading?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ id, label, heading, children, className = "" }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={heading ? headingId : undefined}
      className={`mx-auto w-full max-w-(--container-page) px-6 py-20 md:px-8 md:py-32 ${className}`}
    >
      {label ? <Label>{label}</Label> : null}
      {heading ? (
        <h2 id={headingId} className="type-h2 mt-2">
          {heading}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
