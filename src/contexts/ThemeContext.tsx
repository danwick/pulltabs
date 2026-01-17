'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'default' | 'jackpot';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isJackpot: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('default');

  // Persist theme preference
  useEffect(() => {
    const saved = localStorage.getItem('pulltab-theme') as ThemeMode;
    if (saved && (saved === 'default' || saved === 'jackpot')) {
      setMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pulltab-theme', mode);

    // Apply theme class to document
    if (mode === 'jackpot') {
      document.documentElement.classList.add('jackpot-mode');
    } else {
      document.documentElement.classList.remove('jackpot-mode');
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, isJackpot: mode === 'jackpot' }}>
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
