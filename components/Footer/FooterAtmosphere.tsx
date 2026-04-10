"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

export type FooterAtmosphereValue = {
  pulseSmoke: (amount: number) => void;
  setAudioContext: (ctx: AudioContext | null) => void;
  getSmokeAnalyser: (ctx: AudioContext) => AnalyserNode | null;
  audioContextRef: React.MutableRefObject<AudioContext | null>;
  smokePulseRef: React.MutableRefObject<number>;
};

const FooterAtmosphereContext = createContext<FooterAtmosphereValue | null>(
  null,
);

export function useFooterAtmosphere(): FooterAtmosphereValue {
  const v = useContext(FooterAtmosphereContext);
  if (!v) {
    throw new Error("useFooterAtmosphere must be used within FooterAtmosphereProvider");
  }
  return v;
}

export function FooterAtmosphereProvider({ children }: { children: ReactNode }) {
  const smokePulseRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const pulseSmoke = useCallback((amount: number) => {
    smokePulseRef.current = Math.min(1, smokePulseRef.current + amount);
  }, []);

  const setAudioContext = useCallback((ctx: AudioContext | null) => {
    audioCtxRef.current = ctx;
  }, []);

  const getSmokeAnalyser = useCallback((ctx: AudioContext): AnalyserNode | null => {
    if (analyserRef.current) return analyserRef.current;
    try {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      return analyser;
    } catch {
      return null;
    }
  }, []);

  const value = useMemo(
    () =>
      ({
        pulseSmoke,
        setAudioContext,
        getSmokeAnalyser,
        audioContextRef: audioCtxRef,
        smokePulseRef,
      }) satisfies FooterAtmosphereValue,
    [pulseSmoke, setAudioContext, getSmokeAnalyser],
  );

  return (
    <FooterAtmosphereContext.Provider value={value}>
      {children}
    </FooterAtmosphereContext.Provider>
  );
}
