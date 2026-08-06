// One box in the automation diagram (components/AutomationCanvas).
// "exit" is a path that leaves the automation without converting; it's separate
// from "goal" because goal nodes carry permanent teal highlight styling.
export type AutomationNode = {
  id: string;
  kind: "trigger" | "email" | "wait" | "goal" | "exit";
  label: string;
  title: string;
  metric?: string;
};

// A split in the canvas: two labeled outcomes, each with its own list of nodes.
export type AutomationBranch = {
  id: string;
  kind: "branch";
  label: string;
  title: string;
  outcomes: { label: string; nodes: AutomationNode[] }[];
};

export type CanvasStep = AutomationNode | AutomationBranch;

// "Result vs. industry median" row.
// resultValue/comparisonValue are numeric twins of the display strings and size
// the bars in components/BenchmarkPanel.tsx — keep each pair in sync.
export type BenchmarkRow = {
  label: string;
  result: string;
  comparison: string;
  resultValue: number;
  comparisonValue?: number;
};

// "Before → After" row, for studies with a real pre-launch baseline.
// beforeValue/afterValue are the numeric twins — keep them in sync too.
export type BeforeAfterRow = {
  label: string;
  before: string;
  after: string;
  delta: string;
  beforeValue: number;
  afterValue: number;
};

export type Figure = {
  src: string;
  alt: string;
  caption: string;
  // The image's real pixel dimensions. Optional (components/Figure.tsx defaults
  // to 1200x750) but always set them: a wrong ratio crops the screenshot.
  width?: number;
  height?: number;
  // Renders at reduced width on the case study page. Full size is one click
  // away via components/ExpandableFigure.
  thumbnail?: boolean;
};

export type QuickFacts = {
  role: string;
  company: string;
  timeline: string;
  team: string;
  impact: string;
};

// One case study, driving both its home-page card and its /work/[slug] page.
export type CaseStudy = {
  slug: string;
  discipline: string;
  title: string;
  // One-liner for the home page card.
  cardOutcome: string;
  // Fuller framing sentence for the case study page's lead paragraph.
  leadOutcome: string;
  headlineMetric?: string;
  tags: string[];
  quickFacts: QuickFacts;
  overview: string;
  problem: string;
  // Optional sections. Omit them rather than padding — /work/[slug] skips the
  // heading entirely when they're undefined.
  process?: string[];
  solution: string;
  // Which results shape to render. "operational" shows metricsNote instead of
  // a table, for work with no conversion metric behind it.
  resultsType: "benchmark" | "before-after" | "operational";
  benchmarkResults?: BenchmarkRow[];
  beforeAfterResults?: BeforeAfterRow[];
  metricsNote?: string;
  learnings?: string[];
  // What Kenneth did and didn't do. Every case study renders one.
  roleAttribution: string;
  canvas?: CanvasStep[];
  figures?: Figure[];
  // The visual beside the header on /work/[slug]. Kept out of `figures` on
  // purpose: WorkCard reads figures[cardFigureIndex ?? 0] and WorkLightbox maps
  // the whole array, so adding it there would change both surfaces.
  heroFigure?: Figure;
  // Heading over the lightbox's figure block, for studies whose screenshot is
  // itself the flow. Omit where the captions already say enough.
  visualHeading?: string;
  // What the home-page card shows. Defaults to the first figure, falling back
  // to the headlineMetric tile. Set "metric" when the figure is unreadable at
  // thumbnail size.
  cardVisual?: "figure" | "metric";
  // Which figure the card shows, when it shouldn't be the first. Defaults to 0.
  cardFigureIndex?: number;
  creditLine?: string;
};

