import Image from "next/image";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import { profile } from "@/content/profile";

// Above-the-fold intro. Server Component — every piece of motion here
// (the reveal stagger, the availability dot's pulse) is handled by CSS/the
// client Reveal wrapper, so Hero itself needs no client-side state.
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto grid w-full max-w-(--container-page) gap-10 px-6 pt-16 pb-20 md:grid-cols-[1fr_auto] md:items-center md:px-8 md:pt-24 md:pb-32"
    >
      <div className="order-2 md:order-1">
        <Reveal index={0}>
          {/* Availability pill: the pulsing dot is pure CSS (animate-pulse),
              which app/globals.css's reduced-motion block already disables
              site-wide, so no extra handling is needed here. */}
          <p className="type-label inline-flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
            {profile.availability}
          </p>
        </Reveal>

        <Reveal index={1}>
          <h1 id="hero-heading" className="type-display mt-4">
            {profile.name}
          </h1>
        </Reveal>

        <Reveal index={2}>
          <p className="type-lead mt-6 max-w-xl">{profile.tagline}</p>
        </Reveal>

        <Reveal index={3}>
          <p className="type-label mt-6 flex flex-wrap gap-x-3 gap-y-1 text-text-muted">
            {profile.titles.map((title, index) => (
              <span key={title}>
                {title}
                {index < profile.titles.length - 1 ? " ·" : ""}
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal index={4}>
          <p className="type-body mt-4">{profile.heroSubline}</p>
        </Reveal>

        <Reveal index={5} className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="#work">See the work →</Button>
          <Button href={`mailto:${profile.email}`} variant="ghost">
            {profile.email}
          </Button>
        </Reveal>

        <Reveal index={6} className="mt-6 flex gap-4">
          <a href={profile.socials.linkedin} className="type-label hover:text-accent-text">
            LinkedIn
          </a>
          <a href={profile.socials.github} className="type-label hover:text-accent-text">
            GitHub
          </a>
        </Reveal>
      </div>

      <Reveal index={1} className="order-1 flex justify-center md:order-2 md:justify-end">
        {/* 800x800 min-size headshot per the plan's asset spec; explicit
            width/height keep this from causing layout shift (CLS) before
            the image loads. Not yet dropped into public/, so this renders
            the browser's default broken-image box until Kenneth adds it —
            intentionally left in place as the wired-up slot rather than
            removed, per the plan's "scaffold paths, hide slots until files
            land" instruction. */}
        <Image
          src="/kenneth-sangalang.jpg"
          alt="Portrait of Kenneth Sangalang"
          width={380}
          height={380}
          priority
          quality={75}
          className="h-45 w-45 rounded-full border border-accent/30 object-cover md:h-95 md:w-95 md:rounded-2xl"
        />
      </Reveal>
    </section>
  );
}
