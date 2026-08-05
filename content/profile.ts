// Transcribed from content-source/Kenneth_Sangalang_Master_Resume.md and
// Kenneth_Sangalang_Career_Profile.md, plus the About narrative Kenneth
// supplied directly from his LinkedIn profile.
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
  // Leads on WordPress and keeps email inside the list rather than at its
  // head, so the opening lines read across all three roles instead of
  // positioning Kenneth as an email specialist who also does other things.
  heroSubline:
    "Digital Marketing Specialist with 5+ years building WordPress and CMS platforms, marketing automation, and email campaigns. Combines hands-on marketing execution with tech skills (PHP, HTML, CSS, JavaScript, Python, SQL).",
  summary:
    "Digital Marketing Specialist with 5+ years building WordPress and CMS platforms, marketing automation, and email campaigns. Combines hands-on marketing execution with tech skills (PHP, HTML, CSS, JavaScript, Python, SQL).",
  // The About narrative, in Kenneth's own first-person voice. Split into
  // paragraphs here rather than as one string so About.tsx can space them
  // without parsing on newlines.
  //
  // Structure is deliberate: start at the visible marketing layer, show the
  // specific limits that forced code, name what grew out of that, then land on
  // the systems underneath as the actual job. Analytics closes the story as a
  // continuation of the same pattern rather than a departure from marketing —
  // the previous ending ("Today my focus is data analytics") read to a hiring
  // manager as an exit signal on a site that targets marketing roles.
  //
  // No single project anchors the narrative; the case studies carry specifics.
  // Claims here stay inside what the source docs support: the enrollment REST
  // API and the platform integrations are his, so the story stops at "the layer
  // I've spent years building" rather than claiming a solo platform build,
  // which the career profile still lists as an unresolved ownership question.
  //
  // Em-dash-free per the style preferences in Kenneth_Sangalang_Career_Profile.md.
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
