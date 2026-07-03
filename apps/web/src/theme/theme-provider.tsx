"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "voyageai-theme",
}: {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey) as ThemeMode | null;
    const initialTheme = storedTheme ?? defaultTheme;
    setThemeState(initialTheme);

    const systemTheme = getSystemTheme();
    setResolvedTheme(initialTheme === "system" ? systemTheme : initialTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const nextSystemTheme = getSystemTheme();
      setResolvedTheme((current) => (theme === "system" ? nextSystemTheme : current));
      if (theme === "system") {
        applyTheme(nextSystemTheme);
      }
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [defaultTheme, storageKey, theme]);

  useEffect(() => {
    const nextResolvedTheme = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(nextResolvedTheme);
    applyTheme(nextResolvedTheme);
    window.localStorage.setItem(storageKey, theme);
  }, [storageKey, theme]);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      theme,
      resolvedTheme,
      setTheme: (nextTheme: ThemeMode) => {
        setThemeState(nextTheme);
      },
    };
  }, [resolvedTheme, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
