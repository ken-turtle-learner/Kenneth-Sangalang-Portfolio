"use client";

import { useEffect, useRef, useState } from "react";
import CanvasNode from "@/components/CanvasNode";
import { observeReveal } from "@/lib/observer";
import type { AutomationBranch, AutomationNode, CanvasStep } from "@/content/case-studies";

type AutomationCanvasProps = {
  steps: CanvasStep[];
  // Accessible name for the canvas, read before the text-equivalent list.
  label: string;
  // Collapses long runs of identical steps into a summary node (see
  // collapseRuns). Used in the lightbox; the full /work/[slug] page draws
  // every step.
  compact?: boolean;
};

// pathLength="1" lets stroke-dasharray/dashoffset work on a 0-1 scale
// regardless of the line's real pixel length — see .canvas-connector-line.
const CONNECTOR_ARROWHEAD = <polygon points="8.0,40.0 16.0,40.0 12.0,44.0" className="canvas-connector-arrow" />;

type RenderItem = { kind: "node"; node: AutomationNode } | { kind: "connector"; waitLabel?: string };

// Turns a node list into nodes + connectors, moving each "wait" step onto the
// connector leading into the next node instead of giving it its own card.
// A trailing wait has no following connector, so it comes back separately for
// the caller to attach to whatever it draws next.
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

// Compresses a run of identical steps to first → summary → last, so the shape
// of a long sequence reads at a glance. Keeping the last node matters: in an
// 11-email sequence the final send is the deadline close.
//
// Runs of two are left alone, and wait steps inside a collapsed run are dropped
// with it — the summary node already implies elapsed time.
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

    // Walk forward over same-kind nodes, stepping over wait steps between them
    // — they render on connectors, so they don't break a run.
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

    result.push(node);
    index += 1;
  }

  return result;
}

// The wait label sits in normal flow beside the arrow and wraps within the
// node's width — absolute positioning overflowed the canvas on longer labels.
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

// Flattens the canvas into plain text for screen readers. The visual version is
// aria-hidden, so this is the only thing assistive tech announces.
function describeSteps(steps: CanvasStep[]): string[] {
  const lines: string[] = [];
  for (const step of steps) {
    if (step.kind === "branch") {
      lines.push(`${step.label}: ${step.title}`);
      for (const outcome of step.outcomes) {
        lines.push(`If ${outcome.label}:`);
        for (const node of outcome.nodes) {
          lines.push(`${node.label} — ${node.title}`);
        }
      }
      continue;
    }
    lines.push(`${step.label} — ${step.title}`);
  }
  return lines;
}

// The vertical ActiveCampaign/Zapier-style automation diagram used on the two
// case studies that are literally automations. components/FunnelStrip.tsx is
// the horizontal variant.
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

  // Outcome nodes collapse unconditionally, unlike the linear chain above: the
  // branch columns are narrow, so a long uncollapsed outcome wraps badly even
  // on the full page. Outcomes of one node are unaffected.
  const outcomesForRender = branch
    ? branch.outcomes.map((outcome) => ({ ...outcome, nodes: collapseRuns(outcome.nodes) }))
    : [];
  // Built from the collapsed steps so the screen-reader list always describes
  // exactly what's drawn.
  const describedBranch: AutomationBranch | null = branch ? { ...branch, outcomes: outcomesForRender } : null;
  const describedSteps: CanvasStep[] = describedBranch ? [...linearSteps, describedBranch] : linearSteps;

  return (
    <div ref={ref} className={`automation-canvas ${active ? "automation-canvas--active" : ""}`}>
      {/* No overflow-x-auto here: a scroll container would clip the activation
          pulse's box-shadow (see canvas-node-pulse in globals.css). */}
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
              <p className="type-node-title mt-1">{branch.title}</p>
            </div>
            <div className="mt-2 flex gap-3 sm:gap-6">
              {outcomesForRender.map((outcome, outcomeIndex) => {
                const { items: outcomeItems } = buildRenderSequence(outcome.nodes);
                return (
                  // flex-1 basis-0 splits the canvas evenly between outcomes;
                  // min-w-0 is what lets them shrink below their content width
                  // on narrow viewports, without which they overflow.
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
          // Keyed by index, not text: repeated wait steps produce identical lines.
          <li key={index}>{line}</li>
        ))}
      </ol>
    </div>
  );
}
