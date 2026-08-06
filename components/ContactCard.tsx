type ContactCardProps = {
  platform: string;
  handle: string;
  href: string;
  // The card's action label. Distinct per card rather than a shared "Connect →":
  // three identical labels give three different actions the same weight.
  cta: string;
  // "primary" is the one action the page is actually asking for. Exactly one
  // card should use it, or the hierarchy stops meaning anything.
  variant?: "primary" | "secondary";
  external?: boolean;
};

// One way to get in touch. The whole card is the link, and the handle is shown
// in full rather than hidden behind a generic label, so it can be read or copied
// without clicking.
export default function ContactCard({
  platform,
  handle,
  href,
  cta,
  variant = "secondary",
  external = false,
}: ContactCardProps) {
  // Tinted fill plus a solid accent border, rather than a fully filled card:
  // .type-label and .type-small carry their own colours as unlayered CSS, so a
  // dark fill would leave the text inside them at unreadable contrast.
  const surface =
    variant === "primary"
      ? "border-accent bg-accent-soft"
      : "border-border bg-surface hover:border-accent";

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`hover-grow hover-grow--subtle group flex flex-col rounded-2xl border p-6 text-left shadow-(--shadow-card) hover:-translate-y-0.5 ${surface}`}
    >
      <p className="type-label">{platform}</p>
      {/* break-all: the email and LinkedIn path contain no spaces to wrap at,
          so they overflow a narrow card without it. */}
      <p className="type-small mt-2 break-all text-text-secondary">{handle}</p>
      {/* mt-auto keeps the action label on the bottom edge of every card, so the
          three line up even though the handles above them wrap differently. */}
      <p className="type-label mt-auto pt-4 text-accent-text group-hover:underline">{cta}</p>
    </a>
  );
}
