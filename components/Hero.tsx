import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import StatPill from "@/components/StatPill";
import { profile } from "@/content/profile";

// One proof figure per targeted role, so the row reads across WordPress,
// automation, and lifecycle work instead of stacking three variations of the
// same email result. Every value is quoted from content/case-studies.ts
// (course-platform-api's headlineMetric, so-tool-reengagement's
// beforeAfterResults) or the resume — nothing here is computed or rounded.
//
// The 50.78% open rate is deliberately absent: it's the single strongest
// number on the site, but putting it above the fold is what made the whole
// portfolio read as an email specialist's. It leads its own work block instead.
const HERO_STATS = [
  { value: "5+ yrs", label: "WordPress, marketing & automation" },
  { value: "7 courses · 50 students", label: "Enrollment fully automated" },
  { value: "+15 pts", label: "Lead-magnet completion" },
];

// Above-the-fold intro: a centered single column that leads with what Kenneth
// does rather than with his name, which drops to the eyebrow. Server Component
// — every piece of motion here (the reveal stagger, the availability dot's
// pulse) is CSS or the client Reveal wrapper, so Hero needs no client state.
//
// There is no portrait here any more; it moved to About. That makes the h1 the
// LCP element, which is the reason nothing in this file preloads an image.
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto w-full max-w-(--container-page) px-6 pt-16 pb-20 text-center md:px-8 md:pt-24 md:pb-32"
    >
      <Reveal index={0}>
        <p className="type-label flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {profile.name}
          <span aria-hidden="true">·</span>
          {/* The pulsing dot is pure CSS (animate-pulse), which the
              reduced-motion block in app/globals.css already disables
              site-wide, so it needs no special handling here. */}
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
            {profile.availability}
          </span>
        </p>
      </Reveal>

      <Reveal index={1}>
        {/* max-w-[20ch] pairs with .type-display--sentence: the modifier drops
            the ceiling from 5.5rem to 4rem, and the measure keeps the line
            breaks deliberate rather than letting a full sentence run the
            container's width. */}
        <h1 id="hero-heading" className="type-display type-display--sentence mx-auto mt-6 max-w-[20ch]">
          {profile.tagline}
        </h1>
      </Reveal>

      <Reveal index={2}>
        <p className="type-label mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 text-text-muted">
          {profile.titles.map((title, index) => (
            <span key={title}>
              {title}
              {index < profile.titles.length - 1 ? " ·" : ""}
            </span>
          ))}
        </p>
      </Reveal>

      <Reveal index={3}>
        {/* .type-body carries its own max-width: 68ch, and because it's
            unlayered CSS it outranks any Tailwind max-w-* utility no matter
            the class order. Constraining the wrapper instead of the element
            sidesteps that fight entirely — 68ch simply never binds because
            the parent is already narrower. */}
        <div className="mx-auto max-w-2xl">
          <p className="type-body">{profile.heroSubline}</p>
        </div>
      </Reveal>

      <Reveal index={4} className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        {HERO_STATS.map((stat) => (
          <StatPill key={stat.value} value={stat.value} label={stat.label} />
        ))}
      </Reveal>

      <Reveal index={5} className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button href="#work">See the work →</Button>
        <Button href={`mailto:${profile.email}`} variant="ghost">
          {profile.email}
        </Button>
      </Reveal>

      <Reveal index={6} className="mt-6 flex justify-center gap-4">
        <a href={profile.socials.linkedin} className="type-label hover:text-accent-text">
          LinkedIn
        </a>
        <a href={profile.socials.github} className="type-label hover:text-accent-text">
          GitHub
        </a>
      </Reveal>
    </section>
  );
}
