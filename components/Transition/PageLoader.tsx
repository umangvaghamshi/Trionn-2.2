"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTransition } from "./TransitionContext";
import "./page-loader.css";

/* ── Constants (from Page-Loader/main.js) ─────────────────────────────── */
const BELT_COUNT = 10;
const CORNER_GAP = 6;
const CORNER_SIZE = 6.5;
const CORNER_OFFSET = CORNER_GAP + CORNER_SIZE;
const CENTER_ORIGIN = "52% 52%";
const DIGIT_H = 18;
const FULL_ROTATION = 360;
const PLUS_SPIN_IN = 720;
const PLUS_SPIN_INTRO = 1080;
const INTRO_CENTER_RATIO = 2;
const T_OUT_DUR = 500;
const INTRO_FLY_DUR = 900;
const INTRO_EXPAND_DUR = 600;
const BOX_EXPAND_DUR = 900;
const FINAL_FADE_DUR = 700;
const BORDER_FADE_DUR = 200;
const CENTER_RESTORE_DELAY = 50;
const COUNTER_DUR = 2000;
const LOGO_T_DUR = 700;
const LOGO_T1_DELAY = 200;
const LOGO_T2_DELAY = 400;
const EXPAND_FADE_START = 0.8;
const CORNER_FADE_START = 0.65;

/* ── Easing functions ─────────────────────────────────────────────────── */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOutBack = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const easeOutBackStrong = (t: number) => { const c1 = 1.8, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const easeInOut3 = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ── requestAnimationFrame skip-if-hidden ─────────────────────────────── */
function requestVisibleFrame(tick: (now: number) => void) {
  requestAnimationFrame((now) => {
    if (document.hidden) { requestVisibleFrame(tick); return; }
    tick(now);
  });
}

/* ── animateFrame helper ──────────────────────────────────────────────── */
function animateFrame(duration: number, render: (progress: number, now: number) => void, done?: () => void) {
  let elapsed = 0;
  let lastTime: number | undefined;
  function tick(now: number) {
    if (lastTime !== undefined) elapsed += now - lastTime;
    lastTime = now;
    const progress = Math.min(elapsed / duration, 1);
    render(progress, now);
    if (progress < 1) { requestVisibleFrame(tick); } else if (done) { done(); }
  }
  requestVisibleFrame(tick);
}

/* ── Magnetic field-line generation (from Page-Loader/main.js) ────────── */
const LINE_COUNT = 28;
const DRAW_WINDOW = 0.154034;
const STAGGER = 0.028239;

interface FieldLine {
  path: string;
  delay: number;
  fillX: number;
  fillY: number;
  fillW: number;
  fillH: number;
  axis: "h" | "v";
}

function fieldLine(coord: number, seed: number, axis: "h" | "v"): string {
  const W = 578, H = 586, steps = 60;
  const freq = 1.2 + ((seed * 0.37) % 0.8);
  const amp = 8 + ((seed * 0.61) % 14);
  const phase = (seed * 1.7) % (Math.PI * 2);
  let d = axis === "h" ? `M -10 ${coord.toFixed(1)}` : `M ${coord.toFixed(1)} -10`;
  for (let i = 1; i <= steps; i++) {
    if (axis === "h") {
      const x = (i / steps) * (W + 20) - 10;
      d += ` L ${x.toFixed(1)} ${(coord + amp * Math.sin((x / W) * freq * Math.PI + phase)).toFixed(1)}`;
    } else {
      const y = (i / steps) * (H + 20) - 10;
      d += ` L ${(coord + amp * Math.sin((y / H) * freq * Math.PI + phase)).toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return d;
}

function genFieldLines(direction: "top-down" | "bottom-up" | "left-right"): FieldLine[] {
  return Array.from({ length: LINE_COUNT }, (_, i) => {
    const seed = i * 3.14159 + 1.618;
    if (direction === "top-down") {
      const spacing = 586 / LINE_COUNT, y = (i + 0.5) * spacing;
      return { path: fieldLine(y, seed, "h"), delay: i * STAGGER, fillX: -10, fillY: y - spacing / 2, fillW: 600, fillH: spacing + 1, axis: "h" as const };
    } else if (direction === "bottom-up") {
      const spacing = 586 / LINE_COUNT, y = 586 - (i + 0.5) * spacing;
      return { path: fieldLine(y, seed, "h"), delay: i * STAGGER, fillX: -10, fillY: y, fillW: 600, fillH: spacing + 1, axis: "h" as const };
    } else {
      const spacing = 578 / LINE_COUNT, x = (i + 0.5) * spacing;
      return { path: fieldLine(x, seed, "v"), delay: i * STAGGER, fillX: x - spacing / 2, fillY: -10, fillW: spacing + 1, fillH: 610, axis: "v" as const };
    }
  });
}

const fieldLines1 = genFieldLines("bottom-up");
const fieldLines2 = genFieldLines("left-right");
const fieldLines3 = genFieldLines("top-down");

function renderMagnetic(drawGroup: SVGGElement | null, fillGroup: SVGGElement | null, lines: FieldLine[], progress: number) {
  if (!drawGroup || !fillGroup) return;
  if (progress <= 0) { drawGroup.innerHTML = ""; fillGroup.innerHTML = ""; return; }
  let lineHTML = "", fillHTML = "";
  lines.forEach((fl) => {
    const drawP = Math.max(0, Math.min(1, (progress - fl.delay) / DRAW_WINDOW));
    if (drawP <= 0) return;
    const fillP = easeInOut(Math.min(1, (progress - fl.delay) / (DRAW_WINDOW * 1.4)));
    if (fillP > 0) {
      fillHTML += fl.axis === "h"
        ? `<rect x="${fl.fillX}" y="${fl.fillY.toFixed(1)}" width="${fl.fillW}" height="${(fl.fillH * fillP).toFixed(1)}" fill="#434343"/>`
        : `<rect x="${fl.fillX.toFixed(1)}" y="-10" width="${(fl.fillW * fillP).toFixed(1)}" height="610" fill="#434343"/>`;
    }
    const lineOpacity = Math.max(0, 1 - easeInOut(Math.min(1, (progress - fl.delay) / (DRAW_WINDOW * 2.2))));
    if (lineOpacity > 0.01) {
      lineHTML += `<path d="${fl.path}" fill="none" stroke="#888" stroke-width="1.5" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - easeInOut(drawP)).toFixed(4)}" opacity="${lineOpacity.toFixed(3)}"/>`;
    }
  });
  fillGroup.innerHTML = fillHTML;
  drawGroup.innerHTML = lineHTML;
}

