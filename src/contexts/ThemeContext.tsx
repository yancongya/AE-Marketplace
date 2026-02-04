import { createContext, useContext, type ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ isDark, children }: { isDark: boolean; children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
