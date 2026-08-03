import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AutomationCanvas from "@/components/AutomationCanvas";
import ContactCTA from "@/components/ContactCTA";
import Figure from "@/components/Figure";
import Label from "@/components/Label";
import QuickFacts from "@/components/QuickFacts";
import Reveal from "@/components/Reveal";
import ResultsTable from "@/components/ResultsTable";
import RoleAttribution from "@/components/RoleAttribution";
import { caseStudies } from "@/content/case-studies";

// Every valid slug is known up front and pre-rendered at build time; any
// other slug 404s rather than attempting on-demand rendering, per the
// plan's "every route is static" requirement.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) return {};

  // `title` here is just the study title — the root layout's title
  // template ("%s — Kenneth Sangalang") appends the suffix, so it isn't
  // repeated here or in openGraph/twitter below.
  return {
    title: study.title,
    description: study.leadOutcome,
    openGraph: {
      title: study.title,
      description: study.leadOutcome,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description: study.leadOutcome,
    },
  };
}

// Section heading — a plain function (not its own component file) since
// it's only ever used within this page's fixed Overview/Problem/Process/
// Solution/Results/Learnings structure.
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="type-h3 mt-12">{children}</h2>;
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const index = caseStudies.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();

  const study = caseStudies[index];
  const prev = caseStudies[(index - 1 + caseStudies.length) % caseStudies.length];
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <article>
      <div className="mx-auto w-full max-w-(--container-page) px-6 py-16 md:px-8 md:py-24">
        <Link href="/#work" className="type-label hover:text-accent-text">
          ← Back to work
        </Link>

        <Reveal index={0}>
          <Label>{study.discipline}</Label>
          <h1 className="type-display mt-2 text-4xl md:text-5xl">{study.title}</h1>
          <p className="type-lead mt-4 max-w-2xl">{study.leadOutcome}</p>
        </Reveal>

        <Reveal index={1} className="mt-8">
          <QuickFacts facts={study.quickFacts} />
        </Reveal>

        <div className="max-w-2xl">
          <Reveal index={2}>
            <SectionHeading>Overview</SectionHeading>
            <p className="type-body mt-3">{study.overview}</p>
          </Reveal>

          <Reveal index={3}>
            <SectionHeading>Problem</SectionHeading>
            <p className="type-body mt-3">{study.problem}</p>
          </Reveal>

          {study.process ? (
            <Reveal index={4}>
              <SectionHeading>Process</SectionHeading>
              <div className="mt-3 space-y-3">
                {study.process.map((paragraph) => (
                  <p key={paragraph} className="type-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal index={5}>
            <SectionHeading>Solution</SectionHeading>
            <p className="type-body mt-3">{study.solution}</p>
          </Reveal>
        </div>

        {/* Canvas and figures render full-width (not clamped to max-w-2xl
            like the prose above) since both need more horizontal room. */}
        {study.canvas ? (
          <Reveal index={6} className="mt-8">
            <AutomationCanvas steps={study.canvas} label={`${study.title} automation`} />
          </Reveal>
        ) : null}

        {study.figures ? (
          <div className="mt-8 space-y-8">
            {study.figures.map((figure, figureIndex) => (
              <Reveal key={figure.src} index={figureIndex}>
                <Figure {...figure} />
              </Reveal>
            ))}
            {study.creditLine ? <p className="type-small mt-4">{study.creditLine}</p> : null}
          </div>
        ) : null}

        <div className="max-w-2xl">
          <Reveal index={7}>
            <SectionHeading>Results</SectionHeading>
            <div className="mt-3">
              <ResultsTable
                resultsType={study.resultsType}
                benchmarkResults={study.benchmarkResults}
                beforeAfterResults={study.beforeAfterResults}
                metricsNote={study.metricsNote}
              />
            </div>
          </Reveal>

          {study.learnings ? (
            <Reveal index={8}>
              <SectionHeading>Learnings</SectionHeading>
              <div className="mt-3 space-y-3">
                {study.learnings.map((paragraph) => (
                  <p key={paragraph} className="type-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>

        <Reveal index={9} className="mt-10">
          <RoleAttribution text={study.roleAttribution} />
        </Reveal>

        <nav aria-label="Other case studies" className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <Link href={`/work/${prev.slug}`} className="type-label hover:text-accent-text">
            ← {prev.title}
          </Link>
          <Link href={`/work/${next.slug}`} className="type-label text-right hover:text-accent-text">
            {next.title} →
          </Link>
        </nav>
      </div>

      <ContactCTA />
    </article>
  );
}
