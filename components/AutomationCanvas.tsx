"use client";

import { useEffect, useRef, useState } from "react";
import CanvasNode from "@/components/CanvasNode";
import { observeReveal } from "@/lib/observer";
import type { AutomationBranch, AutomationNode, CanvasStep } from "@/content/case-studies";

type AutomationCanvasProps = {
  steps: CanvasStep[];
  // Accessible label for the canvas as a whole, e.g. "Re-engagement trigger
  // logic" — read by screen readers before the text-equivalent list.
  label: string;
};

// A connector line + arrowhead is identical everywhere it appears, so it's
// hoisted to module scope (rendering-hoist-jsx) instead of being recreated
// on every render. pathLength="1" lets stroke-dasharray/dashoffset work in
// a 0-1 scale regardless of the line's real pixel length.
const CONNECTOR_ARROWHEAD = <polygon points="8.0,40.0 16.0,40.0 12.0,44.0" className="canvas-connector-arrow" />;

// One rendering step: either a boxed node, or a connector segment (with an
// optional wait-duration label) leading into the next node. Building this
// list up front — rather than rendering the raw AutomationNode[] directly —
// is what turns "wait" entries into mono text *on* the connector instead of
// their own boxed card, per the design spec.
type RenderItem = { kind: "node"; node: AutomationNode } | { kind: "connector"; waitLabel?: string };

function buildRenderSequence(nodes: AutomationNode[]): RenderItem[] {
  const items: RenderItem[] = [];
  let pendingWaitLabel: string | undefined;

  for (const node of nodes) {
    if (node.kind === "wait") {
      pendingWaitLabel = node.title;
      continue;
    }
    if (items.length > 0) {
      items.push({ kind: "connector", waitLabel: pendingWaitLabel });
    }
    pendingWaitLabel = undefined;
    items.push({ kind: "node", node });
  }

  return items;
}

// A wait label sits in normal flow beside the arrow (not absolutely
// positioned) and wraps within the node's own width — an earlier version
// placed it absolute + nowrap to the connector's side, which overflowed
// the canvas's max-w-xs container for longer labels like "Between-send
// interval" (the plan's own example, "WAIT 2 DAYS", is short enough that
// this wasn't obvious until real content was plugged in).
function Connector({ index, waitLabel }: { index: number; waitLabel?: string }) {
  return (
    <div
      className="flex w-full items-center justify-center gap-2 py-1"
      style={{ "--i": index } as React.CSSProperties}
    >
      <svg viewBox="0 0 24 48" width={24} height={48} className="shrink-0" aria-hidden="true">
        <line x1={12} y1={0} x2={12} y2={40} pathLength={1} className="canvas-connector-line" />
        {CONNECTOR_ARROWHEAD}
      </svg>
      {waitLabel ? <p className="canvas-wait-label type-node-label text-text-muted">{waitLabel}</p> : null}
    </div>
  );
}

// Flattens the canvas into a plain-text sequence for screen readers — the
// visual version (SVG connectors, absolutely-positioned labels) is marked
// aria-hidden, so this is the only thing assistive tech actually announces.
function describeSteps(steps: CanvasStep[]): string[] {
  const lines: string[] = [];
  for (const step of steps) {
    if (step.kind === "branch") {
      lines.push(`${step.label}: ${step.title}`);
      for (const outcome of step.outcomes) {
        lines.push(`If ${outcome.label}: ${outcome.nodes.map((n) => `${n.label} — ${n.title}`).join(", ")}`);
      }
      continue;
    }
    lines.push(`${step.label}${step.kind === "wait" ? "" : ` — ${step.title}`}`);
  }
  return lines;
}

// The site's signature visual: a vertical ActiveCampaign/Zapier-style
// automation diagram, used only on the two case studies that are literally
// automations (see components/FunnelStrip.tsx for the compact home-page
// variant). Client Component because activation is scroll-triggered via
// the shared IntersectionObserver.
export default function AutomationCanvas({ steps, label }: AutomationCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeReveal(node, () => setActive(true));
  }, []);

  const branchIndex = steps.findIndex((step): step is AutomationBranch => step.kind === "branch");
  const linearSteps = (branchIndex === -1 ? steps : steps.slice(0, branchIndex)) as AutomationNode[];
  const branch = branchIndex === -1 ? null : (steps[branchIndex] as AutomationBranch);
  const renderItems = buildRenderSequence(linearSteps);

  return (
    <div ref={ref} className={`automation-canvas ${active ? "automation-canvas--active" : ""}`}>
      {/* Visual canvas — hidden from assistive tech; describeSteps() below
          is the real accessible content for this component. */}
      <div aria-hidden="true" className="mx-auto flex max-w-xs flex-col items-center overflow-x-auto">
        {renderItems.map((item, index) =>
          item.kind === "node" ? (
            <CanvasNode key={item.node.id} node={item.node} index={index} className="w-full" />
          ) : (
            <Connector key={`connector-${index}`} index={index} waitLabel={item.waitLabel} />
          ),
        )}

        {branch ? (
          <>
            <Connector index={renderItems.length} />
            <div
              className="canvas-node w-full"
              style={{ "--i": renderItems.length + 1 } as React.CSSProperties}
            >
              <p className="type-node-label text-accent-text">{branch.label}</p>
              <p className="type-h3 mt-1 text-base">{branch.title}</p>
            </div>
            {/* Fixed narrow width per column (not w-full like the linear
                chain above) — two w-full columns side by side would each
                try to claim the full max-w-xs canvas width and overflow it.
                Verified overflowing/clipped on both branch outcomes before
                this width constraint was added. */}
            <div className="mt-2 flex justify-center gap-6">
              {branch.outcomes.map((outcome, outcomeIndex) => (
                <div key={outcome.label} className="flex w-32 flex-col items-center">
                  <p className="type-tag mt-2 text-text-muted">IF {outcome.label.toUpperCase()}</p>
                  <Connector index={renderItems.length + 2} />
                  {outcome.nodes.map((node, nodeIndex) => (
                    <CanvasNode
                      key={node.id}
                      node={node}
                      index={renderItems.length + 3 + outcomeIndex + nodeIndex}
                      className="w-full"
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <ol className="sr-only" aria-label={label}>
        {describeSteps(steps).map((line, index) => (
          // Keyed by index, not text — a sequence with several "WAIT" steps
          // (see CS2's 11-email canvas) would otherwise produce duplicate
          // keys, since their line text is identical.
          <li key={index}>{line}</li>
        ))}
      </ol>
    </div>
  );
}
