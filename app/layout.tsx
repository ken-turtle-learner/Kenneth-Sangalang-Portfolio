import type { Metadata } from "next";
import { IBM_Plex_Mono, Montserrat, Newsreader } from "next/font/google";
import { NO_FLASH_THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

// All three fonts are declared here at module scope (not inside a
// component) per the project's server-hoist-static-io performance rule —
// this ensures next/font only ever initializes them once, at build/module
// load time, rather than re-running on every render.

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  // Montserrat is a variable font with only a weight axis (no opsz/wdth),
  // so "variable" gives the full weight range without an `axes` option.
  weight: "variable",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  // IBM Plex Mono isn't a variable font, so weights must be listed explicitly.
  weight: ["400", "500"],
});

// Names all three targeted roles rather than leading on email/lifecycle work,
// which the site had previously over-indexed on relative to the WordPress and
// integration work that makes up just as much of the portfolio.
const TITLE = "Kenneth Sangalang — Digital Marketing, Marketing Automation & WordPress Specialist";
const DESCRIPTION =
  "WordPress sites, marketing automation, and the custom REST integrations that connect them — built by someone who also ships the code underneath.";

export const metadata: Metadata = {
  // `template` lets child routes (e.g. /work/[slug]) set just their own
  // title via generateMetadata and get " — Kenneth Sangalang" appended
  // automatically, instead of every route re-typing the suffix by hand.
  title: {
    default: TITLE,
    template: "%s — Kenneth Sangalang",
  },
  description: DESCRIPTION,
  // No metadataBase set yet — the site has no confirmed deployment domain.
  // Next falls back to resolving OG/Twitter image URLs relative to each
  // request, which works but logs a build warning; set metadataBase to the
  // real domain once one exists.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "Kenneth Sangalang",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Light is the default theme — server-rendered as "light" so there's
      // nothing to flash on first paint. If the visitor previously chose
      // dark, NO_FLASH_THEME_SCRIPT below flips this attribute to "dark"
      // synchronously before paint. app/globals.css keys its color tokens
      // off this attribute (see :root[data-theme="dark"]).
      data-theme="light"
      // Tells Next.js's router that scroll-behavior: smooth (set in
      // globals.css) is intentional, so it exempts its own route-change
      // scroll handling from it — see the comment on `html` in globals.css
      // for the full story.
      data-scroll-behavior="smooth"
      // We intentionally mutate data-theme via a plain <script> outside
      // React's render (see below), so React's hydration check would
      // otherwise warn about a mismatch here — this silences that expected,
      // harmless case.
      suppressHydrationWarning
      className={`${montserrat.variable} ${newsreader.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        {/* Blocking script, runs before first paint: flips data-theme to
            "dark" if that's what's stored, so a returning visitor with a
            dark preference never sees a flash of the light default. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="theme-transition min-h-full flex flex-col">
        {/* Fixed full-viewport gradient layer, behind all content (z-index:
            -1). Lives outside <main> since it never scrolls with the page —
            see .bg-gradient-layer in globals.css for the actual gradients. */}
        <div className="bg-gradient-layer" aria-hidden="true" />
        {/* Accessibility floor requirement: first focusable element on the
            page, visually hidden until focused, lets keyboard/screen-reader
            users skip the (future) nav straight to page content. */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