/* ── T-shape SVG paths ────────────────────────────────────────────────── */
const T1_PATH = "M269.431 257.019C268.708 258.271 268.717 259.816 269.455 261.06L286.98 290.611C288.54 293.241 292.355 293.219 293.885 290.57L327.284 232.72C328.825 230.052 332.677 230.054 334.215 232.724L425.279 390.875C425.982 392.095 427.275 392.856 428.682 392.878L463.65 393.434C466.755 393.483 468.73 390.129 467.18 387.438L353.861 190.681C353.148 189.444 353.149 187.921 353.863 186.685L388.264 127.101C388.965 125.885 388.979 124.391 388.299 123.163L371.368 92.5833C369.861 89.8615 365.96 89.8265 364.404 92.5208L269.431 257.019Z";
const T2_PATH = "M316.66 425.547C318.087 425.545 319.406 426.304 320.123 427.537L356.868 490.777C357.572 491.989 358.86 492.744 360.263 492.767L395.242 493.322C398.347 493.372 400.322 490.018 398.773 487.327L304.909 324.268C304.196 323.03 302.878 322.266 301.449 322.263L265.933 322.201C262.846 322.196 260.916 325.543 262.468 328.212L293.454 381.508C295.005 384.176 293.079 387.521 289.993 387.519L107.1 387.384C105.67 387.383 104.348 388.146 103.633 389.384L86.0729 419.792C84.532 422.461 86.4598 425.796 89.5411 425.793L316.66 425.547Z";
const T3_PATH = "M182.809 283.818C179.736 283.807 177.822 280.479 179.359 277.818L271.364 118.461C272.066 117.245 272.079 115.751 271.399 114.523L254.468 83.9432C252.961 81.2213 249.06 81.1863 247.504 83.8807L133.245 281.783C132.528 283.026 131.2 283.789 129.765 283.783L56.9478 283.499C55.5132 283.494 54.1855 284.257 53.4681 285.499L35.9048 315.92C34.3665 318.584 36.2864 321.915 39.363 321.92L229.336 322.201C230.767 322.203 232.091 321.441 232.806 320.201L250.222 290.036C251.759 287.375 249.845 284.047 246.771 284.036L182.809 283.818Z";

