import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { braveLeadership, freelance } from "@/content/experience";

// Matches percentages ("50.78%"), point deltas ("+17.0 pts"), and bare
// numbers ("705", "7", "50") so bullet text can wrap them in teal mono —
// lets someone skimming the timeline catch the results without reading
// every word.
const NUMBER_PATTERN = /(\+?\d+(?:\.\d+)?%|\+?\d+(?:\.\d+)?\s*pts\.?|\b\d+(?:\.\d+)?\b)/g;
const NUMBER_TEST = /^(\+?\d+(?:\.\d+)?%|\+?\d+(?:\.\d+)?\s*pts\.?|\d+(?:\.\d+)?)$/;

function highlightNumbers(text: string): React.ReactNode {
  return text
    .split(NUMBER_PATTERN)
    .map((part, index) =>
      NUMBER_TEST.test(part) ? (
        <span key={index} className="font-mono text-accent-text">
          {part}
        </span>
      ) : (
        part
      ),
    );
}

// Quiet vertical timeline — deliberately undecorated (no automation-canvas
// styling here), per the plan's "spend the boldness in one place" rule.
// Server Component: purely presentational, no interactivity.
export default function ExperienceTimeline() {
  return (
    <Section id="experience" label="Experience" heading="Where the numbers came from">
      <div className="mt-10 space-y-12 border-l border-border pl-8">
        <Reveal index={0}>
          <div className="relative">
            <span className="absolute top-1.5 -left-[calc(2rem+3px)] h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <div className="flex flex-col justify-between gap-1 md:flex-row md:items-baseline">
              <h3 className="type-h3">{braveLeadership.company}</h3>
              <p className="type-label text-text-muted md:text-right">{braveLeadership.dates}</p>
            </div>
            {braveLeadership.context ? <p className="type-small mt-1">{braveLeadership.context}</p> : null}
            <ul className="type-body mt-4 list-disc space-y-3 pl-5">
              {braveLeadership.bullets.map((bullet) => (
                <li key={bullet}>{highlightNumbers(bullet)}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal index={1}>
          <div className="relative">
            <span className="absolute top-1.5 -left-[calc(2rem+3px)] h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <div className="flex flex-col justify-between gap-1 md:flex-row md:items-baseline">
              <h3 className="type-h3">{freelance.heading}</h3>
              <p className="type-label text-text-muted md:text-right">{freelance.dates}</p>
            </div>
            <p className="type-small mt-1">{freelance.context}</p>

            <div className="mt-4 space-y-4">
              {freelance.clients.map((client) => (
                <div key={client.company}>
                  <div className="flex flex-col justify-between gap-1 md:flex-row md:items-baseline">
                    <p className="type-label text-text-secondary">{client.company}</p>
                    <p className="type-label text-text-muted md:text-right">{client.dates}</p>
                  </div>
                  <ul className="type-body mt-1 list-disc space-y-1 pl-5">
                    {client.bullets.map((bullet) => (
                      <li key={bullet}>{highlightNumbers(bullet)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
