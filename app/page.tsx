import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Hero from "@/components/Hero";
import Proof from "@/components/Proof";
import SideProject from "@/components/SideProject";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SkillsMatrix from "@/components/SkillsMatrix";
import WorkGrid from "@/components/WorkGrid";

// Home page composition. All Server Components except SiteHeader (scroll +
// intersection tracking) — every section pulls its copy from content/*.ts,
// nothing is hardcoded here.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <Proof />
      <WorkGrid />
      <ExperienceTimeline />
      <SkillsMatrix />
      <About />
      <SideProject />
      <ContactCTA />
      <SiteFooter />
    </>
  );
}
