// Theme (dark/light) persistence layer.
//
// Design goals:
// 1. No flash of the wrong theme on reload — handled by NO_FLASH_THEME_SCRIPT,
//    which runs synchronously in <head> before the page paints (see app/layout.tsx).
// 2. React components read/write theme through useSyncExternalStore (see
//    components/ThemeToggle.tsx) instead of useEffect+useState, because
//    setState-inside-an-effect is exactly the "read external state on mount"
//    anti-pattern React's own eslint rule (react-hooks/set-state-in-effect)
//    flags — useSyncExternalStore is the built-in tool for bridging an
//    external source (localStorage) into React without that footgun or a
//    hydration mismatch.

export type Theme = "dark" | "light";

// Versioned so a future breaking change to how theme is stored (e.g. adding
// a "system" option) can invalidate old values instead of misreading them.
const STORAGE_KEY = "ks-theme-v1";
const DEFAULT_THEME: Theme = "dark";
// Custom event used to notify same-tab subscribers (e.g. ThemeToggle) that
// the theme changed. localStorage's own "storage" event only fires in
// *other* tabs, never the tab that made the write, so we need this to make
// setStoredTheme's own tab re-render.
const THEME_CHANGE_EVENT = "ks-theme-change";

// Module-level cache so repeated reads (e.g. multiple ThemeToggle instances,
// or React re-rendering) don't keep hitting localStorage — read once, reuse.
let cachedTheme: Theme | null = null;

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

// Client-side snapshot getter for useSyncExternalStore. Falls back to the
// default theme if nothing (valid) is stored yet.
export function getStoredTheme(): Theme {
  if (cachedTheme) return cachedTheme;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  cachedTheme = isTheme(stored) ? stored : DEFAULT_THEME;
  return cachedTheme;
}

// Server-side snapshot for useSyncExternalStore. The server can't read
// localStorage, so it must return the same default the server-rendered HTML
// already assumes (see <html data-theme="dark"> in app/layout.tsx) — this is
// what keeps hydration from mismatching.
export function getServerTheme(): Theme {
  return DEFAULT_THEME;
}

// Writes the theme to localStorage, updates the <html> attribute the CSS
// tokens key off of, and notifies any subscribed components in this tab.
export function setStoredTheme(theme: Theme): void {
  cachedTheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

// Subscribe function for useSyncExternalStore — re-renders the calling
// component whenever setStoredTheme runs anywhere in the app.
export function subscribeToTheme(callback: () => void): () => void {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
}

// Inlined into <head> as a blocking <script> so the stored theme applies
// before first paint. Must stay a plain string (no imports, no template
// helpers) since it runs outside the React/module graph, directly in the
// browser, before any JS bundle has loaded.
export const NO_FLASH_THEME_SCRIPT = `(function(){try{var t=window.localStorage.getItem("${STORAGE_KEY}");if(t==="light"){document.documentElement.dataset.theme="light"}}catch(e){}})();`;
