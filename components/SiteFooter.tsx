import ThemeToggle from "@/components/ThemeToggle";
import { profile } from "@/content/profile";

const NAV_LINKS = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// Repeats the primary nav and the theme toggle so a visitor who scrolls to
// the very bottom isn't stuck without navigation, plus a quiet closing line
// that reinforces the "marketer who ships code" thesis one more time.
export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-(--container-page) flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between md:px-8">
        <span className="type-h3">KS</span>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6">
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="type-label hover:text-accent-text">
              {link.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-(--container-page) px-6 pb-10 md:px-8">
        <p className="type-label text-text-muted">
          © 2026 {profile.name} · Built with Next.js and Tailwind
        </p>
      </div>
    </footer>
  );
}
