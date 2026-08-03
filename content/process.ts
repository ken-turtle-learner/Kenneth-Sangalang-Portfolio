export type ProcessStep = {
  // Zero-padded so the numerals stay the same width in the mono type scale.
  number: string;
  title: string;
  description: string;
};

// How Kenneth actually works, derived from what the four case studies already
// document rather than written as generic agency boilerplate. Every step below
// traces to specific text in content/case-studies.ts — the source is named in
// the comment above each one, so this stays checkable against the same
// no-invented-content rule the case studies follow.
//
// The 01-07 numbering is kept because this genuinely is an ordered sequence:
// segmentation has to exist before copy is written against it, and QA has to
// happen before launch. The numbers encode real information, not decoration.
export const processSteps: ProcessStep[] = [
  {
    // CS1 overview + problem — inactive leads capped every downstream stage.
    number: "01",
    title: "Map where it's actually breaking",
    description:
      "Find the stage that's capping everything after it. On the SO Tool, leads were going inactive before finishing the lead magnet, so nothing downstream could grow either — the fix belonged at the entry point, not at the pitch.",
  },
  {
    // CS1 solution — segmentation and trigger logic built before the send.
    number: "02",
    title: "Design the segmentation and triggers",
    description:
      "Decide who enters, on what signal, and where they branch. Entries that went inactive get routed differently from entries that converted, and that logic gets built before a single line of copy exists.",
  },
  {
    // CS2 quickFacts.role + process[0] — subject lines, pre-header, voice.
    number: "03",
    title: "Write the sequence",
    description:
      "Subject lines, pre-header text, and the body copy where it's mine to write. Voice does more work than volume: the 11-email sequence reads as a trusted mentor, and urgency only appears in the final send.",
  },
  {
    // CS2 solution — the full ActiveCampaign build.
    number: "04",
    title: "Build it in the platform",
    description:
      "Entry trigger, sends, wait steps, and goals assembled in ActiveCampaign and wired to the segments from step 02.",
  },
  {
    // CS4 solution — WordPress REST endpoints, Zapier, webhooks, FastAPI.
    number: "05",
    title: "Wire what the platform can't do",
    description:
      "Where the tool runs out, code takes over: custom WordPress REST endpoints to auto-enroll students on purchase, Zapier and webhook integrations between platforms, and a FastAPI service when the job needs its own backend.",
  },
  {
    // CS1 and CS2 both state end-to-end QA before launch explicitly.
    number: "06",
    title: "QA end to end before launch",
    description:
      "Walk every branch the way a real contact would. Both the re-engagement campaign and the 11-email sequence were tested start to finish before they went live, and again after.",
  },
  {
    // CS2 benchmarkResults — results are stated against industry medians.
    number: "07",
    title: "Measure against benchmark",
    description:
      "A number on its own says nothing. A 50.78% open rate means something next to the 33.78% industry median, and a 0% unsubscribe rate across 705 sends means the list stayed healthy while it happened.",
  },
];
