import Image from "next/image";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import { profile } from "@/content/profile";

// Above-the-fold intro: a two-column split that leads with what Kenneth does
// rather than with his name, which drops to the eyebrow. Server Component —
// every piece of motion here (the reveal stagger, the availability dot's
// pulse) is CSS or the client Reveal wrapper, so Hero needs no client state.
//
// The portrait sits beside the copy on md+ and stacks above it on mobile.
// That makes it the strongest LCP candidate on desktop, which is why it's the
// one image in the app carrying `preload` (Next 16's replacement for the
// deprecated `priority`). The same photo also appears in About; see the note
// there for why that copy deliberately does not preload.
//
// The section's pt-* runs tighter than its pb-*: SiteHeader is `sticky top-0`
// rather than fixed, so it stays in normal flow and already pushes this
// section down by its own height. Nothing else adds vertical space above —
// layout.tsx, page.tsx and body contribute none — which makes this padding
// the only gap between the header and the eyebrow.
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto grid w-full max-w-(--container-page) gap-10 px-6 pt-10 pb-20 text-center md:grid-cols-[1fr_auto] md:items-center md:px-8 md:pt-14 md:pb-32 md:text-left"
    >
      {/* Every centering utility below is paired with an md: counterpart: the
          mobile stack stays centered under the portrait, while the desktop
          column goes flush-left against it. */}
      <div className="order-2 md:order-1">
        <Reveal index={0}>
          <p className="type-label flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-start">
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
              the ceiling from 5.5rem to 3.5rem, and the measure keeps the line
              breaks deliberate rather than letting a full sentence run the
              column's width. The measure needs no adjustment when the type
              resizes — ch is relative to font-size, so 20ch stays 20
              characters at any ceiling. */}
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
          {/* .type-body carries its own max-width: 68ch, and because it's
              unlayered CSS it outranks any Tailwind max-w-* utility no matter
              the class order. Constraining the wrapper instead of the element
              sidesteps that fight entirely — 68ch simply never binds because
              the parent is already narrower. */}
          <div className="mx-auto max-w-2xl md:mx-0">
            <p className="type-body">{profile.heroSubline}</p>
          </div>
        </Reveal>

        <Reveal index={4} className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <Button href="#work">See the work →</Button>
          <Button href={`mailto:${profile.email}`} variant="ghost">
            {profile.email}
          </Button>
        </Reveal>

        <Reveal index={5} className="mt-6 flex justify-center gap-4 md:justify-start">
          <a href={profile.socials.linkedin} className="type-label hover:text-accent-text">
            LinkedIn
          </a>
          <a href={profile.socials.github} className="type-label hover:text-accent-text">
            GitHub
          </a>
        </Reveal>
      </div>
 
      {/* index={0} rather than pairing with the h1: order-1 puts this first on
          screen at mobile widths, so it should lead the 60ms reveal stagger
          instead of trailing the eyebrow. Explicit width/height match the
          desktop render at 1x (h-95 = 23.75rem = 380px) and let Next's srcset
          cover 2x, while reserving the box so the load causes no layout shift. */}
      <Reveal index={0} className="order-1 flex justify-center md:order-2 md:justify-end">
        <Image
          src="/kenneth-sangalang.jpg"
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
