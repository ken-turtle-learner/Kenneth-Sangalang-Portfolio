"use client";

import { useEffect, useRef } from "react";

type RepelFieldProps = {
  children: React.ReactNode;
  className?: string;
  // How close (px) the cursor has to get before an item starts moving.
  radius?: number;
  // Maximum displacement (px) at the centre of the field.
  strength?: number;
};

// Fraction of the remaining distance each item closes per frame. 0.18 settles
// in ~15 frames — fast enough to feel attached to the cursor, slow enough that
// the return isn't a snap.
const LERP = 0.18;
// Below this, an item is close enough to its target that the difference is
// sub-pixel; used to decide when the whole field has come to rest.
const EPSILON = 0.05;

// Pushes its direct children away from the cursor, then lets them drift back.
//
// Deliberately imperative: it takes server-rendered children and only ever
// writes `style.transform` and a `--near` custom property on the DOM nodes it
// already has. It never renders, reorders, clones, or hides content, so the
// markup a crawler reads is exactly what the server sent — the whole reason
// components/TechStrip.tsx can stay a Server Component while its pills move.
export default function RepelField({
  children,
  className = "",
  radius = 130,
  strength = 22,
}: RepelFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // app/globals.css's prefers-reduced-motion block can only reach CSS
    // transitions; a rAF loop has to opt out of itself. The (hover: hover)
    // half skips the work entirely on touch, where there's no cursor to flee.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // One entry per child: its resting centre in container-local coordinates,
    // the current and target offsets the loop interpolates between, and the
    // last values actually written to the DOM (see the write guards in tick).
    type Item = {
      el: HTMLElement;
      cx: number;
      cy: number;
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      near: number;
      displaced: boolean;
    };

    const items: Item[] = Array.from(container.children).map((child) => ({
      el: child as HTMLElement,
      cx: 0,
      cy: 0,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      near: 0,
      displaced: false,
    }));
    if (items.length === 0) return;

    // offsetLeft/offsetTop, not getBoundingClientRect: offsets come from
    // layout, which `transform` doesn't affect. A rect would already include
    // the displacement we applied last frame, and each frame would feed that
    // back into the next one until the items drifted off the page. The
    // container is position: relative below precisely so these offsets are
    // measured against it.
    function measure() {
      for (const item of items) {
        item.cx = item.el.offsetLeft + item.el.offsetWidth / 2;
        item.cy = item.el.offsetTop + item.el.offsetHeight / 2;
      }
    }
    measure();

    // Latest pointer position in viewport coordinates. Starts far off-screen
    // so nothing moves until the cursor has actually been somewhere.
    let pointerX = -Infinity;
    let pointerY = -Infinity;
    // False until the first pointermove, and again once the cursor leaves the
    // document — the cursor being anywhere on the page counts, since the point
    // is for pills to react as it *approaches* the strip from outside.
    let pointerActive = false;
    let frame = 0;

    function tick() {
      frame = 0;

      // Single read, before any write below — reading a rect after writing a
      // style forces a synchronous layout, and doing that once per item would
      // be sixteen of them per frame.
      // Non-null assertion because TypeScript drops the null check made at the
      // top of the effect once `container` is captured by a nested function;
      // the effect returns early if it was ever null.
      const rect = container!.getBoundingClientRect();
      const localX = pointerX - rect.left;
      const localY = pointerY - rect.top;

      let settled = true;

      for (const item of items) {
        // Vector from the cursor to this item, i.e. the direction it flees in.
        const dx = item.cx - localX;
        const dy = item.cy - localY;
        // `|| 1` covers the cursor landing exactly on a centre, where the
        // direction is undefined and dividing by it would produce NaN.
        const dist = Math.hypot(dx, dy) || 1;
        // Squared falloff: the push builds sharply as the cursor closes in and
        // tapers to nothing at the rim, so items at the edge of the radius
        // don't visibly twitch on and off. Rounded to 3dp so the write guard
        // below isn't defeated by float noise.
        const near =
          pointerActive && dist < radius ? Math.round((1 - dist / radius) ** 2 * 1000) / 1000 : 0;

        // Branched rather than multiplying by `near`: with no pointer yet the
        // coordinates are -Infinity, and Infinity / Infinity * 0 is NaN.
        if (near > 0) {
          item.targetX = (dx / dist) * near * strength;
          item.targetY = (dy / dist) * near * strength;
        } else {
          item.targetX = 0;
          item.targetY = 0;
        }

        // Drives the accent mix in .repel-item — the same 0..1 proximity value
        // that scales the push, so colour and motion peak together. Guarded
        // because pointermove fires on every frame the cursor is anywhere on
        // the page, and re-writing an unchanged value on sixteen elements is
        // style invalidation for nothing.
        if (near !== item.near) {
          item.near = near;
          item.el.style.setProperty("--near", `${near}`);
        }

        item.x += (item.targetX - item.x) * LERP;
        item.y += (item.targetY - item.y) * LERP;

        const atRest =
          Math.abs(item.targetX - item.x) < EPSILON && Math.abs(item.targetY - item.y) < EPSILON;

        if (atRest && item.targetX === 0 && item.targetY === 0) {
          // Land exactly on zero and drop the inline transform, so a resting
          // pill carries no leftover style at all.
          item.x = 0;
          item.y = 0;
          if (item.displaced) {
            item.displaced = false;
            item.el.style.transform = "";
          }
        } else {
          settled = false;
          item.displaced = true;
          item.el.style.transform = `translate3d(${item.x.toFixed(2)}px, ${item.y.toFixed(2)}px, 0)`;
        }
      }

      // Stop the loop once nothing is moving. Any pointer or scroll event
      // starts it again — an always-on rAF would keep the compositor awake
      // for a section the visitor may never reach.
      if (!settled) frame = requestAnimationFrame(tick);
    }

    function start() {
      if (frame === 0) frame = requestAnimationFrame(tick);
    }

    function handlePointerMove(event: PointerEvent) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerActive = true;
      start();
    }

    // Without this, scrolling the strip up under a stationary cursor produces
    // no pointermove, so the pills would sit still while the cursor passes
    // straight through them.
    function handleScroll() {
      if (pointerActive) start();
    }

    // Cursor left the document (out of the window, into devtools): release
    // everything rather than freezing mid-push.
    function handlePointerLeave() {
      pointerActive = false;
      start();
    }

    // Catches flex re-wrap at a new viewport width and the web-font swap, both
    // of which move every centre this component cached.
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      resizeObserver.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
      for (const item of items) {
        item.el.style.transform = "";
        item.el.style.removeProperty("--near");
      }
    };
  }, [radius, strength]);

  // position: relative is load-bearing, not cosmetic — it makes this element
  // the offsetParent of every child, which is what measure() above assumes.
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
    </div>
  );
}
