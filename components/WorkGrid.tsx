import FunnelStrip from "@/components/FunnelStrip";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SideProject from "@/components/SideProject";
import WorkBlock from "@/components/WorkBlock";
import { caseStudies, funnelStripSteps } from "@/content/case-studies";

// Provenance for the one study that renders benchmark bars. Lives here rather
// than in BenchmarkPanel so the panel stays reusable, and rather than in
// content/case-studies.ts because it describes the reporting window the
// numbers were pulled from, not the case study itself.
const BENCHMARK_FOOTNOTE = "Brave Leadership · Aug 2025 – Aug 2026 · ActiveCampaign";

// The home page's featured-work section: the funnel strip that spans all four
// case studies, then each study expanded inline. The old version was a 2x2
// grid of compact cards that required a click to learn anything; these blocks
// carry Problem, Solution, and Results on the page itself.
export default function WorkGrid() {
  return (
    <Section
      id="work"
      label="Featured work"
      heading="What I actually built"
      intro="Four projects at Brave Leadership — the problem, the build, and the numbers where numbers exist."
    >
      <Reveal index={0} className="mt-10">
        <FunnelStrip steps={funnelStripSteps} label="Full funnel: reactivation through conversion" />
      </Reveal>

      <div className="mt-16 flex flex-col gap-16">
        {caseStudies.map((study, index) => (
          <Reveal key={study.slug} index={index}>
            <WorkBlock study={study} benchmarkFootnote={BENCHMARK_FOOTNOTE} />
          </Reveal>
        ))}
      </div>

      <SideProject />
    </Section>
  );
}
