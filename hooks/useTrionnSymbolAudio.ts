"use client";

import { useRef, useCallback } from "react";

const HOVER_BEEP_B64 =
  "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//vgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAYfABVVVVVVVVVVVVVVVVVVVVVVVVVf39/f39/f39/f39/f39/f39/f3+qqqqqqqqqqqqqqqqqqqqqqqqqqtXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAZ4AAAAAAAAGHyFxJ9i";

export function useTrionnSymbolAudio() {
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

  const loadBuffer = useCallback(
    (url: string, cb: (buf: AudioBuffer) => void) => {
      const ctx = getCtx();
      fetch(url)
        .then((r) => r.arrayBuffer())
        .then((ab) => ctx.decodeAudioData(ab))
        .then(cb)
        .catch((e) => console.warn("Audio load error", url, e));
    },
    [getCtx]
  );

  // Vibrate Sound
  const vibrateNoiseRef = useRef<ScriptProcessorNode | null>(null);
  const vibrateGainRef = useRef<GainNode | null>(null);

  const startVibrateSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    if (vibrateNoiseRef.current) return;
    const ctx = getCtx();
    const bufferSize = 4096;
    const noise = ctx.createScriptProcessor(bufferSize, 1, 1);
    let lastOut = 0;
    noise.onaudioprocess = (e) => {
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
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    vibrateNoiseRef.current = noise;
    vibrateGainRef.current = gain;
  }, [getCtx]);

  const stopVibrateSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!vibrateGainRef.current || !ctx) return;
    vibrateGainRef.current.gain.linearRampToValueAtTime(
      0,
      ctx.currentTime + 0.15
    );
    setTimeout(() => {
      if (vibrateNoiseRef.current) {
        vibrateNoiseRef.current.disconnect();
        vibrateNoiseRef.current = null;
      }
      vibrateGainRef.current = null;
    }, 200);
  }, []);

  // Explode (Glass Shatter) Sound
  const glassBufferRef = useRef<AudioBuffer | null>(null);
  const glassNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const glassGainRef = useRef<GainNode | null>(null);

  const playExplodeSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    const doPlay = (buf: AudioBuffer) => {
      const ctx = getCtx();
      if (glassNodeRef.current) {
        try {
          glassNodeRef.current.stop();
        } catch (_) {}
        glassNodeRef.current = null;
      }
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.9, ctx.currentTime);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
      glassNodeRef.current = src;
      glassGainRef.current = gain;
      src.onended = () => {
        glassNodeRef.current = null;
        glassGainRef.current = null;
      };
    };
    if (glassBufferRef.current) {
      doPlay(glassBufferRef.current);
    } else {
      loadBuffer("/sounds/glass-shatter.mp3", (buf) => {
        glassBufferRef.current = buf;
        doPlay(buf);
      });
    }
  }, [getCtx, loadBuffer]);

  const stopExplodeSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!glassGainRef.current || !ctx) return;
    glassGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    setTimeout(() => {
      if (glassNodeRef.current) {
        try {
          glassNodeRef.current.stop();
        } catch (_) {}
        glassNodeRef.current = null;
      }
      glassGainRef.current = null;
    }, 150);
  }, []);

  // Join Sound
  const joinBufferRef = useRef<AudioBuffer | null>(null);
  const playJoinSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    const doPlay = (buf: AudioBuffer) => {
      const ctx = getCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    };
    if (joinBufferRef.current) {
      doPlay(joinBufferRef.current);
    } else {
      loadBuffer("/sounds/join-zoom.mp3", (buf) => {
        joinBufferRef.current = buf;
        doPlay(buf);
      });
    }
  }, [getCtx, loadBuffer]);

  // Woosh Sound
  const wooshBufferRef = useRef<AudioBuffer | null>(null);
  const wooshNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const wooshGainRef = useRef<GainNode | null>(null);
  const wooshStartingRef = useRef(false);
  const wooshAutoStartedRef = useRef(false);

  const startWooshSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    const ctx = getCtx();
    if (wooshNodeRef.current && wooshGainRef.current) {
      wooshGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
      wooshGainRef.current.gain.setValueAtTime(
        wooshGainRef.current.gain.value,
        ctx.currentTime
      );
      wooshGainRef.current.gain.linearRampToValueAtTime(
        0.7,
        ctx.currentTime + 0.8
      );
      return;
    }
    if (wooshStartingRef.current) return;
    wooshStartingRef.current = true;
    const doStart = (buf: AudioBuffer) => {
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
    };
    if (wooshBufferRef.current) {
      doStart(wooshBufferRef.current);
    } else {
      loadBuffer("/sounds/woosh-loop.mp3", (buf) => {
        wooshBufferRef.current = buf;
        doStart(buf);
      });
    }
  }, [getCtx, loadBuffer]);

  const stopWooshSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!wooshGainRef.current || !wooshNodeRef.current || !ctx) return;
    wooshGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
    wooshGainRef.current.gain.setValueAtTime(
      wooshGainRef.current.gain.value,
      ctx.currentTime
    );
    wooshGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => {
      if (wooshNodeRef.current) {
        try {
          wooshNodeRef.current.stop();
        } catch (_) {}
        wooshNodeRef.current = null;
      }
      wooshGainRef.current = null;
      // Reset so woosh can restart when the user scrolls back to this section
      wooshAutoStartedRef.current = false;
    }, 1600);
  }, []);

  const autoStartWoosh = useCallback(() => {
    if (wooshAutoStartedRef.current) return;
    wooshAutoStartedRef.current = true;
    const doStart = (buf: AudioBuffer) => {
      const ctx2 = getCtx();
      const gain = ctx2.createGain();
      gain.gain.setValueAtTime(0, ctx2.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ctx2.currentTime + 2.0);
      const src = ctx2.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(gain);
      gain.connect(ctx2.destination);
      src.start();
      wooshNodeRef.current = src;
      wooshGainRef.current = gain;
    };
    if (wooshBufferRef.current) {
      doStart(wooshBufferRef.current);
    } else {
      loadBuffer("/sounds/woosh-loop.mp3", (buf) => {
        wooshBufferRef.current = buf;
        doStart(buf);
      });
    }
  }, [getCtx, loadBuffer]);

  // Spark Sound
  const sparkAudioCtxRef = useRef<AudioContext | null>(null);
  const sparkBufferRef = useRef<AudioBuffer | null>(null);
  const sparkGainRef = useRef<GainNode | null>(null);
  const sparkReadyRef = useRef(false);
  const sparkCooldownRef = useRef(0);

  const initSparkAudio = useCallback(() => {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    sparkAudioCtxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = 1.0;
    gain.connect(ctx.destination);
    sparkGainRef.current = gain;
    fetch("/sounds/spark.mp3")
      .then((r) => r.arrayBuffer())
      .then((ab) => ctx.decodeAudioData(ab))
      .then((buf) => {
        sparkBufferRef.current = buf;
        sparkReadyRef.current = true;
      })
      .catch((e) => console.warn("WeldFX spark audio error", e));
  }, []);

  const playSparkSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    if (!sparkReadyRef.current || sparkCooldownRef.current > 0) return;
    if (!sparkAudioCtxRef.current) return;
    if (sparkAudioCtxRef.current.state === "suspended")
      sparkAudioCtxRef.current.resume();
    try {
      const src = sparkAudioCtxRef.current.createBufferSource();
      src.buffer = sparkBufferRef.current!;
      src.playbackRate.value = 0.75 + Math.random() * 0.5;
      src.connect(sparkGainRef.current!);
      src.start(0);
      sparkCooldownRef.current = 0.08 + Math.random() * 0.07;
    } catch (_) {}
  }, []);

  // Hover Beep Sound
  const hoverAudioCtxRef = useRef<AudioContext | null>(null);
  const hoverBufferRef = useRef<AudioBuffer | null>(null);

  const initHoverAudio = useCallback(() => {
    try {
      const hCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      hoverAudioCtxRef.current = hCtx;
      fetch("/sounds/hover-beep.mp3")
        .then((r) => r.arrayBuffer())
        .then((ab) => hCtx.decodeAudioData(ab))
        .then((buf) => {
          hoverBufferRef.current = buf;
        })
        .catch(() => {
          const bin = atob(HOVER_BEEP_B64);
          const ab = new ArrayBuffer(bin.length);
          const u8 = new Uint8Array(ab);
          for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
          hCtx.decodeAudioData(ab.slice(0)).then((b) => {
            hoverBufferRef.current = b;
          });
        });
    } catch (_) {}
  }, []);

  const playHoverBeep = useCallback(() => {
    if (
      !soundEnabledRef.current ||
      !hoverBufferRef.current ||
      !hoverAudioCtxRef.current
    )
      return;
    try {
      const src = hoverAudioCtxRef.current.createBufferSource();
      const gain = hoverAudioCtxRef.current.createGain();
      src.buffer = hoverBufferRef.current;
      src.connect(gain);
      gain.connect(hoverAudioCtxRef.current.destination);
      gain.gain.setValueAtTime(0.7, hoverAudioCtxRef.current.currentTime);
      src.start();
    } catch (_) {}
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    soundEnabledRef.current = enabled;
  }, []);

  const stopAllSounds = useCallback(() => {
    stopVibrateSound();
    stopWooshSound();
    stopExplodeSound();
  }, [stopVibrateSound, stopWooshSound, stopExplodeSound]);

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
    autoStartWoosh,
    playSparkSound,
    playHoverBeep,
    initSparkAudio,
    initHoverAudio,
    stopAllSounds,
    sparkCooldownRef,
    wooshGainRef,
    audioCtxRef,
    wooshNodeRef,
    wooshAutoStartedRef,
  };
}
