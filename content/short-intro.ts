// The self-hosted intro video and the copy around it, for the unlisted /intro
// page. Like /watch, that page is only ever reached through a link pasted into
// a job application, so the copy assumes a cold arrival with no context from
// the rest of the site.
//
// Self-hosted rather than on Vidyard, so this one reports no view counts.
export const shortIntro = {
  // Served straight out of public/. Kebab-case on purpose: a filename with
  // spaces would need percent-encoding at every use site.
  src: "/intro-short.mp4",
  // The file's real dimensions, used to reserve a 16:9 box before the browser
  // has the video's metadata.
  width: 1920,
  height: 1080,
  // The player's accessible name, since there is no visible label on it.
  title: "Kenneth Sangalang intro video",
  label: "INTRO",
  heading: "Hi, I'm Kenneth.",
  lead: "A short video about who I am and what I do.",
  // Shown in search-result and link-preview snippets for this page.
  metaDescription:
    "A short introduction from Kenneth Sangalang: marketing automation, lifecycle email, and the WordPress builds and custom code underneath.",
} as const;
