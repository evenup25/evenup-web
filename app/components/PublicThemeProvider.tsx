"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type PublicTheme = "light" | "dark";

type PublicThemeContextValue = {
  theme: PublicTheme;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "evenup-public-theme";

const PublicThemeContext = createContext<PublicThemeContextValue | null>(null);

function getPreferredTheme(): PublicTheme {
  if (typeof window === "undefined") return "light";

  const documentTheme = document.documentElement.dataset.theme;
  if (documentTheme === "light" || documentTheme === "dark") return documentTheme;

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: PublicTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function PublicThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<PublicTheme>(() => getPreferredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange(event: MediaQueryListEvent) {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark") return;

      const nextTheme = event.matches ? "dark" : "light";
      setTheme(nextTheme);
      applyTheme(nextTheme);
    }

    media.addEventListener("change", handleSystemThemeChange);
    return () => media.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const value = useMemo<PublicThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((currentTheme) => {
          const nextTheme = currentTheme === "dark" ? "light" : "dark";
          window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
          applyTheme(nextTheme);
          return nextTheme;
        });
      },
    }),
    [theme]
  );

  return <PublicThemeContext.Provider value={value}>{children}</PublicThemeContext.Provider>;
}

export function usePublicTheme() {
  const context = useContext(PublicThemeContext);
  if (!context) {
    throw new Error("usePublicTheme must be used within PublicThemeProvider");
  }

  return context;
}
