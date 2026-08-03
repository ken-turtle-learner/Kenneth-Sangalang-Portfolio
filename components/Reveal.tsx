"use client";

import { useEffect, useRef, useState } from "react";
import { observeReveal } from "@/lib/observer";

type RevealProps = {
  children: React.ReactNode;
  // Stagger index — fed into the --i CSS variable that app/globals.css's
  // .reveal rule uses for `transition-delay: calc(var(--i) * 60ms)`, so
  // sibling Reveals fire in a staggered sequence instead of all at once.
  index?: number;
  as?: "div" | "li";
  className?: string;
};

// Wraps children in a fade + slide-up reveal that fires once, the first
// time the element scrolls into view. Delegates the actual scroll watching
// to lib/observer.ts's single shared IntersectionObserver rather than
// creating one per instance (see that file for why).
export default function Reveal({ children, index = 0, as = "div", className = "" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // observeReveal returns an unsubscribe fn — used here as the effect's
    // cleanup so we stop watching if this Reveal unmounts before it fires.
    return observeReveal(node, () => setVisible(true));
  }, []);

  const classes = `reveal ${visible ? "reveal--visible" : ""} ${className}`;
  const style = { "--i": index } as React.CSSProperties;
  // `as` lets a Reveal render as a <li> when it's a list item (e.g. inside
  // a <ul>), since a stray <div> there would be invalid HTML.
  const Tag = as as React.ElementType;

  return (
    <Tag ref={ref} className={classes} style={style}>
      {children}
    </Tag>
  );
}
