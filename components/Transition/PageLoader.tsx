"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTransition } from "./TransitionContext";
import "./PageLoader.css";

/* ── constants ──────────────────────────────────────────────────────────── */
const BELT_COUNT = 10; // 5 top + 5 bottom
const HOLD = 60;
const COUNTER_DUR = 3000;
const DIGIT_H = 18;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

/* ── magnetic field-line generation (from HTML reference) ───────────── */
const LINE_COUNT = 28;
const DRAW_WINDOW = 0.18;
const STAGGER = (1 - DRAW_WINDOW) / (LINE_COUNT - 1);

interface FieldLine {
  path: string;
  delay: number;
  fillX: number;
  fillY: number;
  fillW: number;
  fillH: number;
  axis: "h" | "v";
}

function fieldLineH(y: number, seed: number) {
  const W = 578, steps = 60;
  const freq = 1.2 + ((seed * 0.37) % 0.8);
  const amp = 8 + ((seed * 0.61) % 14);
  const phase = (seed * 1.7) % (Math.PI * 2);
  let d = `M -10 ${y.toFixed(1)}`;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * (W + 20) - 10;
    const dy = amp * Math.sin((x / W) * freq * Math.PI + phase);
    d += ` L ${x.toFixed(1)} ${(y + dy).toFixed(1)}`;
  }
  return d;
}

function fieldLineV(x: number, seed: number) {
  const H = 586, steps = 60;
  const freq = 1.2 + ((seed * 0.37) % 0.8);
  const amp = 8 + ((seed * 0.61) % 14);
  const phase = (seed * 1.7) % (Math.PI * 2);
  let d = `M ${x.toFixed(1)} -10`;
  for (let i = 1; i <= steps; i++) {
    const y = (i / steps) * (H + 20) - 10;
    const dx = amp * Math.sin((y / H) * freq * Math.PI + phase);
    d += ` L ${(x + dx).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

function genFieldLines(direction: "top-down" | "bottom-up" | "left-right"): FieldLine[] {
  return Array.from({ length: LINE_COUNT }, (_, i) => {
    const seed = i * 3.14159 + 1.618;
    if (direction === "top-down") {
      const spacing = 586 / LINE_COUNT;
      const y = (i + 0.5) * spacing;
      return { path: fieldLineH(y, seed), delay: i * STAGGER, fillX: -10, fillY: y - spacing / 2, fillW: 600, fillH: spacing + 1, axis: "h" as const };
    } else if (direction === "bottom-up") {
      const spacing = 586 / LINE_COUNT;
      const y = 586 - (i + 0.5) * spacing;
      return { path: fieldLineH(y, seed), delay: i * STAGGER, fillX: -10, fillY: y, fillW: 600, fillH: spacing + 1, axis: "h" as const };
    } else {
      const spacing = 578 / LINE_COUNT;
      const x = (i + 0.5) * spacing;
      return { path: fieldLineV(x, seed), delay: i * STAGGER, fillX: x - spacing / 2, fillY: -10, fillW: spacing + 1, fillH: 610, axis: "v" as const };
    }
  });
}

const fieldLines1 = genFieldLines("bottom-up");
const fieldLines2 = genFieldLines("left-right");
const fieldLines3 = genFieldLines("top-down");

/* ── render magnetic fill (SVG innerHTML) ────────────────────────────── */
function renderMagnetic(drawGroup: SVGGElement | null, fillGroup: SVGGElement | null, lines: FieldLine[], progress: number) {
  if (!drawGroup || !fillGroup) return;
  if (progress <= 0) { drawGroup.innerHTML = ""; fillGroup.innerHTML = ""; return; }
  let lineHTML = "", fillHTML = "";
  lines.forEach((fl) => {
    const drawP = Math.max(0, Math.min(1, (progress - fl.delay) / DRAW_WINDOW));
    if (drawP <= 0) return;
    const fillP = easeInOut(Math.min(1, (progress - fl.delay) / (DRAW_WINDOW * 1.4)));
    if (fillP > 0) {
      if (fl.axis === "h") {
        fillHTML += `<rect x="${fl.fillX}" y="${fl.fillY.toFixed(1)}" width="${fl.fillW}" height="${(fl.fillH * fillP).toFixed(1)}" fill="#434343"/>`;
      } else {
        fillHTML += `<rect x="${fl.fillX.toFixed(1)}" y="-10" width="${(fl.fillW * fillP).toFixed(1)}" height="610" fill="#434343"/>`;
      }
    }
    const age = (progress - fl.delay) / (DRAW_WINDOW * 2.2);
    const lineOpacity = Math.max(0, 1 - easeInOut(Math.min(1, age)));
    if (lineOpacity > 0.01) {
      const offset = (1 - easeInOut(drawP)).toFixed(4);
      lineHTML += `<path d="${fl.path}" fill="none" stroke="#888" stroke-width="1.5" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${offset}" opacity="${lineOpacity.toFixed(3)}"/>`;
    }
  });
  fillGroup.innerHTML = fillHTML;
  drawGroup.innerHTML = lineHTML;
}

