import ContactCard from "@/components/ContactCard";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { profile } from "@/content/profile";

// Strips the protocol so a card can show "github.com/ken-turtle-learner"
// rather than the full URL. Derived rather than stored alongside the URLs in
// content/profile.ts, so there's only one place a handle can be wrong.
function handleFromUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

const METHODS = [
  { platform: "Email", handle: profile.email, href: `mailto:${profile.email}` },
  { platform: "LinkedIn", handle: handleFromUrl(profile.socials.linkedin), href: profile.socials.linkedin },
  { platform: "GitHub", handle: handleFromUrl(profile.socials.github), href: profile.socials.github },
];

// Closing section, and the last CTA on the page before the footer. Also
// rendered at the foot of every /work/[slug] page, so any change here shows up
// in five places.
//
// The single oversized mailto that used to sit here was one target and one
// option; the card grid gives each channel equal weight and shows the actual
// address on each, which is what the reference layout does too.
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
          Open to remote Digital Marketing, Marketing Automation, and WordPress roles — reach out directly.
        </p>
      </Reveal>
      <Reveal index={2} className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        {METHODS.map((method) => (
          <ContactCard key={method.platform} {...method} />
        ))}
      </Reveal>
      <Reveal index={3}>
        <p className="type-label mt-10 inline-flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
          {profile.availability}
        </p>
      </Reveal>
    </Section>
  );
}
