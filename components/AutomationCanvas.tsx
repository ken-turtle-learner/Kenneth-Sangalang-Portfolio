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

// A wait label renders on the connector *leading into the next node*, so a
// trailing wait has no connector to attach to and comes back separately.
// Both canvases end their linear chain with one (trigger -> wait -> branch),
// where the connector down into the branch is its home — without this the
// label was silently dropped.
function buildRenderSequence(nodes: AutomationNode[]): { items: RenderItem[]; trailingWaitLabel?: string } {
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

  return { items, trailingWaitLabel: pendingWaitLabel };
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
        // One line per node, matching how the top-level steps below are
        // described. Joining a whole outcome into a single line was fine
        // while outcomes held one node each, but announces CS4's nurture
        // path as one unbroken run-on.
        lines.push(`If ${outcome.label}:`);
        for (const node of outcome.nodes) {
          lines.push(`${node.label} — ${node.title}`);
        }
      }
      continue;
    }
    // Wait titles are included rather than announcing a bare "WAIT" — their
    // duration is drawn on the connector, so omitting it here would describe
    // less than the canvas actually shows.
    lines.push(`${step.label} — ${step.title}`);
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
  const { items: renderItems, trailingWaitLabel } = buildRenderSequence(linearSteps);

  // Outcome nodes collapse unconditionally — unlike the linear chain above,
  // which only collapses when `compact` is set. The branch columns are pinned
  // to a fixed narrow width (see the comment on the outcome row below), so an
  // uncollapsed 22-node outcome like CS4's nurture path wraps badly on the
  // full /work/[slug] page too, not just the compact home-page lightbox.
  // Outcomes of one node are unaffected: a run of 1 never meets collapseRuns'
  // threshold, so CS1 renders exactly as it did before.
  const outcomesForRender = branch
    ? branch.outcomes.map((outcome) => ({ ...outcome, nodes: collapseRuns(outcome.nodes) }))
    : [];
  // Rebuilt from the *collapsed* steps, not the original `steps` prop, so the
  // screen-reader list always describes exactly what's drawn. Reading out all
  // 11 emails beside a diagram showing 3 would be worse than either alone.
  const describedBranch: AutomationBranch | null = branch ? { ...branch, outcomes: outcomesForRender } : null;
  const describedSteps: CanvasStep[] = describedBranch ? [...linearSteps, describedBranch] : linearSteps;

  return (
    <div ref={ref} className={`automation-canvas ${active ? "automation-canvas--active" : ""}`}>
      {/* Visual canvas — hidden from assistive tech; describeSteps() below
          is the real accessible content for this component. */}
      {/* w-full + max-w-md: 448px on desktop (was a 320px max-w-xs, too narrow
          to split into two readable branch columns), shrinking to whatever the
          host gives it on mobile — the lightbox panel is the tight case at
          ~280px inside its own padding. No overflow-x-auto: nothing in here is
          unshrinkable now that the nodes wrap, and a scroll container would
          clip the activation pulse's box-shadow (see canvas-node-pulse). */}
      <div aria-hidden="true" className="mx-auto flex w-full max-w-md flex-col items-center">
        {renderItems.map((item, index) =>
          item.kind === "node" ? (
            <CanvasNode key={item.node.id} node={item.node} index={index} className="w-full" />
          ) : (
            <Connector key={`connector-${index}`} index={index} waitLabel={item.waitLabel} />
          ),
        )}

        {branch ? (
          <>
            <Connector index={renderItems.length} waitLabel={trailingWaitLabel} />
            <div
              className="canvas-node w-full"
              style={{ "--i": renderItems.length + 1 } as React.CSSProperties}
            >
              <p className="type-node-label text-accent-text">{branch.label}</p>
              {/* Matches CanvasNode's title line exactly — this header is a
                  .canvas-node drawn inline rather than through that component. */}
              <p className="type-node-title mt-1">{branch.title}</p>
            </div>
            {/* The columns must be width-constrained, not w-full like the
                linear chain above — two w-full columns side by side would each
                claim the whole canvas width and overflow it (verified clipped
                on both outcomes before any constraint was here). This splits
                the canvas evenly instead of pinning a fixed w-32: that fixed
                128px left only an ~88px content box after node padding, which
                is what the titles were spilling out of. */}
            <div className="mt-2 flex gap-3 sm:gap-6">
              {outcomesForRender.map((outcome, outcomeIndex) => {
                // Same buildRenderSequence pass the linear chain gets, so wait
                // steps become connector labels here too instead of their own
                // boxed cards. Before this, outcomes bypassed the pipeline
                // entirely — invisible while every outcome held a single node.
                const { items: outcomeItems } = buildRenderSequence(outcome.nodes);
                return (
                  // flex-1 basis-0 makes both outcomes equal halves of the
                  // canvas regardless of content; min-w-0 is what actually
                  // lets them shrink below their content width on narrow
                  // viewports — without it a flex item's min-width:auto floor
                  // reintroduces the same overflow.
                  <div key={outcome.label} className="flex min-w-0 flex-1 basis-0 flex-col items-center">
                    <p className="type-tag mt-2 text-text-muted">IF {outcome.label.toUpperCase()}</p>
                    <Connector index={renderItems.length + 2} />
                    {outcomeItems.map((item, itemIndex) =>
                      item.kind === "node" ? (
                        <CanvasNode
                          key={item.node.id}
                          node={item.node}
                          index={renderItems.length + 3 + outcomeIndex + itemIndex}
                          className="w-full"
                        />
                      ) : (
                        <Connector
                          key={`outcome-${outcomeIndex}-connector-${itemIndex}`}
                          index={renderItems.length + 3 + outcomeIndex + itemIndex}
                          waitLabel={item.waitLabel}
                        />
                      ),
                    )}
                  </div>
                );
              })}
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
