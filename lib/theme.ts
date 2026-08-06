// Theme (dark/light) persistence. Components read and write through
// useSyncExternalStore (see components/ThemeToggle.tsx) rather than
// useEffect + useState, which would cause a hydration mismatch here.

export type Theme = "dark" | "light";

// Versioned so a future change to the stored shape can invalidate old values.
const STORAGE_KEY = "ks-theme-v1";
// Light is the default. Changing it means changing three other places or a
// returning visitor sees a flash of the wrong theme: the bare :root token block
// in app/globals.css, <html data-theme> in app/layout.tsx, and the theme
// NO_FLASH_THEME_SCRIPT checks for at the bottom of this file.
const DEFAULT_THEME: Theme = "light";
// localStorage's own "storage" event only fires in *other* tabs, so same-tab
// subscribers need this custom event to re-render.
const THEME_CHANGE_EVENT = "ks-theme-change";

let cachedTheme: Theme | null = null;

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

export function getStoredTheme(): Theme {
  if (cachedTheme) return cachedTheme;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  cachedTheme = isTheme(stored) ? stored : DEFAULT_THEME;
  return cachedTheme;
}

// Server snapshot for useSyncExternalStore. Must match what the server-rendered
// HTML assumes (<html data-theme="light">) or hydration mismatches.
export function getServerTheme(): Theme {
  return DEFAULT_THEME;
}

export function setStoredTheme(theme: Theme): void {
  cachedTheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function subscribeToTheme(callback: () => void): () => void {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
}

// Inlined into <head> as a blocking script so the stored theme applies before
// first paint. Must stay a plain string — it runs before any bundle loads.
// Only "dark" needs handling, since the server already renders light; flip this
// and DEFAULT_THEME together or neither.
export const NO_FLASH_THEME_SCRIPT = `(function(){try{var t=window.localStorage.getItem("${STORAGE_KEY}");if(t==="dark"){document.documentElement.dataset.theme="dark"}}catch(e){}})();`;
