"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import { navLinks } from "@/content/nav";
import { profile } from "@/content/profile";

const SCROLL_THRESHOLD = 64;

// Sticky header: transparent over the hero, gaining a background and border
// once the page scrolls past SCROLL_THRESHOLD, and underlining whichever nav
// link matches the section currently in view.
export default function SiteHeader() {
  // Raw scroll position lives in a ref so only the derived "crossed 64px?"
  // boolean triggers a render, not every scroll event.
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy for the active nav underline. rootMargin narrows the "in view"
  // band to roughly the vertical center of the viewport, so the underline moves
  // when a section reaches the middle rather than as soon as it peeks in.
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

  // Focus trap for the mobile overlay: Escape closes and restores focus to the
  // opening button; Tab cycles inside the overlay instead of the page behind.
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

        {/* Desktop nav — below md this is replaced by the hamburger button */}
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
            className="hover-grow flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary hover:border-accent hover:text-accent-text"
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
            className="hover-grow absolute top-4 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary hover:border-accent hover:text-accent-text"
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
