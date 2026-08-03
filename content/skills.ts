export type SkillGroup = {
  name: string;
  skills: string[];
};

// Group names and most entries come from the resume's SKILLS section. The
// additions below (React, Node.js, SQL, Custom Plugin Development) come from
// the LinkedIn narrative Kenneth supplied for the About section, which names
// stack he'd worked with but the resume didn't list. Still no proficiency
// ratings anywhere — there's no real data behind a rating and it would read
// as filler.
//
// Web & CMS leads deliberately. The resume ordered Marketing Automation
// first, which made the whole site read as an email specialist's portfolio;
// WordPress is one of the three roles being targeted and belongs at the top.
export const skillGroups: SkillGroup[] = [
  {
    name: "Web & CMS",
    skills: [
      "WordPress",
      "LearnDash",
      "WooCommerce",
      "Custom Plugin Development",
      "Bubble.io",
      "WeWeb",
      "Landing Page Design",
      "REST API Integration",
    ],
  },
  {
    name: "Marketing Automation & Lifecycle",
    skills: [
      "ActiveCampaign",
      "Email Automation",
      "Drip/Nurture Sequences",
      "Re-engagement Campaigns",
      "List Segmentation",
      "Zapier",
      "Webhook Integrations",
      "Funnel & KPI Analysis",
    ],
  },
  {
    name: "Technical / Development",
    skills: [
      "PHP",
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "FastAPI",
      "HTML",
      "CSS",
      "REST API Development",
      "Authentication & Rate Limiting",
    ],
  },
  {
    name: "Data & Analytics",
    skills: ["SQL", "pandas", "NumPy", "Seaborn", "Excel"],
  },
  {
    name: "Other",
    skills: ["Supabase", "BeautifulSoup", "AI/LLM-assisted development"],
  },
];

// The named platforms shown in the home page's "Technologies & integrations"
// strip. Curated explicitly rather than derived from skillGroups above,
// because that list mixes named tools ("WordPress") with capability phrases
// ("Funnel & KPI Analysis") — the strip only wants the former, and any
// filter clever enough to tell them apart would be more fragile than just
// naming them. Ordered WordPress-first to match the role emphasis.
export const platforms: string[] = [
  "WordPress",
  "LearnDash",
  "WooCommerce",
  "WeWeb",
  "Bubble.io",
  "ActiveCampaign",
  "Zapier",
  "PHP",
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "FastAPI",
  "Supabase",
  "SQL",
  "pandas",
];
