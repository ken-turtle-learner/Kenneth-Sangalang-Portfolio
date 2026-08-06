import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { braveLeadership, freelance } from "@/content/experience";
import { highlightNumbers } from "@/lib/highlight-numbers";

// Vertical timeline of roles, read from content/experience.ts. Numbers in the
// bullets are highlighted automatically by lib/highlight-numbers.tsx.
export default function ExperienceTimeline() {
  return (
    <Section
      id="experience"
      label="Background"
      heading="Experience"
    >
      <div className="mt-10 space-y-12 border-l border-border pl-8">
        <Reveal index={0}>
          <div className="relative">
            <span className="absolute top-1.5 -left-8.75 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
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
            <span className="absolute top-1.5 -left-8.75 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
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
