// One shared IntersectionObserver for every scroll reveal on the site (~40+
// elements via components/Reveal.tsx), rather than one observer per element.

type RevealCallback = () => void;

const registry = new Map<Element, RevealCallback>();

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const callback = registry.get(entry.target);
        callback?.();
        // Reveals fire once, so stop watching immediately.
        observer?.unobserve(entry.target);
        registry.delete(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  return observer;
}

// Calls `onReveal` the first time `element` scrolls into view. Returns an
// unsubscribe function for cleanup.
export function observeReveal(element: Element, onReveal: RevealCallback): () => void {
  registry.set(element, onReveal);
  getObserver().observe(element);
  return () => {
    observer?.unobserve(element);
    registry.delete(element);
  };
}
