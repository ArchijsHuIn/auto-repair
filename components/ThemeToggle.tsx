"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Initialize from document dataset (set by layout script) on mount
  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || null;
    setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = (theme === "dark" ? "light" : "dark") as Theme;
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        borderColor: "var(--accent)",
      }}
    >
      <span className="inline-block" aria-hidden>
        {isDark ? "🌙" : "☀️"}
      </span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
