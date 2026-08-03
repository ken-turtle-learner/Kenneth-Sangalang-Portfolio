import CaseStudyCard from "@/components/CaseStudyCard";
import FunnelStrip from "@/components/FunnelStrip";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { caseStudies } from "@/content/case-studies";

// Home page's "Featured work" section: the compact funnel strip (the
// connected-funnel story across all four case studies), then the four
// case study cards in a 2x2 grid (single column below 1024px, per the
// design system's "nothing 3-across below 1024px" layout rule).
export default function WorkGrid() {
  return (
    <Section id="work" label="Featured work" heading="What I actually built">
      <Reveal index={0} className="mt-10">
        <FunnelStrip />
      </Reveal>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {caseStudies.map((study, index) => (
          <Reveal key={study.slug} index={index + 1}>
            <CaseStudyCard study={study} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
