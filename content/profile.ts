// Transcribed from content-source/Kenneth_Sangalang_Master_Resume.md and
// Kenneth_Sangalang_Career_Profile.md, plus the About narrative Kenneth
// supplied directly from his LinkedIn profile. Drives the hero, about, and
// contact sections — kept as a single object (rather than split further)
// since every field here is a one-off, not a repeated/listy structure.
export const profile = {
  name: "Kenneth Sangalang",
  // The three roles this site targets. WordPress is named explicitly rather
  // than folded into a catch-all "MarTech" label — it's a distinct role
  // Kenneth applies for, and the portfolio's WordPress/REST work is
  // substantial enough that hiding it under a generic title undersold it.
  titles: ["Digital Marketing Specialist", "Marketing Automation Specialist", "WordPress Specialist"],
  availability: "Available now · Remote",
  email: "kenjsangalang@gmail.com",
  socials: {
    linkedin: "https://linkedin.com/in/kenneth-jon-sangalang-tech",
    github: "https://github.com/ken-turtle-learner",
  },
  tagline: "I build the marketing automation that converts — and the code underneath it.",
  // Leads on WordPress and keeps email inside the list rather than at its
  // head, so the opening lines read across all three roles instead of
  // positioning Kenneth as an email specialist who also does other things.
  heroSubline:
    "5+ years building WordPress sites, marketing automation, and the custom REST integrations that connect them — for education and B2B/B2C brands.",
  summary:
    "Digital Marketing Specialist with 5+ years building WordPress and CMS platforms, marketing automation, and email lifecycle campaigns for education and B2B/B2C brands. Track record of automating manual marketing operations through custom REST APIs and full-stack internal tools, and of above-benchmark email engagement — a 50.78% open rate and 3.83% click rate against industry medians of 33.78% and 1.37%. Combines hands-on marketing execution with development skills (PHP, JavaScript, React, Node.js, Python, FastAPI) to bridge marketing and engineering.",
  // The About narrative, supplied by Kenneth from his LinkedIn profile and
  // kept in his own voice. Split into paragraphs here rather than as one
  // string so About.tsx can space them without parsing on newlines.
  aboutStory: [
    "I started with managing WordPress sites and handling digital marketing, and never stopped learning from there.",
    "Role by role, problem by problem, that foundation grew into full-stack development: custom plugins in PHP and JavaScript, React and Node.js applications, API integrations, and database management with Supabase. Every skill I have, I learned because a real problem required it.",
    "When the work demanded more technical depth, I adapted. I moved from managing content to writing code, from following systems to helping design them, and from executing tasks to contributing to product and technical decisions.",
    "Today my focus is data analytics. Python, SQL, and structured analysis are where I'm building depth, because the pattern is the same as it's always been: find the gap, learn what it takes, close it.",
    "A lifelong learner — I've been curious since I was little.",
  ],
  education: {
    degree: "Bachelor of Science in Mechanical Engineering",
    school: "University of Mindanao",
    dates: "06/2014 – 10/2020",
  },
  languages: ["English", "German", "Spanish"],
  interests: ["Freediving", "Gym", "Motorcycle riding"],
  currently: "Building depth in data analytics — Python, SQL, and structured analysis.",
} as const;
