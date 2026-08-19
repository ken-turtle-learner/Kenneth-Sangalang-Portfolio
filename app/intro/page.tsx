import type { Metadata } from "next";
import Link from "next/link";
import ContactCTA from "@/components/ContactCTA";
import Label from "@/components/Label";
import Reveal from "@/components/Reveal";
import SelfHostedVideo from "@/components/SelfHostedVideo";
import { shortIntro } from "@/content/short-intro";

const TITLE = "Intro video";

export const metadata: Metadata = {
  // The root layout's title template appends " — Kenneth Sangalang".
  title: TITLE,
  description: shortIntro.metaDescription,
  // Unlisted, not private, same as /watch. Nothing on the site links here — the
  // URL goes into job applications by hand — but an orphan page is still
  // crawlable through referrers and forwarded links, so keep it out of search
  // results too.
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: shortIntro.metaDescription,
    type: "video.other",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: shortIntro.metaDescription,
  },
};

// Deliberately renders no SiteHeader or SiteFooter, same as /watch and
// /work/[slug]: the header's nav is all same-page anchors that don't exist on
// this route.
export default function IntroPage() {
  return (
    <article>
      <div className="mx-auto w-full max-w-(--container-page) px-6 py-16 md:px-8 md:py-24">
        {/* Narrower than the page container so the player doesn't sprawl on
            wide screens — a talking-head video gains nothing from the width. */}
        <div className="mx-auto max-w-3xl">
          <Reveal index={0}>
            <Label>{shortIntro.label}</Label>
            <h1 className="type-display mt-2">{shortIntro.heading}</h1>
            <p className="type-lead mt-4">{shortIntro.lead}</p>
          </Reveal>

          <Reveal index={1} className="mt-10">
            <SelfHostedVideo />
          </Reveal>

          {/* Below the video, not above it. /work/[slug] puts its link at the
              top as a "back" affordance for someone already browsing; this page
              is an entry point, so the link is a next step instead. */}
          <Reveal index={2} className="mt-8">
            <Link href="/" className="type-label hover:text-accent-text">
              See the full portfolio →
            </Link>
          </Reveal>
        </div>
      </div>

      <ContactCTA />
    </article>
  );
}
