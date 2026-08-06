import type { AutomationNode } from "@/content/case-studies";

type CanvasNodeProps = {
  node: AutomationNode;
  index: number;
  className?: string;
};

// One node card, shared by AutomationCanvas (vertical) and FunnelStrip
// (horizontal). Its activation animation comes entirely from the parent's
// .automation-canvas--active / .funnel-strip--active class in globals.css.
export default function CanvasNode({ node, index, className = "" }: CanvasNodeProps) {
  const isGoal = node.kind === "goal";
  const isExit = node.kind === "exit";

  return (
    <div
      className={`canvas-node ${isGoal ? "canvas-node--goal" : ""} ${isExit ? "canvas-node--exit" : ""} ${className}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <p className="type-node-label text-accent-text">{node.label}</p>
      <p className="type-node-title mt-1">{node.title}</p>
      {node.metric ? <p className="type-tag mt-1 text-accent-text">{node.metric}</p> : null}
    </div>
  );
}
