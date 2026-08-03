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
  // Collapses long runs of identical steps into a single summary node (see
  // collapseRuns below). Used on the home page, where the 11-email sequence's
  // 23-step canvas would otherwise render a ~2000px column; the /work/[slug]
  // page leaves this off and draws every step.
  compact?: boolean;
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

// Compresses a long stretch of identical steps down to first -> summary ->
// last, so the *shape* of a sequence still reads at a glance without drawing
// every node. CS2's canvas is trigger + 11 emails + goal; compacted it becomes
// trigger -> "Welcome / opening" -> "9 more emails" -> "Deadline close" -> goal.
//
// Keeping the last node of the run (rather than just truncating) is the point:
// in an 11-email sequence the final send is the deadline close, which is the
// one a reader most needs to see.
//
// Runs of two are left alone — collapsing them would replace two nodes with
// two nodes and gain nothing. Wait steps inside a collapsed run are dropped
// along with it; the summary node already implies elapsed time.
function collapseRuns(nodes: AutomationNode[]): AutomationNode[] {
  const result: AutomationNode[] = [];
  let index = 0;

  while (index < nodes.length) {
    const node = nodes[index];

    if (node.kind === "wait") {
      result.push(node);
      index += 1;
      continue;
    }

    // Walk forward over same-kind nodes, stepping over any wait steps
    // between them (they're rendered on the connectors, not as their own
    // cards, so they don't break a run).
    const run: AutomationNode[] = [node];
    let lastRunIndex = index;
    let lookahead = index + 1;

    while (lookahead < nodes.length) {
      const candidate = nodes[lookahead];
      if (candidate.kind === "wait") {
        lookahead += 1;
        continue;
      }
      if (candidate.kind !== node.kind) break;
      run.push(candidate);
      lastRunIndex = lookahead;
      lookahead += 1;
    }

    if (run.length >= 3) {
      const hidden = run.length - 2;
      result.push(run[0]);
      result.push({
        id: `${run[0].id}-collapsed`,
        kind: node.kind,
        label: `+${hidden}`,
        title: `${hidden} more ${node.kind === "email" ? "emails" : "steps"}`,
      });
      result.push(run[run.length - 1]);
      index = lastRunIndex + 1;
      continue;
    }

    // Run too short to be worth collapsing — emit just this node and let the
    // loop pick up whatever follows (including any wait steps) as normal.
    result.push(node);
    index += 1;
  }

  return result;
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
export default function AutomationCanvas({ steps, label, compact = false }: AutomationCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeReveal(node, () => setActive(true));
  }, []);

  const branchIndex = steps.findIndex((step): step is AutomationBranch => step.kind === "branch");
  const rawLinearSteps = (branchIndex === -1 ? steps : steps.slice(0, branchIndex)) as AutomationNode[];
  const linearSteps = compact ? collapseRuns(rawLinearSteps) : rawLinearSteps;
  const branch = branchIndex === -1 ? null : (steps[branchIndex] as AutomationBranch);
  const renderItems = buildRenderSequence(linearSteps);
  // Rebuilt from the *collapsed* steps, not the original `steps` prop, so the
  // screen-reader list always describes exactly what's drawn. Reading out all
  // 11 emails beside a diagram showing 3 would be worse than either alone.
  const describedSteps: CanvasStep[] = branch ? [...linearSteps, branch] : linearSteps;

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
        {describeSteps(describedSteps).map((line, index) => (
          // Keyed by index, not text — a sequence with several "WAIT" steps
          // (see CS2's 11-email canvas) would otherwise produce duplicate
          // keys, since their line text is identical.
          <li key={index}>{line}</li>
        ))}
      </ol>
    </div>
  );
}
