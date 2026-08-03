type ButtonProps = {
  children: React.ReactNode;
  // When provided, renders as a link (<a>); otherwise a real <button>.
  // Every CTA on this site is a navigation action (mailto:, #anchor,
  // external profile), so `href` covers all real usage.
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
};

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 font-display text-sm font-medium transition-colors duration-200";

// Primary = solid teal fill (main CTA per screen, used sparingly).
// Ghost = teal outline only, for secondary actions sitting next to a primary.
const VARIANTS = {
  primary: "bg-accent text-bg hover:bg-accent-strong",
  ghost: "border border-accent text-accent-text hover:bg-accent-soft",
};

export default function Button({ children, href, variant = "primary", className = "" }: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  // Ternary (not &&) per the project's rendering-conditional-render rule.
  return href ? (
    <a href={href} className={classes}>
      {children}
    </a>
  ) : (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
