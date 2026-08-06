// Work samples: the visual proof row. Case studies in content/case-studies.ts
// go deep on four projects; this file covers the breadth — the sites, pages,
// creatives, and campaigns that don't each warrant a full write-up.
//
// Numbers in `blurb` are auto-highlighted in teal mono by
// lib/highlight-numbers.tsx, same as everywhere else. Write "150+ students" as
// plain text and it styles itself.

export type Sample = {
  // Unique across the whole file: it's the React key and the lightbox target.
  id: string;
  title: string;
  client: string;
  // One sentence. What it is, and what it was for.
  blurb: string;
  stack?: string[];
  // Omit entirely if the page is down. A dead link is worse than no link.
  liveUrl?: string;
  image: {
    src: string;
    alt: string;
    // Real pixel dimensions, not guesses. The lightbox sizes itself from this
    // ratio, so a wrong number crops the image or leaves it running off-screen.
    width: number;
    height: number;
  };
};

export type SampleGroup = {
  id: string;
  heading: string;
  blurb?: string;
  // Picks the tile's aspect ratio and grid density. Deliberately semantic
  // rather than a Tailwind class: components/WorkSamples.tsx owns the mapping,
  // so content files never carry CSS.
  shape: "wide" | "square" | "tall";
  // Draws the browser chrome bar above the screenshot. For anything that was a
  // real page at a real URL.
  browserFrame?: boolean;
  items: Sample[];
};

