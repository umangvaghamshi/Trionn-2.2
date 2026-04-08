"use client";

import { useRef, useCallback, useState, useEffect } from "react";

interface SmokeState {
  pulse: number;
  x: number;
}

interface UseGuitarSoundReturn {
  soundEnabled: boolean;
  toggleSound: () => Promise<void>;
  pluck: (freq: number, intensity: number) => void;
  smokeState: React.MutableRefObject<SmokeState>;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
}

export function useGuitarSound(): UseGuitarSoundReturn {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const smokeState = useRef<SmokeState>({ pulse: 0, x: 0.5 });

  const ensureAudio = useCallback((): AudioContext | null => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();

      // Create analyser for fog effect
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(audioCtxRef.current.destination);
      analyserRef.current = analyser;
    }
    if (
      audioCtxRef.current.state === "suspended" &&
      soundEnabledRef.current
    ) {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const toggleSound = useCallback(async () => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const next = !soundEnabledRef.current;
    soundEnabledRef.current = next;
    setSoundEnabled(next);
    try {
      if (next) {
        await ctx.resume();
      } else {
        await ctx.suspend();
      }
    } catch {
      // ignore
    }
  }, [ensureAudio]);

  const pluck = useCallback(
    (freq: number = 220, intensity: number = 0.35) => {
      const ctx = ensureAudio();
      if (!ctx || !soundEnabledRef.current || ctx.state !== "running") return;

      intensity = Math.max(0, Math.min(1, intensity));

      const peak = 0.03 + intensity * 0.1;
      const attack = 0.1 + intensity * 0.05;
      const sustain = 1.6 + intensity * 0.7;
      const release = 1.2;
      const now = ctx.currentTime;

      // Master gain envelope
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, now);
      out.gain.exponentialRampToValueAtTime(peak, now + attack);
      out.gain.exponentialRampToValueAtTime(peak * 0.82, now + attack + 0.22);
      out.gain.exponentialRampToValueAtTime(
        0.0001,
        now + sustain + release
      );

      // LFO vibrato
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(4.9, now);
      lfoGain.gain.setValueAtTime(0.18 + intensity * 0.25, now);
      lfo.connect(lfoGain);

      // Harmonic oscillators
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, now);
      lfoGain.connect(osc1.frequency);
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(1.0, now);

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2, now);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.1, now);

      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(freq * 3, now);
      const g3 = ctx.createGain();
      g3.gain.setValueAtTime(0.03, now);

      osc1.connect(g1);
      g1.connect(out);
      osc2.connect(g2);
      g2.connect(out);
      osc3.connect(g3);
      g3.connect(out);

      // Tone shaping filters
      const toneLP = ctx.createBiquadFilter();
      toneLP.type = "lowpass";
      toneLP.frequency.setValueAtTime(1800 + intensity * 800, now);

      const airHP = ctx.createBiquadFilter();
      airHP.type = "highpass";
      airHP.frequency.setValueAtTime(120, now);

      const body = ctx.createBiquadFilter();
      body.type = "peaking";
      body.frequency.setValueAtTime(700, now);
      body.Q.setValueAtTime(0.8, now);
      body.gain.setValueAtTime(1.2, now);

      // Echo/delay
      const delay = ctx.createDelay(1.0);
      delay.delayTime.setValueAtTime(0.14, now);

      const fb = ctx.createGain();
      fb.gain.setValueAtTime(0.0, now);
      fb.gain.linearRampToValueAtTime(0.32 + intensity * 0.12, now + 0.05);

      const echoLP = ctx.createBiquadFilter();
      echoLP.type = "lowpass";
      echoLP.frequency.setValueAtTime(1600, now);

      out.connect(airHP);
      airHP.connect(toneLP);
      toneLP.connect(body);
      body.connect(ctx.destination);
      body.connect(delay);
      delay.connect(echoLP);
      echoLP.connect(fb);
      fb.connect(delay);

      const wetGain = ctx.createGain();
      wetGain.gain.setValueAtTime(0.1 + intensity * 0.1, now);
      echoLP.connect(wetGain);
      wetGain.connect(ctx.destination);

      // Noise burst (pick attack)
      const noiseDur = 0.1;
      const nLen = Math.max(1, Math.floor(ctx.sampleRate * noiseDur));
      const nBuf = ctx.createBuffer(1, nLen, ctx.sampleRate);
      const nd = nBuf.getChannelData(0);
      for (let i = 0; i < nLen; i++)
        nd[i] = (Math.random() * 2 - 1) * 0.04 * (1 - i / nLen);

      const noise = ctx.createBufferSource();
      noise.buffer = nBuf;

      const nLP = ctx.createBiquadFilter();
      nLP.type = "lowpass";
      nLP.frequency.setValueAtTime(2200, now);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.0001, now);
      nGain.gain.exponentialRampToValueAtTime(
        0.018 + intensity * 0.02,
        now + 0.03
      );
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      noise.connect(nLP);
      nLP.connect(nGain);
      nGain.connect(out);

      // Start/stop
      const endTime = now + sustain + release + 0.05;
      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      osc1.stop(endTime);
      osc2.stop(endTime);
      osc3.stop(endTime);
      lfo.start(now);
      lfo.stop(endTime);
      noise.start(now);
      noise.stop(now + noiseDur);

      // Feed analyser for fog
      if (analyserRef.current) {
        try {
          out.connect(analyserRef.current);
        } catch {
          // ignore
        }
      }
    },
    [ensureAudio]
  );

  // Close AudioContext on unmount to release system audio resources
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
        analyserRef.current = null;
      }
    };
  }, []);

  return { soundEnabled, toggleSound, pluck, smokeState, analyserRef };
}
