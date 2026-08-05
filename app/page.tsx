import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Hero from "@/components/Hero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TechStrip from "@/components/TechStrip";
import WorkGrid from "@/components/WorkGrid";

// Home page composition. All Server Components except SiteHeader (scroll +
// intersection tracking) — every section pulls its copy from content/*.ts,
// nothing is hardcoded here.
//
// Six content sections, down from ten. Proof folded into the work block for
// the case study it describes, Skills into About, and Side project into the
// end of Work — each of those was a section heading for something that reads
// better as part of its neighbour. "How I work" was cut outright: it described
// method rather than output, which the work blocks already demonstrate.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <TechStrip />
      <WorkGrid />
      <ExperienceTimeline />
      <About />
      <ContactCTA />
      <SiteFooter />
    </>
  );
}