// Array order is display order. A group with no items renders nothing at all,
// so an unfinished row is invisible rather than empty.
export const sampleGroups: SampleGroup[] = [
  {
    id: "sites",
    heading: "Websites",
    blurb: "Full builds, from the page structure down to the checkout.",
    shape: "wide",
    browserFrame: true,
    items: [
      // No liveUrl on any of these three: nowbebrave.com now serves a Bubble app
      // for the Super Objective tool, and every path below it 404s. The site in
      // these captures is gone.
      {
        id: "brave-leadership-home",
        title: "Home page",
        client: "Brave Leadership",
        blurb: "The front door: hero, positioning, and an As Featured In row carrying 8 press logos.",
        stack: ["WordPress"],
        image: {
          src: "/samples/sites/brave-leadership-home.jpg",
          alt: "Brave Leadership home page: a full-width mountain hero headed \"Welcome to Brave Leadership\" over a \"Begin your brave journey\" button, a positioning block addressed to team leaders, and an As Featured In grid of eight press logos including TEDx, Inc., Forbes, and Thrive Global",
          width: 1897,
          height: 2023,
        },
      },
      {
        id: "brave-leadership-offerings",
        title: "Offerings page",
        client: "Brave Leadership",
        blurb: "Splits virtual from live at the top, then makes the case with 4 industry stats before the pitch.",
        stack: ["WordPress"],
        image: {
          src: "/samples/sites/brave-leadership-offerings.jpg",
          alt: "Brave Leadership offerings page: two image tiles splitting Virtual Offerings from Live Offerings, a \"We teach people how to think strategically\" section, and a four-stat row reading 83%, 5%, 20%, and 58% with captions about leadership training",
          width: 1891,
          height: 1666,
        },
      },
      {
        id: "brave-leadership-virtual-courses",
        title: "Virtual courses page",
        client: "Brave Leadership",
        blurb: "The on-demand course page for Leadership Essentials, from the pitch down to the 5 outcomes it promises.",
        stack: ["WordPress"],
        image: {
          src: "/samples/sites/brave-leadership-virtual-courses.jpg",
          alt: "Brave Leadership virtual courses page headed \"Experience the power of Onstage Leadership On-Demand\", introducing the Leadership Essentials foundation course and listing its outcomes: gain clarity, develop, understand, unlock, and feel",
          width: 1893,
          height: 2981,
        },
      },
    ],
  },
  {
    id: "landing",
    heading: "Landing & checkout pages",
    blurb: "Campaign pages built to do one job.",
    shape: "wide",
    browserFrame: true,
    items: [
      {
        id: "membership-sales-page",
        title: "Membership sales page",
        client: "Coaching client",
        blurb:
          "Problem-agitation-solution page for a care-industry membership, opening on 3 objection cards and closing on a struck-through price.",
        image: {
          src: "/samples/landing/seven-figure-impact-membership.jpg",
          alt: "Membership sales page: a split hero asking whether the reader is ready to break into the care industry, an Engage / Educate / Empower band, three teal cards naming the objections, a device mockup of the member area, and a pricing block showing $97 per month struck through and replaced with $47 per month",
          width: 1892,
          height: 3793,
        },
      },
      {
        id: "membership-offer-stack",
        title: "Membership offer stack",
        client: "Coaching client",
        blurb:
          "The bottom half of the same page: what's inside, monthly against annual pricing, and 6 bonuses stacked under the CTA.",
        image: {
          src: "/samples/landing/seven-figure-impact-offer-stack.jpg",
          alt: "Lower half of the membership sales page: an Insiders Only Resources and Events section covering courses, a private podcast feed, and monthly networking events, a monthly against annual pricing block, and six stacked bonuses ending in a repeated Join Now call to action",
          width: 1895,
          height: 5724,
        },
      },
      {
        id: "provider-testimonial-page",
        title: "Testimonial page",
        client: "Coaching client",
        blurb: "Social proof for a licensing program, built around 5 named client quotes and an apply-now close.",
        image: {
          src: "/samples/landing/startup-provider-testimonials.jpg",
          alt: "Testimonial page headed \"Empowering Providers: Real Stories of Success\", with an apply-now call to action and five named client quotes about launching assisted living, group home, and community habilitation businesses",
          width: 1838,
          height: 2675,
        },
      },
      {
        id: "provider-customer-stories",
        title: "Customer stories page",
        client: "Coaching client",
        blurb: "Video proof: milestone cards, then a featured story, then a grid of 6 more rated clips.",
        image: {
          src: "/samples/landing/startup-provider-customer-stories.jpg",
          alt: "Customer stories page: three milestone cards pairing each client's join date with the date they submitted a license application, a featured video testimonial under a five-star rating, and a grid of six more rated video clips with quotes underneath",
          width: 1642,
          height: 2862,
        },
      },
      {
        id: "masterclass-registration",
        title: "Masterclass registration page",
        client: "Event marketing client",
        blurb:
          "A free-masterclass page with the registration form pinned beside the pitch, built inside MemberVault and restyled by hand.",
        stack: ["MemberVault", "HTML", "CSS"],
        image: {
          src: "/samples/landing/venue-masterclass-membervault.jpg",
          alt: "Masterclass registration page: sales copy in the left column headed \"Secure the perfect venue for your event without breaking the bank\", a registration form pinned in the right column, then a What You'll Learn list, a numbered Why This Masterclass Works row, and three student testimonials",
          width: 1889,
          height: 2705,
        },
      },
    ],
  },
  {
    id: "components",
    heading: "Custom-coded blocks",
    blurb: "Hand-written HTML and CSS where the page builder stopped.",
    shape: "wide",
    // No browser chrome: this is a section of a page, not a page.
    items: [
      {
        id: "membervault-testimonial-grid",
        title: "Testimonial grid",
        client: "MemberVault",
        blurb: "A 6-card masonry grid, hand-coded to replace the stock block the platform shipped.",
        stack: ["HTML", "CSS", "MemberVault"],
        image: {
          src: "/samples/components/testimonial-block.jpg",
          alt: "Testimonial section headed \"Thousands of happy content creators love us\", laid out as a three-column masonry grid of six quote cards of uneven height, each with a circular avatar and name centered beneath the quote",
          width: 1536,
          height: 862,
        },
      },
    ],
  },
  {
    id: "social",
    heading: "Social creatives",
    blurb: "Post and ad assets, written and designed.",
    shape: "square",
    items: [
      // Square or 4:5 assets in public/samples/social/. Copy any entry above for
      // the shape; the only field that needs care is image width/height, which
      // must be the file's real pixel size.
    ],
  },
  {
    id: "email",
    heading: "Email campaigns",
    blurb: "The automations and sends behind the numbers above.",
    shape: "tall",
    items: [
      {
        id: "so-le-nurture-automation",
        title: "11-email nurture automation",
        client: "Brave Leadership",
        blurb:
          "The full SO Tool to LE Pitch drip in ActiveCampaign: entry trigger, purchase-suppression branch, and 11 sends with wait steps between each.",
        stack: ["ActiveCampaign"],
        image: {
          src: "/work/so-le-dripfeed/so_le_campaign_2.png",
          alt: "The complete SO Tool to LE Pitch automation in ActiveCampaign, a single vertical flow of eleven email sends separated by wait steps, ending in a tag-and-exit branch",
          width: 273,
          height: 547,
        },
      },
    ],
  },
];
