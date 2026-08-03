import Button from "@/components/Button";

// Custom 404 — styled to match the rest of the site instead of the stock
// Next.js not-found page. No nav/footer here on purpose: a dead link should
// offer one clear way back, not a full site chrome to get lost in again.
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-heading" className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="type-label">404</p>
      <h1 id="not-found-heading" className="type-display mt-4 text-4xl md:text-5xl">
        That page went inactive.
      </h1>
      <p className="type-body mt-4 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist — it may have been moved or the link&apos;s outdated.
      </p>
      <Button href="/" className="mt-8">
        Back to home
      </Button>
    </section>
  );
}
