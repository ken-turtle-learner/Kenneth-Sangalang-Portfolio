import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { processSteps } from "@/content/process";

// "How I work" — the one section on the page that describes method rather
// than output. Rendered as an <ol> because the order is real: segmentation
// has to exist before copy is written against it, and QA has to happen before
// launch. That's also why the 01-07 numerals are kept where the work blocks
// carry none — the work order is curated, this one is sequential.
//
// Single column rather than a grid: in a two-column layout a reader has to
// decide whether step 4 is below step 3 or beside it, which is exactly the
// ambiguity numbering is supposed to remove.
export default function Process() {
  return (
    <Section
      id="process"
      label="Process"
      heading="How I work"
      intro="The same seven steps whether the job is an email sequence, an onboarding flow, or a REST endpoint."
    >
      <ol className="mt-12 space-y-10 md:space-y-12">
        {processSteps.map((step, index) => (
          <Reveal key={step.number} as="li" index={index} className="grid gap-2 md:grid-cols-[5rem_1fr] md:gap-6">
            <p className="type-step-number" aria-hidden="true">
              {step.number}
            </p>
            <div>
              {/* h3 under the section's h2 — the steps are the only headings
                  in this section, so there's no h4 level to skip past. */}
              <h3 className="type-h3">{step.title}</h3>
              <p className="type-body mt-2">{step.description}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