/* ── T-shape SVG paths (from HTML reference) ─────────────────────────── */
const T1_PATH = "M269.431 257.019C268.708 258.271 268.717 259.816 269.455 261.06L286.98 290.611C288.54 293.241 292.355 293.219 293.885 290.57L327.284 232.72C328.825 230.052 332.677 230.054 334.215 232.724L425.279 390.875C425.982 392.095 427.275 392.856 428.682 392.878L463.65 393.434C466.755 393.483 468.73 390.129 467.18 387.438L353.861 190.681C353.148 189.444 353.149 187.921 353.863 186.685L388.264 127.101C388.965 125.885 388.979 124.391 388.299 123.163L371.368 92.5833C369.861 89.8615 365.96 89.8265 364.404 92.5208L269.431 257.019Z";
const T2_PATH = "M316.66 425.547C318.087 425.545 319.406 426.304 320.123 427.537L356.868 490.777C357.572 491.989 358.86 492.744 360.263 492.767L395.242 493.322C398.347 493.372 400.322 490.018 398.773 487.327L304.909 324.268C304.196 323.03 302.878 322.266 301.449 322.263L265.933 322.201C262.846 322.196 260.916 325.543 262.468 328.212L293.454 381.508C295.005 384.176 293.079 387.521 289.993 387.519L107.1 387.384C105.67 387.383 104.348 388.146 103.633 389.384L86.0729 419.792C84.532 422.461 86.4598 425.796 89.5411 425.793L316.66 425.547Z";
const T3_PATH = "M182.809 283.818C179.736 283.807 177.822 280.479 179.359 277.818L271.364 118.461C272.066 117.245 272.079 115.751 271.399 114.523L254.468 83.9432C252.961 81.2213 249.06 81.1863 247.504 83.8807L133.245 281.783C132.528 283.026 131.2 283.789 129.765 283.783L56.9478 283.499C55.5132 283.494 54.1855 284.257 53.4681 285.499L35.9048 315.92C34.3665 318.584 36.2864 321.915 39.363 321.92L229.336 322.201C230.767 322.203 232.091 321.441 232.806 320.201L250.222 290.036C251.759 287.375 249.845 284.047 246.771 284.036L182.809 283.818Z";

