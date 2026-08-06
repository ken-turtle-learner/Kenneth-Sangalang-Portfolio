export type NavLink = {
  // Must match the `id` of a <Section> on the home page — SiteHeader looks it
  // up with getElementById for its active-link underline, and an id that
  // doesn't exist fails silently.
  id: string;
  label: string;
};

// Shared by SiteHeader and SiteFooter so the two can't drift apart.
export const navLinks: NavLink[] = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
