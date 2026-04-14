"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SiteSoundContextValue = {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
};

const SiteSoundContext = createContext<SiteSoundContextValue | null>(null);

export function SiteSoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const toggleSound = useCallback(() => {
    setSoundEnabled((s) => !s);
  }, []);
  const value = useMemo(
    () => ({ soundEnabled, setSoundEnabled, toggleSound }),
    [soundEnabled, toggleSound],
  );
  return (
    <SiteSoundContext.Provider value={value}>{children}</SiteSoundContext.Provider>
  );
}

export function useSiteSound() {
  const ctx = useContext(SiteSoundContext);
  if (!ctx) {
    throw new Error("useSiteSound must be used within SiteSoundProvider");
  }
  return ctx;
}
