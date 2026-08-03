"use client";

import { useEffect, useRef, useState } from "react";
import { observeReveal } from "@/lib/observer";

type RevealProps = {
  children: React.ReactNode;
  index?: number;
  as?: "div" | "li";
  className?: string;
};

export default function Reveal({ children, index = 0, as = "div", className = "" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeReveal(node, () => setVisible(true));
  }, []);

  const classes = `reveal ${visible ? "reveal--visible" : ""} ${className}`;
  const style = { "--i": index } as React.CSSProperties;
  const Tag = as as React.ElementType;

  return (
    <Tag ref={ref} className={classes} style={style}>
      {children}
    </Tag>
  );
}
