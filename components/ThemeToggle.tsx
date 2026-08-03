"use client";

import { useSyncExternalStore } from "react";
import { getServerTheme, getStoredTheme, setStoredTheme, subscribeToTheme } from "@/lib/theme";

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
      className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-text"
    >
      <span aria-hidden="true">{isDark ? "☾" : "☀"}</span>
    </button>
  );
}
