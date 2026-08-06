"use client";

import { useEffect, useRef } from "react";

type RepelFieldProps = {
  children: React.ReactNode;
  className?: string;
  // How close (px) the cursor gets before an item starts moving.
  radius?: number;
  // Maximum displacement (px) at the centre of the field.
  strength?: number;
};

// Fraction of the remaining distance each item closes per frame.
const LERP = 0.18;
// Below this, an item is close enough to its target to count as at rest.
const EPSILON = 0.05;

// Pushes its direct children away from the cursor, then lets them drift back.
//
// Deliberately imperative: it only writes `style.transform` and a `--near`
// custom property on DOM nodes it already has, never rendering, reordering or
// hiding content. That's what lets components/TechStrip.tsx stay a Server
// Component while its pills move.
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

    // globals.css's prefers-reduced-motion block only reaches CSS transitions,
    // so a rAF loop has to opt out itself. The (hover: hover) check skips the
    // work on touch, where there's no cursor to flee.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

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

    // offsetLeft/offsetTop, not getBoundingClientRect: offsets come from layout,
    // which `transform` doesn't affect. A rect would already include last
    // frame's displacement and feed it back until the items drifted away.
    function measure() {
      for (const item of items) {
        item.cx = item.el.offsetLeft + item.el.offsetWidth / 2;
        item.cy = item.el.offsetTop + item.el.offsetHeight / 2;
      }
    }
    measure();

    // Starts off-screen so nothing moves until the cursor has been somewhere.
    let pointerX = -Infinity;
    let pointerY = -Infinity;
    let pointerActive = false;
    let frame = 0;

    function tick() {
      frame = 0;

      // Single read before any write below — reading a rect after writing a
      // style forces a synchronous layout.
      // Non-null assertion: TypeScript drops the null check made at the top of
      // the effect once `container` is captured by a nested function.
      const rect = container!.getBoundingClientRect();
      const localX = pointerX - rect.left;
      const localY = pointerY - rect.top;

      let settled = true;

      for (const item of items) {
        const dx = item.cx - localX;
        const dy = item.cy - localY;
        // `|| 1` covers the cursor landing exactly on a centre, where the
        // direction is undefined and dividing by it gives NaN.
        const dist = Math.hypot(dx, dy) || 1;
        // Squared falloff, so items at the rim don't twitch on and off.
        // Rounded to 3dp so float noise doesn't defeat the write guard below.
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

        // Drives the accent mix in .repel-item. Guarded because pointermove
        // fires constantly and rewriting an unchanged value on every pill is
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
          // pill carries no leftover style.
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

      // Stop once nothing is moving; any pointer or scroll event restarts it.
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

    // Scrolling under a stationary cursor fires no pointermove, so without this
    // the pills sit still while the cursor passes through them.
    function handleScroll() {
      if (pointerActive) start();
    }

    function handlePointerLeave() {
      pointerActive = false;
      start();
    }

    // Catches flex re-wrap at a new viewport width and the web-font swap, both
    // of which move every centre cached above.
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

  // position: relative is load-bearing — it makes this the offsetParent of
  // every child, which is what measure() above assumes.
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
    </div>
  );
}
