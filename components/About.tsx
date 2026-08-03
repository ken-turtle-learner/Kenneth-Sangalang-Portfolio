import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { profile } from "@/content/profile";

// Two columns: prose (the pivot story, in the site's "human voice" serif)
// on the left, a quiet mono fact sheet on the right. Server Component.
export default function About() {
  return (
    <Section id="about" label="About" heading="The pivot">
      <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
        <Reveal index={0}>
          <p className="type-body">{profile.pivotStory}</p>
        </Reveal>

        <Reveal index={1} className="space-y-6">
          <div>
            <p className="type-label">Education</p>
            <p className="type-small mt-1 text-text-secondary">{profile.education.degree}</p>
            <p className="type-small">
              {profile.education.school} · {profile.education.dates}
            </p>
          </div>
          <div>
            <p className="type-label">Languages</p>
            <p className="type-small mt-1 text-text-secondary">{profile.languages.join(", ")}</p>
          </div>
          <div>
            <p className="type-label">Interests</p>
            <p className="type-small mt-1 text-text-secondary">{profile.interests.join(", ")}</p>
          </div>
          <div>
            <p className="type-label">Currently</p>
            <p className="type-small mt-1 text-text-secondary">{profile.currently}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
