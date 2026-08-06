import Reveal from "@/components/Reveal";
import Tag from "@/components/Tag";
import { skillGroups } from "@/content/skills";

// The skill groups from content/skills.ts, as pill tags. A plain block rather
// than its own <Section> because it renders inside About.
export default function SkillsMatrix() {
  return (
    <div className="mt-16 border-t border-border pt-10">
      {/* h3 under About's h2, with each group name an h4 below it. */}
      <h3 className="type-h3">What I actually work with</h3>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {skillGroups.map((group, index) => (
          <Reveal key={group.name} index={index}>
            <h4 className="type-label text-accent-text">{group.name}</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
