import { caseStudies } from "@/content/case-studies";

// Source of truth for every name, title, link, and bio line on the site.
// Read by Hero, About, SiteHeader, SiteFooter, ContactCTA and the OG image.
export const profile = {
  name: "Kenneth Sangalang",
  // The three roles this site targets.
  titles: ["Digital Marketing Specialist", "Marketing Automation Specialist", "WordPress Specialist"],
  availability: "Available now · Remote",
  email: "kenjsangalang@gmail.com",
  // Subject line prefilled on every mailto link. A recruiter writing into a
  // blank compose window is friction; this also makes the replies easy to spot.
  emailSubject: "Opportunity for Kenneth",
  // Both render in the contact section's lead line, and both are optional —
  // ContactCTA drops whichever is empty rather than printing a placeholder.
  // Recruiters screen on these before they reply, so they're worth filling in.
  location: "",
  timezone: "",
  socials: {
    linkedin: "https://linkedin.com/in/kenneth-jon-sangalang-tech",
    github: "https://github.com/ken-turtle-learner",
  },
  tagline: "Hi, I'm Kenneth. I build web sites, marketing automation, and everything in between.",
  heroSubline:
    "Digital Marketing Specialist with 5+ years building WordPress and CMS platforms, marketing automation, and email campaigns. Combines hands-on marketing execution with tech skills (PHP, HTML, CSS, JavaScript, Python, SQL).",
  // The About section narrative. One array entry per paragraph — About.tsx
  // spaces them, so don't use newlines inside a string.
  aboutStory: [
    "I started with managing WordPress sites and handling digital marketing, and never stopped learning from there.",
    "Role by role, problem by problem, that foundation grew into full-stack development: custom plugins in PHP and JavaScript, React and Node.js applications, API integrations, and database management with Supabase. Every skill I have, I learned because a real problem required it.",
    "When the work demanded more technical depth, I adapted. I moved from managing content to writing code, from following systems to helping design them, and from executing tasks to contributing to product and technical decisions.",
    "Lately I've been adding data analytics to that stack. Python, SQL, and structured analysis let me measure the campaigns I build instead of guessing. It's the same pattern as always: find the gap, learn what it takes, close it.",
  ],
  education: {
    degree: "Bachelor of Science in Mechanical Engineering",
    school: "University of Mindanao",
    dates: "06/2014 – 10/2020",
  },
  languages: ["English", "German", "Spanish"],
  interests: ["Freediving", "Gym", "Motorcycles", "Electronics", "Learning new languages"],
  currently: "Building depth in data analytics with Python, SQL, and structured analysis.",
} as const;

// Looks a study up by slug rather than array index, so reordering caseStudies
// can't silently repoint a proof tile at the wrong case study.
function study(slug: string) {
  const found = caseStudies.find((entry) => entry.slug === slug);
  if (!found) throw new Error(`proofPoints: no case study with slug "${slug}"`);
  return found;
}

const nurture = study("so-tool-to-le-pitch");
const reengagement = study("so-tool-reengagement");
const platform = study("course-platform-api");

// The platform study's headlineMetric is "7 courses · 150+ students", which is
// three times the length of the other two stats and wraps where they don't. The
// band leads with the student count and demotes the course count to the
// footnote. Falls back to the whole string if that separator ever goes away.
const [platformCourses, platformStudents] = platform.headlineMetric!.split(" · ");
const platformStat = platformStudents ?? platform.headlineMetric!;
const platformScope = platformStudents ? `${platformCourses} on ` : "";

// The three numbers directly under the hero, in components/ProofBand.
// Two marketing results and one engineering result, on purpose: the band is the
// "marketer who also ships code" argument shown rather than claimed.
//
// Every value is read out of content/case-studies.ts instead of retyped, so a
// number can only be corrected in one place. `stat` stays a display string —
// two of the three aren't single numbers.
export const proofPoints = [
  {
    stat: nurture.benchmarkResults![0].result,
    label: "open rate across an 11-email nurture sequence",
    footnote: `+17.0 pts over the ${nurture.benchmarkResults![0].comparisonValue}% industry median`,
    slug: nurture.slug,
  },
  {
    stat: `${reengagement.beforeAfterResults![0].before} → ${reengagement.beforeAfterResults![0].after}`,
    label: "lead-magnet completion after a re-engagement campaign",
    footnote: reengagement.beforeAfterResults![0].delta,
    slug: reengagement.slug,
  },
  {
    stat: platformStat,
    label: "on a course platform built and run end to end",
    footnote: `${platformScope}WordPress, LearnDash, and WooCommerce`,
    slug: platform.slug,
  },
];
