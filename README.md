# Kenneth Sangalang — Portfolio

Personal portfolio site: a home page plus one page per case study, built with
Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

**→ To change anything on the site, read [docs/EDITING-GUIDE.md](docs/EDITING-GUIDE.md).**
That guide is task-oriented ("how do I add a case study", "how do I change my
email") and is the one to open first. This file covers setup and structure only.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build — also type-checks and pre-renders every page |
| `npm run start` | Serve the production build locally (run `build` first) |
| `npm run lint` | ESLint |

Run `npm run lint` and `npm run build` before pushing. The build is the real
check: it fails on type errors and on broken image paths, which the dev server
will happily let through.

## How the site is put together

Every page is static, generated at build time. There is no database, no CMS,
and no API — all copy lives in TypeScript files under `content/`, and the
components under `components/` read from them.

```
app/
  layout.tsx           Root HTML, fonts, site metadata, theme no-flash script
  page.tsx             Home page — composes the sections, in order
  globals.css          Colour tokens, type scale, all custom CSS
  not-found.tsx        404 page
  opengraph-image.tsx  Social share card
  work/[slug]/page.tsx Case study page template (one page per case study)

content/               ← all site copy lives here
  profile.ts           Name, titles, email, socials, hero copy, About story
  case-studies.ts      The case studies, and the types describing them
  experience.ts        Work history and the side project
  skills.ts            Skill groups + the platform strip
  nav.ts               Header and footer nav links

components/            Presentational components (see the guide for a map)
lib/                   Theme persistence, scroll observer, number highlighting
public/                Static assets — images live here
  work/<slug>/         Case study screenshots, one folder per case study
content-source/        Source resume and career profile the copy was drawn from
```

The one rule worth internalising: **content goes in `content/`, never in a
component.** If you find yourself typing a sentence into a `.tsx` file, it
probably belongs in `content/` instead.

## Deploying

Not deployed yet — the repo has no hosting configuration, and `app/layout.tsx`
notes there's no confirmed domain.

It's a standard Next.js app with no server-side dependencies, so any Next host
works. Vercel needs no configuration: import the GitHub repo and it builds on
every push to `main`. Because every page is static, **content changes only go
live after a rebuild**, which a push triggers.

Two things to do when a domain exists:

1. Set `metadataBase` in `app/layout.tsx`. Until then the build prints a
   warning and social share images resolve against `localhost`.
2. Update the copyright year in `components/SiteFooter.tsx` if it's stale.

## Conventions

- Path alias `@/` maps to the project root, so imports read `@/components/Button`.
- Components are Server Components by default; only files starting with
  `"use client"` ship JavaScript to the browser.
- Comments explain *why*, not *what*. Load-bearing ones (things that break if
  you change them without knowing) are marked as such.
