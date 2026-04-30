"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useSiteSound } from "@/components/SiteSoundContext";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";
import LinePlus from "@/components/LinePlus";
import { useTransitionReady } from "@/components/Transition";

type Project = {
  pos: "left" | "right" | "center";
  size: "small" | "medium" | "large" | "xlarge";
  title: string;
  desc: string;
  year: string;
  img: string;
  link?: boolean;
};

const PROJECTS: Project[] = [
  {
    pos: "left",
    size: "large",
    title: "Velora Studio",
    desc: "Architecture design\nfor a modern brand.",
    year: "2025",
    img: "/assets/orbit-01.jpg",
    link: true,
  },
  {
    pos: "right",
    size: "medium",
    title: "Northform™",
    desc: "Brand identity system\nand visual language.",
    year: "2025",
    img: "/assets/orbit-02.jpg",
  },
  {
    pos: "center",
    size: "xlarge",
    title: "Neue Montreal",
    desc: "Typography system\nfor digital products.",
    year: "2024",
    img: "/assets/orbit-03.jpg",
    link: true,
  },
  {
    pos: "left",
    size: "small",
    title: "One.Dot",
    desc: "Tailored website design\nfor refined brands.",
    year: "2025",
    img: "/assets/orbit-04.jpg",
  },
  {
    pos: "right",
    size: "large",
    title: "Axora Ceramics",
    desc: "Brand identity and\neditorial design.",
    year: "2025",
    img: "/assets/orbit-05.jpg",
    link: true,
  },
  {
    pos: "left",
    size: "medium",
    title: "Grinex Projects",
    desc: "Sustainable material\nbrand system.",
    year: "2025",
    img: "/assets/orbit-07.jpg",
  },
  {
    pos: "center",
    size: "xlarge",
    title: "Royal Festival",
    desc: "Visual identity for\nan event series.",
    year: "2024",
    img: "/assets/orbit-08.jpg",
    link: true,
  },
  {
    pos: "right",
    size: "small",
    title: "Formline Studio",
    desc: "Interface design for\nselected work.",
    year: "2025",
    img: "/assets/orbit-09.jpg",
  },
  {
    pos: "left",
    size: "large",
    title: "Molson Coors",
    desc: "Office building\narchitecture design.",
    year: "2024",
    img: "/assets/orbit-01.jpg",
    link: true,
  },
  {
    pos: "right",
    size: "medium",
    title: "Dark Identity",
    desc: "Branding and digital\nsystems at scale.",
    year: "2025",
    img: "/assets/orbit-02.jpg",
  },
  {
    pos: "center",
    size: "xlarge",
    title: "Typeform Lab",
    desc: "Font design and\ntype specimen work.",
    year: "2024",
    img: "/assets/orbit-03.jpg",
    link: true,
  },
  {
    pos: "left",
    size: "small",
    title: "Refined Co.",
    desc: "Minimal website for\na luxury consultancy.",
    year: "2025",
    img: "/assets/orbit-04.jpg",
  },
  {
    pos: "right",
    size: "large",
    title: "Bloom Studio",
    desc: "Ceramic brand identity\nand packaging design.",
    year: "2024",
    img: "/assets/orbit-05.jpg",
    link: true,
  },
  {
    pos: "left",
    size: "medium",
    title: "Zero Point",
    desc: "Sustainable brand\nfor architecture firm.",
    year: "2025",
    img: "/assets/orbit-07.jpg",
  },
  {
    pos: "center",
    size: "xlarge",
    title: "Festival Noir",
    desc: "Event identity and\nmotion design work.",
    year: "2024",
    img: "/assets/orbit-08.jpg",
    link: true,
  },
  {
    pos: "right",
    size: "large",
    title: "Selected Works",
    desc: "Portfolio curation and\nUI/UX direction.",
    year: "2025",
    img: "/assets/orbit-09.jpg",
    link: true,
  },
  {
    pos: "left",
    size: "medium",
    title: "Archi Collective",
    desc: "Architecture studio\nbranding system.",
    year: "2024",
    img: "/assets/orbit-01.jpg",
  },
  {
    pos: "right",
    size: "small",
    title: "Identity Works",
    desc: "Complete brand identity\nand digital presence.",
    year: "2025",
    img: "/assets/orbit-02.jpg",
  },
  {
    pos: "center",
    size: "xlarge",
    title: "Letterform",
    desc: "Custom typeface for\na global publication.",
    year: "2024",
    img: "/assets/orbit-03.jpg",
    link: true,
  },
  {
    pos: "right",
    size: "medium",
    title: "Dot Collective",
    desc: "Brand system for a\ncreative collective.",
    year: "2025",
    img: "/assets/orbit-04.jpg",
  },
];

const ORBIT_IMGS = [
  "/assets/orbit-01.jpg",
  "/assets/orbit-02.jpg",
  "/assets/orbit-03.jpg",
  "/assets/orbit-04.jpg",
  "/assets/orbit-05.jpg",
  "/assets/orbit-07.jpg",
  "/assets/orbit-08.jpg",
  "/assets/orbit-09.jpg",
];

const FT_THUMBS = [
  "/assets/orbit-01.jpg",
  "/assets/orbit-02.jpg",
  "/assets/orbit-03.jpg",
  "/assets/orbit-04.jpg",
  "/assets/orbit-05.jpg",
  "/assets/orbit-07.jpg",
  "/assets/orbit-08.jpg",
  "/assets/orbit-09.jpg",
  "/assets/orbit-01.jpg",
  "/assets/orbit-03.jpg",
  "/assets/orbit-05.jpg",
  "/assets/orbit-07.jpg",
];

