import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { profile } from "@/content/profile";

// Full-bleed closing section — the deepest point in the page gradient
// (handled by .bg-gradient-layer in globals.css, this section just sits on
// top of it) and the last CTA on the page before the footer.
export default function ContactCTA() {
  return (
    <Section id="contact" headingId="contact-heading" className="text-center">
      <Reveal index={0}>
        <h2 id="contact-heading" className="type-display">
          Let&apos;s talk.
        </h2>
      </Reveal>
      <Reveal index={1}>
        <p className="type-lead mx-auto mt-4 max-w-xl">
          Open to remote Digital Marketing, Marketing Automation, and MarTech roles — reach out directly.
        </p>
      </Reveal>
      <Reveal index={2}>
        {/* break-all: .type-stat's font-size is large enough that the raw
            email string overflows a narrow viewport unless it can wrap
            mid-word — verified overflowing at 375px before this was added. */}
        <a
          href={`mailto:${profile.email}`}
          className="type-stat mt-8 block break-all text-accent hover:text-accent-strong"
        >
          {profile.email}
        </a>
      </Reveal>
      <Reveal index={3} className="mt-6 flex justify-center gap-6">
        <a href={profile.socials.linkedin} className="type-label hover:text-accent-text">
          LinkedIn
        </a>
        <a href={profile.socials.github} className="type-label hover:text-accent-text">
          GitHub
        </a>
      </Reveal>
      <Reveal index={4}>
        <p className="type-label mt-8 inline-flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
          {profile.availability}
        </p>
      </Reveal>
    </Section>
  );
}
