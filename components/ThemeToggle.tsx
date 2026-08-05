"use client";

import { useSyncExternalStore } from "react";
import { getServerTheme, getStoredTheme, setStoredTheme, subscribeToTheme } from "@/lib/theme";

// Dark/light toggle button.
//
// Uses useSyncExternalStore (not useEffect+useState) to read the theme from
// localStorage — this is the React-recommended way to bridge an external,
// mutable data source into a component: it takes a subscribe function, a
// client snapshot getter, and a server snapshot getter, and keeps them in
// sync without the "flash of default state, then correct itself" pattern
// (or the react-hooks/set-state-in-effect lint error) that useEffect would
// produce here.
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
      {/* Icon is decorative — the button's aria-label carries the meaning */}
      <span aria-hidden="true">{isDark ? "☾" : "☀"}</span>
    </button>
  );
}
