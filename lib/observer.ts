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
        observer?.unobserve(entry.target);
        registry.delete(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  return observer;
}

export function observeReveal(element: Element, onReveal: RevealCallback): () => void {
  registry.set(element, onReveal);
  getObserver().observe(element);
  return () => {
    observer?.unobserve(element);
    registry.delete(element);
  };
}