/* ════════════════════════════════════════════════════════════════════════ */
export default function PageLoader() {
  const { phase, markLoaderComplete, setContentVisible } = useTransition();
  const overlayRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const beltRefs = useRef<HTMLDivElement[]>([]);
  const t1Ref = useRef<SVGSVGElement>(null);
  const t2Ref = useRef<SVGSVGElement>(null);
  const t3Ref = useRef<SVGSVGElement>(null);
  const pg1Ref = useRef<SVGGElement>(null);
  const pg2Ref = useRef<SVGGElement>(null);
  const pg3Ref = useRef<SVGGElement>(null);
  const lg1Ref = useRef<SVGGElement>(null);
  const lg2Ref = useRef<SVGGElement>(null);
  const lg3Ref = useRef<SVGGElement>(null);
  const strip0Ref = useRef<HTMLDivElement>(null);
  const strip1Ref = useRef<HTMLDivElement>(null);
  const strip2Ref = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const word3Ref = useRef<HTMLSpanElement>(null);
  const dot1Ref = useRef<HTMLSpanElement>(null);
  const dot2Ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);
  const scrollLockRaf = useRef<number>(0);

  // Continuous brute-force scroll lock during loader phases
  useEffect(() => {
    if (phase !== "loader") {
      if (scrollLockRaf.current) cancelAnimationFrame(scrollLockRaf.current);
      return;
    }

    const lock = () => {
      window.scrollTo(0, 0);
      scrollLockRaf.current = requestAnimationFrame(lock);
    };
    scrollLockRaf.current = requestAnimationFrame(lock);

    return () => {
      if (scrollLockRaf.current) cancelAnimationFrame(scrollLockRaf.current);
    };
  }, [phase]);

  /* ── sweep-out animation ───────────────────────────────────────────── */
  const sweepOut = useCallback((cb: () => void) => {
    const belts = beltRefs.current;
    let done = 0;
    const need = belts.length;
    const fin = () => { if (++done === need) cb(); };
    const DUR = 500;
    [...belts].reverse().forEach((b, i) => {
      setTimeout(() => {
        const s = performance.now();
        (function f(n: number) {
          const r = Math.min((n - s) / DUR, 1);
          const p = easeIn(r);
          b.style.transform = `scaleY(${1 - (1 - 0.008) * p})`;
          r < 1 ? requestAnimationFrame(f) : ((b.style.transform = "scaleY(0)"), fin());
        })(performance.now());
      }, i * 38);
    });
  }, []);

  /* ── animate T in ──────────────────────────────────────────────────── */
  const animTManual = useCallback(
    (el: SVGSVGElement, start: number, fromX: number, fromY: number, fromRot: number, axis: string, fromZ: number, r: number) => {
      const T_DUR = 700 / COUNTER_DUR;
      const localR = Math.max(0, Math.min(1, (r - start) / T_DUR));
      if (localR <= 0) return;
      const p = easeOut(localR);
      const inv = 1 - p;
      const scale = 1.5 + (1 - 1.5) * p;
      el.style.opacity = String(p);
      el.style.transform = `translate(${fromX * inv}px,${fromY * inv}px) rotate${axis}(${fromRot * inv}deg) rotateZ(${fromZ * inv}deg) scale(${scale})`;
    },
    [],
  );

  /* ── animate T out ─────────────────────────────────────────────────── */
  const animTOut = useCallback(
    (el: SVGSVGElement, toX: number, toY: number, toRot: number, axis: string, delay: number, toZ: number): Promise<void> => {
      return new Promise((res) => {
        const toScale = 1.5;
        setTimeout(() => {
          const s = performance.now(), dur = 500;
          (function f(n: number) {
            const r = Math.min((n - s) / dur, 1);
            const p = easeIn(r);
            const scale = 1 + (toScale - 1) * p;
            el.style.opacity = String(1 - p);
            el.style.transform = `translate(${toX * p}px,${toY * p}px) rotate${axis}(${toRot * p}deg) rotateZ(${toZ * p}deg) scale(${scale})`;
            r < 1 ? requestAnimationFrame(f) : ((el.style.opacity = "0"), res());
          })(performance.now());
        }, delay);
      });
    },
    [],
  );

  /* ── hide center (T out + fade label/counter) ──────────────────────── */
  const hideCenter = useCallback(
    (cb: () => void) => {
      const t1 = t1Ref.current!, t2 = t2Ref.current!, t3 = t3Ref.current!;
      const hasLogo = parseFloat(t1.style.opacity || "0") > 0;
      const fadeTargets = hasLogo
        ? [
          animTOut(t2, 0, 80, -50, "X", 0, -24).then(() => { word3Ref.current?.classList.remove("visible"); dot2Ref.current?.classList.remove("visible"); }),
          animTOut(t1, 120, 0, 60, "Y", 200, -32).then(() => { word2Ref.current?.classList.remove("visible"); dot1Ref.current?.classList.remove("visible"); }),
          animTOut(t3, -120, 0, -60, "Y", 400, 28).then(() => { word1Ref.current?.classList.remove("visible"); }),
        ]
        : [];

      const finish = () => {
        const ctr = counterRef.current;
        const counterWasVisible = ctr ? parseFloat(ctr.style.opacity || "0") > 0 : false;
        const s = performance.now();
        (function f(n: number) {
          const r = Math.min((n - s) / 250, 1);
          const p = 1 - easeIn(r) * 1; // fade from 1→0
          if (counterWasVisible && ctr) ctr.style.opacity = String(p);
          if (r < 1) { requestAnimationFrame(f); return; }
          if (centerRef.current) centerRef.current.style.visibility = "hidden";
          if (ctr) ctr.style.opacity = "0";
          [strip0Ref, strip1Ref, strip2Ref].forEach((ref) => { if (ref.current) ref.current.style.transform = "translateY(0px)"; });
          [word1Ref, word2Ref, word3Ref].forEach((ref) => ref.current?.classList.remove("visible"));
          [dot1Ref, dot2Ref].forEach((ref) => ref.current?.classList.remove("visible"));
          [pg1Ref, pg2Ref, pg3Ref, lg1Ref, lg2Ref, lg3Ref].forEach((ref) => { if (ref.current) ref.current.innerHTML = ""; });
          [t1Ref, t2Ref, t3Ref].forEach((ref) => { if (ref.current) { ref.current.style.opacity = "0"; ref.current.style.transform = ""; } });
          cb();
        })(performance.now());
      };

      if (fadeTargets.length) {
        let done = 0;
        fadeTargets.forEach((p) => p.then(() => { if (++done === 3) finish(); }));
      } else {
        finish();
      }
    },
    [animTOut],
  );

  /* ── main loader sequence ──────────────────────────────────────────── */
  useEffect(() => {
    if (phase !== "loader" || hasRun.current) return;
    hasRun.current = true;

    const overlay = overlayRef.current;
    const center = centerRef.current;
    const t1 = t1Ref.current, t2 = t2Ref.current, t3 = t3Ref.current;
    const strip0 = strip0Ref.current, strip1 = strip1Ref.current, strip2 = strip2Ref.current;
    const ctr = counterRef.current;
    if (!overlay || !center || !t1 || !t2 || !t3 || !strip0 || !strip1 || !strip2 || !ctr) return;

    // Hide page content during loader
    setContentVisible(false);

    // Init belts fully closed
    beltRefs.current.forEach((b) => { b.style.transform = "scaleY(1)"; b.style.transformOrigin = "center center"; b.style.opacity = "1"; });
    overlay.classList.add("active");

    // Init strips
    strip0.innerHTML = [0, 1].map((d) => `<div class="trionn-slot-digit">${d}</div>`).join("");
    strip1.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => `<div class="trionn-slot-digit">${d}</div>`).join("");
    strip2.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => `<div class="trionn-slot-digit">${d}</div>`).join("");
    [strip0, strip1, strip2].forEach((s) => (s.style.transform = "translateY(0px)"));

    // Init T shapes
    [t1, t2, t3].forEach((t) => { t.style.opacity = "0"; t.style.transform = ""; });

    // Show center
    center.style.visibility = "visible";
    ctr.style.opacity = "1";

    // T entry timings
    const T_DUR = 700 / COUNTER_DUR;
    const t3Start = 0;
    const t1Start = 200 / COUNTER_DUR;
    const t2Start = 400 / COUNTER_DUR;
    let w1 = false, w2 = false, w3 = false;

    const cs = performance.now();
    const tick = (n: number) => {
      const r = Math.min((n - cs) / COUNTER_DUR, 1);

      // Odometer
      const val = r * 100;
      if (strip2) strip2.style.transform = `translateY(${-((val % 10) / 10) * 10 * DIGIT_H}px)`;
      if (strip1) strip1.style.transform = `translateY(${-(((val % 100) / 10) / 10) * 10 * DIGIT_H}px)`;
      if (strip0) strip0.style.transform = `translateY(${-(val / 100) * DIGIT_H}px)`;

      // T animations
      animTManual(t3, t3Start, -120, 0, -60, "Y", 28, r);
      animTManual(t1, t1Start, 120, 0, 60, "Y", -32, r);
      animTManual(t2, t2Start, 0, 80, -50, "X", -24, r);

      // Words
      if (!w1 && r >= t3Start + T_DUR) { word1Ref.current?.classList.add("visible"); w1 = true; }
      if (!w2 && r >= t1Start + T_DUR) { dot1Ref.current?.classList.add("visible"); word2Ref.current?.classList.add("visible"); w2 = true; }
      if (!w3 && r >= t2Start + T_DUR) { dot2Ref.current?.classList.add("visible"); word3Ref.current?.classList.add("visible"); w3 = true; }

      // Magnetic fill
      renderMagnetic(lg1Ref.current, pg1Ref.current, fieldLines1, r);
      renderMagnetic(lg2Ref.current, pg2Ref.current, fieldLines2, r);
      renderMagnetic(lg3Ref.current, pg3Ref.current, fieldLines3, r);

      if (r < 1) {
        requestAnimationFrame(tick);
      } else {
        // Snap
        if (strip0) strip0.style.transform = `translateY(${-DIGIT_H}px)`;
        if (strip1) strip1.style.transform = "translateY(0px)";
        if (strip2) strip2.style.transform = "translateY(0px)";
        [t1, t2, t3].forEach((t) => { t.style.opacity = "1"; t.style.transform = "translate(0,0) scale(1)"; });

        setTimeout(() => {
          // 1. T shapes exit — runs uncontested (no heavy rendering competing)
          hideCenter(() => {
            // 2. T exit complete. Reveal content behind belts.
            //    This flips visibility:hidden → visible + opacity:0 → 0
            //    The browser starts painting the page content.
            setContentVisible(true);

            // 3. Give the browser 2 frames to paint the newly-visible content
            //    before belts start retracting. This prevents jank.
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                sweepOut(() => {
                  overlay.classList.remove("active");
                  requestAnimationFrame(() => {
                    markLoaderComplete();
                  });
                });
              });
            });
          });
        }, HOLD);
      }
    };

    requestAnimationFrame(tick);
  }, [phase, markLoaderComplete, setContentVisible, animTManual, hideCenter, sweepOut]);

  // Don't render if loader already completed (e.g. soft nav back)
  // We keep it in DOM but invisible after completion

  /* ── SVG helper for one T shape ────────────────────────────────────── */
  const TShape = ({ id, pathD, clipId, svgRef, particlesRef, lightningRef }: {
    id: string; pathD: string; clipId: string;
    svgRef: React.RefObject<SVGSVGElement | null>;
    particlesRef: React.RefObject<SVGGElement | null>;
    lightningRef: React.RefObject<SVGGElement | null>;
  }) => (
    <svg className="trionn-t-path" ref={svgRef} viewBox="0 0 578 586" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={clipId}>
          <path fillRule="evenodd" clipRule="evenodd" d={pathD} />
        </clipPath>
      </defs>
      <path fillRule="evenodd" clipRule="evenodd" d={pathD} fill="none" stroke="#aaa" strokeWidth="1.5" />
      <g clipPath={`url(#${clipId})`} ref={particlesRef} />
      <g clipPath={`url(#${clipId})`} ref={lightningRef} />
    </svg>
  );

  return (
    <>
      {/* Belt overlay */}
      <div ref={overlayRef} className="trionn-overlay">
        {Array.from({ length: BELT_COUNT }, (_, i) => (
          <div key={i} ref={(el) => { if (el) beltRefs.current[i] = el; }} className="trionn-belt" />
        ))}
      </div>

      {/* Center content */}
      <div ref={centerRef} className="trionn-overlay-center">
        <div className="trionn-logo-wrap">
          <TShape id="t1" pathD={T1_PATH} clipId="loader-clip1" svgRef={t1Ref} particlesRef={pg1Ref} lightningRef={lg1Ref} />
          <TShape id="t2" pathD={T2_PATH} clipId="loader-clip2" svgRef={t2Ref} particlesRef={pg2Ref} lightningRef={lg2Ref} />
          <TShape id="t3" pathD={T3_PATH} clipId="loader-clip3" svgRef={t3Ref} particlesRef={pg3Ref} lightningRef={lg3Ref} />
        </div>

        {/* Tagline */}
        <div className="trionn-tagline">
          <span ref={word1Ref} className="trionn-tag-word">Inspire</span>
          <span ref={dot1Ref} className="trionn-tag-dot">·</span>
          <span ref={word2Ref} className="trionn-tag-word">Innovate</span>
          <span ref={dot2Ref} className="trionn-tag-dot">·</span>
          <span ref={word3Ref} className="trionn-tag-word">Impact</span>
        </div>

        {/* Counter */}
        <div ref={counterRef} className="trionn-counter">
          <div className="trionn-slot-reel"><div className="trionn-slot-strip" ref={strip0Ref} /></div>
          <div className="trionn-slot-reel"><div className="trionn-slot-strip" ref={strip1Ref} /></div>
          <div className="trionn-slot-reel"><div className="trionn-slot-strip" ref={strip2Ref} /></div>
        </div>
      </div>
    </>
  );
}