export default function OurWorkListing() {
  const { soundEnabled } = useSiteSound();
  const soundEnabledRef = useRef(soundEnabled);

  // Keep ref in sync with global sound state
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const ready = useTransitionReady();

  useEffect(() => {
    if (typeof window === "undefined" || !ready) return;

    // Force scroll to top, mirroring inline head script.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const forceTop = () => {
      document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    forceTop();
    window.addEventListener("beforeunload", forceTop);
    window.addEventListener("pagehide", forceTop);
    const onPageShow = () => {
      forceTop();
      requestAnimationFrame(forceTop);
    };
    window.addEventListener("pageshow", onPageShow);

    // ===== main.js: project-card sizing/position =====
    const posMap: Record<string, { ml: string; mr: string }> = {
      left: { ml: "4%", mr: "auto" },
      right: { ml: "auto", mr: "4%" },
      center: { ml: "auto", mr: "auto" },
    };
    const sizeMap: Record<string, { w: string; ar: string }> = {
      small: { w: "29%", ar: "812/568" },
      medium: { w: "36%", ar: "812/568" },
      large: { w: "41%", ar: "812/568" },
      xlarge: { w: "46%", ar: "812/568" },
    };
    document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
      card.removeAttribute("style");
      const pm = posMap[card.dataset.pos || "left"] || posMap.left;
      const sm = sizeMap[card.dataset.size || "medium"] || sizeMap.medium;
      card.style.marginLeft = pm.ml;
      card.style.marginRight = pm.mr;
      card.style.width = sm.w;
      const img = card.querySelector<HTMLImageElement>(".card-thumb img");
      if (img) img.style.aspectRatio = sm.ar;
    });

    // ===== Lenis =====
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    } as any);
    (window as any)._lenis = lenis;
    window.scrollTo(0, 0);
    (lenis as any).scrollTo(0, { immediate: true, force: true });
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      (lenis as any).scrollTo(0, { immediate: true, force: true });
    });
    gsap.ticker.add((time: number) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // ===== intro.js =====
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));
    const clamp01 = (v: number) => clamp(v, 0, 1);
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const THUMB_W = 170,
      THUMB_H = 114;
    const WHEEL_NEEDED = 1600;
    const DONE_ON = 0.9995,
      DONE_OFF = 0.985;
    const FLOAT_RESUME_AT = 0.0001;
    const TOP_RERENDER_DELAY = 1400;
    const RERENDER_FADE_OUT = 420;
    const RERENDER_FADE_IN = 720;
    const INTRO_STAGGER = 70;
    const INTRO_DUR = 760;
    const TILT_INNER = 1.05;

    let ORBIT_R_INNER = 220;
    function computeRadii() {
      ORBIT_R_INNER = Math.floor(window.innerWidth * 0.26);
      const maxYInner = window.innerHeight * 0.36;
      if (ORBIT_R_INNER * Math.cos(TILT_INNER) > maxYInner)
        ORBIT_R_INNER = Math.floor(maxYInner / Math.cos(TILT_INNER));
      if (ORBIT_R_INNER < 80) ORBIT_R_INNER = 80;
    }

    type ThumbDatum = any;
    let thumbData: ThumbDatum[] = [];
    let dotX = 0,
      dotY = 0;
    let animDone = false;
    let wheelAccum = 0;
    let wheelTarget = 0;
    let lastTs = 0;
    let orbitTime = 0;
    let raw = 0;
    let rawSmooth = 0;
    let topRerenderPausedUntil = 0;
    let prevRaw = 0;
    let convergeLocked = false;
    let bandW = 0;
    let bandStarts: number[] = [];
    let waveTime = 0;
    let logoTiltRX = 0,
      logoTiltRY = 0;
    let logoIntroStart = 0;
    let _refreshRaf = 0;
    let scrollDir = 0;

    const STRIP_LINE_COUNT = 28;
    const STRIP_DRAW_WINDOW = 0.18;
    const STRIP_STAGGER =
      (1 - STRIP_DRAW_WINDOW) / Math.max(1, STRIP_LINE_COUNT - 1);
    let _logoSvgReady = false;
    let _fieldLines1: any[] | null = null,
      _fieldLines2: any[] | null = null,
      _fieldLines3: any[] | null = null;

    const logoSvgEls = () => ({
      t1: document.querySelector<SVGSVGElement>("#t1"),
      t2: document.querySelector<SVGSVGElement>("#t2"),
      t3: document.querySelector<SVGSVGElement>("#t3"),
      pg1: document.querySelector<SVGGElement>("#particles1"),
      pg2: document.querySelector<SVGGElement>("#particles2"),
      pg3: document.querySelector<SVGGElement>("#particles3"),
      lg1: document.querySelector<SVGGElement>("#lightning1"),
      lg2: document.querySelector<SVGGElement>("#lightning2"),
      lg3: document.querySelector<SVGGElement>("#lightning3"),
    });
    function fieldLineH(y: number, seed: number) {
      const W = 578,
        steps = 60,
        freq = 1.2 + ((seed * 0.37) % 0.8),
        amp = 8 + ((seed * 0.61) % 14),
        phase = (seed * 1.7) % (Math.PI * 2);
      let d = `M -10 ${y.toFixed(1)}`;
      for (let i = 1; i <= steps; i++) {
        const x = (i / steps) * (W + 20) - 10;
        const dy = amp * Math.sin((x / W) * freq * Math.PI + phase);
        d += ` L ${x.toFixed(1)} ${(y + dy).toFixed(1)}`;
      }
      return d;
    }
    function fieldLineV(x: number, seed: number) {
      const H = 586,
        steps = 60,
        freq = 1.2 + ((seed * 0.37) % 0.8),
        amp = 8 + ((seed * 0.61) % 14),
        phase = (seed * 1.7) % (Math.PI * 2);
      let d = `M ${x.toFixed(1)} -10`;
      for (let i = 1; i <= steps; i++) {
        const y = (i / steps) * (H + 20) - 10;
        const dx = amp * Math.sin((y / H) * freq * Math.PI + phase);
        d += ` L ${(x + dx).toFixed(1)} ${y.toFixed(1)}`;
      }
      return d;
    }
    function genFieldLines(direction: "top-down" | "bottom-up" | "left-right") {
      return Array.from({ length: STRIP_LINE_COUNT }, (_, i) => {
        const seed = i * 3.14159 + 1.618;
        if (direction === "top-down") {
          const spacing = 586 / STRIP_LINE_COUNT,
            y = (i + 0.5) * spacing;
          return {
            path: fieldLineH(y, seed),
            delay: i * STRIP_STAGGER,
            fillX: -10,
            fillY: y - spacing / 2,
            fillW: 600,
            fillH: spacing + 1,
            axis: "h",
          };
        }
        if (direction === "bottom-up") {
          const spacing = 586 / STRIP_LINE_COUNT,
            y = 586 - (i + 0.5) * spacing;
          return {
            path: fieldLineH(y, seed),
            delay: i * STRIP_STAGGER,
            fillX: -10,
            fillY: y,
            fillW: 600,
            fillH: spacing + 1,
            axis: "h",
          };
        }
        const spacing = 578 / STRIP_LINE_COUNT,
          x = (i + 0.5) * spacing;
        return {
          path: fieldLineV(x, seed),
          delay: i * STRIP_STAGGER,
          fillX: x - spacing / 2,
          fillY: -10,
          fillW: spacing + 1,
          fillH: 610,
          axis: "v",
        };
      });
    }
    function ensureLogoSvg() {
      const e = logoSvgEls();
      if (!e.t1 || !e.t2 || !e.t3) return null;
      if (!_logoSvgReady) {
        [e.lg1, e.lg2, e.lg3].forEach((g) => {
          if (g) (g as any).style.display = "block";
        });
        [e.t1, e.t2, e.t3].forEach((t) => {
          if (t) {
            t.style.opacity = "0";
            (t as any).style.transformOrigin = "50% 50%";
          }
        });
        _fieldLines1 = genFieldLines("bottom-up");
        _fieldLines2 = genFieldLines("left-right");
        _fieldLines3 = genFieldLines("top-down");
        _logoSvgReady = true;
      }
      return e;
    }
    function renderSvgStrip(
      drawGroup: SVGGElement | null,
      fillGroup: SVGGElement | null,
      lines: any[],
      progress: number,
    ) {
      if (!drawGroup || !fillGroup) return;
      if (progress <= 0) {
        drawGroup.innerHTML = "";
        fillGroup.innerHTML = "";
        return;
      }
      let lineHTML = "",
        fillHTML = "";
      lines.forEach((fl: any) => {
        const drawP = clamp01((progress - fl.delay) / STRIP_DRAW_WINDOW);
        if (drawP <= 0) return;
        const fillP = easeInOut(
          clamp01((progress - fl.delay) / (STRIP_DRAW_WINDOW * 1.4)),
        );
        if (fillP > 0) {
          if (fl.axis === "h")
            fillHTML += `<rect x="${fl.fillX}" y="${fl.fillY.toFixed(1)}" width="${fl.fillW}" height="${(fl.fillH * fillP).toFixed(1)}" fill="#D0D0D0"/>`;
          else
            fillHTML += `<rect x="${fl.fillX.toFixed(1)}" y="-10" width="${(fl.fillW * fillP).toFixed(1)}" height="610" fill="#D0D0D0"/>`;
        }
        const age = (progress - fl.delay) / (STRIP_DRAW_WINDOW * 2.2);
        const lineOpacity = Math.max(0, 1 - easeInOut(clamp01(age)));
        if (lineOpacity > 0.01) {
          const offset = (1 - easeInOut(drawP)).toFixed(4);
          lineHTML += `<path d="${fl.path}" fill="none" stroke="#303640" stroke-width="1.5" stroke-opacity="0.7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${offset}" opacity="${lineOpacity.toFixed(3)}"/>`;
        }
      });
      fillGroup.innerHTML = fillHTML;
      drawGroup.innerHTML = lineHTML;
    }
    function resetSvgStrips() {
      const e = logoSvgEls();
      [e.pg1, e.pg2, e.pg3, e.lg1, e.lg2, e.lg3].forEach((g) => {
        if (g) g.innerHTML = "";
      });
    }
    function drawLogoIntroParts(ts: number) {
      const e = ensureLogoSvg();
      if (!e) return true;
      const start = logoIntroStart || ts;
      const dur = 700;
      const defs = [
        { el: e.t3!, delay: 0, x: -120, y: 0, rot: -60, axis: "Y", z: 28 },
        { el: e.t1!, delay: 200, x: 120, y: 0, rot: 60, axis: "Y", z: -32 },
        { el: e.t2!, delay: 400, x: 0, y: 80, rot: -50, axis: "X", z: -24 },
      ];
      const now = ts || performance.now();
      const allDone = now - start >= 400 + dur;
      defs.forEach((d) => {
        const local = clamp01((now - start - d.delay) / dur);
        const p = easeOutCubic(local);
        const inv = 1 - p;
        const scale = 1.5 + (1 - 1.5) * p;
        d.el.style.opacity = p.toFixed(3);
        (d.el as any).style.transform =
          `translate(${(d.x * inv).toFixed(2)}px,${(d.y * inv).toFixed(2)}px) rotate${d.axis}(${(d.rot * inv).toFixed(2)}deg) rotateZ(${(d.z * inv).toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      });
      return allDone;
    }
    function drawLogoFill(fillProgress: number, ts?: number) {
      const e = ensureLogoSvg();
      if (!e) return;
      if (!logoIntroStart && ts) logoIntroStart = ts;
      if (fillProgress <= 0.001) {
        resetSvgStrips();
        drawLogoIntroParts(ts ?? performance.now());
        return;
      }
      [e.t1, e.t2, e.t3].forEach((t) => {
        if (t) {
          t.style.opacity = "1";
          (t as any).style.transform = "translate(0,0) scale(1)";
        }
      });
      renderSvgStrip(
        e.lg1,
        e.pg1,
        _fieldLines1 || genFieldLines("bottom-up"),
        fillProgress,
      );
      renderSvgStrip(
        e.lg2,
        e.pg2,
        _fieldLines2 || genFieldLines("left-right"),
        fillProgress,
      );
      renderSvgStrip(
        e.lg3,
        e.pg3,
        _fieldLines3 || genFieldLines("top-down"),
        fillProgress,
      );
    }

    function getCenter() {
      const h = document.querySelector<HTMLElement>("#page-header");
      if (!h) return { cx: window.innerWidth / 2, cy: window.innerHeight / 2 };
      const r = h.getBoundingClientRect();
      const upOffset = window.innerHeight * 0.16;
      return {
        cx: window.innerWidth / 2 - r.left,
        cy: window.innerHeight / 2 - r.top - upOffset,
      };
    }
    function spawnThumb(td: any) {
      const vw = window.innerWidth,
        vh = window.innerHeight;
      td.floatX = Math.random() * (vw + td.TW) - td.TW;
      td.floatY = Math.random() * (vh + td.TH) - td.TH;
      const speed = 18 + Math.random() * 28;
      const angle = Math.random() * Math.PI * 2;
      td.floatVX = Math.cos(angle) * speed;
      td.floatVY = Math.sin(angle) * speed;
      td.floatScale = 0.35 + Math.random() * 0.65;
      td.floatAlpha = 0;
      td.floatAge = 0;
      td.floatLife = 6 + Math.random() * 6;
    }
    function orbitPos3D(td: any) {
      const scale = td.floatScale || 0.7;
      const age = td.floatAge || 0;
      const life = td.floatLife || 8;
      const delayActive = performance.now() < topRerenderPausedUntil;
      const baseAlpha = delayActive
        ? 1
        : age < 0.8
          ? age / 0.8
          : age > life - 1.2
            ? Math.max(0, (life - age) / 1.2)
            : 1;
      const alpha =
        typeof td._alphaOverride === "number"
          ? clamp01(td._alphaOverride)
          : baseAlpha;
      const screenX = (td.floatX || 0) + td.TW / 2;
      const screenY = (td.floatY || 0) + td.TH / 2;
      return {
        x: td.floatX || 0,
        y: td.floatY || 0,
        screenX,
        screenY,
        Z3: 0,
        depthN: scale,
        depthScale: scale,
        depthAlpha: alpha,
      };
    }
    function placeThumbs() {
      computeRadii();
      const header = document.querySelector<HTMLElement>("#page-header");
      if (!header) return;
      const thumbs = Array.from(header.querySelectorAll<HTMLElement>(".ft"));
      const TW = THUMB_W,
        TH = THUMB_H;
      let pool = [
        ...ORBIT_IMGS,
        ...ORBIT_IMGS,
        ...ORBIT_IMGS,
        ...ORBIT_IMGS,
      ].slice(0, thumbs.length);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      thumbData = [];
      thumbs.forEach((el, i) => {
        el.style.cssText = `position:absolute;width:${TW}px;height:${TH}px;opacity:0;visibility:visible;left:0px;top:0px;transform-origin:center center;border-radius:4px;overflow:hidden;will-change:transform,opacity,left,top;box-shadow:none;`;
        const img = el.querySelector("img");
        if (img) {
          (img as HTMLImageElement).src = pool[i % pool.length];
          (img as HTMLImageElement).style.cssText =
            "width:100%;height:100%;object-fit:cover;display:block;";
        }
        const td: any = {
          el,
          TW,
          TH,
          warpAngle: 0,
          warpPhase: 0,
          warpSpeed: 0,
          floatX: 0,
          floatY: 0,
          floatVX: 0,
          floatVY: 0,
          floatScale: 0.7,
          floatAlpha: 0,
          floatAge: 0,
          floatLife: 8,
          R: ORBIT_R_INNER,
          slotAngle: 0,
          direction: 1,
          tilt: TILT_INNER,
          cyOffset: 0,
          isOuter: false,
          flyInDone: true,
          flyInStartTs: null,
          flyInStarted: true,
          _introStart: performance.now() + i * INTRO_STAGGER,
          _introDone: false,
          fromX: 0,
          fromY: 0,
          curX: 0,
          curY: 0,
          flyInProgress: 1,
          curRotX: 0,
          curRotY: 0,
        };
        td.floatAge = (i / thumbs.length) * 8;
        spawnThumb(td);
        td.floatAge = 0.9 + (i / Math.max(1, thumbs.length)) * 0.15;
        thumbData[i] = td;
      });
      const OVERLAP = 0.8;
      const n = thumbData.length;
      bandW = 1 / (1 + (n - 1) * (1 - OVERLAP));
      const step = bandW * (1 - OVERLAP);
      bandStarts = thumbData.map((_, i) => i * step);
      orbitTime = 0;
      raw = 0;
    }
    function updateDotPos() {
      const h = document.querySelector<HTMLElement>("#page-header");
      dotX = window.innerWidth / 2;
      dotY = window.innerHeight / 2;
      if (h) {
        const r = h.getBoundingClientRect();
        dotX -= r.left;
        dotY -= r.top;
      }
    }
    function getThumbEp(idx: number, r: number) {
      const start = bandStarts[idx];
      const local = clamp01((r - start) / bandW);
      return easeInOut(local);
    }
    function getIntroState(td: any, _idx: number, ts: number) {
      if (td._introDone) return { alpha: 1, scale: 1, y: 0 };
      const st = td._introStart || 0;
      const t = clamp01((ts - st) / INTRO_DUR);
      const e = easeOutCubic(t);
      if (t >= 1) td._introDone = true;
      return { alpha: e, scale: 0.86 + 0.14 * e, y: (1 - e) * 22 };
    }
    function applyThumb3D(
      td: any,
      pos: any,
      scaleMulti?: number,
      alphaMulti?: number,
    ) {
      const s = pos.depthScale * (scaleMulti !== undefined ? scaleMulti : 1);
      const a = pos.depthAlpha * (alphaMulti !== undefined ? alphaMulti : 1);
      const speed = Math.sqrt((td.floatVX || 0) ** 2 + (td.floatVY || 0) ** 2);
      const driftRotY = speed > 0 ? (-(td.floatVX || 0) / speed) * 8 : 0;
      const driftRotX = speed > 0 ? ((td.floatVY || 0) / speed) * 5 : 0;
      const mt = (window as any)._mouseTilt || {
        mx: window.innerWidth / 2,
        my: window.innerHeight / 2,
      };
      const thumbCX = pos.x + td.TW / 2;
      const thumbCY = pos.y + td.TH / 2;
      const mdx = (mt.mx - thumbCX) / (window.innerWidth / 2);
      const mdy = (mt.my - thumbCY) / (window.innerHeight / 2);
      const mouseRotY = mdx * 14;
      const mouseRotX = -mdy * 10;
      const rotY = driftRotY * 0.3 + mouseRotY * 0.7;
      const rotX = driftRotX * 0.3 + mouseRotX * 0.7;
      const lerpT = 0.06;
      td.curRotY = td.curRotY + (rotY - td.curRotY) * lerpT;
      td.curRotX = td.curRotX + (rotX - td.curRotX) * lerpT;
      td.el.style.transform = `translate3d(${pos.x}px,${pos.y}px,0) scale(${Math.max(0.01, s)}) perspective(600px) rotateY(${td.curRotY.toFixed(3)}deg) rotateX(${td.curRotX.toFixed(3)}deg)`;
      const aClamped = clamp01(a);
      if (td._lastA !== aClamped) {
        td.el.style.opacity = String(aClamped);
        td._lastA = aClamped;
      }
      const z = Math.round(pos.depthN * 15 + 1);
      if (td._lastZ !== z) {
        td.el.style.zIndex = String(z);
        td._lastZ = z;
      }
    }

    let introRafId = 0;
    function loop(ts: number) {
      introRafId = requestAnimationFrame(loop);
      if (animDone) return;
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      const scrubK = 1 - Math.pow(0.001, dt * 4.5);
      wheelAccum += (wheelTarget - wheelAccum) * scrubK;
      if (Math.abs(wheelTarget - wheelAccum) < 0.5) wheelAccum = wheelTarget;
      const prevRawLocal = prevRaw;
      raw = Math.min(1, wheelAccum / WHEEL_NEEDED);
      if (raw < FLOAT_RESUME_AT) {
        raw = 0;
        wheelAccum = 0;
        wheelTarget = 0;
      }
      rawSmooth = raw;
      if (raw > FLOAT_RESUME_AT)
        topRerenderPausedUntil = Math.max(topRerenderPausedUntil, ts + 1);
      const enteringConverge = raw > FLOAT_RESUME_AT && !convergeLocked;
      const leavingConverge = raw <= FLOAT_RESUME_AT && convergeLocked;
      orbitTime += dt;
      const allLanded =
        thumbData.length > 0 && thumbData.every((td) => td.flyInDone);
      (window as any)._orbitReady = allLanded;
      const delta = raw - prevRawLocal;
      const newDir = delta > 0.0001 ? 1 : delta < -0.0001 ? -1 : scrollDir;
      if (newDir !== scrollDir) scrollDir = newDir;
      if (raw === 0) scrollDir = 0;
      const ce = rawSmooth * rawSmooth * rawSmooth;
      document.body.style.backgroundColor = "#040508";
      const dot = document.querySelector<HTMLElement>("#header-dot");
      if (dot) {
        dot.style.visibility = "visible";
        dot.style.transition = "";
        dot.style.opacity = ce >= 0.999 ? "0" : "1";
      }
      {
        const mt = (window as any)._mouseTilt;
        const lc = document.querySelector<HTMLElement>("#logo-circle");
        const ox = window.innerWidth / 2;
        const oy = window.innerHeight / 2;
        const tdx = (mt.mx - ox) / (window.innerWidth / 2);
        const tdy = (mt.my - oy) / (window.innerHeight / 2);
        const targetRY = tdx * 18;
        const targetRX = -tdy * 13;
        logoTiltRX += (targetRX - logoTiltRX) * 0.07;
        logoTiltRY += (targetRY - logoTiltRY) * 0.07;
        if (lc) {
          lc.style.opacity = "1";
          lc.style.transform = `perspective(800px) rotateX(${logoTiltRX.toFixed(2)}deg) rotateY(${logoTiltRY.toFixed(2)}deg)`;
        }
        if (dot)
          dot.style.transform = `translate3d(-50%, -50%, 0) scale(1) perspective(800px) rotateX(${logoTiltRX.toFixed(2)}deg) rotateY(${logoTiltRY.toFixed(2)}deg)`;
      }
      waveTime += dt;
      drawLogoFill(rawSmooth, ts);
      const { cx, cy } = getCenter();
      for (let i = 0; i < thumbData.length; i++) {
        const td = thumbData[i];
        td.floatX += td.floatVX * dt;
        td.floatY += td.floatVY * dt;
        td.floatAge += dt;
        const vw = window.innerWidth,
          vh = window.innerHeight;
        const offscreen =
          td.floatX < -td.TW * 2 ||
          td.floatX > vw + td.TW * 2 ||
          td.floatY < -td.TH * 2 ||
          td.floatY > vh + td.TH * 2;
        const allowTopRerender = raw <= 0.001 && ts >= topRerenderPausedUntil;
        const needsRespawn =
          allowTopRerender && (td.floatAge >= td.floatLife || offscreen);
        if (needsRespawn || td._respawnState) {
          if (!td._respawnState) {
            const currentAlpha = typeof td._lastA === "number" ? td._lastA : 1;
            td._respawnState = {
              phase: "out",
              start: ts,
              fromAlpha: currentAlpha,
            };
          }
          const st = td._respawnState;
          if (st.phase === "out") {
            const t = clamp01((ts - st.start) / RERENDER_FADE_OUT);
            td._alphaOverride = st.fromAlpha * (1 - easeInOut(t));
            if (t >= 1) {
              td.el.style.opacity = "0";
              td._lastA = 0;
              spawnThumb(td);
              td.floatAge = 0;
              td._respawnState = { phase: "in", start: ts };
              td._alphaOverride = 0;
            }
          } else if (st.phase === "in") {
            const t = clamp01((ts - st.start) / RERENDER_FADE_IN);
            td._alphaOverride = easeOutCubic(t);
            if (t >= 1) {
              delete td._respawnState;
              delete td._alphaOverride;
            }
          }
        } else {
          delete td._alphaOverride;
          if (td.floatX < -td.TW * 2) td.floatX = vw + td.TW;
          else if (td.floatX > vw + td.TW * 2) td.floatX = -td.TW;
          if (td.floatY < -td.TH * 2) td.floatY = vh + td.TH;
          else if (td.floatY > vh + td.TH * 2) td.floatY = -td.TH;
        }
      }
      const livePosArr = thumbData.map((td) => orbitPos3D(td));
      if (enteringConverge) {
        thumbData.forEach((td, i) => {
          const lp = livePosArr[i];
          td._moveFromX = lp.x;
          td._moveFromY = lp.y;
          td._moveFromScale = lp.depthScale;
          td._moveFromAlpha = lp.depthAlpha;
          td._moveFromDepth = lp.depthN;
          td._lockFloatX = td.floatX;
          td._lockFloatY = td.floatY;
        });
        convergeLocked = true;
      }
      if (leavingConverge) {
        topRerenderPausedUntil = ts + TOP_RERENDER_DELAY;
        const n = Math.max(1, thumbData.length);
        thumbData.forEach((td, idx) => {
          td._convInit = false;
          const life = td.floatLife || 8;
          td.floatAge = (idx / n) * life * 0.72;
          delete td._moveFromX;
          delete td._moveFromY;
          delete td._moveFromScale;
          delete td._moveFromAlpha;
          delete td._moveFromDepth;
          delete td._lockFloatX;
          delete td._lockFloatY;
          delete td._respawnState;
          delete td._alphaOverride;
        });
        convergeLocked = false;
      }
      thumbData.forEach((td, idx) => {
        if (td.el.style.visibility === "hidden") {
          td.el.style.visibility = "visible";
          td.el.style.transition = "";
        }
        if (!td.flyInStarted) {
          td.el.style.opacity = "0";
          return;
        }
        const livePos = livePosArr[idx];
        if (raw > 0) {
          const ep = getThumbEp(idx, rawSmooth);
          const cx2 = dotX - td.TW / 2,
            cy2 = dotY - td.TH / 2;
          const driftX =
            typeof td._lockFloatX === "number" ? td.floatX - td._lockFloatX : 0;
          const driftY =
            typeof td._lockFloatY === "number" ? td.floatY - td._lockFloatY : 0;
          const fromX =
            typeof td._moveFromX === "number"
              ? td._moveFromX + driftX
              : livePos.x;
          const fromY =
            typeof td._moveFromY === "number"
              ? td._moveFromY + driftY
              : livePos.y;
          const fromScale =
            typeof td._moveFromScale === "number"
              ? td._moveFromScale
              : livePos.depthScale;
          const fromAlpha =
            typeof td._moveFromAlpha === "number"
              ? td._moveFromAlpha
              : livePos.depthAlpha;
          const fromDepth =
            typeof td._moveFromDepth === "number"
              ? td._moveFromDepth
              : livePos.depthN;
          const x = fromX + (cx2 - fromX) * ep;
          const y = fromY + (cy2 - fromY) * ep;
          td.curX = x;
          td.curY = y;
          const scaleDown = 1 - ep * 0.92;
          const alphaFade = ep > 0.85 ? 1 - (ep - 0.85) / 0.15 : 1;
          const flatFactor = 1 - ep;
          const dx = (livePos.screenX - cx) / td.R;
          const dy2 = (livePos.screenY - cy) / td.R;
          const mt2 = (window as any)._mouseTilt || {
            mx: window.innerWidth / 2,
            my: window.innerHeight / 2,
          };
          const tcx = x + td.TW / 2;
          const tcy = y + td.TH / 2;
          const mrdx = (mt2.mx - tcx) / (window.innerWidth / 2);
          const mrdy = (mt2.my - tcy) / (window.innerHeight / 2);
          const mouseRotY2 = mrdx * 14;
          const mouseRotX2 = -mrdy * 10;
          const orbitRotY = -dx * 32 * flatFactor;
          const orbitRotX = dy2 * 22 * flatFactor;
          const rotY = orbitRotY * 0.4 + mouseRotY2 * 0.6 * flatFactor;
          const rotX = orbitRotX * 0.4 + mouseRotX2 * 0.6 * flatFactor;
          const lerpS = 0.1;
          td.curRotY = td.curRotY + (rotY - td.curRotY) * lerpS;
          td.curRotX = td.curRotX + (rotX - td.curRotX) * lerpS;
          const targetScale = fromScale * scaleDown;
          td._curScale = targetScale;
          td.el.style.transform = `translate3d(${x}px,${y}px,0) scale(${Math.max(0.01, td._curScale)}) perspective(600px) rotateY(${td.curRotY.toFixed(3)}deg) rotateX(${td.curRotX.toFixed(3)}deg)`;
          const aV = Math.max(0, fromAlpha * alphaFade);
          if (td._lastA !== aV) {
            td.el.style.opacity = String(aV);
            td._lastA = aV;
          }
          const zV = Math.round(fromDepth * 20 + 1);
          if (td._lastZ !== zV) {
            td.el.style.zIndex = String(zV);
            td._lastZ = zV;
          }
          return;
        }
        td.curX = livePos.x;
        td.curY = livePos.y;
        td._convInit = false;
        const intro = getIntroState(td, idx, ts);
        const introPos = intro.y
          ? Object.assign({}, livePos, { y: livePos.y + intro.y })
          : livePos;
        applyThumb3D(td, introPos, intro.scale, intro.alpha);
      });
      prevRaw = raw;
    }

    let _pageLinesInited = false;
    function _initPageLinesOnce() {
      if (_pageLinesInited) return;
      if ((window as any)._initPageLines) {
        _pageLinesInited = true;
        (window as any)._initPageLines();
      }
    }
    function setProgress(p: number) {
      p = Math.max(0, Math.min(1, p));
      wheelAccum = p * WHEEL_NEEDED;
      wheelTarget = wheelAccum;
      const wasDone = (window as any)._thumbAnimDone;
      if (p >= DONE_ON) {
        (window as any)._thumbAnimDone = true;
        animDone = false;
      } else if (p <= DONE_OFF) {
        (window as any)._thumbAnimDone = false;
      }
      if ((window as any)._thumbAnimDone && !wasDone) _initPageLinesOnce();
      if (!(window as any)._thumbAnimDone && wasDone) {
        const lcirc = document.querySelector<HTMLElement>("#logo-circle");
        if (lcirc) {
          lcirc.classList.remove("lines-started");
          lcirc.style.top = "";
        }
        if (
          (window as any).PageLines &&
          typeof (window as any).PageLines.resetProg === "function"
        )
          (window as any).PageLines.resetProg();
      }
    }

    let st: ScrollTrigger | null = null;
    function bootScrollTrigger() {
      const pin = document.querySelector<HTMLElement>("#page-header-pin");
      if (!pin) return;
      st = ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        scrub: true,
        markers: false,
        invalidateOnRefresh: true,
        onUpdate: (self: ScrollTrigger) => setProgress(self.progress),
        onRefresh: (self: ScrollTrigger) => {
          if (_refreshRaf) cancelAnimationFrame(_refreshRaf);
          _refreshRaf = requestAnimationFrame(() => {
            _refreshRaf = 0;
            setProgress(self.progress);
          });
        },
      });
      st.refresh();
    }

    // ===== pagelines.js =====
    const PL_clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const debounce = (fn: (...args: any[]) => void, wait = 200) => {
      let timer: ReturnType<typeof setTimeout> | null = null;
      return (...args: any[]) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
      };
    };
    const BOLT_COUNT = 6,
      BOLT_SEGS = 9,
      STEPS = 200;
    let lc: HTMLCanvasElement | null = null;
    let lctx: CanvasRenderingContext2D | null = null;
    let VW = 0,
      VH = 0,
      PH = 0;
    let _t = 0;
    let bolts: any[] = [];
    let _wc = 0,
      _sc = 0;
    let lineA: any[] = [],
      lineB: any[] = [],
      lineC: any[] = [];
    let cardData: any[] = [];
    let _originY = 0,
      _lastDotY = 0,
      _btnY = 0;
    let _wanderStartY = 0,
      _wanderEndY = 0;
    let _pinchTs: number[] = [];
    let drawProg = 0,
      smoothProg = 0;
    let weldParticles: any[] = [];
    let wA: any[] = [],
      wB: any[] = [],
      wC: any[] = [];
    let actx: AudioContext | null = null;
    let sbuf: AudioBuffer | null = null;
    let pgGain: GainNode | null = null;
    let sready = false;
    let _audioIniting = false;
    let _htmlAudioPool: HTMLAudioElement[] | null = null;
    let _htmlAudioIndex = 0;
    const SPARK_AUDIO_SRC = "/assets/spark.mp3";
    function initHtmlAudio() {
      if (_htmlAudioPool) return;
      _htmlAudioPool = [];
      for (let i = 0; i < 5; i++) {
        const a = new Audio(SPARK_AUDIO_SRC);
        a.preload = "auto";
        a.volume = 0.9;
        _htmlAudioPool.push(a);
      }
    }
    function initAudio() {
      initHtmlAudio();
      if (actx || _audioIniting) return;
      _audioIniting = true;
      try {
        actx = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
        pgGain = actx.createGain();
        pgGain.gain.value = 0.9;
        pgGain.connect(actx.destination);
        fetch(SPARK_AUDIO_SRC)
          .then((r) => {
            if (!r.ok) throw new Error("fetch failed");
            return r.arrayBuffer();
          })
          .then((ab) => actx!.decodeAudioData(ab))
          .then((b) => {
            sbuf = b;
            sready = true;
          })
          .catch((err) =>
            console.warn(
              "spark audio buffer load failed, using HTMLAudio fallback:",
              err,
            ),
          );
      } catch (e) {
        console.warn("AudioContext failed, using HTMLAudio fallback:", e);
      }
    }
    function playHtmlSpark() {
      try {
        initHtmlAudio();
        const a = _htmlAudioPool![_htmlAudioIndex++ % _htmlAudioPool!.length];
        a.pause();
        a.currentTime = 0;
        a.volume = 0.9;
        a.playbackRate = 0.7 + Math.random() * 0.6;
        const pr = a.play();
        if (pr && (pr as any).catch) (pr as any).catch(() => { });
        _sc = 0.05;
      } catch (e) { }
    }
    function spark() {
      if (soundEnabledRef.current === false || _sc > 0) return;
      initAudio();
      const play = () => {
        if (sready && actx && sbuf) {
          try {
            const s = actx.createBufferSource();
            s.buffer = sbuf;
            s.playbackRate.value = 0.7 + Math.random() * 0.6;
            s.connect(pgGain!);
            s.start(0);
            _sc = 0.05;
            return;
          } catch (e) { }
        }
        playHtmlSpark();
      };
      if (actx && actx.state === "suspended")
        actx.resume().then(play).catch(playHtmlSpark);
      else play();
    }
    const onFirstInteraction = () => {
      initAudio();
      if (actx && actx.state === "suspended") actx.resume().catch(() => { });
      [
        "pointerdown",
        "mousedown",
        "click",
        "wheel",
        "keydown",
        "touchstart",
      ].forEach((ev) => document.removeEventListener(ev, onFirstInteraction));
    };
    [
      "pointerdown",
      "mousedown",
      "click",
      "wheel",
      "keydown",
      "touchstart",
    ].forEach((ev) =>
      document.addEventListener(ev, onFirstInteraction, { passive: true }),
    );

    function _lerp(
      ax: number,
      ay: number,
      bx: number,
      by: number,
      t0: number,
      t1: number,
      tc: number,
    ) {
      if (Math.abs(t1 - t0) < 1e-10) return [ax, ay];
      const f = (tc - t0) / (t1 - t0);
      return [ax + f * (bx - ax), ay + f * (by - ay)];
    }
    function cr(anch: any[]) {
      const pts: any[] = [],
        N = anch.length - 1;
      const kn = [0];
      for (let i = 0; i < N; i++) {
        const dx = anch[i + 1].x - anch[i].x,
          dy = anch[i + 1].y - anch[i].y;
        kn.push(kn[i] + Math.sqrt(dx * dx + dy * dy));
      }
      for (let i = 0; i < N; i++) {
        const p0 = anch[Math.max(0, i - 1)],
          p1 = anch[i],
          p2 = anch[i + 1],
          p3 = anch[Math.min(N, i + 2)];
        const t0 = kn[Math.max(0, i - 1)],
          t1 = kn[i],
          t2 = kn[i + 1],
          t3 = kn[Math.min(N, i + 2)];
        for (let s = 0; s <= STEPS; s++) {
          if (s === 0 && pts.length) continue;
          const tc = t1 + (s / STEPS) * (t2 - t1);
          const [A1x, A1y] = _lerp(p0.x, p0.y, p1.x, p1.y, t0, t1, tc);
          const [A2x, A2y] = _lerp(p1.x, p1.y, p2.x, p2.y, t1, t2, tc);
          const [A3x, A3y] = _lerp(p2.x, p2.y, p3.x, p3.y, t2, t3, tc);
          const [B1x, B1y] = _lerp(A1x, A1y, A2x, A2y, t0, t2, tc);
          const [B2x, B2y] = _lerp(A2x, A2y, A3x, A3y, t1, t3, tc);
          const [Cx, Cy] = _lerp(B1x, B1y, B2x, B2y, t1, t2, tc);
          pts.push({ x: Cx, y: Cy, nx: 0, ny: 1, t: 0 });
        }
      }
      let cum = 0;
      const lens = [0];
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i - 1].x,
          dy = pts[i].y - pts[i - 1].y;
        cum += Math.sqrt(dx * dx + dy * dy);
        lens.push(cum);
      }
      const total = cum || 1;
      for (let i = 0; i < pts.length; i++) pts[i].t = lens[i] / total;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 1)],
          b = pts[Math.min(pts.length - 1, i + 1)];
        const tx = b.x - a.x,
          ty = b.y - a.y,
          tl = Math.sqrt(tx * tx + ty * ty) || 1;
        pts[i].nx = -ty / tl;
        pts[i].ny = tx / tl;
      }
      return pts;
    }
    function wave(base: any[], seed: number) {
      const COILS = 16;
      const amp = VW * 0.022;
      const rotOff = _t * 0.5 + seed * 2.1;
      const PINCH_HALF = 0.03;
      return base.map((p) => {
        let suppress = 1;
        for (let i = 0; i < _pinchTs.length; i++) {
          const d = Math.abs(p.t - _pinchTs[i]);
          if (d < PINCH_HALF) suppress = Math.min(suppress, d / PINCH_HALF);
        }
        const angle = p.t * Math.PI * 2 * COILS + rotOff;
        const lateral = Math.cos(angle) * amp * suppress;
        const depth = Math.sin(angle) * amp * 0.35 * suppress;
        const tanX = -p.ny,
          tanY = p.nx;
        return {
          x: p.x + p.nx * lateral + tanX * depth,
          y: p.y + p.ny * lateral + tanY * depth,
          t: p.t,
        };
      });
    }
    function getStableLineStartY() {
      const header = document.querySelector<HTMLElement>("#page-header");
      if (!header) return Math.max(0, window.innerHeight);
      const pageTop = header.getBoundingClientRect().top + window.scrollY;
      return Math.max(0, pageTop + header.offsetHeight - window.innerHeight);
    }
    function build() {
      const cards = Array.from(
        document.querySelectorAll<HTMLElement>(".project-card"),
      );
      if (!cards.length) return;
      const sy = window.scrollY,
        cx = VW / 2;
      const startY = getStableLineStartY();
      _originY = startY + VH * 0.5;
      cardData = cards.map((c) => {
        const thumb = c.querySelector<HTMLElement>(".card-thumb");
        const tr = (thumb || c).getBoundingClientRect();
        const dotX = tr.left + tr.width / 2;
        const dotY = tr.top + sy;
        return {
          el: c,
          dotX,
          dotY,
          lineT: 0,
          opacity: 0,
          phase: Math.random() * Math.PI * 2,
        };
      });
      _lastDotY = cardData[cardData.length - 1].dotY;
      cardData.forEach((cd) => {
        cd.lineT = 0;
        cd._touched = false;
      });
      const btn = document.querySelector<HTMLElement>("#contact-btn");
      const br = btn ? btn.getBoundingClientRect() : null;
      const btnX = br ? br.left + br.width / 2 : cx;
      _btnY = br ? br.top + sy + br.height / 2 : _lastDotY + VH * 0.4;
      const rnd = (min: number, max: number) =>
        min + Math.random() * (max - min);
      const spread = rnd(0.15, 0.28);
      const MIN = 0.12;
      const swings = Array.from({ length: cardData.length }, () => {
        const base = rnd(0.25, 0.7);
        let a = Math.max(0.05, Math.min(0.9, base + rnd(-spread, spread)));
        let b = Math.max(0.05, Math.min(0.9, base + rnd(-spread, spread)));
        let c = Math.max(0.05, Math.min(0.9, base + rnd(-spread, spread)));
        [a, b, c] = [a, b, c].sort((x, y) => x - y);
        if (b - a < MIN) b = a + MIN;
        if (c - b < MIN) c = b + MIN;
        if (c > 0.92) {
          c = 0.92;
          b = Math.min(b, c - MIN);
          a = Math.min(a, b - MIN);
        }
        return [a, b, c];
      });
      const D = 20;
      const PULL = 0.3;
      const aA: any[] = [{ x: cx, y: _originY }];
      const aB: any[] = [{ x: cx, y: _originY }];
      const aC: any[] = [{ x: cx, y: _originY }];
      let prevY = _originY;
      cardData.forEach((c, idx) => {
        const dX = c.dotX,
          dY = c.dotY;
        const sw = swings[idx % swings.length];
        const mY = prevY + (dY - prevY) * 0.5;
        const rawA = VW * sw[0],
          rawB = VW * sw[1],
          rawC = VW * sw[2];
        aA.push({ x: rawA + (dX - rawA) * PULL, y: mY });
        aB.push({ x: rawB + (dX - rawB) * PULL, y: mY });
        aC.push({ x: rawC + (dX - rawC) * PULL, y: mY });
        aA.push({ x: dX, y: dY });
        aB.push({ x: dX, y: dY });
        aC.push({ x: dX, y: dY });
        prevY = dY;
      });
      const wanderY1 = _btnY - VH * 0.55;
      const wanderY2 = _btnY - VH * 0.28;
      aA.push({ x: VW * 0.08, y: wanderY1 });
      aB.push({ x: VW * 0.18, y: wanderY1 });
      aC.push({ x: VW * 0.3, y: wanderY1 });
      aA.push({ x: VW * 0.12, y: wanderY2 });
      aB.push({ x: VW * 0.22, y: wanderY2 });
      aC.push({ x: VW * 0.34, y: wanderY2 });
      const preBtnY = _btnY - VH * 0.07;
      aA.push({ x: btnX - D * 2, y: preBtnY });
      aB.push({ x: btnX, y: preBtnY });
      aC.push({ x: btnX + D * 2, y: preBtnY });
      aA.push({ x: btnX, y: _btnY });
      aB.push({ x: btnX, y: _btnY });
      aC.push({ x: btnX, y: _btnY });
      lineA = cr(aA);
      lineB = cr(aB);
      lineC = cr(aC);
      _wanderStartY = _lastDotY;
      _wanderEndY = _btnY;
      const syncYs = cardData.map((cd) => cd.dotY).concat([_btnY]);
      const syncSpan = Math.max(1, _btnY - _originY);
      const syncTable = [{ y: _originY, t: 0 }];
      syncYs.forEach((sy2) => {
        syncTable.push({ y: sy2, t: PL_clamp01((sy2 - _originY) / syncSpan) });
      });
      syncTable.push({ y: _btnY + 1, t: 1 });
      function remapT(pts: any[]) {
        let si = 0;
        for (let i = 0; i < pts.length; i++) {
          const py = pts[i].y;
          while (si < syncTable.length - 2 && py > syncTable[si + 1].y) si++;
          const s0 = syncTable[si],
            s1 = syncTable[si + 1];
          const span = s1.y - s0.y;
          const f = span < 1 ? 0 : Math.max(0, Math.min(1, (py - s0.y) / span));
          pts[i].t = s0.t + f * (s1.t - s0.t);
        }
      }
      remapT(lineA);
      remapT(lineB);
      remapT(lineC);
      _pinchTs = [0];
      syncYs.forEach((sy2) => {
        _pinchTs.push(PL_clamp01((sy2 - _originY) / syncSpan));
      });
      _pinchTs.push(1);
    }
    function drawLine(pts: any[], prog: number, sx: number) {
      if (!pts.length || prog <= 0 || !lctx) return;
      lctx.save();
      lctx.strokeStyle = "rgba(48,54,64,1)";
      lctx.lineWidth = 1;
      lctx.lineCap = "round";
      lctx.lineJoin = "round";
      lctx.globalAlpha = 1;
      lctx.beginPath();
      let started = false;
      for (let i = 0; i < pts.length; i++) {
        if (pts[i].t > prog) break;
        const px = pts[i].x,
          sy2 = pts[i].y - sx;
        if (px < -10 || px > VW + 10) {
          started = false;
          continue;
        }
        if (!started) {
          lctx.moveTo(px, sy2);
          started = true;
        } else lctx.lineTo(px, sy2);
      }
      if (started) lctx.stroke();
      lctx.restore();
    }
    function getTipY() {
      let tip = _originY;
      [wA, wB, wC].forEach((pts) => {
        for (let i = pts.length - 1; i >= 0; i--) {
          if (pts[i].t <= drawProg) {
            if (pts[i].y > tip) tip = pts[i].y;
            break;
          }
        }
      });
      return tip;
    }
    function drawCardDots(sx: number) {
      if (!lctx) return;
      cardData.forEach((cd) => {
        const sy2 = cd.dotY - sx;
        if (sy2 < -20 || sy2 > VH + 20) return;
        lctx!.save();
        lctx!.fillStyle = "rgba(215,215,205,1)";
        lctx!.globalAlpha = 0.55;
        lctx!.beginPath();
        lctx!.arc(cd.dotX, sy2, 1.5, 0, Math.PI * 2);
        lctx!.fill();
        lctx!.restore();
      });
    }
    function drawFrontDots(sx: number) {
      if (drawProg <= 0.005 || !lctx) return;
      [wA, wB, wC].forEach((pts) => {
        if (!pts.length) return;
        let fp = pts[0];
        for (let i = pts.length - 1; i >= 0; i--) {
          if (pts[i].t <= drawProg) {
            fp = pts[i];
            break;
          }
        }
        const sy2 = fp.y - sx;
        if (sy2 < -10 || sy2 > VH + 10) return;
        if (fp.x < 0 || fp.x > VW) return;
        lctx!.save();
        lctx!.fillStyle = "rgba(200,200,200,1)";
        lctx!.globalAlpha = 0.85;
        lctx!.beginPath();
        lctx!.arc(fp.x, sy2, 1.5, 0, Math.PI * 2);
        lctx!.fill();
        lctx!.restore();
      });
    }
    const DOT_BOLT_COUNT = 8;
    const dotBolts: any[] = [];
    function mkBolt() {
      return { pts: [], life: 0, max: 0, on: false, col: 0x88ccff } as any;
    }
    for (let i = 0; i < DOT_BOLT_COUNT; i++) dotBolts.push(mkBolt());
    function spawnWeldSparks(ox: number, oy: number) {
      const COUNT = 6;
      for (let i = 0; i < COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 14 + Math.random() * 20;
        const tx = ox + Math.cos(angle) * dist;
        const ty = oy + Math.sin(angle) * dist;
        const slot =
          dotBolts.find((b) => !b.on) || dotBolts[i % DOT_BOLT_COUNT];
        spawnBoltOn(slot, ox, oy, tx, ty);
        slot.life += Math.random() * 0.03;
        slot.max = slot.life;
      }
      weldParticles.push({
        flash: true,
        x: ox,
        y: oy,
        life: 0.1,
        maxLife: 0.1,
      });
    }
    function drawWeldSparks(dt: number, sx: number) {
      if (!lctx) return;
      weldParticles = weldParticles.filter((p) => {
        p.life -= dt;
        if (p.life <= 0) return false;
        const fade = p.life / p.maxLife;
        const prog = 1 - fade;
        const r = prog * 13;
        const a = fade * 0.75;
        lctx!.save();
        const g = lctx!.createRadialGradient(
          p.x,
          p.y - sx,
          0,
          p.x,
          p.y - sx,
          Math.max(0.1, r),
        );
        g.addColorStop(0, `rgba(255,255,255,${a})`);
        g.addColorStop(0.5, `rgba(53,135,242,${a * 0.5})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        lctx!.fillStyle = g;
        lctx!.beginPath();
        lctx!.arc(p.x, p.y - sx, Math.max(0.1, r), 0, Math.PI * 2);
        lctx!.fill();
        lctx!.restore();
        return true;
      });
      dotBolts.forEach((b) => {
        if (!b.on) return;
        b.life -= dt;
        if (b.life <= 0) {
          b.on = false;
          return;
        }
        const sp = b.pts.map((p: any) => ({ x: p.x, y: p.y - sx }));
        const fade = b.life / b.max;
        const dx0 = sp[sp.length - 1].x - sp[0].x,
          dy0 = sp[sp.length - 1].y - sp[0].y;
        const blen = Math.sqrt(dx0 * dx0 + dy0 * dy0) || 1;
        const s = Math.min(1, blen / 80);
        lctx!.save();
        lctx!.filter = `blur(${(2 + s * 2).toFixed(1)}px)`;
        lctx!.strokeStyle = `rgba(80,125,181,${fade})`;
        lctx!.lineWidth = 1.5 + s * 1.5;
        lctx!.lineCap = "round";
        lctx!.lineJoin = "round";
        lctx!.beginPath();
        sp.forEach((p: any, i: number) =>
          i === 0 ? lctx!.moveTo(p.x, p.y) : lctx!.lineTo(p.x, p.y),
        );
        lctx!.stroke();
        lctx!.restore();
        lctx!.save();
        lctx!.filter = `blur(${(0.8 + s * 0.5).toFixed(1)}px)`;
        lctx!.strokeStyle = `rgba(53,135,242,${0.75 * fade})`;
        lctx!.lineWidth = 0.8 + s * 0.8;
        lctx!.lineCap = "round";
        lctx!.lineJoin = "round";
        lctx!.beginPath();
        sp.forEach((p: any, i: number) =>
          i === 0 ? lctx!.moveTo(p.x, p.y) : lctx!.lineTo(p.x, p.y),
        );
        lctx!.stroke();
        lctx!.restore();
        lctx!.save();
        lctx!.filter = "blur(0px)";
        lctx!.strokeStyle = `rgba(255,255,255,${fade})`;
        lctx!.lineWidth = 0.7;
        lctx!.lineCap = "round";
        lctx!.lineJoin = "round";
        lctx!.beginPath();
        sp.forEach((p: any, i: number) =>
          i === 0 ? lctx!.moveTo(p.x, p.y) : lctx!.lineTo(p.x, p.y),
        );
        lctx!.stroke();
        lctx!.restore();
      });
    }
    function updateCards() {
      const tipY = getTipY();
      cardData.forEach((cd) => {
        const target = tipY >= cd.dotY ? 1 : 0;
        if (!cd._touched && target === 1) {
          cd._touched = true;
          spawnWeldSparks(cd.dotX, cd.dotY);
          spark();
        }
        if (target === 0) cd._touched = false;
        cd.opacity += (target - cd.opacity) * 0.09;
        cd.el.style.opacity = Math.min(1, Math.max(0, cd.opacity)).toFixed(3);
      });
    }
    const BCOLS = [
      0xffffff, 0x88ddff, 0x44aaff, 0x0066ff, 0x00ccff, 0xaaddff, 0x0044cc,
    ];
    function spawnBoltOn(
      b: any,
      ox: number,
      oy: number,
      tx: number,
      ty: number,
    ) {
      const dx = tx - ox,
        dy = ty - oy,
        dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const px = -dy / dist,
        py = dx / dist,
        od = Math.random() > 0.5 ? 1 : -1;
      const pts: any[] = [{ x: ox, y: oy }];
      let cx = ox,
        cy = oy;
      for (let i = 1; i <= BOLT_SEGS; i++) {
        const t = i / BOLT_SEGS;
        const jMag =
          Math.min(dist * 0.3, 13) *
          (0.5 + Math.random() * 0.8) *
          Math.sin(t * Math.PI);
        const oMag = Math.min(dist * 0.12, 6) * Math.sin(t * Math.PI) * od;
        const nx = ox + dx * t + (Math.random() - 0.5) * jMag * 1.4 + px * oMag;
        const ny =
          oy +
          dy * t +
          (Math.random() - 0.5) * jMag +
          py * oMag * (0.6 + Math.random() * 0.8);
        pts.push({ x: nx, y: ny });
        if (i === Math.floor(BOLT_SEGS * 0.45)) {
          cx = nx;
          cy = ny;
        }
      }
      pts.push({ x: tx, y: ty });
      b.pts = pts;
      if (Math.random() < 0.55) {
        const fAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2;
        const fLen = dist * 0.28;
        const fx = cx + Math.cos(fAngle) * fLen,
          fy = cy + Math.sin(fAngle) * fLen;
        const bPts: any[] = [{ x: cx, y: cy }];
        for (let i = 1; i <= 4; i++) {
          const t = i / 4;
          bPts.push({
            x: cx + (fx - cx) * t + (Math.random() - 0.5) * 4,
            y: cy + (fy - cy) * t + (Math.random() - 0.5) * 4,
          });
        }
        bPts.push({ x: fx, y: fy });
        b.branch = bPts;
      } else {
        b.branch = null;
      }
      b.max = 0.04 + Math.random() * 0.06;
      b.life = b.max;
      b.on = true;
      b.col = BCOLS[Math.floor(Math.random() * BCOLS.length)];
    }
    function drawBolts(dt: number, sx: number) {
      if (!lctx) return;
      _sc = Math.max(0, _sc - dt);
      _wc = Math.max(0, _wc - dt);
      bolts.forEach((b) => {
        if (!b.on) return;
        b.life -= dt;
        if (b.life <= 0) {
          b.on = false;
          return;
        }
        const sp = b.pts.map((p: any) => ({ x: p.x, y: p.y - sx }));
        const minY = Math.min(...sp.map((p: any) => p.y)),
          maxY = Math.max(...sp.map((p: any) => p.y));
        if (maxY < -20 || minY > VH + 20) return;
        const fade = b.life / b.max;
        const dx0 = sp[sp.length - 1].x - sp[0].x,
          dy0 = sp[sp.length - 1].y - sp[0].y;
        const blen = Math.sqrt(dx0 * dx0 + dy0 * dy0) || 1;
        const s = Math.min(1, blen / 120);
        lctx!.save();
        lctx!.filter = `blur(${(3 + s * 3).toFixed(1)}px)`;
        lctx!.strokeStyle = `rgba(80,125,181,${1 * fade})`;
        lctx!.lineWidth = 2 + s * 2;
        lctx!.lineCap = "round";
        lctx!.lineJoin = "round";
        lctx!.beginPath();
        sp.forEach((p: any, i: number) =>
          i === 0 ? lctx!.moveTo(p.x, p.y) : lctx!.lineTo(p.x, p.y),
        );
        lctx!.stroke();
        lctx!.restore();
        lctx!.save();
        lctx!.filter = `blur(${(1 + s * 1).toFixed(1)}px)`;
        lctx!.strokeStyle = `rgba(53,135,242,${0.7 * fade})`;
        lctx!.lineWidth = 1 + s * 1.2;
        lctx!.lineCap = "round";
        lctx!.lineJoin = "round";
        lctx!.beginPath();
        sp.forEach((p: any, i: number) =>
          i === 0 ? lctx!.moveTo(p.x, p.y) : lctx!.lineTo(p.x, p.y),
        );
        lctx!.stroke();
        lctx!.restore();
        lctx!.save();
        lctx!.filter = "blur(0px)";
        lctx!.strokeStyle = `rgba(255,255,255,${1.0 * fade})`;
        lctx!.lineWidth = 0.9;
        lctx!.lineCap = "round";
        lctx!.lineJoin = "round";
        lctx!.beginPath();
        sp.forEach((p: any, i: number) =>
          i === 0 ? lctx!.moveTo(p.x, p.y) : lctx!.lineTo(p.x, p.y),
        );
        lctx!.stroke();
        lctx!.restore();
        if (b.branch) {
          const bp = b.branch.map((p: any) => ({ x: p.x, y: p.y - sx }));
          lctx!.save();
          lctx!.filter = `blur(${(1.5 + s).toFixed(1)}px)`;
          lctx!.strokeStyle = `rgba(80,125,181,${0.7 * fade})`;
          lctx!.lineWidth = 1 + s * 0.8;
          lctx!.lineCap = "round";
          lctx!.lineJoin = "round";
          lctx!.beginPath();
          bp.forEach((p: any, i: number) =>
            i === 0 ? lctx!.moveTo(p.x, p.y) : lctx!.lineTo(p.x, p.y),
          );
          lctx!.stroke();
          lctx!.restore();
          lctx!.save();
          lctx!.filter = "blur(0px)";
          lctx!.strokeStyle = `rgba(255,255,255,${0.7 * fade})`;
          lctx!.lineWidth = 0.5;
          lctx!.lineCap = "round";
          lctx!.lineJoin = "round";
          lctx!.beginPath();
          bp.forEach((p: any, i: number) =>
            i === 0 ? lctx!.moveTo(p.x, p.y) : lctx!.lineTo(p.x, p.y),
          );
          lctx!.stroke();
          lctx!.restore();
        }
      });
    }
    let _mx = -9999,
      _my = -9999;
    function nearLine(
      pts: any[],
      mx: number,
      my: number,
      sx: number,
      th: number,
    ) {
      let best: any = null,
        bd = th * th;
      for (let i = 0; i < pts.length; i++) {
        if (pts[i].t > drawProg) break;
        const dy2 = pts[i].y - sx - my,
          dx2 = pts[i].x - mx,
          d = dx2 * dx2 + dy2 * dy2;
        if (d < bd) {
          bd = d;
          best = pts[i];
        }
      }
      return best;
    }
    function checkWeld(sx: number) {
      if (_wc > 0 || drawProg < 0.01) return;
      const all = [wA, wB, wC];
      let hitL = -1,
        hitP: any = null;
      for (let li = 0; li < 3; li++) {
        const p = nearLine(all[li], _mx, _my, sx, 18);
        if (p) {
          hitL = li;
          hitP = p;
          break;
        }
      }
      if (!hitP) return;
      const otherLines = [0, 1, 2].filter((i) => i !== hitL).map((i) => all[i]);
      bolts.forEach((b) => {
        const tgtLine =
          otherLines[Math.floor(Math.random() * otherLines.length)];
        let best: any = null,
          bd = Infinity;
        for (let i = 0; i < tgtLine.length; i++) {
          if (tgtLine[i].t > drawProg) break;
          const dx2 = tgtLine[i].x - hitP.x,
            dy2 = tgtLine[i].y - hitP.y,
            d = dx2 * dx2 + dy2 * dy2;
          if (d < bd) {
            bd = d;
            best = tgtLine[i];
          }
        }
        if (best) spawnBoltOn(b, hitP.x, hitP.y, best.x, best.y);
      });
      spark();
      _wc = 0.1 + Math.random() * 0.2;
    }
    const onMouseMove = (e: MouseEvent) => {
      _mx = e.clientX;
      _my = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    function updateProg() {
      const sy = window.scrollY;
      if (!lineA.length) {
        drawProg = 0;
        smoothProg = 0;
        return;
      }
      const startY = Math.max(0, _originY - VH * 0.5);
      const endY = Math.max(startY + 1, _btnY - VH * 0.5);
      const target = PL_clamp01((sy - startY) / (endY - startY));
      smoothProg += (target - smoothProg) * 0.14;
      if (target === 0) smoothProg = 0;
      drawProg = smoothProg;
    }
    let plLast = 0;
    let plRafId: number | null = null;
    function plLoop(ts: number) {
      plRafId = requestAnimationFrame(plLoop);
      const dt = Math.min((ts - plLast) / 1000, 0.05);
      plLast = ts;
      _t += dt;
      updateProg();
      const sx = window.scrollY;
      wA = wave(lineA, 1.0);
      wB = wave(lineB, 2.3);
      wC = wave(lineC, 3.7);
      if (!lctx) return;
      lctx.clearRect(0, 0, VW, VH);
      lctx.save();
      lctx.beginPath();
      lctx.rect(0, 0, VW, VH);
      lctx.clip();
      drawLine(wA, drawProg, sx);
      drawLine(wB, drawProg, sx);
      drawLine(wC, drawProg, sx);
      drawCardDots(sx);
      drawFrontDots(sx);
      lctx.restore();
      updateCards();
      checkWeld(sx);
      drawBolts(dt, sx);
      drawWeldSparks(dt, sx);
    }
    function plResize() {
      VW = window.innerWidth;
      VH = window.innerHeight;
      PH = document.documentElement.scrollHeight;
      if (lc) {
        lc.width = VW;
        lc.height = VH;
      }
      build();
    }
    let plResizeHandler: any = null;
    function plInit() {
      lc = document.querySelector<HTMLCanvasElement>("#line-canvas");
      if (!lc) return;
      lctx = lc.getContext("2d");
      if (plRafId) {
        cancelAnimationFrame(plRafId);
        plRafId = null;
      }
      if (plResizeHandler)
        window.removeEventListener("resize", plResizeHandler);
      bolts = [];
      for (let i = 0; i < BOLT_COUNT; i++) bolts.push(mkBolt());
      document.querySelectorAll<HTMLElement>(".project-card").forEach((c) => {
        c.style.opacity = "0";
        c.style.transition = "none";
      });
      plResize();
      plResizeHandler = debounce(plResize, 200);
      window.addEventListener("resize", plResizeHandler);
      plRafId = requestAnimationFrame((ts) => {
        plLast = ts;
        plRafId = requestAnimationFrame(plLoop);
      });
    }
    function resetProg() {
      drawProg = 0;
      smoothProg = 0;
    }
    (window as any).PageLines = { init: plInit, rebuild: build, resetProg };
    (window as any)._initPageLines = plInit;

    // ===== boot intro on load =====
    (window as any)._mouseTilt = {
      mx: window.innerWidth / 2,
      my: window.innerHeight / 2,
    };
    const onTiltMove = (e: MouseEvent) => {
      (window as any)._mouseTilt.mx = e.clientX;
      (window as any)._mouseTilt.my = e.clientY;
    };
    document.addEventListener("mousemove", onTiltMove);

    function startIntro() {
      window.scrollTo(0, 0);
      (lenis as any).scrollTo(0, { immediate: true, force: true });
      ensureLogoSvg();
      computeRadii();
      drawLogoFill(0);
      logoIntroStart = performance.now();
      const lc0 = document.querySelector<HTMLElement>("#logo-circle");
      if (lc0) {
        lc0.style.opacity = "1";
        lc0.style.visibility = "visible";
        lc0.style.transform = "perspective(800px)";
      }
      (window as any)._thumbAnimReady = true;
      (window as any)._thumbAnimDone = false;
      updateDotPos();
      placeThumbs();
      requestAnimationFrame((ts) => {
        lastTs = ts;
        introRafId = requestAnimationFrame(loop);
      });
      bootScrollTrigger();
    }

    const onResize = () => {
      updateDotPos();
      if ((window as any)._thumbAnimDone !== true) placeThumbs();
      st?.refresh();
    };
    window.addEventListener("resize", onResize);

    // fallback PageLines start if intro fails to fire
    const fallbackPL = setTimeout(() => {
      if (!(window as any)._thumbAnimReady) plInit();
    }, 200);

    if (document.readyState === "complete") startIntro();
    else window.addEventListener("load", startIntro, { once: true });

    // ===== flagwave (three.js) — dynamic import =====
    let flag: { dispose: () => void } | null = null;
    let flagCancelled = false;
    import("./flagwave")
      .then((mod) => {
        if (flagCancelled) return;
        flag = mod.initFlagwave(document.body);
      })
      .catch((err) => console.warn("flagwave init failed", err));

    // ===== cleanup =====
    return () => {
      flagCancelled = true;
      if (flag) flag.dispose();
      window.removeEventListener("beforeunload", forceTop);
      window.removeEventListener("pagehide", forceTop);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("resize", onResize);
      if (plResizeHandler)
        window.removeEventListener("resize", plResizeHandler);
      window.removeEventListener("load", startIntro);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousemove", onTiltMove);
      [
        "pointerdown",
        "mousedown",
        "click",
        "wheel",
        "keydown",
        "touchstart",
      ].forEach((ev) => document.removeEventListener(ev, onFirstInteraction));
      animDone = true;
      if (introRafId) cancelAnimationFrame(introRafId);
      if (plRafId) cancelAnimationFrame(plRafId);
      if (_refreshRaf) cancelAnimationFrame(_refreshRaf);
      clearTimeout(fallbackPL);
      if (st) st.kill();
      try {
        lenis.destroy();
      } catch {}
      delete (window as any)._lenis;
      delete (window as any)._mouseTilt;
      delete (window as any)._thumbAnimReady;
      delete (window as any)._thumbAnimDone;
      delete (window as any)._orbitReady;
      delete (window as any)._initPageLines;
      delete (window as any).PageLines;
      if (actx) {
        try {
          actx.close();
        } catch { }
      }
    };
  }, [ready]);

  return (
    <div className="bg-[#040508] text-light-font relative overflow-hidden font-sans">
      <style>{styles}</style>

      <div id="header-dot" />

      <div id="page-header" className="relative">
        <div
          id="page-header-pin"
          className="h-screen w-full flex flex-col items-center justify-center text-center gap-0"
        >
          <div className="absolute inset-0 overflow-hidden z-5 pointer-events-none">
            {FT_THUMBS.map((src, i) => (
              <div
                key={i}
                className="ft absolute w-43 rounded-sm overflow-hidden opacity-0"
              >
                <img
                  src={src}
                  alt=""
                  className="w-full aspect-4/3 object-cover block opacity-100"
                />
              </div>
            ))}
          </div>
          <div className="tr__container w-full flex flex-col items-center">
            <div
              id="logo-circle"
              className="relative w-80 h-80 flex items-center justify-center pointer-events-none z-20 shrink-0 transform-3d will-change-transform"
            >
              <div
                id="logo-svg-wrap"
                className="absolute inset-0 w-full h-full z-1 pointer-events-none perspective-midrange transform-3d translate-x-[5%]"
              >
                <svg
                  className="logo-t-path"
                  id="t1"
                  style={{ opacity: 0 }}
                  viewBox="0 0 578 586"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <clipPath id="clip1">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M269.431 257.019C268.708 258.271 268.717 259.816 269.455 261.06L286.98 290.611C288.54 293.241 292.355 293.219 293.885 290.57L327.284 232.72C328.825 230.052 332.677 230.054 334.215 232.724L425.279 390.875C425.982 392.095 427.275 392.856 428.682 392.878L463.65 393.434C466.755 393.483 468.73 390.129 467.18 387.438L353.861 190.681C353.148 189.444 353.149 187.921 353.863 186.685L388.264 127.101C388.965 125.885 388.979 124.391 388.299 123.163L371.368 92.5833C369.861 89.8615 365.96 89.8265 364.404 92.5208L269.431 257.019Z"
                      />
                    </clipPath>
                  </defs>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M269.431 257.019C268.708 258.271 268.717 259.816 269.455 261.06L286.98 290.611C288.54 293.241 292.355 293.219 293.885 290.57L327.284 232.72C328.825 230.052 332.677 230.054 334.215 232.724L425.279 390.875C425.982 392.095 427.275 392.856 428.682 392.878L463.65 393.434C466.755 393.483 468.73 390.129 467.18 387.438L353.861 190.681C353.148 189.444 353.149 187.921 353.863 186.685L388.264 127.101C388.965 125.885 388.979 124.391 388.299 123.163L371.368 92.5833C369.861 89.8615 365.96 89.8265 364.404 92.5208L269.431 257.019Z"
                    fill="none"
                    stroke="#303640"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                  />
                  <g clipPath="url(#clip1)" id="particles1" />
                  <g clipPath="url(#clip1)" id="lightning1" />
                </svg>
                <svg
                  className="logo-t-path"
                  id="t2"
                  style={{ opacity: 0 }}
                  viewBox="0 0 578 586"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <clipPath id="clip2">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M316.66 425.547C318.087 425.545 319.406 426.304 320.123 427.537L356.868 490.777C357.572 491.989 358.86 492.744 360.263 492.767L395.242 493.322C398.347 493.372 400.322 490.018 398.773 487.327L304.909 324.268C304.196 323.03 302.878 322.266 301.449 322.263L265.933 322.201C262.846 322.196 260.916 325.543 262.468 328.212L293.454 381.508C295.005 384.176 293.079 387.521 289.993 387.519L107.1 387.384C105.67 387.383 104.348 388.146 103.633 389.384L86.0729 419.792C84.532 422.461 86.4598 425.796 89.5411 425.793L316.66 425.547Z"
                      />
                    </clipPath>
                  </defs>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M316.66 425.547C318.087 425.545 319.406 426.304 320.123 427.537L356.868 490.777C357.572 491.989 358.86 492.744 360.263 492.767L395.242 493.322C398.347 493.372 400.322 490.018 398.773 487.327L304.909 324.268C304.196 323.03 302.878 322.266 301.449 322.263L265.933 322.201C262.846 322.196 260.916 325.543 262.468 328.212L293.454 381.508C295.005 384.176 293.079 387.521 289.993 387.519L107.1 387.384C105.67 387.383 104.348 388.146 103.633 389.384L86.0729 419.792C84.532 422.461 86.4598 425.796 89.5411 425.793L316.66 425.547Z"
                    fill="none"
                    stroke="#303640"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                  />
                  <g clipPath="url(#clip2)" id="particles2" />
                  <g clipPath="url(#clip2)" id="lightning2" />
                </svg>
                <svg
                  className="logo-t-path"
                  id="t3"
                  style={{ opacity: 0 }}
                  viewBox="0 0 578 586"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <clipPath id="clip3">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M182.809 283.818C179.736 283.807 177.822 280.479 179.359 277.818L271.364 118.461C272.066 117.245 272.079 115.751 271.399 114.523L254.468 83.9432C252.961 81.2213 249.06 81.1863 247.504 83.8807L133.245 281.783C132.528 283.026 131.2 283.789 129.765 283.783L56.9478 283.499C55.5132 283.494 54.1855 284.257 53.4681 285.499L35.9048 315.92C34.3665 318.584 36.2864 321.915 39.363 321.92L229.336 322.201C230.767 322.203 232.091 321.441 232.806 320.201L250.222 290.036C251.759 287.375 249.845 284.047 246.771 284.036L182.809 283.818Z"
                      />
                    </clipPath>
                  </defs>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M182.809 283.818C179.736 283.807 177.822 280.479 179.359 277.818L271.364 118.461C272.066 117.245 272.079 115.751 271.399 114.523L254.468 83.9432C252.961 81.2213 249.06 81.1863 247.504 83.8807L133.245 281.783C132.528 283.026 131.2 283.789 129.765 283.783L56.9478 283.499C55.5132 283.494 54.1855 284.257 53.4681 285.499L35.9048 315.92C34.3665 318.584 36.2864 321.915 39.363 321.92L229.336 322.201C230.767 322.203 232.091 321.441 232.806 320.201L250.222 290.036C251.759 287.375 249.845 284.047 246.771 284.036L182.809 283.818Z"
                    fill="none"
                    stroke="#303640"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                  />
                  <g clipPath="url(#clip3)" id="particles3" />
                  <g clipPath="url(#clip3)" id="lightning3" />
                </svg>
              </div>
            </div>
            <BlurTextReveal
              as="h1"
              html="Our work"
              animationType="chars"
              stagger={0.08}
              className="z-2 mb-6"
            />
            <div
              id="line-origin"
              className="absolute w-0 h-0 top-1/2 left-1/2 pointer-events-none invisible"
            />
            <p className="small">
              A curated collection of branding,
              <br />
              web, and digital system work.
            </p>
          </div>
        </div>
      </div>

      <canvas
        id="line-canvas"
        className="fixed top-0 left-0 pointer-events-none z-2 will-change-contents"
      />

      <main id="projects-grid">
        {PROJECTS.map((p, i) => (
          <article
            key={i}
            className="project-card"
            data-pos={p.pos}
            data-size={p.size}
          >
            <div className="card-thumb overflow-hidden mb-6 rounded-sm relative">
              {p.link ? (
                <a
                  href="#"
                  className="thumb-link"
                  aria-label={`Open ${p.title}`}
                >
                  <img src={p.img} alt={p.title} />
                </a>
              ) : (
                <img src={p.img} alt={p.title} />
              )}
            </div>
            <div className="card-info flex flex-col gap-4">
              <div className="flex justify-between">
                <h2 className="h3 w-7/12">{p.title}</h2>
                <p className="text-light-font/60 w-5/12 text-right small">
                  {p.year}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-light-font/60 w-7/12 small">
                  {p.desc.split("\n").map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
                <div className="w-5/12 flex justify-end">
                  <WordShiftButton
                    text="EXPLORE PROJECT"
                    href="#"
                    styleVars={{ buttonWrapperColor: "#D8D8D8" }}
                  />
                </div>
              </div>
              {/* <div className="card-left-meta">
                <h2>{p.title}</h2>
                <p>
                  {p.desc.split("\n").map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>
              <div className="card-right-meta">
                <span className="yr">{p.year}</span>
                <a href="#" className="cta">
                  EXPLORE PROJECT <span>→</span>
                </a>
              </div> */}
            </div>
          </article>
        ))}
      </main>

      <div id="contact-section" className="py-37.5">
        <div className="tr__container flex flex-col gap-10 items-center">
          <div id="contact-btn">
            <WordShiftButton
              text="Contact Us"
              href="#"
              styleVars={{ buttonWrapperColor: "#D8D8D8" }}
            />
          </div>
          <h3 className="text-center text-light-font">
            Every project begins with a conversation — let&apos;s start yours.{" "}
            <br />
            We work with studios, founders, and brands who care about craft.{" "}
            <br />
            Based globally. Available for select work worldwide.
          </h3>
        </div>
        {/* <a href="#" id="contact-btn">
          Contact Us
        </a> */}
        {/* <div id="contact-subtext">
          <p>
            Every project begins with a conversation — let&apos;s start yours.
          </p>
          <p>
            We work with studios, founders, and brands who care about craft.
          </p>
          <p>Based globally. Available for select work worldwide.</p>
        </div> */}
      </div>
      <div className="tr__container">
        <LinePlus
          lineClass={"bg-[#2F323B] left-1/2! -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto translate-x-0!"}
          iconColor={"#D8D8D8"}
        />
      </div>
    </div>
  );
}

