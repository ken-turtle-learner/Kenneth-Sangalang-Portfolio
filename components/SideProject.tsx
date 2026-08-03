import Label from "@/components/Label";
import Reveal from "@/components/Reveal";
import Tag from "@/components/Tag";
import { sideProject } from "@/content/experience";

// One compact card — deliberately not inflated into a fifth case study
// (there's no metric or client story behind it, just a self-directed build).
//
// Renders as a plain block rather than its own <Section>: it now sits at the
// end of the featured-work section, where a full section of its own would
// have given a side project the same page weight as four client projects.
export default function SideProject() {
  return (
    <Reveal index={0}>
      <div className="mt-16 rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card) md:p-8">
        <Label>Side project</Label>
        <h3 className="type-h3 mt-2">{sideProject.name}</h3>
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
  );
}
