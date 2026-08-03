import Reveal from "@/components/Reveal";
import Tag from "@/components/Tag";
import { skillGroups } from "@/content/skills";

// Renders the five skill groups as pill tags — no proficiency bars/ratings,
// since there's no real data behind a rating and it would read as filler
// (see the "no invented content" rule this whole site follows).
//
// A plain block rather than its own <Section>: it now sits inside About,
// which is where the reference layout puts a technical-skills list and where
// it reads as part of Kenneth's background rather than as a standalone
// keyword dump. The named platforms also appear in the TechStrip near the top
// of the page; that one is a summary for scanning, this is the full grouping.
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
