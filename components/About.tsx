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

// Portrait, narrative, fact sheet, skills breakdown. Copy comes from
// content/profile.ts; the heading and eyebrow are set below.
//
// Every section wears a distinct eyebrow, or it stops working as a landmark.
// The ones already taken above this: "Featured work", "Selected work".
export default function About() {
  return (
    <Section id="about" label="Who I am" heading="About Me">
      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <Reveal index={0}>
          {/* No `preload` here: this is the second, below-the-fold copy of a
              photo the hero already preloads. */}
          <Image
            src="/kenneth-sangalang-3.png"
            alt="Portrait of Kenneth Sangalang"
            width={480}
            height={480}
            quality={75}
            className="aspect-auto w-full max-w-xs rounded-4xl border border-border object-cover md:max-w-none"
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
