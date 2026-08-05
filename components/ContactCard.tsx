type ContactCardProps = {
  platform: string;
  handle: string;
  href: string;
};

// One way to get in touch. The whole card is the link so the click target is
// as large as possible, and the handle is shown in full rather than hidden
// behind a generic "Connect" label — someone deciding whether to reach out
// wants to see the address before they commit to clicking.
export default function ContactCard({ platform, handle, href }: ContactCardProps) {
  return (
    <a
      href={href}
      // Same hover recipe as WorkCard — see the note there on why the old
      // transition-[transform,...] never actually eased the lift.
      className="hover-grow hover-grow--subtle group flex flex-col rounded-2xl border border-border bg-surface p-6 text-left shadow-(--shadow-card) hover:-translate-y-0.5 hover:border-accent"
    >
      <p className="type-label">{platform}</p>
      {/* break-all: the email and the full LinkedIn path both overflow a
          375px card otherwise, since neither contains a space to wrap at. */}
      <p className="type-small mt-2 break-all text-text-secondary">{handle}</p>
      <p className="type-label mt-4 text-accent-text group-hover:underline">Connect →</p>
    </a>
  );
}
