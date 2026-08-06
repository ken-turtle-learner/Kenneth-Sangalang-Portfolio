"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Figure as FigureData } from "@/content/case-studies";

// A case study screenshot that opens full-size in an overlay when clicked.
// components/Figure.tsx is the static counterpart used inside WorkLightbox,
// which can't nest a second modal.
export default function ExpandableFigure({
  src,
  alt,
  caption,
  width = 1200,
  height = 750,
  thumbnail,
}: FigureData) {
  const [isOpen, setIsOpen] = useState(false);
  // Drives the fade-in. The overlay mounts without `open` and gains it a frame
  // later, because a CSS transition won't fire on an element already painted in
  // its final state.
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsVisible(false);
    triggerRef.current?.focus();
  }, []);

  // Bound on the document so Escape works regardless of focus.
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Focus and fade both happen a frame after mount, so the transition has a
  // starting state to animate from.
  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
      closeRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) close();
  }

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
          {/* Appends to the button's accessible name, which would otherwise be
              the image alt alone and never say the image is interactive. */}
          <span className="sr-only"> — click to enlarge</span>
          {/* Zoom affordance. Sits at a resting opacity rather than appearing
              only on hover, so it reads as interactive on first sight, and goes
              solid on keyboard focus too. */}
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

      {/* Portalled to document.body: components/Reveal wraps every figure and
          its `transform` makes it a containing block, so an inline overlay
          would size `inset-0` against the Reveal instead of the viewport. */}
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
                // Natural width, clamped by both viewport axes. The third term
                // is the width at which the image would hit 85vh tall, which
                // keeps portrait shots from running off the bottom.
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
                {/* Styled inline rather than with .type-small: that class is
                    unlayered CSS, so its muted colour would beat any Tailwind
                    text utility and leave the caption unreadable on the scrim. */}
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
