"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

  // Track latest value in a ref so the effect below only registers once
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);

  // Whether sound was on before the FIRST transition start in a chain of navigations
  // Only updated on transition:start if sound is currently on — prevents rapid
  // back-to-back navigations from overwriting the saved value with false
  const soundBeforeTransitionRef = useRef(false);

  useEffect(() => {
    const onStart = () => {
      if (soundEnabledRef.current) {
        soundBeforeTransitionRef.current = true;
      }
      setSoundEnabled(false);
    };
    const onComplete = () => {
      if (soundBeforeTransitionRef.current) {
        soundBeforeTransitionRef.current = false;
        setSoundEnabled(true);
      }
    };
    window.addEventListener("trionn-transition:start", onStart);
    window.addEventListener("trionn-transition:complete", onComplete);
    return () => {
      window.removeEventListener("trionn-transition:start", onStart);
      window.removeEventListener("trionn-transition:complete", onComplete);
    };
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
