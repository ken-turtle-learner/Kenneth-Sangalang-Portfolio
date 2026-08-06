import Image from "next/image";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import { profile } from "@/content/profile";

// Above-the-fold intro. All copy comes from content/profile.ts.
//
// pt-* runs tighter than pb-* because SiteHeader is sticky, not fixed, so it
// already pushes this section down by its own height.
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto grid w-full max-w-(--container-page) gap-10 px-6 pt-10 pb-20 text-center md:grid-cols-[1fr_auto] md:items-center md:px-8 md:pt-14 md:pb-32 md:text-left"
    >
      {/* Every centering utility below is paired with an md: counterpart: the
          mobile stack stays centered under the portrait, the desktop column
          goes flush-left beside it. */}
      <div className="order-2 md:order-1">
        <Reveal index={0}>
          <p className="type-label flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-start">
            {profile.name}
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
              {profile.availability}
            </span>
          </p>
        </Reveal>

        <Reveal index={1}>
          {/* max-w-[20ch] pairs with .type-display--sentence, which drops the
              type ceiling so a full sentence stays readable. */}
          <h1 id="hero-heading" className="type-display type-display--sentence mx-auto mt-6 max-w-[20ch] md:mx-0">
            {profile.tagline}
          </h1>
        </Reveal>

        <Reveal index={2}>
          <p className="type-label mt-6 flex flex-wrap justify-center gap-x-1 gap-y-1 text-text-muted md:justify-start">
            {profile.titles.map((title, index) => (
              <span key={title}>
                {title}
                {index < profile.titles.length - 1 ? " ·" : ""}
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal index={3}>
          {/* Width is capped on the wrapper, not the <p>: .type-body carries
              its own max-width: 68ch and, being unlayered CSS, beats any
              Tailwind max-w-* utility applied directly to the element. */}
          <div className="mx-auto max-w-2xl md:mx-0">
            <p className="type-body">{profile.heroSubline}</p>
          </div>
        </Reveal>

        <Reveal index={4} className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <Button href="#work">See the work →</Button>
          <Button
            href={`mailto:${profile.email}?subject=${encodeURIComponent(profile.emailSubject)}`}
            variant="ghost"
          >
            {profile.email}
          </Button>
        </Reveal>

        <Reveal index={5} className="mt-6 flex justify-center gap-4 md:justify-start">
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="type-label hover:text-accent-text"
          >
            LinkedIn
          </a>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="type-label hover:text-accent-text"
          >
            GitHub
          </a>
        </Reveal>
      </div>
 
      {/* index={0} because order-1 puts the portrait first on mobile, so it
          should lead the reveal stagger. `preload` because this is the LCP
          image on desktop; the second copy in About deliberately lazy-loads. */}
      <Reveal index={0} className="order-1 flex justify-center md:order-2 md:justify-end">
        <Image
          src="/kenneth-sangalang-3.png"
          alt="Portrait of Kenneth Sangalang"
          width={380}
          height={380}
          preload
          quality={75}
          className="h-45 w-45 rounded-full border border-accent/30 object-cover md:h-95 md:w-95 md:rounded-16xl"
        />
      </Reveal>
    </section>
  );
}
