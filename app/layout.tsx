import type { Metadata } from "next";
import { IBM_Plex_Mono, Montserrat, Newsreader } from "next/font/google";
import { NO_FLASH_THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

// Fonts are declared at module scope so next/font initializes them once at
// build time rather than on every render.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
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
  // Not a variable font, so weights must be listed explicitly.
  weight: ["400", "500"],
});

const TITLE = "Kenneth Sangalang — Digital Marketing, Marketing Automation & WordPress Specialist";
// This is the snippet a recruiter sees in search results and link previews, so
// it leads with numbers rather than a role description. Past tense throughout:
// the integrations were built and shipped, but are no longer in service.
const DESCRIPTION =
  "Marketing automation and lifecycle email, plus the WordPress builds and custom code underneath. 50.78% open rates, a 15-point lift in lead-magnet completion, and a course platform built end to end.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    // Child routes set only their own title and get the suffix appended.
    template: "%s — Kenneth Sangalang",
  },
  description: DESCRIPTION,
  // No metadataBase until the site has a confirmed domain. Next resolves
  // OG/Twitter image URLs per-request without it, but logs a build warning.
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
      // Light is the default, so the server-rendered value never flashes.
      // NO_FLASH_THEME_SCRIPT flips this to "dark" before paint for visitors
      // who chose dark; globals.css keys its color tokens off this attribute.
      data-theme="light"
      // Tells the Next router that globals.css's scroll-behavior: smooth is
      // author-chosen, so route changes still jump instantly.
      data-scroll-behavior="smooth"
      // data-theme is mutated outside React by the script below, so the
      // hydration mismatch here is expected.
      suppressHydrationWarning
      className={`${montserrat.variable} ${newsreader.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="theme-transition min-h-full flex flex-col">
        {/* Fixed full-viewport gradient behind all content (z-index: -1). */}
        <div className="bg-gradient-layer" aria-hidden="true" />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        <Analytics />
        </main>
      </body>
    </html>
  );
}
