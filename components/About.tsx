import Image from "next/image";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SkillsMatrix from "@/components/SkillsMatrix";
import { profile } from "@/content/profile";

const FACTS = [
  { label: "Education", lines: [profile.education.degree, `${profile.education.school} · ${profile.education.dates}`] },
  { label: "Languages", lines: [profile.languages.join(", ")] },
  { label: "Interests", lines: [profile.interests.join(", ")] },
  { label: "Currently", lines: [profile.currently] },
];

// Portrait left, narrative right, then the fact sheet and the skills
// breakdown. The heading is Kenneth's own closing line from the story rather
// than a label like "About me" — it's the throughline of every paragraph
// underneath it.
//
// The story replaced an earlier mechanical-engineering "pivot" framing. The
// degree is still real and still listed in the fact sheet below; it just
// isn't the narrative any more, because the narrative Kenneth tells starts at
// WordPress.
export default function About() {
  return (
    <Section
      id="about"
      label="About"
      heading="Find the gap, learn what it takes, close it"
      intro="How managing WordPress sites turned into writing the code behind them."
    >
      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <Reveal index={0}>
          {/* No preload here (and no `priority`, which Next 16 deprecated in
              favour of `preload`): this is the second, below-the-fold copy of
              a photo the hero already preloads, so preloading it again would
              only queue a duplicate fetch at the wrong priority. Lazy loading
              is correct; explicit width/height still prevent layout shift. */}
          <Image
            src="/kenneth-sangalang.jpg"
            alt="Portrait of Kenneth Sangalang"
            width={480}
            height={480}
            quality={75}
            className="aspect-square w-full max-w-xs rounded-2xl border border-border object-cover md:max-w-none"
          />
        </Reveal>

        <Reveal index={1} className="space-y-4">
          {profile.aboutStory.map((paragraph) => (
            <p key={paragraph} className="type-body">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>

      <Reveal index={2}>
        <dl className="mt-16 grid gap-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <dt className="type-label">{fact.label}</dt>
              {fact.lines.map((line) => (
                <dd key={line} className="type-small mt-1 text-text-secondary">
                  {line}
                </dd>
              ))}
            </div>
          ))}
        </dl>
      </Reveal>

      <SkillsMatrix />
    </Section>
  );
}
