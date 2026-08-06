type ContactCardProps = {
  platform: string;
  handle: string;
  href: string;
};

// One way to get in touch. The whole card is the link, and the handle is shown
// in full rather than hidden behind a generic "Connect" label.
export default function ContactCard({ platform, handle, href }: ContactCardProps) {
  return (
    <a
      href={href}
      className="hover-grow hover-grow--subtle group flex flex-col rounded-2xl border border-border bg-surface p-6 text-left shadow-(--shadow-card) hover:-translate-y-0.5 hover:border-accent"
    >
      <p className="type-label">{platform}</p>
      {/* break-all: the email and LinkedIn path contain no spaces to wrap at,
          so they overflow a narrow card without it. */}
      <p className="type-small mt-2 break-all text-text-secondary">{handle}</p>
      <p className="type-label mt-4 text-accent-text group-hover:underline">Connect →</p>
    </a>
  );
}
