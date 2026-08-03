import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import Tag from "@/components/Tag";
import { skillGroups } from "@/content/skills";

// Renders the five skill groups as pill tags — no proficiency bars/ratings,
// since there's no real data behind a rating and it would read as filler
// (see the "no invented content" rule this whole site follows).
export default function SkillsMatrix() {
  return (
    <Section id="skills" label="Skills" heading="What I actually work with">
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {skillGroups.map((group, index) => (
          <Reveal key={group.name} index={index}>
            <h3 className="type-label text-accent-text">{group.name}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
