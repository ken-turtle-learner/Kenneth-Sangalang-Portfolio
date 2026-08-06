type ButtonProps = {
  children: React.ReactNode;
  // When provided, renders as an <a>; otherwise a <button>.
  href?: string;
  variant?: "primary" | "ghost";
  // Opens the link in a new tab. Set it on anything leaving the site: without
  // it, clicking through to LinkedIn or GitHub replaces the portfolio in the
  // same tab and the visit is over.
  external?: boolean;
  className?: string;
};

// .hover-grow (app/globals.css) owns the whole transition list, including
// colours — an unlayered class always beats Tailwind's layered transition-*
// utilities, so adding one here would do nothing.
const BASE =
  "hover-grow inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 font-display text-sm font-medium";

// Primary = solid teal fill, one per screen. Ghost = outline, for secondary
// actions sitting next to a primary.
const VARIANTS = {
  primary: "bg-accent text-bg hover:bg-accent-strong",
  ghost: "border border-accent text-accent-text hover:bg-accent-soft",
};

export default function Button({
  children,
  href,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  return href ? (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={classes}
    >
      {children}
    </a>
  ) : (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
