"use client";

import { useSyncExternalStore } from "react";
import { getServerTheme, getStoredTheme, setStoredTheme, subscribeToTheme } from "@/lib/theme";

// Dark/light toggle. Reads localStorage through useSyncExternalStore rather
// than useEffect + useState, which would flash the default theme first.
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getStoredTheme, getServerTheme);
  const isDark = theme === "dark";

  const handleToggle = () => {
    setStoredTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!isDark}
      className="hover-grow flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary hover:border-accent hover:text-accent-text"
    >
      <span aria-hidden="true">{isDark ? "☾" : "☀"}</span>
    </button>
  );
}
