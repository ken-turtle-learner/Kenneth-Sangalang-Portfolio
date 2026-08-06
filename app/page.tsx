import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Hero from "@/components/Hero";
import ProofBand from "@/components/ProofBand";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Testimonial from "@/components/Testimonial";
import WorkGrid from "@/components/WorkGrid";

// Home page composition. Every section reads its copy from content/*.ts —
// nothing is hardcoded here. Section order below is the page order.
//
// ProofBand sits directly under the hero on purpose: it puts real numbers in the
// first screen after the fold, which is as far as most visitors read.
//
// TechStrip used to occupy that slot. It's still in components/, but its pills
// are a subset of the grouped breakdown SkillsMatrix renders inside About, so
// running both spent the page's second-best position on duplicate content.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <ProofBand />
      <WorkGrid />
      {/* Renders nothing until content/testimonial.ts is published. */}
      <Testimonial />
      <ExperienceTimeline />
      <About />
      <ContactCTA />
      <SiteFooter />
    </>
  );
}