// Array order is display order — on the home page, and for the prev/next links
// on /work/[slug].
export const caseStudies: CaseStudy[] = [
  {
    slug: "so-tool-reengagement",
    discipline: "Lifecycle Automation · Email Marketing",
    title: "Getting leads from 48% to 63% completion on a self-discovery tool",
    cardOutcome: "A re-engagement campaign that lifted lead-magnet completion by 15 points.",
    leadOutcome:
      "A re-engagement campaign for Brave Leadership's self-discovery lead magnet, raising completion from 48% to 63% — strategy, copy, and build all mine.",
    headlineMetric: "+15 pts",
    tags: ["ActiveCampaign", "Segmentation", "Trigger Logic", "Webhooks"],
    quickFacts: {
      role: "Strategy, copy, segmentation, build, QA",
      company: "Brave Leadership",
      timeline: "Within the Aug 2025 – Aug 2026 reporting window",
      team: "Solo",
      impact: "48% → 63% completion (+15 pts)",
    },
    overview:
      "The Super Objective (SO) Tool is Brave Leadership's self-discovery lead magnet — the entry point into their funnel. A meaningful share of leads started it but never finished, which meant they never reached the nurture sequence downstream (see the SO Tool to LE Pitch case study) at all.",
    problem:
      "Leads were starting the SO Tool and going inactive before completing it, capping the volume available to every stage of the funnel after it.",
    solution:
      "Wrote short re-engagement copy and built the segmentation and trigger logic in ActiveCampaign: entries who went inactive after starting the tool were branched into a re-engagement send, then routed to completion or exited from the flow. QA tested end to end before launch.",
    resultsType: "before-after",
    beforeAfterResults: [
      {
        label: "SO Tool completion rate",
        before: "48%",
        after: "63%",
        delta: "+15 pts",
        beforeValue: 48,
        afterValue: 63,
      },
    ],
    roleAttribution:
      "Kenneth owned this end to end: wrote the copy, designed the segmentation and trigger logic, QA tested, and launched. This campaign sits just upstream of the 11-email 'SO Tool to LE Pitch' nurture sequence — together they're one connected funnel: reactivate → nurture → convert.",
    heroFigure: {
      src: "/work/so-tool-reengagement/reengagement-mockup.png",
      alt: "The re-engagement automation on a phone screen: wait for 5 minutes, then wait until the Needs a nudge tag exists, then send the Super Objective re-engagement email titled 'Did you get stuck?' — reporting 58 sent, 39.7% open rate, 10.3% click rate — then wait until the Disengaged tag exists before a second send",
      caption: "The live automation on mobile — 39.7% open rate, 10.3% click rate on the nudge email",
      width: 1080,
      height: 1920,
    },
    figures: [
      {
        src: "/work/so-tool-reengagement/automation-flow.png",
        alt: "ActiveCampaign automation showing wait-until-tag-exists steps for Needs a nudge, Disengaged, and Inactive, each branching into a Super Objective re-engagement email",
        caption: "The re-engagement automation in ActiveCampaign",
        width: 798,
        height: 743,
        // Sits directly under a full-width AutomationCanvas; two full-width flow
        // diagrams stacked read as one long picture.
        thumbnail: true,
      },
    ],
    canvas: [
      { id: "trigger", kind: "trigger", label: "TRIGGER", title: "Started SO Tool, went inactive" },
      { id: "wait", kind: "wait", label: "WAIT", title: "Inactivity window" },
      {
        id: "branch",
        kind: "branch",
        label: "BRANCH",
        title: "Completed SO Tool?",
        outcomes: [
          { label: "No", nodes: [{ id: "reengage", kind: "email", label: "EMAIL", title: "Re-engagement send" }] },
          { label: "Yes", nodes: [{ id: "goal", kind: "goal", label: "GOAL", title: "SO Tool completed" }] },
        ],
      },
    ],
  },
  {
    slug: "course-platform-api",
    discipline: "Backend / Systems",
    title: "Killing manual enrollment with custom WordPress REST endpoints",
    cardOutcome: "Custom REST endpoints and a FastAPI tool that replaced manual course enrollment.",
    leadOutcome:
      "Secure custom WordPress REST endpoints that auto-enroll students on purchase, a FastAPI internal tool, and a coaching-portal build for Brave Leadership's AI-powered Super Objective quiz.",
    headlineMetric: "7 courses · 50 students",
    tags: ["WordPress REST", "FastAPI", "Zapier", "Webhooks"],
    quickFacts: {
      role: "Backend endpoints & automation end-to-end; contributed to the coaching-portal build",
      company: "Brave Leadership",
      timeline: "11/2020 – 06/2026",
      team: "Kenneth (endpoints); Kenneth + product team (coaching portal)",
      impact: "7 courses · 50 students · manual enrollment eliminated",
    },
    overview:
      "Brave Leadership's course portal (WordPress + LearnDash + WooCommerce) supports 7 courses and 50 students. Every purchase used to require manual enrollment.",
    problem:
      "Purchase data lived in WooCommerce but enrollment in LearnDash was a manual step after every sale — a growing operational bottleneck as course volume increased.",
    solution:
      "Built secure custom WordPress REST API endpoints to sync purchase data and auto-enroll students, plus Zapier/webhook integrations across platforms to streamline the wider enrollment workflow. Also built a full-stack internal tool (FastAPI backend with authentication and rate limiting, deployed on Render) to support the course platform. Separately, contributed to Brave Leadership's Super Objective coaching portal — an AI/LLM-powered, multi-step quiz that generates a personalized impact statement, originally built on Bubble.io and migrated to a full-stack web app — helping build the new coaching-portal addition and some of its API endpoints, with Claude Code assisting on syntax.",
    resultsType: "operational",
    metricsNote:
      "The outcome here is operational, not a conversion metric: manual enrollment processing was eliminated after every purchase.",
    learnings: [
      "Contributing to the coaching-portal build and its API endpoints is where a lot of the system-design intuition for this kind of work came from.",
    ],
    roleAttribution:
      "Kenneth built the WordPress REST endpoints and enrollment automation described above end to end. On the separate Super Objective coaching-portal product, he helped build the new coaching-portal addition and some of the API endpoints — with Claude Code assisting on syntax — but did not architect the original quiz product or its AI pipeline.",
  },
  {
    slug: "so-tool-onboarding-flow",
    discipline: "Product / Onboarding UX",
    title: "Onboarding flow in WeWeb",
    cardOutcome: "A five-step flow that personalizes the payoff before the signup form.",
    leadOutcome:
      "A five-step, onboarding flow that gives users a personalized glimpse of their result before they ever see a signup form.",
    tags: ["WeWeb", "UI/UX", "Conditional Logic"],
    quickFacts: {
      role: "UI and flow logic, built from a client-provided design spec",
      company: "Brave Leadership",
      timeline: "Live status unconfirmed",
      team: "Kenneth + client design spec",
      impact: "No metrics tracked for this flow specifically",
    },
    overview:
      `This flow precedes the Super Objective (SO) Tool itself, opening with "You're about to discover your Super Objective™." It's structured as a problem-agitation-solution sequence: a multi-select resonance screen, a single-select screen narrowing those picks to one pain point, a "here's what that's costing you" consequence screen, a positive reframe, then the transition into the full SO Tool.`,
    problem:
      "Getting a user to commit to a self-discovery tool cold is a hard ask — the flow needed to build buy-in by giving users an early, personalized sense of the payoff before asking for anything.",
    process: [
      "Five steps: multi-select resonance → single-select narrowing → cost framing → positive reframe → transition into the SO Tool.",
      'The reframe step is the hinge of the flow — a selected pain point like "I\'m stuck and don\'t know why" flips to a paired positive outcome, "You see the path forward," with a supporting benefit list.',
    ],
    solution:
      "Designed the UI and wireframe in Figma and rebuilt the design and flow logic in WeWeb, including conditional logic that personalizes the reframe and outcome copy based on the user's earlier answers.",
    resultsType: "operational",
    metricsNote:
      "No completion or conversion metrics exist for this flow specifically — it's tracked separately from the SO Tool's own 63% completion figure.",
    roleAttribution:
      "Kenneth designed the UI and built the flow logic in WeWeb from a design spec the client provided. He did not originate the underlying content or copy strategy for this flow.",
    // Flow order, matching the sequence a user walks through. The card thumbnail
    // is pinned to the reframe screen via cardFigureIndex below.
    figures: [
      {
        src: "/work/onboarding-sequence/1.png",
        alt: "SO Tool welcome screen reading \"You're about to discover your Super Objective™\", with supporting copy and a \"Let's Get Started\" button",
        caption: "Welcome / intro screen",
        width: 1527,
        height: 852,
      },
      {
        src: "/work/onboarding-sequence/2.png",
        alt: "Multi-select screen asking the user to select 3 options that resonate most, showing a grid of pain-point tiles with three highlighted",
        caption: "Resonance screen (multi-select)",
        width: 1601,
        height: 856,
      },
      {
        src: "/work/onboarding-sequence/3.png",
        alt: "Single-select screen asking which pain point is most challenging right now, listing only the three the user picked on the previous screen with one highlighted and a \"Selected: 1/1\" counter",
        caption: "Pain-point selection (single-select)",
        width: 1606,
        height: 826,
      },
      {
        src: "/work/onboarding-sequence/4.png",
        alt: "Red-bordered consequence screen headed \"Here's what that is costing you\", listing nine costs tied to the selected pain point above a \"Flip to What's Possible\" button",
        caption: "\"Here's what that's costing you\" — consequence screen",
        width: 1617,
        height: 865,
      },
      {
        src: "/work/onboarding-sequence/5.png",
        alt: "Reframe screen showing \"I'm stuck and don't know why\" becoming \"You see the path forward\", with a supporting grid of nine benefits",
        caption: "Reframe screen",
        width: 1181,
        height: 707,
      },
    ],
    // The reframe screen — the only frame showing the conditional payoff.
    cardFigureIndex: 4,
    creditLine: "Super Objective™ is a trademark of Brave Leadership.",
  },
  {
    slug: "so-tool-to-le-pitch",
    discipline: "Email Automation · Lifecycle Marketing",
    title: "An 11-email nurture sequence at a 50.78% open rate",
    cardOutcome: "11 emails, above benchmark on every open/click metric, zero list attrition.",
    leadOutcome: "705 sends across 11 emails, a 50.78% open rate, and zero bounces or unsubscribes over a full year.",
    headlineMetric: "50.78% open",
    tags: ["ActiveCampaign", "Segmentation", "Email Design", "Sequencing Logic"],
    quickFacts: {
      role: "Automation build, QA, segmentation, subject lines & design — body copy by another writer",
      company: "Brave Leadership",
      timeline: "Aug 2025 – Aug 2026 (12 months)",
      team: "Kenneth + 1 copywriter",
      impact: "50.78% open · 3.83% click · 0% bounce/unsub",
    },
    overview:
      "\"SO Tool to LE Pitch\" is an 11-email sequence that nurtures leads who completed the Super Objective (SO) self-discovery tool toward Leadership Essentials (LE), Brave Leadership's paid program. The sender voice reads as a trusted mentor, not a marketer.",
    problem:
      "Converting a self-discovery-tool lead into a paying customer without the sequence reading as a hard sell — trust has to be built before the pitch, not assumed.",
    process: [
      "The throughline across all 11 emails is authentic leadership, self-investment, and shared mission — urgency is introduced only in the final email, a deadline close ('special something ends tonight') with a midnight cutoff.",
      "This sequence sits downstream of a separate re-engagement campaign (see the SO Tool re-engagement case study) that feeds it volume — together they form one connected funnel: reactivate → nurture → convert.",
    ],
    solution:
      "Built and implemented the full automation in ActiveCampaign: an entry trigger on the SO Tool completion tag, a suppression check that routes anyone who already bought the Super Objective Report out to other automations, then 11 email sends with wait steps between them and a purchase goal. Owned segmentation, subject lines, pre-header text, and email design; QA'd the entire sequence before and after launch.",
    resultsType: "benchmark",
    benchmarkResults: [
      {
        label: "Open rate",
        result: "50.78%",
        comparison: "median 33.78% · ▲ +17.0 pts",
        resultValue: 50.78,
        comparisonValue: 33.78,
      },
      {
        label: "Click rate",
        result: "3.83%",
        comparison: "median 1.37% · ▲ +2.46 pts",
        resultValue: 3.83,
        comparisonValue: 1.37,
      },
      { label: "Click-to-open rate", result: "7.54%", comparison: "—", resultValue: 7.54 },
      { label: "Bounce rate", result: "0%", comparison: "705 sends, 12 months", resultValue: 0 },
      { label: "Unsubscribe rate", result: "0%", comparison: "705 sends, 12 months", resultValue: 0 },
    ],
    roleAttribution:
      "Body copy for this sequence was written by someone else. Kenneth built and implemented the automation in ActiveCampaign, QA'd and tested it end to end, and owned segmentation, subject lines, pre-header text, email design, and sequencing logic.",
    // No `canvas` here: this study shows the real ActiveCampaign capture, which
    // carries more than a drawn approximation could.
    visualHeading: "The flow",
    cardVisual: "metric",
    figures: [
      {
        src: "/work/so-le-dripfeed/so_le_campaign_1.png",
        alt: "ActiveCampaign automation for the SO Tool to LE Pitch sequence: it starts when the tag 'Leaders With Super Objective' is added, waits 20 minutes, then checks whether the contact's purchases already contain the Super Objective Report. The No path runs the nurture sends — Email 1 'Way to Excavate Your Super Objective!' at 67 sent and 76.1% open, then a 2-day wait, then Email 2 'One question that makes all the difference' at 65 sent and 49.2% open. The Yes path checks for a Leadership Essentials purchase and routes both outcomes into other automations, ending this one.",
        caption: "The nurture sequence in ActiveCampaign — entry trigger, the purchase-suppression branch, and the opening sends",
        width: 939,
        height: 782,
      },
    ],
  },
];

// Feeds components/FunnelStrip.tsx, which nothing currently renders.
export const funnelStripSteps: AutomationNode[] = [
  { id: "reengagement", kind: "trigger", label: "STEP 1", title: "Re-engagement" },
  { id: "completed", kind: "goal", label: "STEP 2", title: "SO Tool completed" },
  { id: "nurture", kind: "email", label: "STEP 3", title: "11-email nurture" },
  { id: "conversion", kind: "goal", label: "STEP 4", title: "Leadership Essentials" },
];
