export type SkillGroup = {
  name: string;
  skills: string[];
};

// The full grouped skills list, rendered by SkillsMatrix inside About.
// Group order is display order.
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

// The home page's "Technologies & integrations" strip. Curated separately from
// skillGroups above, which mixes named tools ("WordPress") with capability
// phrases ("Funnel & KPI Analysis") — only named tools belong here.
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
