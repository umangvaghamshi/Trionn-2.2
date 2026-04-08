"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface StringEndpoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface StringState extends StringEndpoints {
  amp: number;
  phase: number;
  speed: number;
  cycles: number;
  note: number;
  intensity: number;
}

interface GuitarStringEntry {
  el: SVGPathElement;
  state: StringState;
}

const SCALE = [196, 220, 247, 294, 330, 392, 440, 494];

function parseStraightPathD(d: string): StringEndpoints | null {
  const clean = d.replace(/,/g, " ").trim();
  const num = (v: string) => parseFloat(v);

  let m = clean.match(/^M\s*([-\d.]+)\s*([-\d.]+)\s*H\s*([-\d.]+)\s*$/i);
  if (m) return { x1: num(m[1]), y1: num(m[2]), x2: num(m[3]), y2: num(m[2]) };

  m = clean.match(/^M\s*([-\d.]+)\s*([-\d.]+)\s*V\s*([-\d.]+)\s*$/i);
  if (m) return { x1: num(m[1]), y1: num(m[2]), x2: num(m[1]), y2: num(m[3]) };

  m = clean.match(
    /^M\s*([-\d.]+)\s*([-\d.]+)\s*L\s*([-\d.]+)\s*([-\d.]+)\s*$/i
  );
  if (m) return { x1: num(m[1]), y1: num(m[2]), x2: num(m[3]), y2: num(m[4]) };

  return null;
}

function makeWavePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  amp: number,
  phase: number,
  cycles: number
): string {
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
    d += ` L ${(x1 + vx * t + ox).toFixed(3)} ${(y1 + vy * t + oy).toFixed(3)}`;
  }
  return d;
}

interface UseGuitarStringsOptions {
  pluck: (freq: number, intensity: number) => void;
  smokeState: React.MutableRefObject<{ pulse: number; x: number }>;
}

export function useGuitarStrings(
  svgRef: React.RefObject<SVGSVGElement | null>,
  { pluck, smokeState }: UseGuitarStringsOptions
) {
  const stringsRef = useRef<GuitarStringEntry[]>([]);

  const setupStrings = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const pathEls = Array.from(svg.querySelectorAll("path"));
    const strings: GuitarStringEntry[] = [];

    pathEls.forEach((p, idx) => {
      const stroke = p.getAttribute("stroke");
      if (!stroke) return;

      const info = parseStraightPathD(p.getAttribute("d") || "");
      if (!info) return;

      p.classList.add("guitar-string");
      p.setAttribute("fill", "none");
      if (!p.getAttribute("stroke-linecap"))
        p.setAttribute("stroke-linecap", "round");
      if (!p.getAttribute("vector-effect"))
        p.setAttribute("vector-effect", "non-scaling-stroke");

      const i = strings.length;
      const intensity =
        i === 0 ? 0 : Math.pow(i / Math.max(1, pathEls.length - 1), 1.25);

      const state: StringState = {
        x1: info.x1,
        y1: info.y1,
        x2: info.x2,
        y2: info.y2,
        amp: 0,
        phase: 0,
        speed: 0,
        cycles: 2.2,
        note: SCALE[strings.length % SCALE.length] * (strings.length % 2 ? 1 : 0.5),
        intensity,
      };

      p.setAttribute(
        "d",
        makeWavePath(state.x1, state.y1, state.x2, state.y2, 0, 0, state.cycles)
      );

      const handleEnter = () => {
        state.amp = 7;
        state.speed = 18;
        gsap.killTweensOf(state);
        gsap.to(state, { amp: 0, duration: 0.9, ease: "expo.out" });
        gsap.to(state, { speed: 0, duration: 0.9, ease: "expo.out" });
        pluck(state.note, state.intensity);
        smokeState.current.pulse += 0.4;
        smokeState.current.x = (state.x1 + state.x2) / 2 / 1728;
      };

      const handleClick = () => {
        state.amp = 11;
        state.speed = 26;
        gsap.killTweensOf(state);
        gsap.to(state, { amp: 0, duration: 1.1, ease: "expo.out" });
        gsap.to(state, { speed: 0, duration: 1.1, ease: "expo.out" });
        pluck(state.note * 1.01, Math.min(1, state.intensity + 0.12));
        smokeState.current.pulse += 0.9;
        smokeState.current.x = (state.x1 + state.x2) / 2 / 1728;
      };

      p.addEventListener("mouseenter", handleEnter);
      p.addEventListener("click", handleClick);

      strings.push({ el: p, state });

      // Transparent hit-area clone
      const clone = p.cloneNode(true) as SVGPathElement;
      clone.removeAttribute("d");
      clone.setAttribute("stroke", "transparent");
      clone.setAttribute("stroke-width", "18");
      clone.setAttribute("pointer-events", "stroke");
      clone.classList.remove("guitar-string");
      p.parentNode?.insertBefore(clone, p.nextSibling);

      const sync = () => clone.setAttribute("d", p.getAttribute("d") || "");
      sync();

      const obs = new MutationObserver(sync);
      obs.observe(p, { attributes: true, attributeFilter: ["d"] });

      const cloneEnter = () => {
        p.dispatchEvent(new Event("mouseenter", { bubbles: true }));
      };
      const cloneClick = () => {
        p.dispatchEvent(new Event("click", { bubbles: true }));
      };
      clone.addEventListener("mouseenter", cloneEnter);
      clone.addEventListener("click", cloneClick);

      // Register cleanup for this string
      cleanupRef.current.push(() => {
        p.removeEventListener("mouseenter", handleEnter);
        p.removeEventListener("click", handleClick);
        clone.removeEventListener("mouseenter", cloneEnter);
        clone.removeEventListener("click", cloneClick);
        obs.disconnect();
        clone.remove();
      });
    });

    stringsRef.current = strings;
  }, [svgRef, pluck, smokeState]);

  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    setupStrings();

    // GSAP animation tick
    const tickHandler = () => {
      const dt = gsap.ticker.deltaRatio() / 60;
      for (const s of stringsRef.current) {
        const st = s.state;
        if (st.amp > 0.02 || st.speed > 0.02) {
          st.phase += st.speed * dt;
          s.el.setAttribute(
            "d",
            makeWavePath(st.x1, st.y1, st.x2, st.y2, st.amp, st.phase, st.cycles)
          );
        }
      }
    };

    gsap.ticker.add(tickHandler);

    return () => {
      gsap.ticker.remove(tickHandler);

      // Kill in-flight tweens and clean up listeners/observers/clones
      for (const s of stringsRef.current) {
        gsap.killTweensOf(s.state);
      }
      for (const dispose of cleanupRef.current) {
        dispose();
      }
      cleanupRef.current = [];
      stringsRef.current = [];
    };
  }, [setupStrings]);
}
