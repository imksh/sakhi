import { create } from "zustand";
import { persist } from "zustand/middleware";

const lightColors = {
  bg: "#f8fafc",
  surface: "#ffffff",
  text: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  shadow: "#000000",
};

const darkColors = {
  bg: "#0f172a",
  surface: "#1e293b",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#334155",
  primary: "#60a5fa",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#f87171",
  shadow: "#000000",
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light",
      colors: lightColors,

      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({
          theme: next,
          colors: next === "light" ? lightColors : darkColors,
        });
      },

      setTheme: (theme) => {
        set({
          theme,
          colors: theme === "light" ? lightColors : darkColors,
        });
      },
    }),
    {
      name: "theme",
    }
  )
);