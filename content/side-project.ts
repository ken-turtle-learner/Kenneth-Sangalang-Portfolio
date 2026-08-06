// The card at the foot of the Featured Work section, rendered by
// components/SideProject.tsx.
//
// This used to live in content/experience.ts alongside the resume timeline.
// That timeline came off the page when the site narrowed to a portfolio; this
// entry stayed, so it got a file of its own rather than a file named after
// something that no longer renders.
export const sideProject = {
  name: "Python Web Scraper",
  description:
    "Automated BeautifulSoup scraper that extracts, cleans, and deduplicates web data from books.toscrape.com, batch-loaded into a Supabase table for analytics.",
  tags: ["Python", "BeautifulSoup", "Supabase"],
  githubUrl: "https://github.com/ken-turtle-learner",
};
