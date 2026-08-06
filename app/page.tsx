import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import Hero from "@/components/Hero";
import ProofBand from "@/components/ProofBand";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Testimonial from "@/components/Testimonial";
import WorkGrid from "@/components/WorkGrid";
import WorkSamples from "@/components/WorkSamples";

// Home page composition. Every section reads its copy from content/*.ts —
// nothing is hardcoded here. Section order below is the page order.
//
// ProofBand sits directly under the hero on purpose: it puts real numbers in the
// first screen after the fold, which is as far as most visitors read.
//
// TechStrip used to occupy that slot. It's still in components/, but its pills
// are a subset of the grouped breakdown SkillsMatrix renders inside About, so
// running both spent the page's second-best position on duplicate content.
//
// ExperienceTimeline held the WorkSamples slot until this site became a
// portfolio rather than a resume. WorkGrid and WorkSamples now split the job
// between them: four projects in depth, then everything else in breadth.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <ProofBand />
      <WorkGrid />
      {/* Renders nothing until content/testimonial.ts is published. */}
      <Testimonial />
      {/* Also renders nothing while every group in content/samples.ts is empty. */}
      <WorkSamples />
      <About />
      <ContactCTA />
      <SiteFooter />
    </>
  );
}
