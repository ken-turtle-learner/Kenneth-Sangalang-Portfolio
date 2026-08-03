export type SkillGroup = {
  name: string;
  skills: string[];
};

// The five groups and their contents are copied verbatim from the resume's
// SKILLS section (group names included) — no proficiency ratings are
// attached anywhere, per the plan's decision not to invent skill levels
// the source docs don't support.
export const skillGroups: SkillGroup[] = [
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
    name: "Web & CMS",
    skills: ["WordPress", "LearnDash", "WooCommerce", "Bubble.io", "WeWeb", "Landing Page Design", "REST API Integration"],
  },
  {
    name: "Technical / Development",
    skills: [
      "PHP",
      "HTML",
      "CSS",
      "JavaScript",
      "Python",
      "FastAPI",
      "REST API Development",
      "Authentication & Rate Limiting",
    ],
  },
  {
    name: "Data & Analytics",
    skills: ["Excel", "pandas", "NumPy", "Seaborn"],
  },
  {
    name: "Other",
    skills: ["Supabase", "BeautifulSoup", "AI/LLM-assisted development"],
  },
];
