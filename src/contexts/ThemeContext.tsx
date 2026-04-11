import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeMode = "white" | "dark" | null;

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  hasChosen: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  setTheme: () => {},
  hasChosen: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("lumière-theme");
    return saved === "white" || saved === "dark" ? saved : null;
  });

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    if (t) localStorage.setItem("lumière-theme", t);
    else localStorage.removeItem("lumière-theme");
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dark");
    if (theme === "dark") root.classList.add("theme-dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, hasChosen: theme !== null }}>
      {children}
    </ThemeContext.Provider>
  );
};
