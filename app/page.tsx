import Button from "@/components/Button";
import Label from "@/components/Label";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import Tag from "@/components/Tag";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 md:px-8">
        <span className="type-h3">KS</span>
        <ThemeToggle />
      </header>

      <Section id="hero" label="Phase 1 — token & type check">
        <Reveal index={0}>
          <h1 className="type-display mt-4">Kenneth Sangalang</h1>
        </Reveal>
        <Reveal index={1}>
          <p className="type-lead mt-6 max-w-2xl">
            I build the marketing automation that converts — and the code underneath it.
          </p>
        </Reveal>
        <Reveal index={2}>
          <p className="type-body mt-4">
            This paragraph is set in Newsreader to confirm body copy legibility on the dark navy
            background at real reading size.
          </p>
        </Reveal>
        <Reveal index={3} className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="#">See the work →</Button>
          <Button href="#" variant="ghost">
            kenjsangalang@gmail.com
          </Button>
        </Reveal>
        <Reveal index={4} className="mt-8 flex flex-wrap gap-3">
          <Tag>ActiveCampaign</Tag>
          <Tag>WordPress REST</Tag>
          <Tag>Python</Tag>
          <Tag>FastAPI</Tag>
        </Reveal>
        <p className="type-stat mt-8 text-accent">50.78%</p>
        <Label>Open rate</Label>
      </Section>
    </>
  );
}
