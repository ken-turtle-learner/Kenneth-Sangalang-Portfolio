type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
};

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 font-display text-sm font-medium transition-colors duration-200";

const VARIANTS = {
  primary: "bg-accent text-bg hover:bg-accent-strong",
  ghost: "border border-accent text-accent-text hover:bg-accent-soft",
};

export default function Button({ children, href, variant = "primary", className = "" }: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

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
