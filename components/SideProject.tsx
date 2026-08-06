import Label from "@/components/Label";
import Reveal from "@/components/Reveal";
import Tag from "@/components/Tag";
import { sideProject } from "@/content/side-project";

// Compact card at the end of the work section, read from content/side-project.ts.
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
        <a
          href={sideProject.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="type-label mt-4 inline-block hover:text-accent-text"
        >
          View on GitHub →
        </a>
      </div>
    </Reveal>
  );
}
