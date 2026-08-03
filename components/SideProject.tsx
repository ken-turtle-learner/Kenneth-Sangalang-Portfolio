import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import Tag from "@/components/Tag";
import { sideProject } from "@/content/experience";

// One compact card — deliberately not inflated into a fifth case study
// (there's no metric or client story behind it, just a self-directed build).
export default function SideProject() {
  return (
    <Section id="side-project" label="Side project" heading="Also built">
      <Reveal index={0}>
        <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] md:p-8">
          <h3 className="type-h3">{sideProject.name}</h3>
          <p className="type-body mt-2">{sideProject.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {sideProject.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <a href={sideProject.githubUrl} className="type-label mt-4 inline-block hover:text-accent-text">
            View on GitHub →
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
