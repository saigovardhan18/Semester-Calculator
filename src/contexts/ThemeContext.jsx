import { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, setTheme as saveTheme } from '../db/settings';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load saved theme
    getTheme().then(saved => {
      if (saved) setThemeState(saved);
    });
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      let dark = false;
      if (theme === 'dark') dark = true;
      else if (theme === 'system') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    await saveTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
