"use client";

import { useRef, useCallback } from "react";

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(false);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
    }
    return audioCtxRef.current;
  }, []);

  const vibrateNoiseRef = useRef<ScriptProcessorNode | null>(null);
  const vibrateGainRef = useRef<GainNode | null>(null);

  const startVibrateSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    const ctx = getCtx();
    if (vibrateNoiseRef.current) return;
    const bufferSize = 4096;
    const node = ctx.createScriptProcessor(bufferSize, 1, 1);
    let lastOut = 0;
    node.onaudioprocess = (e) => {
      const out = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        out[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = out[i];
        out[i] *= 3.5;
      }
    };
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 80;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.1);
    node.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    vibrateNoiseRef.current = node;
    vibrateGainRef.current = gain;
  }, [getCtx]);

  const stopVibrateSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!vibrateGainRef.current || !ctx) return;
    vibrateGainRef.current.gain.linearRampToValueAtTime(
      0,
      ctx.currentTime + 0.15,
    );
    setTimeout(() => {
      vibrateNoiseRef.current?.disconnect();
      vibrateNoiseRef.current = null;
      vibrateGainRef.current = null;
    }, 200);
  }, []);

  const glassBufferRef = useRef<AudioBuffer | null>(null);
  const glassNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const glassGainRef = useRef<GainNode | null>(null);

  const loadGlass = useCallback(
    (cb: (buf: AudioBuffer) => void) => {
      if (glassBufferRef.current) {
        cb(glassBufferRef.current);
        return;
      }
      const ctx = getCtx();
      fetch("/audio/glass-shatter.mp3")
        .then((r) => r.arrayBuffer())
        .then((ab) => ctx.decodeAudioData(ab))
        .then((buf) => {
          glassBufferRef.current = buf;
          cb(buf);
        })
        .catch(() => {});
    },
    [getCtx],
  );

  const playExplodeSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    loadGlass((buf) => {
      const ctx = getCtx();
      if (glassNodeRef.current) {
        try {
          glassNodeRef.current.stop();
        } catch (e) {}
        glassNodeRef.current = null;
      }
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.9, ctx.currentTime);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
      src.onended = () => {
        glassNodeRef.current = null;
        glassGainRef.current = null;
      };
      glassNodeRef.current = src;
      glassGainRef.current = gain;
    });
  }, [loadGlass, getCtx]);

  const stopExplodeSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!glassGainRef.current || !ctx) return;
    glassGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    setTimeout(() => {
      try {
        glassNodeRef.current?.stop();
      } catch (e) {}
      glassNodeRef.current = null;
      glassGainRef.current = null;
    }, 150);
  }, []);

  const joinBufferRef = useRef<AudioBuffer | null>(null);
  const loadJoin = useCallback(
    (cb: (buf: AudioBuffer) => void) => {
      if (joinBufferRef.current) {
        cb(joinBufferRef.current);
        return;
      }
      const ctx = getCtx();
      fetch("/audio/join-zoom.mp3")
        .then((r) => r.arrayBuffer())
        .then((ab) => ctx.decodeAudioData(ab))
        .then((buf) => {
          joinBufferRef.current = buf;
          cb(buf);
        })
        .catch(() => {});
    },
    [getCtx],
  );

  const playJoinSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    loadJoin((buf) => {
      const ctx = getCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    });
  }, [loadJoin, getCtx]);

  const wooshBufferRef = useRef<AudioBuffer | null>(null);
  const wooshNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const wooshGainRef = useRef<GainNode | null>(null);
  const wooshStartingRef = useRef(false);

  const loadWoosh = useCallback(
    (cb: (buf: AudioBuffer) => void) => {
      if (wooshBufferRef.current) {
        cb(wooshBufferRef.current);
        return;
      }
      const ctx = getCtx();
      fetch("/audio/woosh-loop.mp3")
        .then((r) => r.arrayBuffer())
        .then((ab) => ctx.decodeAudioData(ab))
        .then((buf) => {
          wooshBufferRef.current = buf;
          cb(buf);
        })
        .catch(() => {});
    },
    [getCtx],
  );

  const startWooshSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    const ctx = getCtx();
    if (wooshNodeRef.current && wooshGainRef.current) {
      wooshGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
      wooshGainRef.current.gain.setValueAtTime(
        wooshGainRef.current.gain.value,
        ctx.currentTime,
      );
      wooshGainRef.current.gain.linearRampToValueAtTime(
        0.7,
        ctx.currentTime + 0.8,
      );
      return;
    }
    if (wooshStartingRef.current) return;
    wooshStartingRef.current = true;
    loadWoosh((buf) => {
      wooshStartingRef.current = false;
      const ctx2 = getCtx();
      const gain = ctx2.createGain();
      gain.gain.setValueAtTime(0, ctx2.currentTime);
      gain.gain.linearRampToValueAtTime(0.7, ctx2.currentTime + 0.8);
      const src = ctx2.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(gain);
      gain.connect(ctx2.destination);
      src.start();
      wooshNodeRef.current = src;
      wooshGainRef.current = gain;
    });
  }, [getCtx, loadWoosh]);

  const stopWooshSound = useCallback(() => {
    if (!wooshGainRef.current || !wooshNodeRef.current) return;
    const ctx = getCtx();
    wooshGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
    wooshGainRef.current.gain.setValueAtTime(
      wooshGainRef.current.gain.value,
      ctx.currentTime,
    );
    wooshGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => {
      try {
        wooshNodeRef.current?.stop();
      } catch (e) {}
      wooshNodeRef.current = null;
      wooshGainRef.current = null;
    }, 1600);
  }, [getCtx]);

  const hoverCtxRef = useRef<AudioContext | null>(null);
  const hoverBufferRef = useRef<AudioBuffer | null>(null);

  const initHoverBeep = useCallback(() => {
    fetch("/audio/hover-beep.mp3")
      .then((r) => r.arrayBuffer())
      .then((ab) => {
        const ctx = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        )();
        hoverCtxRef.current = ctx;
        return ctx.decodeAudioData(ab);
      })
      .then((buf) => {
        hoverBufferRef.current = buf;
      })
      .catch(() => {});
  }, []);

  const playHoverBeep = useCallback(() => {
    if (
      !soundEnabledRef.current ||
      !hoverBufferRef.current ||
      !hoverCtxRef.current
    )
      return;
    try {
      const src = hoverCtxRef.current.createBufferSource();
      const gain = hoverCtxRef.current.createGain();
      src.buffer = hoverBufferRef.current;
      src.connect(gain);
      gain.connect(hoverCtxRef.current.destination);
      gain.gain.setValueAtTime(0.7, hoverCtxRef.current.currentTime);
      src.start();
    } catch (e) {}
  }, []);

  const stopAllSounds = useCallback(() => {
    stopVibrateSound();
    stopWooshSound();
    stopExplodeSound();
  }, [stopVibrateSound, stopWooshSound, stopExplodeSound]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    soundEnabledRef.current = enabled;
  }, []);

  return {
    soundEnabledRef,
    setSoundEnabled,
    startVibrateSound,
    stopVibrateSound,
    playExplodeSound,
    stopExplodeSound,
    playJoinSound,
    startWooshSound,
    stopWooshSound,
    playHoverBeep,
    initHoverBeep,
    stopAllSounds,
  };
}
