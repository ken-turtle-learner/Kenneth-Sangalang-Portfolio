import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Hero from "@/components/Hero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TechStrip from "@/components/TechStrip";
import WorkGrid from "@/components/WorkGrid";

// Home page composition. Every section reads its copy from content/*.ts —
// nothing is hardcoded here. Section order below is the page order.
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
