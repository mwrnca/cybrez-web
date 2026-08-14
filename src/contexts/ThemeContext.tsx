import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function ThemeProvider({
  children,
}: Props) {
  const [theme, setThemeState] =
    useState<Theme>("dark");

  function setTheme(theme: Theme) {
    setThemeState(theme);
    localStorage.setItem(
      "cybrez-theme",
      theme
    );
  }

  function toggleTheme() {
    setTheme(
      theme === "dark"
        ? "light"
        : "dark"
    );
  }

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "cybrez-theme"
      ) as Theme | null;

    if (
      saved === "dark" ||
      saved === "light"
    ) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}