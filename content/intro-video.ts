// The Vidyard intro video and the copy around it, for the unlisted /watch page.
// That page is only ever reached through a link pasted into a job application,
// so the copy assumes a cold arrival with no context from the rest of the site.
export const introVideo = {
  uuid: "MM828My8RwXWBRwBPxm62C",
  // Alt text on the embed handle, so a blocked script still says what the
  // thumbnail is rather than showing an unlabelled image.
  title: "Kenneth Sangalang intro video",
  label: "INTRO",
  heading: "Hi, I'm Kenneth.",
  lead: "A short video about who I am and what I do.",
  // Vidyard's own share page. The <noscript> fallback points here so the page
  // still leads somewhere playable when the embed script can't run.
  shareUrl: "https://share.vidyard.com/watch/MM828My8RwXWBRwBPxm62C",
  // Shown in search-result and link-preview snippets for this page.
  metaDescription:
    "A short introduction from Kenneth Sangalang: marketing automation, lifecycle email, and the WordPress builds and custom code underneath.",
} as const;
