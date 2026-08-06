import ThemeToggle from "@/components/ThemeToggle";
import { navLinks } from "@/content/nav";
import { profile } from "@/content/profile";

// Site footer. Column headings are <p>, not <h2>/<h3>, so they stay out of the
// document outline and don't compete with the page's real sections.
export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-(--container-page) px-6 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <span className="type-h3">KS</span>
            <p className="type-small mt-3 max-w-xs">
              Digital marketing, marketing automation, and WordPress — plus the code underneath.
            </p>
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent(profile.emailSubject)}`}
              className="type-label mt-4 inline-block hover:text-accent-text"
            >
              {profile.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="type-label text-text-muted">Navigate</p>
            <ul className="mt-3 space-y-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="type-small hover:text-accent-text">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="type-label text-text-muted">Elsewhere</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-small hover:text-accent-text"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-small hover:text-accent-text"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <p className="type-label text-text-muted">© 2026 {profile.name} · Built with Next.js and Tailwind</p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
