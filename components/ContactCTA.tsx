import ContactCard from "@/components/ContactCard";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { profile } from "@/content/profile";

// Strips the protocol so a card shows "github.com/name", not the full URL.
// Derived rather than stored, so a handle can only be wrong in one place.
function handleFromUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

// Prefilled subject: see profile.emailSubject.
const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(profile.emailSubject)}`;

// Ordered by how much the page wants each one clicked. Email is the ask; with no
// resume PDF on the site, LinkedIn is the thing a recruiter forwards to a hiring
// manager, so it has to outrank GitHub.
const METHODS = [
  { platform: "Email", handle: profile.email, href: mailto, cta: "Email me →", variant: "primary" as const },
  {
    platform: "LinkedIn",
    handle: handleFromUrl(profile.socials.linkedin),
    href: profile.socials.linkedin,
    cta: "View profile →",
    external: true,
  },
  {
    platform: "GitHub",
    handle: handleFromUrl(profile.socials.github),
    href: profile.socials.github,
    cta: "See the code →",
    external: true,
  },
];

// Builds the lead line out of whichever logistics are filled in. Recruiters
// screen on location and hours before replying, so stating them up front removes
// a round trip — but an unset field is skipped rather than shown empty.
function leadLine() {
  const sentences = [
    "Open to remote roles in digital marketing, marketing automation, and web development.",
  ];

  const logistics = [profile.location && `Based in ${profile.location}`, profile.timezone && `working ${profile.timezone}`]
    .filter(Boolean)
    .join(", ");
  if (logistics) sentences.push(`${logistics}.`);

  sentences.push("I reply within a day.");
  return sentences.join(" ");
}

// The closing CTA. Also rendered at the foot of every /work/[slug] page, so a
// change here shows up in five places.
export default function ContactCTA() {
  return (
    <Section id="contact" headingId="contact-heading" className="text-center">
      <Reveal index={0}>
        <h2 id="contact-heading" className="type-display">
          Let&apos;s talk.
        </h2>
      </Reveal>
      <Reveal index={1}>
        <p className="type-lead mx-auto mt-4 max-w-xl">{leadLine()}</p>
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