const PLUS_SVG = (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="6.5" y1="0" x2="6.5" y2="13" stroke="#555" />
    <line x1="13" y1="6.5" x2="0" y2="6.5" stroke="#555" />
  </svg>
);

const rotDirs = [1, -1, -1, 1];

/* ════════════════════════════════════════════════════════════════════════ */
export default function PageLoader() {
  const { phase, markLoaderComplete, setContentVisible } = useTransition();

  /* ── DOM refs ────────────────────────────────────────────────────────── */
  const overlayRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const borderSvgRef = useRef<SVGSVGElement>(null);
  const borderRectRef = useRef<SVGRectElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const strip0Ref = useRef<HTMLDivElement>(null);
  const strip1Ref = useRef<HTMLDivElement>(null);
  const strip2Ref = useRef<HTMLDivElement>(null);
  const beltRefs = useRef<HTMLDivElement[]>([]);

  /* T-shape SVG refs */
  const t1Ref = useRef<SVGSVGElement>(null);
  const t2Ref = useRef<SVGSVGElement>(null);
  const t3Ref = useRef<SVGSVGElement>(null);
  /* Particle group refs */
  const pg1Ref = useRef<SVGGElement>(null);
  const pg2Ref = useRef<SVGGElement>(null);
  const pg3Ref = useRef<SVGGElement>(null);
  const lg1Ref = useRef<SVGGElement>(null);
  const lg2Ref = useRef<SVGGElement>(null);
  const lg3Ref = useRef<SVGGElement>(null);

  /* Logo corner plus refs [tl, tr, bl, br] */
  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerTRRef = useRef<HTMLDivElement>(null);
  const cornerBLRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);

  /* Flying plus refs [tl, tr, bl, br] */
  const flyTLRef = useRef<HTMLDivElement>(null);
  const flyTRRef = useRef<HTMLDivElement>(null);
  const flyBLRef = useRef<HTMLDivElement>(null);
  const flyBRRef = useRef<HTMLDivElement>(null);

  /* Tagline word/dot refs */
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const word3Ref = useRef<HTMLSpanElement>(null);
  const dot1Ref = useRef<HTMLSpanElement>(null);
  const dot2Ref = useRef<HTMLSpanElement>(null);

  const hasRun = useRef(false);
  const scrollLockRaf = useRef<number>(0);

  /* ── Scroll lock during loader ───────────────────────────────────────── */
  useEffect(() => {
    if (phase !== "loader") {
      if (scrollLockRaf.current) cancelAnimationFrame(scrollLockRaf.current);
      return;
    }
    const lock = () => { window.scrollTo(0, 0); scrollLockRaf.current = requestAnimationFrame(lock); };
    scrollLockRaf.current = requestAnimationFrame(lock);
    return () => { if (scrollLockRaf.current) cancelAnimationFrame(scrollLockRaf.current); };
  }, [phase]);

  /* ── Animate T out ───────────────────────────────────────────────────── */
  const animTOut = useCallback((el: SVGSVGElement, toX: number, toY: number, toRot: number, axis: string, delay: number, toZ: number): Promise<void> => {
    return new Promise((res) => {
      setTimeout(() => {
        animateFrame(T_OUT_DUR, (r) => {
          const p = easeIn(r);
          el.style.opacity = String(1 - p);
          el.style.transform = `translate(${toX * p}px,${toY * p}px) rotate${axis}(${toRot * p}deg) rotateZ(${toZ * p}deg) scale(${1 + 0.5 * p})`;
        }, () => { el.style.opacity = "0"; res(); });
      }, delay);
    });
  }, []);

  /* ── showCenterLogoOnly (counter + border draw + magnetic fill) ──────── */
  const showCenterLogoOnly = useCallback((cb: () => void) => {
    const center = centerRef.current!;
    const lbl = labelRef.current!;
    const ctr = counterRef.current!;
    const strip0 = strip0Ref.current!, strip1 = strip1Ref.current!, strip2 = strip2Ref.current!;
    const borderSvg = borderSvgRef.current!, borderRect = borderRectRef.current!;
    const logoWrap = logoWrapRef.current!;
    const tPaths = [t1Ref.current!, t2Ref.current!, t3Ref.current!];
    const corners = [cornerTLRef.current!, cornerTRRef.current!, cornerBLRef.current!, cornerBRRef.current!];
    const wordEls = [word1Ref.current!, word2Ref.current!, word3Ref.current!, dot1Ref.current!, dot2Ref.current!];

    center.style.visibility = "visible";
    lbl.textContent = ""; lbl.style.opacity = "0";
    ctr.style.opacity = "1";
    [pg1Ref, pg2Ref, pg3Ref, lg1Ref, lg2Ref, lg3Ref].forEach((r) => { if (r.current) r.current.innerHTML = ""; });
    wordEls.forEach((el) => el.classList.remove("visible"));

    strip0.innerHTML = [0, 1].map((d) => `<div class="pl-slot-digit">${d}</div>`).join("");
    strip1.innerHTML = [0,1,2,3,4,5,6,7,8,9].map((d) => `<div class="pl-slot-digit">${d}</div>`).join("");
    strip2.innerHTML = [0,1,2,3,4,5,6,7,8,9,0].map((d) => `<div class="pl-slot-digit">${d}</div>`).join("");

    tPaths.forEach((t) => { t.style.opacity = "1"; t.style.transformOrigin = CENTER_ORIGIN; t.style.transform = "scale(1)"; });

    const wrapW = logoWrap.offsetWidth, wrapH = logoWrap.offsetHeight;
    borderRect.setAttribute("x", "0.75"); borderRect.setAttribute("y", "0.75");
    borderRect.setAttribute("width", (wrapW - 1.5).toFixed(2));
    borderRect.setAttribute("height", (wrapH - 1.5).toFixed(2));
    borderSvg.style.opacity = "1";
    borderRect.style.strokeDashoffset = "1";

    const [cpTL, cpTR, cpBL, cpBR] = corners;
    const cpRots = { tl: 0, tr: 0, br: 0, bl: 0 };
    let lastT: number | null = null;

    const P = 2 * wrapW + 2 * wrapH;
    const rTR = wrapW / P, rBR = (wrapW + wrapH) / P, rBL = (2 * wrapW + wrapH) / P;
    let word2shown = false, word3shown = false;
    const rWord2 = 100 / COUNTER_DUR, rWord3 = 200 / COUNTER_DUR;

    wordEls[0].classList.add("visible");

    const cs = performance.now();
    (function tick(n: number) {
      const r = Math.min((n - cs) / COUNTER_DUR, 1);

      strip0.style.transform = `translateY(${-r * DIGIT_H}px)`;
      strip1.style.transform = `translateY(${-(r * 10 * DIGIT_H) % (10 * DIGIT_H)}px)`;
      strip2.style.transform = `translateY(${-(r * 30 * DIGIT_H) % (10 * DIGIT_H)}px)`;

      borderRect.style.strokeDashoffset = String(1 - r);

      const dt = lastT ? (n - lastT) / 1000 : 0; lastT = n;
      cpRots.tl += FULL_ROTATION * dt;
      if (r >= rTR) cpRots.tr += FULL_ROTATION * dt;
      if (r >= rBR) cpRots.br += FULL_ROTATION * dt;
      if (r >= rBL) cpRots.bl += FULL_ROTATION * dt;
      cpTL.style.transform = `rotate(${cpRots.tl}deg)`;
      cpTR.style.transform = `rotate(${cpRots.tr}deg)`;
      cpBR.style.transform = `rotate(${cpRots.br}deg)`;
      cpBL.style.transform = `rotate(${cpRots.bl}deg)`;

      if (!word2shown && r >= rWord2) { wordEls[3].classList.add("visible"); wordEls[1].classList.add("visible"); word2shown = true; }
      if (!word3shown && r >= rWord3) { wordEls[4].classList.add("visible"); wordEls[2].classList.add("visible"); word3shown = true; }

      renderMagnetic(lg1Ref.current, pg1Ref.current, fieldLines1, r);
      renderMagnetic(lg2Ref.current, pg2Ref.current, fieldLines2, r);
      renderMagnetic(lg3Ref.current, pg3Ref.current, fieldLines3, r);

      if (r < 1) {
        requestVisibleFrame(tick);
      } else {
        strip0.style.transform = `translateY(${-DIGIT_H}px)`;
        strip1.style.transform = "translateY(0px)";
        strip2.style.transform = "translateY(0px)";
        borderRect.style.strokeDashoffset = "0";
        [cpTL, cpTR, cpBR, cpBL].forEach((c) => { c.style.transform = "rotate(0deg)"; });
        tPaths.forEach((t) => { t.style.opacity = "1"; t.style.transformOrigin = CENTER_ORIGIN; t.style.transform = "scale(1)"; });
        const sfs = performance.now();
        (function sf(now: number) {
          const fr = Math.min((now - sfs) / BORDER_FADE_DUR, 1);
          [t1Ref.current, t2Ref.current, t3Ref.current].forEach((p) => { if (p) p.style.opacity = String(1 - fr); });
          borderSvg.style.opacity = String(1 - fr);
          if (fr < 1) requestAnimationFrame(sf); else cb();
        })(performance.now());
      }
    })(performance.now());
  }, []);

  /* ── expandBoxFullscreen ─────────────────────────────────────────────── */
  const expandBoxFullscreen = useCallback((cb: () => void) => {
    const box = logoBoxRef.current!;
    const wrap = logoWrapRef.current!;
    const corners = [cornerTLRef.current!, cornerTRRef.current!, cornerBLRef.current!, cornerBRRef.current!];
    const whiteOverlay = whiteOverlayRef.current!;

    const wrapRect = wrap.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const fromL = wrapRect.left, fromT = wrapRect.top, fromW = wrapRect.width, fromH = wrapRect.height;
    const fromR = 0xD2;

    box.style.position = "fixed"; box.style.inset = "auto";
    box.style.left = fromL + "px"; box.style.top = fromT + "px";
    box.style.width = fromW + "px"; box.style.height = fromH + "px";
    box.style.transform = "none"; box.style.zIndex = "9250";

    corners.forEach((c) => {
      c.style.cssText += ";position:fixed;left:auto;top:auto;right:auto;bottom:auto;transform:translate(-50%,-50%);z-index:9300;";
    });

    const start = performance.now();
    (function tick(now: number) {
      const r = Math.min((now - start) / BOX_EXPAND_DUR, 1), p = easeInOut3(r);
      const L = fromL - fromL * p, T = fromT - fromT * p;
      const W = fromW + (vw - fromW) * p, H = fromH + (vh - fromH) * p;

      box.style.left = L + "px"; box.style.top = T + "px";
      box.style.width = W + "px"; box.style.height = H + "px";

      corners[0].style.left = (L - CORNER_OFFSET + CORNER_SIZE) + "px"; corners[0].style.top = (T - CORNER_OFFSET + CORNER_SIZE) + "px";
      corners[1].style.left = (L + W + CORNER_OFFSET - CORNER_SIZE) + "px"; corners[1].style.top = (T - CORNER_OFFSET + CORNER_SIZE) + "px";
      corners[2].style.left = (L - CORNER_OFFSET + CORNER_SIZE) + "px"; corners[2].style.top = (T + H + CORNER_OFFSET - CORNER_SIZE) + "px";
      corners[3].style.left = (L + W + CORNER_OFFSET - CORNER_SIZE) + "px"; corners[3].style.top = (T + H + CORNER_OFFSET - CORNER_SIZE) + "px";

      const cv = Math.round(fromR * (1 - p));
      box.style.background = `rgb(${cv},${cv},${cv})`;

      if (r >= EXPAND_FADE_START) {
        const ov = Math.round(0xFF * (1 - (r - EXPAND_FADE_START) / (1 - EXPAND_FADE_START)));
        whiteOverlay.style.background = `rgb(${ov},${ov},${ov})`;
      }
      if (r > CORNER_FADE_START) corners.forEach((c) => { c.style.opacity = String(1 - (r - CORNER_FADE_START) / (1 - CORNER_FADE_START)); });

      if (r < 1) {
        requestVisibleFrame(tick);
      } else {
        corners.forEach((c) => { c.style.opacity = "0"; });
        box.style.background = "#000"; whiteOverlay.style.background = "#000";
        box.style.left = "0"; box.style.top = "0";
        box.style.width = "100vw"; box.style.height = "100vh";
        cb();
      }
    })(performance.now());
  }, []);

  /* ── runIntroAnimation ───────────────────────────────────────────────── */
  const runIntroAnimation = useCallback((cb: () => void) => {
    const fps = [flyTLRef.current!, flyTRRef.current!, flyBLRef.current!, flyBRRef.current!];
    const box = logoBoxRef.current!;
    const wrap = logoWrapRef.current!;
    const corners = [cornerTLRef.current!, cornerTRRef.current!, cornerBLRef.current!, cornerBRRef.current!];
    const tPaths = [t1Ref.current!, t2Ref.current!, t3Ref.current!];

    corners.forEach((c) => { c.style.opacity = "0"; });
    box.style.opacity = "0"; box.style.transform = "scale(0)";

    const cx = window.innerWidth / INTRO_CENTER_RATIO, cy = window.innerHeight / INTRO_CENTER_RATIO;
    const wrapRect = wrap.getBoundingClientRect();
    const finalCorners = {
      tl: { x: wrapRect.left - CORNER_OFFSET + CORNER_SIZE, y: wrapRect.top - CORNER_OFFSET + CORNER_SIZE },
      tr: { x: wrapRect.right + CORNER_OFFSET - CORNER_SIZE, y: wrapRect.top - CORNER_OFFSET + CORNER_SIZE },
      bl: { x: wrapRect.left - CORNER_OFFSET + CORNER_SIZE, y: wrapRect.bottom + CORNER_OFFSET - CORNER_SIZE },
      br: { x: wrapRect.right + CORNER_OFFSET - CORNER_SIZE, y: wrapRect.bottom + CORNER_OFFSET - CORNER_SIZE },
    };
    const margin = 60;
    const flyEls = [
      { el: fps[0], sx: margin, sy: margin, fx: finalCorners.tl.x, fy: finalCorners.tl.y },
      { el: fps[1], sx: window.innerWidth - margin, sy: margin, fx: finalCorners.tr.x, fy: finalCorners.tr.y },
      { el: fps[2], sx: margin, sy: window.innerHeight - margin, fx: finalCorners.bl.x, fy: finalCorners.bl.y },
      { el: fps[3], sx: window.innerWidth - margin, sy: window.innerHeight - margin, fx: finalCorners.br.x, fy: finalCorners.br.y },
    ];
    flyEls.forEach(({ el, sx, sy }) => { el.style.left = sx + "px"; el.style.top = sy + "px"; el.style.opacity = "1"; });

    const FLY_DUR = INTRO_FLY_DUR, EXP_DUR = INTRO_EXPAND_DUR;
    let logoStarted = false;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      if (elapsed <= FLY_DUR) {
        const r = Math.min(elapsed / FLY_DUR, 1);
        const p = 1 - Math.pow(1 - r, 5);
        flyEls.forEach(({ el, sx, sy }, i) => {
          el.style.left = (sx + (cx - sx) * p) + "px";
          el.style.top = (sy + (cy - sy) * p) + "px";
          el.style.transform = `translate(-50%,-50%) rotate(${rotDirs[i] * PLUS_SPIN_IN * (1 - easeOut(r))}deg)`;
        });
        requestVisibleFrame(tick);
      } else {
        const r = Math.min((elapsed - FLY_DUR) / EXP_DUR, 1);
        const pBox = easeOut(r), pPosition = easeOutBackStrong(r);
        box.style.opacity = "1"; box.style.transform = `scale(${pBox})`;

        if (!logoStarted && pBox >= 0.4) {
          logoStarted = true;
          const logoStart = performance.now();
          (function logoTick(now: number) {
            const el = now - logoStart;
            const doT = (svg: SVGSVGElement, delay: number, ry: number, rz: number) => {
              const localR = Math.max(0, Math.min(1, (el - delay) / LOGO_T_DUR));
              if (localR <= 0) return;
              const p = easeOutBack(localR), inv = 1 - Math.max(0, Math.min(1, easeOut(localR)));
              svg.style.opacity = String(Math.min(1, localR * 3));
              svg.style.transformOrigin = "52% 52%";
              svg.style.transform = `rotateY(${ry * inv}deg) rotateZ(${rz * inv}deg) scale(${0.15 + 0.85 * p})`;
            };
            doT(t3Ref.current!, 0, -60, 28);
            doT(t1Ref.current!, LOGO_T1_DELAY, 60, -32);
            const r2 = Math.max(0, Math.min(1, (el - LOGO_T2_DELAY) / LOGO_T_DUR));
            if (r2 > 0) {
              const p2 = easeOutBack(r2), inv2 = 1 - Math.max(0, Math.min(1, easeOut(r2)));
              const t2 = t2Ref.current!;
              t2.style.opacity = String(Math.min(1, r2 * 3));
              t2.style.transformOrigin = "52% 52%";
              t2.style.transform = `rotateX(${-50 * inv2}deg) rotateZ(${-24 * inv2}deg) scale(${0.15 + 0.85 * p2})`;
            }
            if (el < LOGO_T2_DELAY + LOGO_T_DUR) requestVisibleFrame(logoTick);
            else tPaths.forEach((t) => { t.style.opacity = "1"; t.style.transformOrigin = CENTER_ORIGIN; t.style.transform = "scale(1)"; });
          })(performance.now());
        }

        const spinEase = 1 - easeOut(r);
        flyEls.forEach(({ el, fx, fy }, i) => {
          el.style.left = (cx + (fx - cx) * pPosition) + "px";
          el.style.top = (cy + (fy - cy) * pPosition) + "px";
          el.style.opacity = "1";
          el.style.transform = `translate(-50%,-50%) scale(1) rotate(${rotDirs[i] * PLUS_SPIN_INTRO * spinEase}deg)`;
        });

        if (r < 1) {
          requestVisibleFrame(tick);
        } else {
          box.style.transform = "scale(1)";
          corners.forEach((c) => { c.style.opacity = "1"; });
          flyEls.forEach(({ el }) => { el.style.opacity = "0"; el.style.transform = "translate(-50%,-50%) scale(1) rotate(0deg)"; });
          cb();
        }
      }
    }
    requestVisibleFrame(tick);
  }, []);

  /* ── Main loader sequence (mirrors window load in main.js) ───────────── */
  useEffect(() => {
    if (phase !== "loader" || hasRun.current) return;
    hasRun.current = true;

    const overlay = overlayRef.current!;
    const center = centerRef.current!;
    const box = logoBoxRef.current!;
    const whiteOverlay = whiteOverlayRef.current!;
    const tPaths = [t1Ref.current!, t2Ref.current!, t3Ref.current!];

    setContentVisible(false);

    // Init state
    beltRefs.current.forEach((b) => { b.style.transform = "scaleY(0)"; b.style.opacity = "0"; });
    overlay.classList.add("active");
    center.style.visibility = "visible";
    [cornerTLRef, cornerTRRef, cornerBLRef, cornerBRRef].forEach((r) => { if (r.current) r.current.style.opacity = "0"; });
    box.style.opacity = "0";
    tPaths.forEach((t) => { t.style.opacity = "0"; });

    runIntroAnimation(() => {
      showCenterLogoOnly(() => {
        // T shapes exit
        animTOut(t2Ref.current!, 0, 80, -50, "X", 0, -24);
        animTOut(t1Ref.current!, 120, 0, 60, "Y", 100, -32);
        animTOut(t3Ref.current!, -120, 0, -60, "Y", 200, 28);

        // Fade tagline + counter
        const fadeTargets = [counterRef.current, word1Ref.current, word2Ref.current, word3Ref.current, dot1Ref.current, dot2Ref.current];
        fadeTargets.forEach((el) => {
          if (el) { el.style.transition = "opacity 0.4s"; el.style.opacity = "0"; }
        });

        expandBoxFullscreen(() => {
          setContentVisible(true);

          const fadeStart = performance.now();
          (function fadeTick(now: number) {
            const r = Math.min((now - fadeStart) / FINAL_FADE_DUR, 1), op = String(1 - r);
            box.style.opacity = op; whiteOverlay.style.opacity = op;
            if (r < 1) {
              requestVisibleFrame(fadeTick);
            } else {
              center.style.visibility = "hidden"; center.style.display = "none";
              box.style.display = "none"; whiteOverlay.style.display = "none";
              box.style.cssText = "background:#D2D2D2;";
              [cornerTLRef, cornerTRRef, cornerBLRef, cornerBRRef].forEach((r) => { if (r.current) r.current.style.cssText = ""; });
              overlay.classList.remove("active");
              setTimeout(() => { center.style.display = ""; }, CENTER_RESTORE_DELAY);
              markLoaderComplete();
            }
          })(performance.now());
        });
      });
    });
  }, [phase, markLoaderComplete, setContentVisible, runIntroAnimation, showCenterLogoOnly, animTOut, expandBoxFullscreen]);

  /* ── JSX ─────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* White fullscreen cover (visible at start) */}
      <div ref={whiteOverlayRef} className="pl-white-overlay" />

      {/* Belt overlay */}
      <div ref={overlayRef} className="pl-overlay">
        {Array.from({ length: BELT_COUNT }, (_, i) => (
          <div
            key={i}
            ref={(el) => { if (el) beltRefs.current[i] = el; }}
            className="pl-belt"
          />
        ))}
      </div>

      {/* Flying plus markers */}
      <div ref={flyTLRef} className="pl-flying-plus" style={{ opacity: 0 }}>{PLUS_SVG}</div>
      <div ref={flyTRRef} className="pl-flying-plus" style={{ opacity: 0 }}>{PLUS_SVG}</div>
      <div ref={flyBLRef} className="pl-flying-plus" style={{ opacity: 0 }}>{PLUS_SVG}</div>
      <div ref={flyBRRef} className="pl-flying-plus" style={{ opacity: 0 }}>{PLUS_SVG}</div>

      {/* Center content */}
      <div ref={centerRef} className="pl-overlay-center">
        <div ref={logoWrapRef} className="pl-overlay-logo-wrap">
          {/* Black box */}
          <div ref={logoBoxRef} className="pl-logo-black-box" />

          {/* Border draw SVG */}
          <svg ref={borderSvgRef} className="pl-border-svg" style={{ opacity: 0 }}>
            <rect
              ref={borderRectRef}
              x="0.75" y="0.75" width="1" height="1"
              fill="none" stroke="#434343" strokeWidth="1.5"
              strokeDasharray="1" strokeDashoffset="1"
              pathLength={1} rx="2"
            />
          </svg>

          {/* Logo corner plus markers */}
          <div ref={cornerTLRef} className="pl-logo-corner-plus tl">{PLUS_SVG}</div>
          <div ref={cornerTRRef} className="pl-logo-corner-plus tr">{PLUS_SVG}</div>
          <div ref={cornerBLRef} className="pl-logo-corner-plus bl">{PLUS_SVG}</div>
          <div ref={cornerBRRef} className="pl-logo-corner-plus br">{PLUS_SVG}</div>

          {/* T path 1 */}
          <svg ref={t1Ref} className="pl-t-path" viewBox="-79.5 -31.4 662 640" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="pl-clip1">
                <path fillRule="evenodd" clipRule="evenodd" d={T1_PATH} />
              </clipPath>
            </defs>
            <path fillRule="evenodd" clipRule="evenodd" d={T1_PATH} fill="none" stroke="#aaa" strokeWidth="1.5" />
            <g clipPath="url(#pl-clip1)" ref={pg1Ref} />
            <g clipPath="url(#pl-clip1)" ref={lg1Ref} />
          </svg>

          {/* T path 2 */}
          <svg ref={t2Ref} className="pl-t-path" viewBox="-79.5 -31.4 662 640" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="pl-clip2">
                <path fillRule="evenodd" clipRule="evenodd" d={T2_PATH} />
              </clipPath>
            </defs>
            <path fillRule="evenodd" clipRule="evenodd" d={T2_PATH} fill="none" stroke="#aaa" strokeWidth="1.5" />
            <g clipPath="url(#pl-clip2)" ref={pg2Ref} />
            <g clipPath="url(#pl-clip2)" ref={lg2Ref} />
          </svg>

          {/* T path 3 */}
          <svg ref={t3Ref} className="pl-t-path" viewBox="-79.5 -31.4 662 640" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="pl-clip3">
                <path fillRule="evenodd" clipRule="evenodd" d={T3_PATH} />
              </clipPath>
            </defs>
            <path fillRule="evenodd" clipRule="evenodd" d={T3_PATH} fill="none" stroke="#aaa" strokeWidth="1.5" />
            <g clipPath="url(#pl-clip3)" ref={pg3Ref} />
            <g clipPath="url(#pl-clip3)" ref={lg3Ref} />
          </svg>

          {/* Page label (used by PageTransition, shown during belt transitions) */}
          <div ref={labelRef} className="pl-overlay-page-label" />
        </div>

        {/* Tagline */}
        <div className="pl-overlay-tagline">
          <span ref={word1Ref} className="pl-tag-word">Inspire</span>
          <span ref={dot1Ref} className="pl-tag-dot">·</span>
          <span ref={word2Ref} className="pl-tag-word">Innovate</span>
          <span ref={dot2Ref} className="pl-tag-dot">·</span>
          <span ref={word3Ref} className="pl-tag-word">Impact</span>
        </div>

        {/* Counter */}
        <div ref={counterRef} className="pl-overlay-counter">
          <div className="pl-slot-reel"><div ref={strip0Ref} className="pl-slot-strip" /></div>
          <div className="pl-slot-reel"><div ref={strip1Ref} className="pl-slot-strip" /></div>
          <div className="pl-slot-reel"><div ref={strip2Ref} className="pl-slot-strip" /></div>
        </div>
      </div>
    </>
  );
}
