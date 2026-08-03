import BenchmarkTrack from "@/components/BenchmarkTrack";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { caseStudies } from "@/content/case-studies";

// Pulls its numbers straight from content/case-studies.ts instead of
// duplicating them here, so there is exactly one place (the case study
// content) that can drift from the source resume/profile docs — this
// section just reads and formats it.
const soToLePitch = caseStudies.find((study) => study.slug === "so-tool-to-le-pitch");
const reengagement = caseStudies.find((study) => study.slug === "so-tool-reengagement");

if (!soToLePitch?.benchmarkResults || !reengagement?.beforeAfterResults) {
  throw new Error("Proof section expects so-tool-to-le-pitch and so-tool-reengagement case study data");
}

const openRate = soToLePitch.benchmarkResults[0];
const clickRate = soToLePitch.benchmarkResults[1];
const bounceRow = soToLePitch.benchmarkResults[3];
const unsubRow = soToLePitch.benchmarkResults[4];
const completion = reengagement.beforeAfterResults[0];

// Each row's bar/tick widths are normalized against roughly 1.3x the
// larger of its own two values, rather than plotted on a literal 0-100
// scale — a raw 3.83% click rate would otherwise render as an
// almost-invisible sliver. This keeps every row visually legible
// regardless of the metric's real-world scale, while preserving the
// bar-vs-tick relationship that makes the "beating the benchmark" point.
function scaleRow(result: number, tick?: number) {
  const max = Math.max(result, tick ?? 0) * 1.3 || 1;
  return {
    fillPercent: (result / max) * 100,
    tickPercent: tick === undefined ? undefined : (tick / max) * 100,
  };
}

const openScale = scaleRow(50.78, 33.78);
const clickScale = scaleRow(3.83, 1.37);
const completionScale = scaleRow(63, 48);
const zeroScale = scaleRow(0);

export default function Proof() {
  return (
    <Section id="proof" label="Proof" heading="The numbers, against benchmark">
      <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
        <Reveal index={0}>
          <BenchmarkTrack
            label="Open rate"
            value={50.78}
            fillPercent={openScale.fillPercent}
            tickPercent={openScale.tickPercent}
            comparisonText={openRate.comparison}
          />
        </Reveal>
        <Reveal index={1}>
          <BenchmarkTrack
            label="Click rate"
            value={3.83}
            fillPercent={clickScale.fillPercent}
            tickPercent={clickScale.tickPercent}
            comparisonText={clickRate.comparison}
          />
        </Reveal>
        <Reveal index={2}>
          <BenchmarkTrack
            label="Lead magnet completion"
            value={63}
            fillPercent={completionScale.fillPercent}
            tickPercent={completionScale.tickPercent}
            comparisonText={`before ${completion.before} · ${completion.delta}`}
          />
        </Reveal>
        <Reveal index={3}>
          <BenchmarkTrack
            label="Unsubscribes & bounces"
            value={0}
            fillPercent={zeroScale.fillPercent}
            comparisonText={`${bounceRow.comparison} · unsub ${unsubRow.result}`}
          />
        </Reveal>
      </div>
      <Reveal index={4}>
        <p className="type-small mt-10">Brave Leadership · Aug 2025 – Aug 2026 · ActiveCampaign</p>
      </Reveal>
    </Section>
  );
}
