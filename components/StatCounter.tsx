"use client";

import { useEffect, useRef, useState } from "react";
import { observeReveal } from "@/lib/observer";

type StatCounterProps = {
  // Target number, e.g. 50.78. A number rather than the display string used
  // elsewhere, so intermediate values can be interpolated.
  value: number;
  suffix?: string;
  // Decimal places. Inferred from `value` by default, so 50.78 counts up
  // showing 2 decimals throughout and 63 never shows a stray ".00".
  decimals?: number;
  className?: string;
};

const DURATION_MS = 1200;

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function decimalsOf(value: number): number {
  const [, fraction] = value.toString().split(".");
  return fraction ? fraction.length : 0;
}

// Counts a number up from 0 once it scrolls into view. Skips the animation for
// visitors with prefers-reduced-motion — a CSS media query can't reach a rAF
// loop, so it has to opt out itself.
export default function StatCounter({ value, suffix = "", decimals, className = "" }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const precision = decimals ?? decimalsOf(value);
  // Always starts at 0 to match the server-rendered markup — the reduced-motion
  // check happens inside the effect, never in this initializer, so hydration
  // never sees two different values.
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
