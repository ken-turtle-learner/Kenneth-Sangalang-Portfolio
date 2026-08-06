# Editing & Managing This Site

A task-oriented guide: find the thing you want to change, follow the recipe.
For setup and project structure, see [the README](../README.md).

**Contents**

1. [The one rule](#1-the-one-rule)
2. [Where everything lives](#2-where-everything-lives)
3. [Quick edits](#3-quick-edits)
4. [Case studies](#4-case-studies)
5. [Images](#5-images)
6. [Colours, type, and spacing](#6-colours-type-and-spacing)
7. [Adding a new home page section](#7-adding-a-new-home-page-section)
8. [Publishing](#8-publishing)
9. [Gotchas](#9-gotchas)

---

## 1. The one rule

**All copy lives in `content/`. Components never contain sentences.**

Every heading, paragraph, metric, and link on the site is an entry in a
TypeScript file under `content/`. The components in `components/` only decide
how that content is arranged and styled.

So the question "where do I edit this?" almost always answers itself:

- Changing **words or numbers** → a file in `content/`
- Changing **layout or arrangement** → a file in `components/`
- Changing **colour, font size, or spacing** → `app/globals.css`

TypeScript will catch you if you get a field name wrong — run `npm run build`
and it will name the file and line.

---

## 2. Where everything lives

### Content files

| File | Controls |
| --- | --- |
| `content/profile.ts` | Name, job titles, email, LinkedIn/GitHub, availability badge, hero headline and subline, About story, education, languages, interests |
| `content/case-studies.ts` | All four case studies — cards, lightboxes, and `/work/[slug]` pages |
| `content/experience.ts` | Brave Leadership role, freelance clients, the side project card |
| `content/skills.ts` | Grouped skills list (in About) and the platform strip (under the hero) |
| `content/nav.ts` | Header and footer navigation links |

### Page files

| File | Controls |
| --- | --- |
| `app/layout.tsx` | Browser tab title, meta description, social preview text, fonts |
| `app/page.tsx` | Which sections appear on the home page, and in what order |
| `app/work/[slug]/page.tsx` | The case study page template — the layout every case study page uses |
| `app/not-found.tsx` | The 404 page |
| `app/opengraph-image.tsx` | The image shown when the site is shared on social media |
| `app/globals.css` | Colours (light + dark), type scale, animations |

### Components, by what they render

| Component | Renders |
| --- | --- |
| `SiteHeader` / `SiteFooter` | Sticky nav bar and footer |
| `Hero` | Top-of-page intro and portrait |
| `TechStrip` | The platform pills under the hero |
| `WorkGrid` | The Featured Work section (cards + lightbox) |
| `WorkCard` | One card in that grid |
| `WorkLightbox` | The modal a card opens |
| `ExperienceTimeline` | The work history timeline |
| `About` / `SkillsMatrix` | About section and its skills breakdown |
| `ContactCTA` / `ContactCard` | Closing contact section |
| `AutomationCanvas` | The drawn automation flow diagram |
| `ResultsTable` / `BenchmarkPanel` / `BenchmarkTrack` | The three results displays |
| `Figure` / `ExpandableFigure` | Screenshots (static, and click-to-enlarge) |
| `Section` | Shared wrapper giving every section its width and spacing |
| `Reveal` | The fade-in-on-scroll wrapper |
| `Button` / `Tag` / `Label` | Small shared UI pieces |

---

## 3. Quick edits

### Change your email address

`content/profile.ts` → `email`. This updates the header button, the hero, the
contact cards, and the footer at once — it is only stored in one place.

### Change the hero headline

`content/profile.ts`:

- `tagline` — the big headline ("Hi, I'm Kenneth. I build…")
- `heroSubline` — the paragraph under the job titles
- `titles` — the three job titles listed between them

Keep `tagline` short. It renders at display size and is capped to roughly 20
characters per line; a long sentence will run to four or five lines.

### Change the "Available now" badge

`content/profile.ts` → `availability`. It appears in the hero and again in the
contact section, both with a pulsing dot.

### Edit the About story

`content/profile.ts` → `aboutStory`. It's an array — **one string per
paragraph**. Don't put line breaks inside a string; add another array entry
instead.

The section heading and intro line above it aren't in this file — they're in
`components/About.tsx`, as the `heading` and `intro` props on `<Section>`.

### Edit your work history

`content/experience.ts`:

- `braveLeadership.bullets` — the main role's bullet points
- `freelance.clients` — the freelance client list; copy an existing entry to add one
- `sideProject` — the side project card at the bottom of Featured Work

Numbers in bullets are highlighted in teal automatically — write "50.78%" as
plain text and `lib/highlight-numbers.tsx` styles it. No markup needed.

### Edit skills or the platform strip

`content/skills.ts` holds two separate lists, on purpose:

- `skillGroups` — the full grouped breakdown inside About. Group order is
  display order; add a group by copying an existing object.
- `platforms` — the pill strip under the hero. **Named tools only**
  ("WordPress", "Python"), not capability phrases ("Funnel & KPI Analysis").

Adding a skill to one does not add it to the other. That's deliberate — the
strip is a scannable summary, not a mirror of the full list.

### Rename or reorder nav links

`content/nav.ts`. Both the header and the footer read from it.

⚠️ Each link's `id` **must match** the `id` of a section on the home page (see
`components/WorkGrid.tsx`, `About.tsx`, etc. — the `id` prop on `<Section>`).
If it doesn't, the link scrolls nowhere and the active-link underline stops
working, with no error message.

### Change the browser tab title or meta description

`app/layout.tsx` → the `TITLE` and `DESCRIPTION` constants at the top. They feed
the tab title, the search-result snippet, and the social preview text.

Case study pages set their own title from the case study's `title` field, and
the layout appends " — Kenneth Sangalang" automatically.

---

## 4. Case studies

### How one case study becomes three things

A single entry in `content/case-studies.ts` renders in three places:

1. **A card** in the Featured Work grid — uses `discipline`, `title`,
   `cardOutcome`, and either a figure or the `headlineMetric` tile
2. **A lightbox** when that card is clicked — adds `leadOutcome`, `problem`,
   `solution`, results, a visual, and `tags`
3. **A full page** at `/work/<slug>` — everything, including `overview`,
   `process`, `learnings`, `quickFacts`, and `roleAttribution`

You write it once. All three update together.

### Adding a new case study

**Step 1 — put the images in place.** Create `public/work/<your-slug>/` and drop
the screenshots in. Use a slug that matches the one you'll use below.

**Step 2 — get the real pixel dimensions.** These matter (see
[Images](#5-images)). In PowerShell, from the project root:

```powershell
Add-Type -AssemblyName System.Drawing
Get-ChildItem public/work/your-slug/*.png | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  "{0}: {1}x{2}" -f $_.Name, $img.Width, $img.Height
  $img.Dispose()
}
```

**Step 3 — add the entry.** Open `content/case-studies.ts` and add an object to
the `caseStudies` array. Array position is display order. Here's a minimal one
that will build:

```ts
{
  slug: "my-project",
  discipline: "Lifecycle Automation",
  title: "What the project achieved, as a sentence",
  cardOutcome: "One line for the grid card.",
  leadOutcome: "A fuller framing sentence for the top of the case study page.",
  tags: ["ActiveCampaign", "Segmentation"],
  quickFacts: {
    role: "What you owned",
    company: "Client name",
    timeline: "Mar 2026 – Jun 2026",
    team: "Solo",
    impact: "The headline outcome",
  },
  overview: "What this project is and where it sits.",
  problem: "The problem it solved.",
  solution: "What you actually built.",
  resultsType: "operational",
  metricsNote: "State plainly if there's no metric, rather than omitting it.",
  roleAttribution: "What you did, and what you didn't.",
},
```

**Step 4 — check it.** Run `npm run dev` and visit both `/` and
`/work/my-project`.

### Field reference

**Required on every case study**

| Field | Notes |
| --- | --- |
| `slug` | URL segment. Lowercase, hyphens. Changing it changes the page's URL. |
| `discipline` | The small mono eyebrow above the title. Use `·` to join two. |
| `title` | The headline. Reads best as a sentence about the outcome. |
| `cardOutcome` | One line, for the grid card. Keep it to a sentence. |
| `leadOutcome` | Fuller framing, for the lightbox and page lead. |
| `tags` | Tool/skill pills shown in the lightbox. |
| `quickFacts` | Role, company, timeline, team, impact — the strip at the top of the page. |
| `overview`, `problem`, `solution` | Prose sections. One paragraph each. |
| `resultsType` | See below. |
| `roleAttribution` | The "My role" callout. Every case study renders one. |

**Optional**

| Field | Notes |
| --- | --- |
| `headlineMetric` | Short stat, e.g. `"+15 pts"`. Used as the card tile when there's no thumbnail. |
| `process` | Array of paragraphs. The Process section is skipped entirely if omitted. |
| `learnings` | Same, for the Learnings section. |
| `metricsNote` | Required in practice when `resultsType` is `"operational"` — it's what renders instead of a table. |
| `figures` | Screenshots. See [Images](#5-images). |
| `heroFigure` | A single image beside the page headline. Kept out of `figures` deliberately. |
| `canvas` | A drawn automation diagram. See below. |
| `visualHeading` | Heading above the figures in the lightbox, e.g. `"The flow"`. |
| `cardVisual` | `"metric"` forces the card to show the stat tile instead of a screenshot. |
| `cardFigureIndex` | Which figure the card shows. Defaults to `0`. |
| `creditLine` | Trademark or attribution line under the figures. |

### Choosing `resultsType`

Pick the one matching the evidence you actually have:

| Value | Renders | Use when |
| --- | --- | --- |
| `"before-after"` | A Before / After / Change table | You have a real pre-launch baseline |
| `"benchmark"` | Result vs. industry median, with bars in the lightbox | You have results but no baseline |
| `"operational"` | The `metricsNote` paragraph, no table | There's no number — say so plainly |

For `"before-after"`, fill `beforeAfterResults`. For `"benchmark"`, fill
`benchmarkResults`.

⚠️ Both row types carry **display strings and numeric twins** — `before: "48%"`
alongside `beforeValue: 48`. The strings render as text; the numbers size the
bars. **Update both or the bars will silently disagree with the labels.**

### Controlling what the grid card shows

By default the card shows the first entry in `figures`, falling back to a
coloured tile with `headlineMetric` if there are no figures.

- Screenshot too dense to read at thumbnail size? Set `cardVisual: "metric"`.
- Want a later figure instead of the first? Set `cardFigureIndex: 4`. This
  leaves the figure order untouched everywhere else, which matters when the
  figures are in a deliberate sequence.

### Reordering or removing

Order in the `caseStudies` array is display order on the home page, and it also
drives the ← / → links at the bottom of each case study page (they wrap around,
so the last links back to the first).

To remove one: delete its object, and delete its folder from `public/work/`.

### The automation canvas

`canvas` draws the ActiveCampaign-style flow diagram. It's an array of steps:

```ts
canvas: [
  { id: "trigger", kind: "trigger", label: "TRIGGER", title: "Started tool, went inactive" },
  { id: "wait",    kind: "wait",    label: "WAIT",    title: "Inactivity window" },
  {
    id: "branch",
    kind: "branch",
    label: "BRANCH",
    title: "Completed the tool?",
    outcomes: [
      { label: "No",  nodes: [{ id: "nudge", kind: "email", label: "EMAIL", title: "Re-engagement send" }] },
      { label: "Yes", nodes: [{ id: "goal",  kind: "goal",  label: "GOAL",  title: "Completed" }] },
    ],
  },
],
```

Node kinds:

| `kind` | Renders as |
| --- | --- |
| `trigger`, `email` | A normal card |
| `wait` | Not a card — its `title` becomes a label on the connector line |
| `goal` | A card with permanent teal highlight |
| `exit` | A dashed, muted card — a path that leaves without converting |
| `branch` | A split into two labelled `outcomes` |

`id` values must be unique within one canvas. A canvas can have at most one
branch, and it must be the last step — anything after it is ignored.

Long runs of the same node kind are collapsed to `first → "+N more" → last` in
the lightbox, so a 23-step sequence stays readable. The full page draws every
step.

Not every case study needs one. Where a real screenshot of the automation
exists, that's usually better — it carries the actual condition wording and
live metrics that a drawing can't.

---

## 5. Images

### Where they go

```
public/work/<case-study-slug>/screenshot.png
public/kenneth-sangalang.jpg        ← the headshot, used in Hero and About
```

Paths in `content/case-studies.ts` are written from `public/` as the root, so
the file above is referenced as `/work/<slug>/screenshot.png`.

### Always pass real dimensions

```ts
{
  src: "/work/my-project/flow.png",
  alt: "…",
  caption: "The automation in ActiveCampaign",
  width: 798,     // ← the file's real pixel width
  height: 743,    // ← and height
}
```

`width` and `height` are technically optional, but the fallback is 1200×750 and
a wrong ratio distorts or crops the image. Use the PowerShell snippet in
[§4](#adding-a-new-case-study) to read the real values.

### Writing alt text

Describe **what the screen shows**, not that it's a screenshot. The alt text on
this site is unusually detailed on purpose — for an automation screenshot,
naming the trigger, the branch conditions, and the visible metrics means someone
using a screen reader gets the same information a sighted visitor does.

`caption` is different: it's visible to everyone and should be short.

### The `thumbnail` flag

Set `thumbnail: true` on a figure to render it at reduced width on the case
study page. Worth doing when an image would otherwise dominate — the full-size
version is still one click away, since every figure on a case study page opens
in an overlay.

### Formats

PNG for UI screenshots, JPG for photos. Next.js converts to WebP and generates
responsive sizes at build time, so don't pre-optimise or resize — upload the
original and let the build handle it.

---

## 6. Colours, type, and spacing

### Colours

All colours are CSS variables at the top of `app/globals.css`, defined twice:

```css
:root { --accent: #0d9488; … }                    /* light theme */
:root[data-theme="dark"] { --accent: #0c9397; … } /* dark theme */
```

**Change both.** Editing only `:root` leaves dark mode on the old colour.

Key tokens: `--bg` (page background), `--surface` (cards), `--text` (headings),
`--text-secondary` (body), `--text-muted` (small print), `--accent` (the teal),
`--border`.

⚠️ Don't lighten `--text-muted`. It's used at 15px, which is below the WCAG
large-text threshold, so it needs a full 4.5:1 contrast ratio. The current value
clears it with little margin.

Once defined, tokens are available as Tailwind classes: `bg-surface`,
`text-text-muted`, `border-border`, and so on.

### Typography

Three fonts, each with a job: **Montserrat** for headings and UI, **Newsreader**
for body prose, **IBM Plex Mono** for metrics, labels, and tags.

Use the `type-*` classes rather than Tailwind size utilities:

| Class | Used for |
| --- | --- |
| `type-display` | The largest headlines |
| `type-h2` / `type-h3` / `type-h4` | Section and subsection headings |
| `type-lead` | Intro paragraph under a heading |
| `type-body` | Body prose |
| `type-small` | Captions and small print |
| `type-label` | Uppercase mono eyebrows |
| `type-stat` / `type-card-stat` | Big numbers |
| `type-tag` | Pills |

⚠️ **`type-*` classes beat Tailwind utilities.** They're unlayered CSS and
Tailwind's utilities live in a cascade layer, so `className="type-h3 text-base"`
renders at `type-h3`'s size and the `text-base` does nothing — regardless of
class order. This is silent; nothing warns you.

Two ways around it: cap the width or size on a **wrapper element** instead of
the text element, or add a new `type-*` class in `globals.css` (that's why
`type-card-title` and `type-node-title` exist).

### Spacing

- Page width: the `--container-page` variable in `globals.css` (currently
  71.25rem / 1140px).
- Section spacing: handled by `components/Section.tsx`. Every section gets the
  same rhythm — change it there, once, rather than per section.

### Motion

Content fades in as it scrolls into view via `<Reveal>`. Its `index` prop
staggers siblings 60ms apart, so number them `0, 1, 2…` in visual order within
a section.

Everything respects `prefers-reduced-motion`: elements jump straight to their
final state instead of animating.

---

## 7. Adding a new home page section

1. **Create the component** in `components/`, wrapping the content in
   `<Section>`:

   ```tsx
   import Section from "@/components/Section";
   import Reveal from "@/components/Reveal";

   export default function Testimonials() {
     return (
       <Section id="testimonials" label="Praise" heading="What people say"
                intro="One line saying what this section holds.">
         <Reveal index={0}>{/* … */}</Reveal>
       </Section>
     );
   }
   ```

2. **Put the copy in `content/`**, not in the component.

3. **Add it to `app/page.tsx`** in the position you want it.

4. **Add a nav link** in `content/nav.ts` if it should appear in the header —
   with `id` matching the `id` you gave `<Section>`.

Using `<Section>` is what gets you the correct width, spacing, heading
structure, and screen-reader landmark for free.

---

## 8. Publishing

```bash
npm run lint     # catches unused variables, bad hooks
npm run build    # catches type errors, missing images, broken imports
```

Then commit and push to GitHub.

The site isn't hosted anywhere yet. Once it is (Vercel needs no configuration —
import the repo and it builds on every push to `main`), remember that every page
is generated at build time, so **content changes only go live after a rebuild**.
A push triggers one.

### Before publishing, check

- [ ] `npm run build` passes
- [ ] Both themes look right (toggle in the header)
- [ ] Mobile layout works — narrow the browser to ~375px
- [ ] New images have `alt` text describing what's shown, and real `width`/`height`
- [ ] Numeric twins match their display strings in any results rows
- [ ] Every claim is one you can back up; `roleAttribution` says what you didn't do

---

## 9. Gotchas

Things that fail quietly. Each is commented at the relevant line in the code.

**A nav link `id` that matches no section fails silently.** The link does
nothing and the active underline stops working. Keep `content/nav.ts` in step
with the `id` props on `<Section>`.

**Results numbers are stored twice.** `before: "48%"` and `beforeValue: 48`.
The string is the label, the number sizes the bar. Change one without the other
and they disagree.

**`type-*` classes override Tailwind utilities.** See
[§6](#typography). `className="type-body max-w-sm"` will not narrow anything.

**Adding a case study needs a rebuild to appear.** Slugs are pre-rendered at
build time and unknown slugs 404 rather than rendering on demand. This is
intentional; it just means dev-server hot reload isn't the whole story.

**The default theme is defined in four places.** `DEFAULT_THEME` in
`lib/theme.ts`, the `NO_FLASH_THEME_SCRIPT` at the bottom of that same file,
`<html data-theme>` in `app/layout.tsx`, and the bare `:root` token block in
`globals.css`. Change one and returning visitors see a flash of the wrong
theme on load. Change all four together or none.

**Image dimensions that don't match the file get cropped.** Not an error — just
a subtly wrong-looking image.

**Prev/next links wrap around.** The last case study links forward to the first.
Reordering the array reorders those links too.

**`components/FunnelStrip.tsx` and `funnelStripSteps` are currently unused.**
They're the horizontal counterpart to `AutomationCanvas`, kept for a funnel that
reads better as a left-to-right rail. Safe to delete if you're sure you don't
want it.
