"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import SampleLightbox from "@/components/SampleLightbox";
import SampleTile from "@/components/SampleTile";
import Section from "@/components/Section";
import type { Sample, SampleGroup } from "@/content/samples";
import { sampleGroups } from "@/content/samples";

// Grid density per shape. Wide screenshots need the room; square and tall
// assets are read at a glance, so they pack tighter.
//
// Each entry sets the mobile count too. Don't put a default grid-cols-* on the
// wrapper and override it here: two unprefixed column utilities on one element
// are resolved by their order in the generated stylesheet, not by the order
// they're written in the class attribute.
const GRID_COLUMNS: Record<SampleGroup["shape"], string> = {
  wide: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  square: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  tall: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

// The breadth half of the portfolio: rows of real screenshots grouped by what
// they are, each opening full size. Case studies (components/WorkGrid.tsx) go
// deep on four projects; this covers everything else that shipped.
export default function WorkSamples() {
  const [activeSample, setActiveSample] = useState<Sample | null>(null);
  // The tile that opened the lightbox, so focus can return to it on close.
  // Captured from the click event rather than looked up in the DOM the way
  // WorkGrid has to, because these tiles are buttons with no URL to key off.
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handleOpen = (sample: Sample, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setActiveSample(sample);
  };

  const handleClose = () => {
    setActiveSample(null);
    lastTriggerRef.current?.focus();
  };

  // An empty group renders nothing, so a row Kenneth hasn't filled yet is
  // invisible rather than a heading over blank space. If every group is empty
  // the section skips itself entirely — including its nav anchor, which is why
  // content/nav.ts's "samples" link would go dead in that state.
  const groups = sampleGroups.filter((group) => group.items.length > 0);
  if (groups.length === 0) return null;

  return (
    <Section
      id="samples"
      label="Selected work"
      heading="Work samples"
      intro="Sites, pages, and campaign assets I designed and shipped. The case studies above have the numbers; these are the things the numbers came from."
    >
      <div className="mt-16 space-y-16">
        {groups.map((group) => (
          <div key={group.id}>
            <h3 className="type-h3">{group.heading}</h3>
            {group.blurb ? <p className="type-small mt-1">{group.blurb}</p> : null}

            <div className={`mt-6 grid gap-x-6 gap-y-8 ${GRID_COLUMNS[group.shape]}`}>
              {group.items.map((sample, index) => (
                // index restarts per group so the stagger delay never compounds
                // across rows the way a running count would.
                <Reveal key={sample.id} index={index}>
                  <SampleTile
                    sample={sample}
                    shape={group.shape}
                    browserFrame={group.browserFrame}
                    onOpen={handleOpen}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* One lightbox for the whole section, not one per tile. */}
      <SampleLightbox sample={activeSample} onClose={handleClose} />
    </Section>
  );
}
