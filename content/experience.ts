export type ExperienceEntry = {
  company: string;
  dates: string;
  context?: string;
  bullets: string[];
};

export const braveLeadership: ExperienceEntry = {
  company: "Digital Marketing Specialist — Brave Leadership",
  dates: "11/2020 – 06/2026",
  context: "AI-enabled leadership training platform · Education · B2B/B2C",
  bullets: [
    'Built and managed email marketing automation in ActiveCampaign; architected and owned an 11-email nurture-to-conversion sequence ("SO Tool to LE Pitch") that generated 705 sends over 12 months with a 50.78% open rate (+17.0 pts vs. 33.78% industry median) and 3.83% click rate (+2.46 pts vs. 1.37% industry median), 0% bounce rate, and 0% unsubscribe rate.',
    "Wrote copy and built segmentation and trigger logic for re-engagement email campaigns targeting inactive users, raising completion of a self-discovery assessment tool used as a marketing lead magnet from 48% to 63%.",
    "Designed and built high-converting websites and landing pages using WordPress, Bubble.io, and WeWeb to support lead generation and course sales.",
    "Built and managed a full online course portal (WordPress, LearnDash, WooCommerce) supporting 7 courses and 50 students.",
    "Developed secure custom WordPress REST API endpoints to sync purchase data and automate student enrollment, eliminating manual enrollment processing after every purchase.",
    "Integrated marketing and operations platforms via Zapier, webhooks, and API calls to streamline lead nurturing and course enrollment workflows.",
    "Built a full-stack internal web application (FastAPI backend with authentication and rate limiting, deployed on Render) to support the online course platform, including a new coaching-portal addition to the AI/LLM-powered Super Objective quiz tool.",
    "Analyzed course and student data in Excel to monitor completion, retention, and funnel KPIs, informing campaign and budget optimization.",
  ],
};

export const freelance = {
  heading: "Freelance Marketing & Web Consultant — Self-Employed",
  dates: "04/2023 – 05/2026",
  context: "Concurrent with Brave Leadership role",
  clients: [
    {
      company: "Veteran Woman LLC",
      dates: "04/2023 – 01/2026",
      bullets: ["Built landing pages, checkout pages, and workbooks for the client's various campaigns and sub-clients."],
    },
    {
      company: "Sammat Education",
      dates: "06/2023 – 05/2026",
      bullets: ["Managed social media scheduling and content creation."],
    },
  ] satisfies ExperienceEntry[],
};

export const sideProject = {
  name: "Python Web Scraper",
  description:
    "Automated BeautifulSoup scraper that extracts, cleans, and deduplicates web data from books.toscrape.com, batch-loaded into a Supabase table for analytics.",
  tags: ["Python", "BeautifulSoup", "Supabase"],
  githubUrl: "https://github.com/ken-turtle-learner",
};
