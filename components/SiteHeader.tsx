"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import { navLinks } from "@/content/nav";
import { profile } from "@/content/profile";

const SCROLL_THRESHOLD = 64;

// Sticky site header: transparent over the hero, gains a surface
// background + blur + bottom border once the page scrolls past
// SCROLL_THRESHOLD, and underlines whichever nav link matches the section
// currently in view. Client Component because it needs scroll position and
// intersection tracking — both browser-only concerns.
export default function SiteHeader() {
  // Scroll position itself is read-heavy and doesn't need to trigger a
  // render on every pixel — only the derived "have we crossed 64px?"
  // boolean does. Keeping raw position in a ref (not state) and only
  // calling setState on the boolean's actual flip avoids a render per
  // scroll event, per the project's rerender-use-ref-transient-values and
  // rerender-derived-state rules.
  const scrolledRef = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      const isScrolled = window.scrollY > SCROLL_THRESHOLD;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
    }

    // { passive: true } per client-passive-event-listeners — this listener
    // never calls preventDefault, so the browser can keep scrolling smooth
    // without waiting on it.
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // One IntersectionObserver, created once, watching every nav-linked
  // section — not one observer per link. rootMargin narrows the
  // "in view" band to roughly the vertical center of the viewport, so the
  // active link updates when a section crosses there rather than as soon
  // as any sliver of it appears.
  useEffect(() => {
    const sections = navLinks.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => sectionObserver.observe(section));
    return () => sectionObserver.disconnect();
  }, []);

  // Minimal focus trap for the mobile overlay: Escape closes it and
  // restores focus to the button that opened it; Tab cycles within the
  // overlay's focusable elements instead of escaping to the page behind it.
  useEffect(() => {
    if (!mobileOpen) return;

    const overlay = overlayRef.current;
    const focusable = overlay?.querySelectorAll<HTMLElement>("a, button");
    focusable?.[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const headerClasses = scrolled
    ? "border-b border-border bg-surface/80 backdrop-blur-md"
    : "border-b border-transparent bg-transparent";

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 ${headerClasses}`}>
      <div className="mx-auto flex max-w-(--container-page) items-center justify-between px-6 py-4 md:px-8">
        <a href="#main-content" className="type-h3">
          KS
        </a>

        {/* Desktop nav — hidden below md, replaced by the hamburger button */}
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={activeId === link.id ? "true" : undefined}
              className={`type-label border-b-2 pb-1 transition-colors duration-200 ${
                activeId === link.id ? "border-accent text-accent-text" : "border-transparent hover:text-accent-text"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <Button href={`mailto:${profile.email}`} variant="ghost">
            Email me
          </Button>
        </div>

        {/* Mobile: theme toggle stays visible, nav collapses into the overlay */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary"
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-bg md:hidden"
        >
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              menuButtonRef.current?.focus();
            }}
            aria-label="Close menu"
            className="absolute top-4 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary"
          >
            <span aria-hidden="true">✕</span>
          </button>
          <nav aria-label="Mobile" className="flex flex-col items-center gap-6">
            {navLinks.map((link, index) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMobileOpen(false)}
                style={{ "--i": index } as React.CSSProperties}
                className="reveal reveal--visible type-display text-3xl"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
