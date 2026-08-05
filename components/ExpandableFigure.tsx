"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Figure as FigureData } from "@/content/case-studies";

// A case study screenshot that opens full-size in an overlay when clicked.
//
// This is the interactive counterpart to components/Figure.tsx (still used by
// WorkLightbox, which must stay a Server-rendered figure — see the scroll-lock
// note below). The two render the same markup when collapsed; this one adds the
// button wrapper, the zoom affordance, and the overlay.
//
// The escape / scroll-lock / focus plumbing below is deliberately a copy of the
// same logic in WorkLightbox.tsx rather than a shared hook: the two modals are
// never open at once and factoring them together would mean editing the work
// modal, which this change is scoped out of. Worth revisiting if a third one
// appears.
export default function ExpandableFigure({
  src,
  alt,
  caption,
  width = 1200,
  height = 750,
  thumbnail,
}: FigureData) {
  const [isOpen, setIsOpen] = useState(false);
  // Drives the fade-in. The overlay mounts without `open` and gains it on the
  // next frame, because a CSS transition doesn't fire on an element that was
  // already painted in its final state.
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsVisible(false);
    // Return focus to the thumbnail that opened the overlay.
    triggerRef.current?.focus();
  }, []);

  // Escape closes. Bound on the document so it fires regardless of focus.
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, close]);

  // Scroll lock while the overlay is up, restoring whatever was there before.
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Move focus into the overlay and trigger the fade, both one frame after
  // mount so the transition has a starting state to animate from.
  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
      closeRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  // Only closes on the backdrop itself, not on clicks that land on the image.
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) close();
  }

  // Thumbnails cap at max-w-lg (512px) — under half the container, but the
  // automation screenshots have a lot of empty canvas around a narrow flow, and
  // anything smaller reduced them to an unreadable smudge. Everything else
  // fills the container, which tops out at --container-page minus its padding.
  const sizes = thumbnail
    ? "(min-width: 640px) 512px, 100vw"
    : "(min-width: 1200px) 1092px, 100vw";

  return (
    <>
      <figure className={thumbnail ? "max-w-lg" : undefined}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border"
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            quality={75}
            sizes={sizes}
            className="h-auto w-full"
          />
          {/* Appends to the button's accessible name, which otherwise reads as
              the image alt alone and never says the image is interactive. */}
          <span className="sr-only"> — click to enlarge</span>
          {/* Decorative: the sr-only text above already carries this meaning.
              Sits at a resting opacity rather than fully hidden — a hover-only
              affordance left the shrunken thumbnail looking like a static image
              with nothing to say it opens. Goes solid on hover and on keyboard
              focus, so it isn't mouse-only. */}
          <span
            aria-hidden="true"
            className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-raised text-text-secondary opacity-70 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5 14.5 14.5M7 5v4M5 7h4" />
            </svg>
          </span>
        </button>
        <figcaption className="type-small mt-2">{caption}</figcaption>
      </figure>

      {/* Portalled to document.body rather than rendered in place. The page
          wraps every figure in components/Reveal, whose `transform` makes it a
          containing block for fixed-position descendants — left inline, the
          backdrop's `inset-0` resolved against the Reveal's box instead of the
          viewport, so the overlay appeared as a dark band across the middle of
          the page and the image was capped to the column width. */}
      {isOpen
        ? createPortal(
            <div
              className={`lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 ${isVisible ? "open" : ""}`}
              onClick={handleBackdropClick}
              role="presentation"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label={caption}
                className="lightbox-panel relative"
                // Widened to the image's natural resolution, then clamped by
                // both viewport axes — the third term is the width at which the
                // image would hit 85vh tall, which keeps portrait shots from
                // running off the bottom.
                style={{
                  width: `min(90vw, ${width}px, ${((width / height) * 85).toFixed(2)}vh)`,
                }}
              >
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close image"
                  className="hover-grow absolute top-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-raised text-text-secondary hover:border-accent hover:text-accent-text"
                >
                  <span aria-hidden="true">✕</span>
                </button>
                <Image
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  quality={75}
                  sizes="90vw"
                  onClick={close}
                  className="h-auto w-full cursor-zoom-out rounded-xl"
                />
                {/* Matches .type-small's font and size but not its colour.
                    .type-small is unlayered CSS, so it beats any Tailwind
                    utility regardless of specificity — using it here left the
                    caption in muted slate on the black scrim, at roughly 1.5:1
                    contrast. Restated inline so the light-on-dark colour holds. */}
                <p className="mt-3 text-center text-[0.9375rem] text-white/90 font-body">
                  {caption}
                </p>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
