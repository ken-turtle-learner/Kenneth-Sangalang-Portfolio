"use client";

import { useEffect, useRef, useState } from "react";
import CanvasNode from "@/components/CanvasNode";
import { observeReveal } from "@/lib/observer";
import { funnelStripSteps } from "@/content/case-studies";

// Horizontal arrowhead — hoisted per rendering-hoist-jsx, same reasoning as
// AutomationCanvas's vertical one.
const CONNECTOR_ARROWHEAD = <polygon points="40.0,8.0 40.0,16.0 44.0,12.0" className="canvas-connector-arrow" />;

function Connector({ index }: { index: number }) {
  return (
    <div className="flex h-6 w-10 shrink-0 items-center justify-center" style={{ "--i": index } as React.CSSProperties}>
      <svg viewBox="0 0 48 24" width={40} height={24} aria-hidden="true">
        <line x1={0} y1={12} x2={40} y2={12} pathLength={1} className="canvas-connector-line" />
        {CONNECTOR_ARROWHEAD}
      </svg>
    </div>
  );
}

// The compact, home-page variant of the automation canvas: one horizontal
// row telling the connected-funnel story (re-engagement -> SO Tool
// completed -> 11-email nurture -> Leadership Essentials) across all four
// case studies. Wrapped in overflow-x-auto so a narrow viewport scrolls the
// strip itself instead of widening the page.
export default function FunnelStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeReveal(node, () => setActive(true));
  }, []);

  return (
    // min-w-0 on both the wrapper and the scrollable row: without it, a
    // flex item's default min-width is its content's intrinsic width, so
    // this row (7 unshrinkable children wide) would force every ancestor
    // flex container up to <main> (itself `flex flex-col` — see
    // app/layout.tsx) to grow the whole page instead of letting
    // overflow-x-auto below handle it internally. Verified overflowing at
    // 375px before this was added.
    <div ref={ref} className={`funnel-strip min-w-0 ${active ? "funnel-strip--active" : ""}`}>
      <div aria-hidden="true" className="flex min-w-0 items-center overflow-x-auto pb-2">
        {funnelStripSteps.map((step, index) => (
          <div key={step.id} className="flex shrink-0 items-center">
            <CanvasNode node={step} index={index} className="w-40" />
            {index < funnelStripSteps.length - 1 ? <Connector index={index} /> : null}
          </div>
        ))}
      </div>
      <ol className="sr-only" aria-label="Full funnel: reactivation through conversion">
        {funnelStripSteps.map((step) => (
          <li key={step.id}>
            {step.label} — {step.title}
          </li>
        ))}
      </ol>
    </div>
  );
}
