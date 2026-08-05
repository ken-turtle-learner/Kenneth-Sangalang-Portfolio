import type { AutomationNode } from "@/content/case-studies";

type CanvasNodeProps = {
  node: AutomationNode;
  index: number;
  className?: string;
};

// One node card in the automation canvas — shared by AutomationCanvas
// (vertical, case study pages) and FunnelStrip (horizontal, home page), so
// the two signature visuals stay visually identical instead of drifting.
// Purely presentational: no hooks, no browser APIs, so it doesn't need
// 'use client' itself even though both its callers do — its activation
// state comes entirely from the parent's wrapping .automation-canvas--active
// / .funnel-strip--active class (see the .canvas-node CSS rules).
export default function CanvasNode({ node, index, className = "" }: CanvasNodeProps) {
  const isGoal = node.kind === "goal";
  // An exit is a path out of the automation, not an outcome — it gets muted
  // styling so it reads as a dead end rather than competing with the goal.
  const isExit = node.kind === "exit";

  return (
    <div
      className={`canvas-node ${isGoal ? "canvas-node--goal" : ""} ${isExit ? "canvas-node--exit" : ""} ${className}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <p className="type-node-label text-accent-text">{node.label}</p>
      {/* .type-node-title, not `.type-h3 text-base` — see the class's comment in
          globals.css for why the utility silently lost to the type class here. */}
      <p className="type-node-title mt-1">{node.title}</p>
      {node.metric ? <p className="type-tag mt-1 text-accent-text">{node.metric}</p> : null}
    </div>
  );
}
