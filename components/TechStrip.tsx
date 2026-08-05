import RepelField from "@/components/RepelField";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import Tag from "@/components/Tag";
import { platforms } from "@/content/skills";

// The named-platform strip that sits directly under the hero: a visitor
// scanning for "do they know my stack?" gets an answer before scrolling into
// any case study.
//
// Reads content/skills.ts's `platforms` export rather than flattening
// `skillGroups`, because that list mixes named tools with capability phrases
// ("Funnel & KPI Analysis") and only the former belong here. The fuller
// grouped breakdown still lives in About, so this is a summary rather than a
// duplicate.
export default function TechStrip() {
  return (
    <Section
      id="tech"
      label="Stack"
      heading="Technologies & integrations"
      intro="The platforms and languages the work in this portfolio was actually built on."
      align="center"
    >
      {/* RepelField sits inside Reveal rather than replacing it: Reveal owns a
          `transform` on the outer element for its entrance, RepelField writes
          transforms on the pills themselves, and nesting keeps the two off the
          same node. The flex row moves down to RepelField because that's the
          element whose direct children get pushed around.

          This section stays a Server Component — RepelField only ever moves
          nodes it's handed, so all 16 platform names are still in the HTML
          the server sends, in the same order, with no JS required to read
          them. */}
      <Reveal index={0} className="mt-10">
        <RepelField className="flex flex-wrap justify-center gap-2">
          {platforms.map((platform) => (
            <Tag key={platform} className="repel-item">
              {platform}
            </Tag>
          ))}
        </RepelField>
      </Reveal>
    </Section>
  );
}
