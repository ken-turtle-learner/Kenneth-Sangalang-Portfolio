"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Sample } from "@/content/samples";

type SampleLightboxProps = {
  // null closes it. State lives in WorkSamples so the whole gallery shares one
  // instance, the same way WorkGrid runs one WorkLightbox for every card.
  sample: Sample | null;
  onClose: () => void;
};

// Full-size view of a work sample. The overlay mechanics are lifted from
// components/ExpandableFigure.tsx, which solved the same problems already; the
// difference here is that state is owned by the parent and the caption carries
// client, blurb, stack, and the live link.
export default function SampleLightbox({ sample, onClose }: SampleLightboxProps) {
  // Drives the fade-in. The overlay mounts without `open` and gains it a frame
  // later, because a CSS transition won't fire on an element already painted in
  // its final state.
  const [isVisible, setIsVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Bound on the document so Escape works regardless of focus.
  useEffect(() => {
    if (!sample) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sample, onClose]);

  useEffect(() => {
    if (!sample) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [sample]);

  // Focus and fade both happen a frame after mount, so the transition has a
  // starting state to animate from. The cleanup clears isVisible on close (and
  // between two samples opened back to back) so every open animates.
  //
  // Both setState calls sit in callbacks rather than the effect body on
  // purpose: react-hooks/set-state-in-effect rejects the body.
  //
  // Like the other two lightboxes this moves focus in without trapping it;
  // returning focus to the tile is WorkSamples' job.
  useEffect(() => {
    if (!sample) return;

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
      closeRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      setIsVisible(false);
    };
  }, [sample]);

  if (!sample) return null;

  const { width, height } = sample.image;

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // Portalled to document.body: components/Reveal wraps every tile and its
  // `transform` makes it a containing block, so an inline overlay would size
  // `inset-0` against the Reveal instead of the viewport.
  return createPortal(
    <div
      className={`lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 ${isVisible ? "open" : ""}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${sample.title}, ${sample.client}`}
        className="lightbox-panel relative my-auto"
        // Natural width, clamped by both viewport axes. The third term is the
        // width at which the image would hit 78vh tall, which keeps portrait
        // screenshots from pushing the caption off the bottom.
        //
        // The 34rem floor under that term is for full-page site captures. One of
        // those runs three or four screens long, and fitting a 1895x5724 image to
        // 78vh leaves it 26vh wide, far too narrow to read. Past the floor the
        // panel holds a legible width and the backdrop scrolls instead, which is
        // how you'd read a full-page screenshot anyway. min() still picks 90vw on
        // phones, so narrow viewports are unaffected.
        style={{
          width: `min(90vw, ${width}px, max(${((width / height) * 78).toFixed(2)}vh, 34rem))`,
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image"
          className="hover-grow absolute top-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-raised text-text-secondary hover:border-accent hover:text-accent-text"
        >
          <span aria-hidden="true">✕</span>
        </button>

        <Image
          src={sample.image.src}
          alt={sample.image.alt}
          width={width}
          height={height}
          quality={90}
          sizes="90vw"
          onClick={onClose}
          className="h-auto w-full cursor-zoom-out rounded-xl"
        />

        {/* Styled inline rather than with .type-label / .type-small: those are
            unlayered CSS, so their colours would beat any Tailwind text utility
            and leave the caption unreadable on the scrim. Same reason the blurb
            isn't run through highlightNumbers here — its teal is a dark shade in
            light mode, which would vanish against the black backdrop. */}
        <div className="mt-3 text-center">
          <p className="font-mono text-xs tracking-[0.16em] text-white/60 uppercase">
            {sample.client}
          </p>
          <p className="mt-1 text-base font-semibold text-white">{sample.title}</p>
          <p className="font-body mx-auto mt-1 max-w-prose text-[0.9375rem] text-white/80">
            {sample.blurb}
          </p>

          {sample.stack?.length ? (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {sample.stack.map((item) => (
                <span
                  key={item}
                  className="type-tag inline-flex items-center rounded-full border border-white/25 px-3 py-1 text-white/80"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}

          {sample.liveUrl ? (
            <a
              href={sample.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-mono text-xs tracking-[0.16em] text-white uppercase underline underline-offset-4"
            >
              Visit live site ↗
            </a>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
