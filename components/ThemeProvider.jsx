"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const ThemeContext = createContext({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
  themes: ["light", "dark"],
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
  enableSystem = false,
  storageKey = "shophoria-theme",
}) {
  const [theme, setThemeState] = useState(defaultTheme);

  const applyThemeToDom = useCallback(
    (targetTheme) => {
      if (typeof document === "undefined") return;
      const root = document.documentElement;
      if (attribute === "class") {
        root.classList.remove("light", "dark");
        if (targetTheme === "dark" || targetTheme === "light") {
          root.classList.add(targetTheme);
        }
      } else {
        root.setAttribute(attribute, targetTheme);
      }
      root.style.colorScheme = targetTheme === "dark" ? "dark" : "light";
    },
    [attribute]
  );

  useEffect(() => {
    let initial = defaultTheme;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") {
        initial = saved;
      } else if (enableSystem && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        initial = "dark";
      }
    } catch (e) {}

    setThemeState(initial);
    applyThemeToDom(initial);

    const handleStorage = (event) => {
      if (event.key === storageKey && (event.newValue === "light" || event.newValue === "dark")) {
        setThemeState(event.newValue);
        applyThemeToDom(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme, enableSystem, storageKey, applyThemeToDom]);

  const setTheme = useCallback(
    (value) => {
      setThemeState((prev) => {
        const nextTheme = typeof value === "function" ? value(prev) : value;
        if (nextTheme !== "light" && nextTheme !== "dark") {
          return prev;
        }
        try {
          window.localStorage.setItem(storageKey, nextTheme);
        } catch (e) {}
        applyThemeToDom(nextTheme);
        return nextTheme;
      });
    },
    [storageKey, applyThemeToDom]
  );

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme,
      themes: ["light", "dark"],
    }),
    [theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
