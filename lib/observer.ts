// Shared scroll-reveal IntersectionObserver.
//
// The site has ~40+ elements that fade/slide in on scroll (see
// components/Reveal.tsx). Creating one `new IntersectionObserver(...)` per
// element is the obvious-but-wasteful approach — this module instead creates
// a single observer, lazily, the first time anything asks to be observed,
// and keeps a registry mapping each watched DOM element to its own callback.
// Every Reveal instance shares this one observer instance.

type RevealCallback = () => void;

const registry = new Map<Element, RevealCallback>();

let observer: IntersectionObserver | null = null;

// Creates the observer on first use (not at module load) and reuses it on
// every subsequent call. threshold: 0.15 matches the "reveal once 15% of
// the element is visible" spec.
function getObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const callback = registry.get(entry.target);
        callback?.();
        // Reveals only ever fire once, so stop watching immediately —
        // keeps the registry and the observer's internal tracking small.
        observer?.unobserve(entry.target);
        registry.delete(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  return observer;
}

// Registers `element` to invoke `onReveal` the first time it scrolls into
// view. Returns an unsubscribe function for cleanup (e.g. on unmount, if the
// element never became visible).
export function observeReveal(element: Element, onReveal: RevealCallback): () => void {
  registry.set(element, onReveal);
  getObserver().observe(element);
  return () => {
    observer?.unobserve(element);
    registry.delete(element);
  };
}
