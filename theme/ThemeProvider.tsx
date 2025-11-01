import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "app_theme_preference";

const ThemeContext = createContext<{
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}>({
  theme: "system",
  resolved: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  // read stored preference
  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEY);
        if (v === "light" || v === "dark" || v === "system") setThemeState(v);
      } catch (e) {
        console.warn("failed to load theme pref", e);
      }
    })();
  }, []);

  // subscribe to system scheme (nativewind or RN useColorScheme can be used externally).
  // We'll use window.matchMedia-like fallback - but easiest: use React Native's Appearance.
  useEffect(() => {
    // lazy import to avoid SSR issues
    const { Appearance } = require("react-native");
    const update = () => {
      const system = Appearance.getColorScheme() === "dark" ? "dark" : "light";
      setResolved(theme === "system" ? system : theme);
    };
    update();
    const sub = Appearance.addChangeListener(() => update());
    return () => sub.remove();
  }, [theme]);

  // persist any theme change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        console.warn("failed to save theme pref", e);
      }
    })();
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((s) => (s === "dark" ? "light" : "dark"));

  const ctx = useMemo(() => ({ theme, resolved, setTheme, toggleTheme }), [theme, resolved]);

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
