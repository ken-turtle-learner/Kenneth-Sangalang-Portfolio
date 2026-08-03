export type NavLink = {
  // Must match the `id` of a <Section> on the home page. SiteHeader resolves
  // these with getElementById to drive its active-link underline, so an id
  // that doesn't exist fails silently rather than loudly.
  id: string;
  label: string;
};

// Shared by SiteHeader and SiteFooter. Each used to keep its own hardcoded
// copy, which meant a section rename could leave the header's scroll-spy
// pointing at nothing while the footer still looked fine — the two can no
// longer drift apart.
export const navLinks: NavLink[] = [
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
