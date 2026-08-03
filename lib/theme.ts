export type Theme = "dark" | "light";

const STORAGE_KEY = "ks-theme-v1";
const DEFAULT_THEME: Theme = "dark";
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

// Inlined into <head> as a blocking script so the stored theme applies
// before first paint. Must stay a plain string (no imports) since it
// runs outside the React/module graph.
export const NO_FLASH_THEME_SCRIPT = `(function(){try{var t=window.localStorage.getItem("${STORAGE_KEY}");if(t==="light"){document.documentElement.dataset.theme="light"}}catch(e){}})();`;
