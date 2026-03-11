import { create } from "zustand";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const THEME_STORAGE_KEY = "irkekzn_administration_theme";

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "light" || value === "dark";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (isThemeMode(savedTheme)) {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const saveTheme = (theme: ThemeMode): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const useThemeState = create<ThemeState>()((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";

    saveTheme(nextTheme);
    set({ theme: nextTheme });
  },
  setTheme: (theme) => {
    saveTheme(theme);
    set({ theme });
  },
}));
