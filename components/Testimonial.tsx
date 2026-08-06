import Reveal from "@/components/Reveal";
import { testimonial } from "@/content/testimonial";

// A single attributed pull-quote, sitting between the work and the experience
// timeline — right after the proof, where a person vouching for the numbers does
// the most work.
//
// Renders nothing until content/testimonial.ts sets `published: true`, so the
// placeholder can't reach a live page.
export default function Testimonial() {
  if (!testimonial.published) return null;

  const { quote, name, role, company, sourceUrl } = testimonial;
  const attribution = `${name} · ${role}, ${company}`;

  return (
    <section
      aria-label="Testimonial"
      className="mx-auto w-full max-w-(--container-page) px-6 py-20 md:px-8 md:py-32"
    >
      <Reveal index={0}>
        <figure className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center shadow-(--shadow-card) md:p-12">
          <blockquote className="type-lead">
            {/* Curly quotes live here rather than in the content file so the
                quote itself stays plain text and easy to paste in. */}
            &ldquo;{quote}&rdquo;
          </blockquote>
          <figcaption className="type-label mt-6 text-text-muted">
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-text hover:underline"
              >
                {attribution}
              </a>
            ) : (
              attribution
            )}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
