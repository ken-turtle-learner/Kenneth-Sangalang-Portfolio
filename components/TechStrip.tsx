import RepelField from "@/components/RepelField";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import Tag from "@/components/Tag";
import { platforms } from "@/content/skills";

// The platform strip under the hero, reading `platforms` from
// content/skills.ts. The fuller grouped breakdown lives in About.
export default function TechStrip() {
  return (
    <Section
      id="tech"
      label="Stack"
      heading="Technologies & integrations"
      intro="The platforms and languages the work in this portfolio was actually built on."
      align="center"
    >
      {/* RepelField nests inside Reveal rather than replacing it: both write
          transforms, and nesting keeps them off the same node. The flex row
          belongs on RepelField, whose direct children are what get pushed. */}
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
