'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface ScreenshotContextValue {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (value: boolean) => void;
}

const ScreenshotContext = createContext<ScreenshotContextValue | undefined>(undefined);

export function ScreenshotModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('screenshot-mode', enabled);
    }
  }, [enabled]);

  const value = useMemo(
    () => ({
      enabled,
      toggle: () => setEnabled((prev) => !prev),
      setEnabled
    }),
    [enabled]
  );

  return <ScreenshotContext.Provider value={value}>{children}</ScreenshotContext.Provider>;
}

export function useScreenshotMode() {
  const context = useContext(ScreenshotContext);
  if (!context) {
    throw new Error('useScreenshotMode deve ser usado dentro de ScreenshotModeProvider');
  }
  return context;
}
