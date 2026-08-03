"use client";

import { useEffect, useRef, useState } from "react";
import { observeReveal } from "@/lib/observer";

type StatCounterProps = {
  // Target number to count up to, e.g. 50.78. Kept as a number (not the
  // pre-formatted string used elsewhere in content/case-studies.ts) so we
  // can interpolate intermediate values during the animation.
  value: number;
  suffix?: string;
  // How many decimal places to show — inferred from `value` by default so
  // 50.78 counts up showing 2 decimals throughout, not just at the end,
  // and 63 (a whole number) never shows a stray ".00".
  decimals?: number;
  className?: string;
};

const DURATION_MS = 1200;

// easeOutExpo — starts fast, settles gently into the final value. Matches
// the motion spec's "1200ms easeOutExpo" for stat count-ups.
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function decimalsOf(value: number): number {
  const [, fraction] = value.toString().split(".");
  return fraction ? fraction.length : 0;
}

// Animates a number counting up from 0 to `value` once the element scrolls
// into view, via the shared IntersectionObserver (not its own instance —
// see lib/observer.ts). Renders the final value immediately if the browser
// has prefers-reduced-motion set, since app/globals.css disables the CSS
// transitions this component doesn't use anyway, but we still want to skip
// the JS rAF animation itself for that audience.
export default function StatCounter({ value, suffix = "", decimals, className = "" }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const precision = decimals ?? decimalsOf(value);
  // Always starts at 0 to match the server-rendered markup exactly — the
  // reduced-motion check happens inside the effect below (client-only),
  // never in this initializer, so hydration never sees two different values.
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Read once per effect run (not per animation frame) and capture it in
    // the closure below — matchMedia itself doesn't need to be reactive here.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Both branches call setDisplay from inside this reveal callback (fired
    // asynchronously by the shared IntersectionObserver), never synchronously
    // in the effect body itself — that's what keeps this compliant with
    // react-hooks/set-state-in-effect, the same rule ThemeToggle's
    // useSyncExternalStore rewrite exists to satisfy.
    return observeReveal(node, () => {
      if (prefersReducedMotion) {
        setDisplay(value);
        return;
      }

      const start = performance.now();

      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / DURATION_MS, 1);
        setDisplay(value * easeOutExpo(progress));
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }, [value]);

  return (
    <span ref={ref} className={`type-stat ${className}`}>
      {display.toFixed(precision)}
      {suffix}
    </span>
  );
}
