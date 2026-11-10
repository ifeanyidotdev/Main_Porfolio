import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type StoredColorScheme = 'light' | 'dark' | null;
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  storedScheme: StoredColorScheme;
  systemScheme: ResolvedTheme;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
  setScheme: (scheme: StoredColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemScheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialStoredScheme(): StoredColorScheme {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem('color-scheme');
    if (val === 'light' || val === 'dark') return val;
  } catch {
    // Ignore storage errors
  }
  return null;
}

function syncMetaTag(scheme: StoredColorScheme) {
  if (typeof document === 'undefined') return;
  let meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'color-scheme';
    document.head.prepend(meta);
  }
  meta.content = scheme ?? 'light dark';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedScheme, setStoredScheme] = useState<StoredColorScheme>(getInitialStoredScheme);
  const [systemScheme, setSystemScheme] = useState<ResolvedTheme>(getSystemScheme);

  const resolvedTheme: ResolvedTheme = storedScheme ?? systemScheme;

  useEffect(() => {
    syncMetaTag(storedScheme);
  }, [storedScheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      // Update system scheme without removing stored override
      setSystemScheme(e.matches ? 'dark' : 'light');
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'color-scheme') {
        const next = e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : null;
        setStoredScheme(next);
        syncMetaTag(next);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setScheme = useCallback((target: StoredColorScheme) => {
    const currentSys = getSystemScheme();
    // If target is null or matches current system preference when toggling, revert to system
    if (target === null) {
      try {
        localStorage.removeItem('color-scheme');
      } catch {
        // Ignore storage errors
      }
      setStoredScheme(null);
      syncMetaTag(null);
      return;
    }

    try {
      localStorage.setItem('color-scheme', target);
    } catch {
      // Ignore storage errors
    }
    setStoredScheme(target);
    syncMetaTag(target);
    setSystemScheme(currentSys);
  }, []);

  // Two-state toggle logic following modern-web-guidance `dark-mode-toggle`:
  // 1. Target = opposite of currently rendered scheme.
  // 2. If target differs from current system preference, store literally.
  // 3. If target matches current system preference, remove stored value and set meta to "light dark".
  const toggleTheme = useCallback(() => {
    const currentSys = getSystemScheme();
    const currentRendered: ResolvedTheme = storedScheme ?? currentSys;
    const target: ResolvedTheme = currentRendered === 'dark' ? 'light' : 'dark';

    if (target === currentSys) {
      try {
        localStorage.removeItem('color-scheme');
      } catch {
        // Ignore storage errors
      }
      setStoredScheme(null);
      syncMetaTag(null);
    } else {
      try {
        localStorage.setItem('color-scheme', target);
      } catch {
        // Ignore storage errors
      }
      setStoredScheme(target);
      syncMetaTag(target);
    }
  }, [storedScheme]);

  return (
    <ThemeContext.Provider
      value={{
        storedScheme,
        systemScheme,
        resolvedTheme,
        toggleTheme,
        setScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
