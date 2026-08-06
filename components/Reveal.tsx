"use client";

import { useEffect, useRef, useState } from "react";
import { observeReveal } from "@/lib/observer";

type RevealProps = {
  children: React.ReactNode;
  // Stagger index. Sets the --i CSS variable that globals.css's .reveal rule
  // turns into a 60ms-per-step transition delay, so siblings fade in one after
  // another. Number them 0, 1, 2… within a section.
  index?: number;
  as?: "div" | "li";
  className?: string;
};

// Fades and slides its children in the first time they scroll into view.
// Scroll watching is delegated to the one shared observer in lib/observer.ts.
export default function Reveal({ children, index = 0, as = "div", className = "" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // observeReveal returns an unsubscribe fn, used here as the cleanup.
    return observeReveal(node, () => setVisible(true));
  }, []);

  const classes = `reveal ${visible ? "reveal--visible" : ""} ${className}`;
  const style = { "--i": index } as React.CSSProperties;
  // `as="li"` for reveals inside a <ul>, where a <div> would be invalid HTML.
  const Tag = as as React.ElementType;

  return (
    <Tag ref={ref} className={classes} style={style}>
      {children}
    </Tag>
  );
}
