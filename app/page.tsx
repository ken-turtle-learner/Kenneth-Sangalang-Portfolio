import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TechStrip from "@/components/TechStrip";
import WorkGrid from "@/components/WorkGrid";

// Home page composition. All Server Components except SiteHeader (scroll +
// intersection tracking) — every section pulls its copy from content/*.ts,
// nothing is hardcoded here.
//
// Seven content sections, down from ten. Proof folded into the work block for
// the case study it describes, Skills into About, and Side project into the
// end of Work — each of those was a section heading for something that reads
// better as part of its neighbour.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <TechStrip />
      <WorkGrid />
      <Process />
      <ExperienceTimeline />
      <About />
      <ContactCTA />
      <SiteFooter />
    </>
  );
}