// ===== Inline styles =====
// Tailwind utilities cannot express: mix-blend-mode-difference on nav, sticky pin,
// clip-path circle, vector-effect on SVG strokes, fixed canvas overlays, and the
// mobile breakpoint overrides that target by id. Keeping these as scoped CSS
// rather than a separate file (per requirement #3, "absolutely necessary").
const styles = `
:root {
  --bg: #040508;
  --white: #ffffff;
  --ink-soft: rgba(10,10,10,0.55);
  --glass-line: rgba(255,255,255,0.18);
  --ease-soft: cubic-bezier(0.22,1,0.36,1);
}
.ft { will-change: transform, opacity, left, top; }
// #floating-thumbs { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 5; }
// .ft img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; opacity: 1; }
// #line-origin { position: absolute; width: 0; height: 0; top: 50%; left: 50%; pointer-events: none; visibility: hidden; }
// #logo-circle {
//   position: relative; width: 320px; height: 320px;
//   display: flex; align-items: center; justify-content: center;
//   pointer-events: none; z-index: 20;
//   transform-style: preserve-3d; will-change: transform;
//   flex-shrink: 0; margin-bottom: 24px;
// }
// #logo-svg-wrap {
//   position: absolute; inset: 0; width: 100%; height: 100%;
//   z-index: 1; pointer-events: none; perspective: 800px; transform-style: preserve-3d;
// }
#logo-svg-wrap svg.logo-t-path {
  position: absolute; inset: 0; width: 100%; height: 100%;
  overflow: visible; transform-origin: 50% 50%; will-change: transform, opacity;
  opacity: 0;
}
#logo-svg-wrap .logo-t-path > path {
  stroke: #303640; stroke-width: 1.5; stroke-opacity: 0.7; vector-effect: non-scaling-stroke;
}
// #page-header { position: relative; }
// #page-header-pin {
//   height: 100vh; width: 100%;
//   display: flex; flex-direction: column; align-items: center; justify-content: center;
//   text-align: center; gap: 0;
// }
#header-dot {
  width: 320px; height: 320px; border-radius: 160px;
  clip-path: circle(50%); background: var(--bg);
  position: fixed; left: 50%; top: 50%;
  transform: translate3d(-50%, -50%, 0) scale(1);
  transform-origin: center center;
  z-index: -1; pointer-events: none; will-change: transform;
  isolation: isolate;
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
}
// #page-h1 {
//   font-size: clamp(2.6rem,5.5vw,5rem);
//   font-weight: 300; letter-spacing: -0.01em;
//   color: var(--white); text-align: center;
//   margin: 0 0 12px 0; position: relative; z-index: 100;
// }
// #page-sub {
//   font-size: 0.76rem; line-height: 1.7; color: rgba(255,255,255,0.7);
//   text-align: center; margin: 0; position: relative; z-index: 100;
// }
// #line-canvas { position: fixed; top:0; left:0; pointer-events: none; will-change: contents; z-index: 2; }
#projects-grid {
  position: relative; padding: 120px 5% 160px; z-index: 10;
  display: flex; flex-direction: column; gap: 80px;
}
.project-card { position: relative; cursor: pointer; opacity: 0; transition: opacity 0.9s var(--ease-soft); }
.project-card.card-revealed { opacity: 1; }
// .card-thumb { overflow: hidden; margin-bottom: 14px; border-radius: 4px; position: relative; }
.card-thumb img { width: 100%; display:block; object-fit:cover; border-radius: 4px; }
// .card-info { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
// .card-left-meta h2 { font-size:clamp(0.85rem,1.5vw,1.1rem); font-weight:300; letter-spacing:-0.005em; margin-bottom:4px; line-height:1.2; }
// .card-left-meta p { font-size:0.68rem; color:rgba(255,255,255,0.45); line-height:1.6; }
// .card-right-meta { text-align:right; flex-shrink:0; }
// .yr { display:block; font-size:0.62rem; color:rgba(255,255,255,0.35); letter-spacing:0.1em; margin-bottom:6px; }
// .cta {
//   display:inline-flex; align-items:center; gap:5px;
//   font-size:0.58rem; letter-spacing:0.18em; text-transform:uppercase;
//   color:rgba(255,255,255,0.5); text-decoration:none;
//   border-bottom:1px solid var(--glass-line); padding-bottom:3px;
//   transition:color 0.2s, border-color 0.2s;
// }
// .cta:hover { color:var(--white); border-color:rgba(255,255,255,0.65); }
@media(max-width:768px){
  #projects-grid { padding:200px 20px 80px; gap:50px; }
  .project-card { width:90%!important; margin-left:auto!important; margin-right:auto!important; }
  #logo-circle { width:250px; height:250px; }
  #logo-svg-wrap { width:250px; height:250px; }
}
// #contact-section {
//   display:flex; flex-direction:column; justify-content:center; align-items:center;
//   gap:36px; padding:120px 0 120px; position:relative; z-index:10;
// }
// #contact-btn {
//   display:inline-flex; align-items:center; gap:10px;
//   font-size:0.7rem; font-weight:500; letter-spacing:0.22em; text-transform:uppercase;
//   text-decoration:none; color:rgba(255,255,255,0.75);
//   border:1px solid var(--glass-line); padding:16px 40px; border-radius:2px;
//   transition:color 0.3s, border-color 0.3s;
// }
// #contact-btn:hover { color:var(--white); border-color:rgba(255,255,255,0.55); }
// #contact-subtext { display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center; margin:100px 0 0 0; }
// #contact-subtext p { font-size:2rem; font-weight:400; letter-spacing:0.04em; color:rgba(255,255,255,0.42); line-height:1.6; }
.is-hidden { display:none!important; }
#shared-card-wave-canvas { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 11; }
.card-thumb .thumb-link { display:block; width:100%; height:100%; color:inherit; text-decoration:none; }
.card-thumb .thumb-link img { display:block; width:100%; }
`;
