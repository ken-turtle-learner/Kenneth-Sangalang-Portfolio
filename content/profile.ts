// Source of truth for every name, title, link, and bio line on the site.
// Read by Hero, About, SiteHeader, SiteFooter, ContactCTA and the OG image.
export const profile = {
  name: "Kenneth Sangalang",
  // The three roles this site targets.
  titles: ["Digital Marketing Specialist", "Marketing Automation Specialist", "WordPress Specialist"],
  availability: "Available now · Remote",
  email: "kenjsangalang@gmail.com",
  socials: {
    linkedin: "https://linkedin.com/in/kenneth-jon-sangalang-tech",
    github: "https://github.com/ken-turtle-learner",
  },
  tagline: "Hi, I'm Kenneth. I build web sites, marketing automation, and everything in between.",
  heroSubline:
    "Digital Marketing Specialist with 5+ years building WordPress and CMS platforms, marketing automation, and email campaigns. Combines hands-on marketing execution with tech skills (PHP, HTML, CSS, JavaScript, Python, SQL).",
  summary:
    "Digital Marketing Specialist with 5+ years building WordPress and CMS platforms, marketing automation, and email campaigns. Combines hands-on marketing execution with tech skills (PHP, HTML, CSS, JavaScript, Python, SQL).",
  // The About section narrative. One array entry per paragraph — About.tsx
  // spaces them, so don't use newlines inside a string.
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
  interests: ["Freediving", "Gym", "Motorcycles", "Electronics", "Learning new languages"],
  currently: "Building depth in data analytics — Python, SQL, and structured analysis.",
} as const;
