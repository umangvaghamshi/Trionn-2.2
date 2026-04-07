"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

type Props = {
  /** Paste your SVG markup string here (the full <svg ...>...</svg>) */
  svgMarkup: string;

  /** Optional: make lines a bit thicker/thinner (default 0.6) */
  strokeWidth?: number;

  /** Optional: subtle wave amount (default hoverAmp 7 / clickAmp 11) */
  hoverAmp?: number;
  clickAmp?: number;

  /** Optional wrapper classes */
  className?: string;
};

type StringState = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  amp: number;
  phase: number;
  speed: number;
  cycles: number;
  note: number;
  intensity: number;
};

const DEFAULT_SCALE = [196, 220, 247, 294, 330, 392, 440, 494]; // G3..B4-ish

export default function FluteWaveSvg({
  svgMarkup,
  strokeWidth = 0.6,
  hoverAmp = 7,
  clickAmp = 11,
  className = "",
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [soundOn, setSoundOn] = useState(false);

  // --- WebAudio (dreamy flute) ---
  const audioRef = useRef<AudioContext | null>(null);

  const ensureAudio = () => {
    if (!audioRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      audioRef.current = new Ctx();
    }
    return audioRef.current;
  };

  const pluckFluteDreamy = (freq: number, intensity: number) => {
    const ctx = ensureAudio();
    if (!ctx) return;
    if (!soundOn) return;
    if (ctx.state !== "running") return;

    intensity = Math.max(0, Math.min(1, intensity));

    const peak = 0.03 + intensity * 0.1; // soft
    const attack = 0.1 + intensity * 0.05;
    const sustain = 1.6 + intensity * 0.7;
    const release = 1.2;

    const now = ctx.currentTime;

    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, now);
    out.gain.exponentialRampToValueAtTime(peak, now + attack);
    out.gain.exponentialRampToValueAtTime(peak * 0.82, now + attack + 0.22);
    out.gain.exponentialRampToValueAtTime(0.0001, now + sustain + release);

    // subtle vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(4.9, now);
    lfoGain.gain.setValueAtTime(0.18 + intensity * 0.25, now);
    lfo.connect(lfoGain);

    // mostly sine + gentle harmonics
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);
    lfoGain.connect(osc1.frequency);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, now);

    const osc3 = ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(freq * 3, now);

    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(1.0, now);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.1, now);

    const g3 = ctx.createGain();
    g3.gain.setValueAtTime(0.03, now);

    osc1.connect(g1);
    osc2.connect(g2);
    osc3.connect(g3);

    g1.connect(out);
    g2.connect(out);
    g3.connect(out);

    // warm tone shaping
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

    // dreamy echo
    const delay = ctx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.14, now);

    const fb = ctx.createGain();
    fb.gain.setValueAtTime(0.0, now);
    fb.gain.linearRampToValueAtTime(0.32 + intensity * 0.12, now + 0.05);

    const echoLP = ctx.createBiquadFilter();
    echoLP.type = "lowpass";
    echoLP.frequency.setValueAtTime(1600, now);

    const wetGain = ctx.createGain();
    wetGain.gain.setValueAtTime(0.1 + intensity * 0.1, now);

    out.connect(airHP);
    airHP.connect(toneLP);
    toneLP.connect(body);

    // dry
    body.connect(ctx.destination);

    // wet loop
    body.connect(delay);
    delay.connect(echoLP);
    echoLP.connect(fb);
    fb.connect(delay);
    echoLP.connect(wetGain);
    wetGain.connect(ctx.destination);

    // soft breath noise
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
      now + 0.03,
    );
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    noise.connect(nLP);
    nLP.connect(nGain);
    nGain.connect(out);

    // start/stop
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    lfo.start(now);
    noise.start(now);

    const stopAt = now + sustain + release + 0.06;
    osc1.stop(stopAt);
    osc2.stop(stopAt);
    osc3.stop(stopAt);
    lfo.stop(stopAt);
    noise.stop(now + noiseDur);
  };

  // --- Geometry helpers (work with ANY stroked path) ---
  const makeWavePath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    amp: number,
    phase: number,
    cycles: number,
  ) => {
    const segs = 26;
    const vx = x2 - x1;
    const vy = y2 - y1;
    const len = Math.hypot(vx, vy) || 1;

    const ux = vx / len;
    const uy = vy / len;

    const px = -uy;
    const py = ux;

    let d = `M ${x1.toFixed(3)} ${y1.toFixed(3)}`;
    for (let i = 1; i <= segs; i++) {
      const t = i / segs;
      const env = Math.sin(Math.PI * t);
      const wobble = Math.sin(Math.PI * 2 * (cycles * t) + phase);

      const ox = px * wobble * amp * env;
      const oy = py * wobble * amp * env;

      const x = x1 + vx * t + ox;
      const y = y1 + vy * t + oy;

      d += ` L ${x.toFixed(3)} ${y.toFixed(3)}`;
    }
    return d;
  };

  const parseFallbackEndpoints = (dRaw: string) => {
    const d = (dRaw || "").replace(/,/g, " ").trim();
    let m = d.match(/^M\s*([-\d.]+)\s*([-\d.]+)\s*H\s*([-\d.]+)\s*$/i);
    if (m) return { x1: +m[1], y1: +m[2], x2: +m[3], y2: +m[2] };
    m = d.match(/^M\s*([-\d.]+)\s*([-\d.]+)\s*V\s*([-\d.]+)\s*$/i);
    if (m) return { x1: +m[1], y1: +m[2], x2: +m[1], y2: +m[3] };
    m = d.match(/^M\s*([-\d.]+)\s*([-\d.]+)\s*L\s*([-\d.]+)\s*([-\d.]+)\s*$/i);
    if (m) return { x1: +m[1], y1: +m[2], x2: +m[3], y2: +m[4] };
    return null;
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Inject SVG markup
    mount.innerHTML = svgMarkup;

    const svg = mount.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;

    const paths = Array.from(svg.querySelectorAll("path"));
    const strings: Array<{ el: SVGPathElement; state: StringState }> = [];

    const hasStroke = (p: SVGPathElement) => {
      const strokeAttr = p.getAttribute("stroke");
      const strokeComputed = getComputedStyle(p).stroke;
      return (
        (strokeAttr && strokeAttr !== "none") ||
        (strokeComputed && strokeComputed !== "none")
      );
    };

    const getEndpoints = (p: SVGPathElement) => {
      try {
        const total = p.getTotalLength();
        if (isFinite(total) && total > 0) {
          const a = p.getPointAtLength(0);
          const b = p.getPointAtLength(total);
          return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
        }
      } catch {}
      return parseFallbackEndpoints(p.getAttribute("d") || "");
    };

    // Setup paths
    for (const p of paths) {
      if (!hasStroke(p)) continue;

      const ep = getEndpoints(p);
      if (!ep) continue;

      // keep SVG colors; just enforce width + caps + non-scaling
      p.style.fill = "none";
      p.style.strokeLinecap = (p.getAttribute("strokeLinecap") ||
        "round") as any;
      p.style.vectorEffect = (p.getAttribute("vector-effect") ||
        "non-scaling-stroke") as any;
      p.style.strokeWidth = `${strokeWidth}`;

      p.classList.add("tw-cursor-pointer");

      const i = strings.length;
      const intensity =
        i === 0 ? 0 : Math.pow(i / Math.max(1, paths.length - 1), 1.25);

      const state: StringState = {
        x1: ep.x1,
        y1: ep.y1,
        x2: ep.x2,
        y2: ep.y2,
        amp: 0,
        phase: 0,
        speed: 0,
        cycles: 2.2,
        note: DEFAULT_SCALE[i % DEFAULT_SCALE.length] * (i % 2 ? 1 : 0.5),
        intensity,
      };

      // Replace path to straight chord-based wave baseline (amp 0)
      p.setAttribute(
        "d",
        makeWavePath(
          state.x1,
          state.y1,
          state.x2,
          state.y2,
          0,
          0,
          state.cycles,
        ),
      );

      const onHover = () => {
        state.amp = hoverAmp;
        state.speed = 18;
        gsap.killTweensOf(state);
        gsap.to(state, { amp: 0, duration: 0.9, ease: "expo.out" });
        gsap.to(state, { speed: 0, duration: 0.9, ease: "expo.out" });
        pluckFluteDreamy(state.note, state.intensity);
      };

      const onClick = () => {
        state.amp = clickAmp;
        state.speed = 26;
        gsap.killTweensOf(state);
        gsap.to(state, { amp: 0, duration: 1.1, ease: "expo.out" });
        gsap.to(state, { speed: 0, duration: 1.1, ease: "expo.out" });
        pluckFluteDreamy(
          state.note * 1.01,
          Math.min(1, state.intensity + 0.12),
        );
      };

      p.addEventListener("mouseenter", onHover);
      p.addEventListener("click", onClick);

      // Bigger hit area with transparent clone (doesn't affect colors)
      const clone = p.cloneNode(true) as SVGPathElement;
      clone.setAttribute("stroke", "transparent");
      clone.style.strokeWidth = `${Math.max(12, strokeWidth * 18)}`;
      clone.setAttribute("pointer-events", "stroke");
      // keep d in sync
      const sync = () => clone.setAttribute("d", p.getAttribute("d") || "");
      sync();
      const obs = new MutationObserver(sync);
      obs.observe(p, { attributes: true, attributeFilter: ["d"] });

      clone.addEventListener("mouseenter", () =>
        p.dispatchEvent(new Event("mouseenter", { bubbles: true })),
      );
      clone.addEventListener("click", () =>
        p.dispatchEvent(new Event("click", { bubbles: true })),
      );

      p.parentNode?.insertBefore(clone, p.nextSibling);

      strings.push({ el: p, state });
    }

    const tick = () => {
      const dt = gsap.ticker.deltaRatio() / 60;
      for (const s of strings) {
        const st = s.state;
        if (st.amp > 0.02 || st.speed > 0.02) {
          st.phase += st.speed * dt;
          s.el.setAttribute(
            "d",
            makeWavePath(
              st.x1,
              st.y1,
              st.x2,
              st.y2,
              st.amp,
              st.phase,
              st.cycles,
            ),
          );
        }
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      // best-effort cleanup: remove injected svg
      mount.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgMarkup, strokeWidth, hoverAmp, clickAmp, soundOn]);

  const onToggleSound = async () => {
    const ctx = ensureAudio();
    if (!ctx) return;

    const next = !soundOn;
    setSoundOn(next);

    try {
      if (next) await ctx.resume();
      else await ctx.suspend();
    } catch {}
  };

  return (
    <div className={`relative ${className}`}>
      {/* Floating Sound Button */}
      <div className="tr__container relative">
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          className={[
            "w-full h-full max-w-10 max-h-10 rounded-full  cursor-pointer absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full flex items-center justify-center bg-[#D8D8D8]/20",
            soundOn ? " " : "",
          ].join(" ")}
        >
          {soundOn ? <SoundOffIcon /> : <SoundOnIcon />}
        </button>
      </div>
      <div className="w-full overflow-hidden" ref={mountRef} />
    </div>
  );
}

function SoundOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8"
    >
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke="#D8D8D8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 9l-6 6M17 9l6 6"
        stroke="#D8D8D8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8"
    >
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke="#D8D8D8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14"
        stroke="#D8D8D8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke="#D8D8D8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
