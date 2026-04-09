"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";
import {
  mapServicesScrollProgress,
  SERVICES_PIN_END_PERCENT,
  SERVICES_SHUTTER_VH,
  SERVICES_SCRUB_VH,
} from "@/components/Sections/Home/servicesScrollConstants";
gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface Particle {
  el: HTMLSpanElement;
  ox: number;
  oy: number;
  fontSize: number;
  isHero: boolean;
  offX: number;
  offY: number;
  tx: number | null;
  ty: number | null;
  heroScale: number;
  dirX: number;
  dirY: number;
  speed: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  fadeOffset: number;
}

interface CharMeasure {
  ch: string;
  x: number;
  y: number;
  fontSize: number;
  /** Copied from the line’s computed style so particles match `.mrquee-text` / `text-light-font` */
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  color: string;
}

/** Match how CSS `text-transform` affects the string used for layout (must match painted glyphs). */
function applyTextTransform(text: string, textTransform: string): string {
  if (textTransform === "uppercase") return text.toUpperCase();
  if (textTransform === "lowercase") return text.toLowerCase();
  if (textTransform === "capitalize") {
    return text.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }
  return text;
}

/** Inter-letter spacing in px (canvas + layout must match CSS `.mrquee-text` tracking). */
function letterSpacingPx(cs: CSSStyleDeclaration, fontSizePx: number): number {
  const ls = cs.letterSpacing?.trim();
  if (!ls || ls === "normal") return 0;
  const px = /^(-?[\d.]+)px$/.exec(ls);
  if (px) return parseFloat(px[1]);
  const em = /^(-?[\d.]+)em$/.exec(ls);
  if (em) return parseFloat(em[1]) * fontSizePx;
  return 0;
}

interface CardData {
  id: string;
  title: string;
  description: string;
  svgIndex: number;
  highlightColor?: { r: number; g: number; b: number };
}

/* ─────────────────────────────────────────────
   SVG path data (inlined for DrawSVGPlugin access)
   ───────────────────────────────────────────── */
const CARD_SVG_PATHS: string[][] = [
  // 0 – vertical lines
  [
    "M35.9,59.8V.5",
    "M30,59.7V.4",
    "M6.4,59.8V.5",
    "M59.5,59.7V.4",
    "M53.6,59.7V.4",
    "M47.7,59.7V.4",
    "M41.8,59.7V.4",
    "M24.1,59.7V.3",
    "M18.2,59.7V.4",
    "M12.3,59.7V.4",
    "M.5,59.7V.4",
  ],
  // 1 – concentric circles
  [
    "M.6,30c0,16.2,13.2,29.4,29.4,29.4s29.4-13.2,29.4-29.4S46.2.6,30,.6.6,13.8.6,30Z",
    "M6.6,30c0,12.9,10.5,23.4,23.4,23.4s23.4-10.5,23.4-23.4S42.9,6.6,30,6.6,6.6,17.1,6.6,30Z",
    "M12.6,30c0,9.6,7.8,17.4,17.4,17.4s17.4-7.8,17.4-17.4-7.8-17.4-17.4-17.4-17.4,7.8-17.4,17.4Z",
    "M18.6,30c0,6.3,5.1,11.4,11.4,11.4s11.4-5.1,11.4-11.4-5.1-11.4-11.4-11.4-11.4,5.1-11.4,11.4Z",
    "M24.6,30c0,3,2.4,5.4,5.4,5.4s5.4-2.4,5.4-5.4-2.4-5.4-5.4-5.4-5.4,2.4-5.4,5.4Z",
  ],
  // 2 – concentric squares
  [
    "M.6,59.2c0,.1.1.3.3.3h58.3c.1,0,.3-.1.3-.3V.9c0-.1-.1-.3-.3-.3H.8c-.1,0-.3.1-.3.3v58.3h0Z",
    "M6.6,53.2c0,.1,0,.2.2.2h46.4c.1,0,.2,0,.2-.2V6.8c0-.1,0-.2-.2-.2H6.8c-.1,0-.2,0-.2.2v46.4h0Z",
    "M12.6,47.2c0,.1.1.3.3.3h34.3c.1,0,.3-.1.3-.3V12.9c0-.1-.1-.3-.3-.3H12.8c-.1,0-.3.1-.3.3v34.3h0Z",
    "M18.6,41.2c0,.1.1.2.2.2h22.3c.1,0,.2-.1.2-.2v-22.3c0-.1-.1-.2-.2-.2h-22.3c-.1,0-.2.1-.2.2v22.3h0Z",
    "M24.6,35.2c0,.1,0,.2.2.2h10.4c.1,0,.2,0,.2-.2v-10.4c0-.1,0-.2-.2-.2h-10.4c-.1,0-.2,0-.2.2v10.4Z",
    "M29.3,30.1c0-.4.3-.7.7-.7s.7.3.7.7-.3.7-.7.7-.7-.3-.7-.7Z",
  ],
  // 3 – curved wave lines
  [
    "M.5,59.2c4.7-.1,8.8-1.1,12.5-3,10.1-5.1,16.5-15,16.5-26.2S23.1,8.8,13,3.7C9.3,1.9,5.2.9.5.8",
    "M59.6.8c-4.7.1-8.8,1.1-12.5,3-10.1,5.1-16.5,15-16.5,26.3s6.4,21.1,16.5,26.2c3.6,1.8,7.8,2.8,12.5,3",
    "M59.9,6.6c-9.8.6-16.8,5.1-21,13.5-1.5,3-2.2,6.3-2.2,9.9,0,3.6.8,6.9,2.3,9.9,4.3,8.4,11.3,12.9,21.1,13.4",
    "M.4,53.3c7.8-.4,13.9-3.5,18.2-9.2,3.2-4.2,4.8-8.9,4.8-14.1,0-5.2-1.6-9.9-4.8-14.1C14.3,10.2,8.2,7.1.4,6.7",
    "M.5,47.3c5.7-.3,10.3-2.6,13.6-7.1,2.3-3.1,3.4-6.4,3.4-10.2,0-3.7-1.1-7.1-3.4-10.2-3.3-4.5-7.8-6.8-13.6-7.1",
    "M59.8,12.6c-6.8.5-11.7,3.5-14.9,9-1.5,2.5-2.2,5.3-2.2,8.3s.7,5.8,2.2,8.3c3.2,5.5,8.2,8.5,14.9,9",
    "M59.6,18.7c-6.2.4-11,5.2-11,11.3,0,6.1,4.8,10.9,11,11.3",
    "M.4,41.3c5.3-.5,8.9-3.2,10.6-8.2.3-.9.5-1.9.5-3.1h0c0-1.2-.1-2.3-.4-3.1-1.7-5-5.2-7.7-10.5-8.2",
    "M.6,35.3c2.7-.3,4.9-2.5,4.9-5.3,0-2.8-2.1-5-4.9-5.3",
    "M59.7,24.6c-2.8.2-5.1,2.5-5.1,5.3,0,2.8,2.2,5.1,5,5.4",
  ],
  // 4 – spiral rings (single compound path)
  [
    "M47.9,25c0,2.3,0,4.1,0,5.3-.2,4.8-1.9,8.8-5.1,12.1-10,10.2-27.1,5.3-30.2-8.5-2.1-9.1,3.2-18.1,12.3-21,1.7-.5,4.7-.8,9.1-.8,5.8,0,15.2,0,26.1,0M53.7,25c0,2.5,0,4.4,0,5.5,0,3.2-.7,6.3-2.1,9.3-3,6.4-7.9,10.7-14.5,12.8-4.9,1.5-9.7,1.5-14.5-.1C6.5,47,1,27.1,12.3,14.3c3.3-3.7,7.4-6.2,12.4-7.4,1.9-.4,5.2-.7,10.1-.6,7.2,0,16.2,0,25.2,0M36.4,25c0,1,0,2.1,0,3.4,0,3-.4,5.3-3,6.9-3.7,2.4-8.3.4-9.5-3.7-.5-1.9-.2-3.7,1.1-5.4,2-2.7,4.4-2.6,8.1-2.6,12.4,0,21.1,0,26.1,0,.2,0,.3.1.3.3,0,3,.2,6,0,8.6-.9,9.5-5.4,16.9-13.4,22.2-12.7,8.4-30.1,5.2-39.3-6.9C-6.7,30.3,3.1,5.1,24.8,1.1c1.8-.3,5.2-.5,10.1-.5,4.2,0,13.3,0,25,0M42.1,25c0,1.2,0,2.8,0,5,0,5-3,9.4-7.7,11.3-7.6,3-16-2.3-16.5-10.5-.2-3.3.8-6.2,2.9-8.6,1.6-1.8,3.5-3.1,5.7-3.7,1.3-.4,3.5-.6,6.5-.6,11.4,0,21,0,27,0",
  ],
  // 5 – horizontal lines (oval shape)
  [
    "M17.2,59.4h25.5",
    "M8.9,52.9h42.2",
    "M4.2,46.4h51.4",
    "M1.6,39.8h56.7",
    "M.4,33.3h59.2",
    "M.4,26.8h59.2",
    "M1.5,20.3h56.9",
    "M4.2,13.7h51.5",
    "M8.9,7.2h42.2",
    "M17.3.7h25.4",
  ],
];

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */
const LEFT_CARDS: CardData[] = [
  {
    id: "card-L0",
    svgIndex: 0,
    title: "AI & Intelligent Automation",
    description:
      "AI-powered solutions designed to enhance products, automate workflows, and unlock smarter digital experiences.",
  },
  {
    id: "card-L1",
    svgIndex: 1,
    title: "Web Development",
    description:
      "Custom web development delivered with a product-focused, design-conscious approach.",
  },
  {
    id: "card-L2",
    svgIndex: 2,
    title: "Product Design",
    description:
      "AI-powered solutions designed to enhance products, automate workflows, and unlock smarter digital experiences.",
  },
];

const RIGHT_CARDS: CardData[] = [
  {
    id: "card-R0",
    svgIndex: 3,
    title: "Website & Mobile Design",
    description:
      "High-quality website and app experiences designed to attract users and keep them coming back.",
  },
  {
    id: "card-R1",
    svgIndex: 4,
    title: "WordPress Development",
    description:
      "WordPress development focused on performance, clarity, and experiences that convert visitors into loyal users.",
  },
  {
    id: "card-R2",
    svgIndex: 5,
    title: "Branding",
    description:
      "WordPress development focused on performance, clarity, and experiences that convert visitors into loyal users.",
  },
];

const TEXT_LINES = ["A.I.", "Design", "Development", "Branding"];

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */
function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}
function randInt(a: number, b: number) {
  return Math.floor(rand(a, b + 1));
}

/* ─────────────────────────────────────────────
   Card Component
   ───────────────────────────────────────────── */
function ServiceCard({ data }: { data: CardData }) {
  const paths = CARD_SVG_PATHS[data.svgIndex];

  return (
    <div className="w-full h-full relative">
      <div className="card-inner pointer-events-auto bg-[#000]/20 border-0 rounded-sm p-10 h-full flex flex-col justify-between overflow-hidden relative backdrop-blur-md min-h-79">
        <div className="card-top relative z-10 flex justify-between items-start gap-6">
          <h3 className="text-white m-0 max-w-50">{data.title}</h3>
          <svg
            viewBox="0 0 60 60"
            xmlns="http://www.w3.org/2000/svg"
            className="card-svg-icon shrink-0 w-25 h-25"
          >
            {paths.map((d, i) => (
              <path
                key={i}
                className="svg-path"
                fill="none"
                stroke="#d8d8d8"
                strokeMiterlimit={10}
                style={{ vectorEffect: "non-scaling-stroke" }}
                d={d}
              />
            ))}
          </svg>
        </div>
        <p className="text-light-font relative z-10 m-0 small max-w-75">
          {data.description}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
export default function TrionnServices() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const scrollDriverRef = useRef<HTMLDivElement>(null);
  const stickyWrapRef = useRef<HTMLDivElement>(null);
  const stripesRef = useRef<HTMLDivElement[]>([]);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const setCardRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      cardRefs.current[id] = el;
    },
    [],
  );

  /* ── mutable state kept in refs to avoid re-renders in RAF ── */
  const stateRef = useRef({
    imgs: new Array<HTMLImageElement>(371),
    loaded: 0,
    preloading: false,
    videoIdx: 0,
    scrollT: 0,
    cardsT: 0, // Smoothed scroll specifically for cards
    particles: [] as Particle[],
    prevInZone: false,
    particleContainer: null as HTMLDivElement | null,
    gsapTL: null as gsap.core.Timeline | null,
    cardsTL: null as gsap.core.Timeline | null,
    svgFired: new Set<string>(),
    pairCenterTimes: [] as { lk: string; rk: string; centerTime: number }[],
  });

  const TOTAL = 371;
  const EXPLODE_START = 0.35;
  const EXPLODE_END = 0.53;
  const CARDS_START = 0.45;
  const CARDS_END = 1.0;

  /* ── Measure each char viewport position ── */
  const measureChars = useCallback((): CharMeasure[] => {
    const results: CharMeasure[] = [];
    const overlay = textOverlayRef.current;
    if (!overlay) return results;

    overlay.querySelectorAll<HTMLElement>("[data-line]").forEach((line) => {
      const cs = getComputedStyle(line);
      const raw = line.textContent || "";
      const text = applyTextTransform(raw, cs.textTransform);
      const rect = line.getBoundingClientRect();
      const fSize = parseFloat(cs.fontSize);
      const fontFamily = cs.fontFamily;
      const fontWeight = cs.fontWeight;
      const fontStyle = cs.fontStyle;
      const color = cs.color;
      const lsPx = letterSpacingPx(cs, fSize);

      const tmpCanvas = document.createElement("canvas");
      const tmp = tmpCanvas.getContext("2d")!;
      tmp.font = `${fontStyle} ${fontWeight} ${fSize}px ${fontFamily}`;
      const tmpExt = tmp as CanvasRenderingContext2D & { letterSpacing?: string };
      if ("letterSpacing" in tmpExt) {
        tmpExt.letterSpacing = cs.letterSpacing;
      }

      const widths: number[] = [];
      let tw = 0;
      for (let i = 0; i < text.length; i++) {
        const w = tmp.measureText(text[i]!).width;
        widths.push(w);
        tw += w;
        if (i < text.length - 1) tw += lsPx;
      }

      let x = rect.left + rect.width / 2 - tw / 2;
      const y = rect.top + rect.height / 2;

      for (let i = 0; i < text.length; i++) {
        const c = text[i]!;
        const cw = widths[i]!;
        results.push({
          ch: c,
          x: x + cw / 2,
          y,
          fontSize: fSize,
          fontFamily,
          fontWeight,
          fontStyle,
          color,
        });
        x += cw;
        if (i < text.length - 1) x += lsPx;
      }
    });
    return results;
  }, []);

  /* ── Create explosion particles ── */
  const createParticles = useCallback(() => {
    const s = stateRef.current;
    if (s.gsapTL) {
      s.gsapTL.kill();
      s.gsapTL = null;
    }
    if (s.particleContainer) {
      s.particleContainer.remove();
      s.particleContainer = null;
    }
    s.particles = [];

    const container = document.createElement("div");
    /* `mix-blend-difference` on moving single-glyph layers composites each letter against a
       different part of the video/stone → uneven color/weight. Use normal blend + headline color. */
    container.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:999;overflow:visible;isolation:isolate;mix-blend-mode:normal;";
    document.body.appendChild(container);
    s.particleContainer = container;

    const m = measureChars();
    const maxDim = Math.max(window.innerWidth, window.innerHeight);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const hc = randInt(2, 3);
    const hi = new Set<number>();
    while (hi.size < Math.min(hc, m.length)) hi.add(randInt(0, m.length - 1));

    m.forEach((p, i) => {
      const isHero = hi.has(i);
      const el = document.createElement("span");
      el.textContent = p.ch;
      el.style.cssText = `position:absolute;top:0;left:0;font-family:${p.fontFamily};font-style:${p.fontStyle};font-weight:${p.fontWeight};font-size:${p.fontSize}px;color:${p.color};font-synthesis:none;transform-origin:center center;will-change:transform,opacity;white-space:nowrap;line-height:1;-webkit-font-smoothing:antialiased;`;
      container.appendChild(el);

      const er = el.getBoundingClientRect();
      const offX = -(er.width / 2);
      const offY = -(er.height / 2);
      gsap.set(el, { x: p.x + offX, y: p.y + offY, opacity: 1 });

      const angle = rand(-Math.PI, Math.PI);
      const speed = isHero
        ? rand(0.05, 0.15) * maxDim
        : rand(0.4, 0.9) * maxDim;

      s.particles.push({
        el,
        ox: p.x,
        oy: p.y,
        fontSize: p.fontSize,
        isHero,
        offX,
        offY,
        tx: isHero ? vw / 2 + rand(-vw * 0.15, vw * 0.15) : null,
        ty: isHero ? vh / 2 + rand(-vh * 0.15, vh * 0.15) : null,
        heroScale: isHero ? rand(6, 10) : 1,
        dirX: Math.cos(angle),
        dirY: Math.sin(angle) * rand(-1.0, 0.18),
        speed,
        rotX: rand(-360, 360),
        rotY: rand(-360, 360),
        rotZ: isHero ? rand(-15, 15) : rand(-180, 180),
        fadeOffset: rand(0, 0.3),
      });
    });

    const tl = gsap.timeline({ paused: true });
    tl.to(
      { _p: 0 },
      {
        _p: 1,
        duration: 1,
        ease: "none",
        onUpdate() {
          const t = this.progress();
          s.particles.forEach((p) => {
            const px = p.isHero
              ? p.ox + (p.tx! - p.ox) * t
              : p.ox + p.dirX * p.speed * t;
            const py = p.isHero
              ? p.oy + (p.ty! - p.oy) * t
              : p.oy + p.dirY * p.speed * t;

            let op: number;
            if (p.isHero) {
              op = t < 0.15 ? t / 0.15 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
            } else {
              op =
                t < p.fadeOffset + 0.3
                  ? 1
                  : Math.max(0, 1 - (t - p.fadeOffset - 0.3) / 0.35);
            }

            const fs = p.isHero
              ? p.fontSize * (1 + (p.heroScale - 1) * Math.min(1, t / 0.5))
              : p.fontSize;

            const flipX = Math.cos((p.rotY * t * Math.PI) / 180);
            const flipY = p.isHero ? 1 : Math.cos((p.rotX * t * Math.PI) / 180);
            const rotZ = p.rotZ * t;

            gsap.set(p.el, {
              x: px + p.offX,
              y: py + p.offY,
              fontSize: fs,
              rotation: rotZ,
              scaleX: flipX,
              scaleY: flipY,
              opacity: Math.max(0, op),
            });
          });
        },
      },
    );
    s.gsapTL = tl;
  }, [measureChars]);

  const clearParticles = useCallback(() => {
    const s = stateRef.current;
    if (s.gsapTL) {
      s.gsapTL.kill();
      s.gsapTL = null;
    }
    if (s.particleContainer) {
      s.particleContainer.remove();
      s.particleContainer = null;
    }
    s.particles = [];
  }, []);

  /* ── Build cards GSAP timeline ── */
  const buildCardsTL = useCallback(() => {
    const s = stateRef.current;
    if (s.cardsTL) s.cardsTL.kill();

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 768;
    const W = Math.round(vw * (isMobile ? 0.42 : 0.28));
    const H = Math.round(vh * (isMobile ? 0.28 : 0.32));

    const cEls = cardRefs.current;
    const allEls = Object.values(cEls).filter(Boolean) as HTMLDivElement[];

    allEls.forEach((el) => {
      el.style.width = W + "px";
      el.style.height = H + "px";
    });

    gsap.set(allEls, { opacity: 0, x: 0, y: 0 });

    const tl = gsap.timeline({ paused: true });
    const pairDur = 0.45;
    const pairStep = 0.2;
    const STEPS = 12;

    const pairs: [string, string][] = [
      ["card-L0", "card-R0"],
      ["card-L1", "card-R1"],
      ["card-L2", "card-R2"],
    ];

    s.svgFired = new Set<string>();
    s.pairCenterTimes = pairs.map(([lk, rk], i) => ({
      lk,
      rk,
      centerTime: i * pairStep + pairDur * 0.3,
    }));

    pairs.forEach(([lk, rk], i) => {
      const startT = i * pairStep;
      const lEl = cEls[lk];
      const rEl = cEls[rk];
      if (!lEl || !rEl) return;

      const lData = LEFT_CARDS.find((c) => c.id === lk);
      const rData = RIGHT_CARDS.find((c) => c.id === rk);

      const lFrames: any[] = [];
      const rFrames: any[] = [];

      for (let step = 0; step <= STEPS; step++) {
        const frac = step / STEPS;

        const lStartX = -W * 0.7;
        const lEndX = -W * 0.7;
        const lStartY = vh;
        const lEndY = -H;
        const lPeakX = vw * 0.1;

        const lY = lStartY + frac * (lEndY - lStartY);
        const arc = frac <= 0.5 ? Math.sin(frac * Math.PI) : 1;
        const lX = lStartX + arc * (lPeakX - lStartX);

        const rStartX = vw - W * 0.3;
        const rStartY = -H;
        const rEndY = vh;
        const rPeakX = vw * 0.9 - W;

        const rY = rStartY + frac * (rEndY - rStartY);
        const rX = rStartX + arc * (rPeakX - rStartX);

        const op =
          frac < 0.15
            ? frac / 0.15
            : frac > 0.85
              ? 1 - (frac - 0.85) / 0.15
              : 1;

        lFrames.push({
          x: lX,
          y: lY,
          opacity: op,
        });
        rFrames.push({
          x: rX,
          y: rY,
          opacity: op,
        });
      }

      const lPosFrames = lFrames.map((f) => ({
        x: f.x,
        y: f.y,
        opacity: f.opacity,
      }));
      const rPosFrames = rFrames.map((f) => ({
        x: f.x,
        y: f.y,
        opacity: f.opacity,
      }));

      tl.to(
        lEl,
        { keyframes: lPosFrames, duration: pairDur, ease: "none" },
        startT,
      );
      tl.to(
        rEl,
        { keyframes: rPosFrames, duration: pairDur, ease: "none" },
        startT,
      );

      /* ── DrawSVG: init paths — animation fires independently in updateCards ── */
      const svgPathsL = Array.from(
        lEl.querySelectorAll<SVGPathElement>(".svg-path"),
      );
      const svgPathsR = Array.from(
        rEl.querySelectorAll<SVGPathElement>(".svg-path"),
      );
      if (svgPathsL.length) gsap.set(svgPathsL, { drawSVG: "0%" });
      if (svgPathsR.length) gsap.set(svgPathsR, { drawSVG: "0%" });
    });

    s.cardsTL = tl;
  }, []);

  /* ── Update cards ── */
  const updateCards = useCallback(
    (t: number) => {
      const s = stateRef.current;
      if (!s.cardsTL) buildCardsTL();

      const cEls = cardRefs.current;
      const allEls = Object.values(cEls).filter(Boolean) as HTMLDivElement[];

      if (t < CARDS_START) {
        gsap.set(allEls, { opacity: 0, x: 0, y: 0 });
        return;
      }

      const prog = Math.min(1, (t - CARDS_START) / (CARDS_END - CARDS_START));
      s.cardsTL?.progress(prog);

      // Fire SVG draw animation once per pair when timeline crosses center time
      const tlTime = s.cardsTL?.time() ?? 0;
      s.pairCenterTimes.forEach(({ lk, rk, centerTime }) => {
        if (!s.svgFired.has(lk) && tlTime >= centerTime) {
          s.svgFired.add(lk);
          const lEl = cardRefs.current[lk];
          const rEl = cardRefs.current[rk];
          if (lEl) {
            const paths = Array.from(
              lEl.querySelectorAll<SVGPathElement>(".svg-path"),
            );
            if (paths.length)
              gsap.fromTo(
                paths,
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 1.5, ease: "none", stagger: 0.04 },
              );
          }
          if (rEl) {
            const paths = Array.from(
              rEl.querySelectorAll<SVGPathElement>(".svg-path"),
            );
            if (paths.length)
              gsap.fromTo(
                paths,
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 1.5, ease: "none", stagger: 0.04 },
              );
          }
        }
      });
    },
    [buildCardsTL, CARDS_START, CARDS_END],
  );

  /* ── Draw frame ── */
  const drawFrame = useCallback((i: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    const img = s.imgs[Math.round(i)];
    if (!img || !img.complete) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = ch / ih;
    const dw = iw * scale;
    const dh = ih * scale;

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    ctx.restore();
  }, []);

  /* ── Resize ── */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const vh = Math.round(
      typeof window !== "undefined" && window.visualViewport?.height
        ? window.visualViewport.height
        : window.innerHeight,
    );
    const cvH = vh;
    const cvW = Math.round(cvH * (16 / 9));
    canvas.width = cvW * dpr;
    canvas.height = cvH * dpr;
    canvas.style.width = cvW + "px";
    canvas.style.height = cvH + "px";
    stateRef.current.cardsTL = null;
    drawFrame(stateRef.current.videoIdx);
  }, [drawFrame]);

  /* ── Set text overlay visibility ── */
  const setOverlay = useCallback((v: boolean) => {
    const overlay = textOverlayRef.current;
    if (!overlay) return;
    overlay.style.transition = "none";
    overlay.style.opacity = v ? "1" : "0";
  }, []);

  /* ── Preload frames ── */
  const preload = useCallback(() => {
    const s = stateRef.current;
    if (s.preloading || s.loaded > 0) return;
    s.preloading = true;
    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.onload = () => {
        s.loaded++;
        if (s.loaded === TOTAL) {
          drawFrame(0);
        }
      };
      img.src = `stone/frame_${String(i + 1).padStart(4, "0")}.webp`;
      s.imgs[i] = img;
    }
  }, [drawFrame, TOTAL]);

  /* ── ScrollTrigger: pin section, scrub scrollT 0→1 then hold final frame (testimonials overlap) ── */
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const driver = scrollDriverRef.current;
      const sticky = stickyWrapRef.current;
      if (!driver || !sticky) return;

      ScrollTrigger.create({
        trigger: driver,
        start: "top 200%", // Start preloading 1 viewport above
        once: true,
        onEnter: () => preload(),
      });


      ScrollTrigger.create({
        trigger: driver,
        start: "top top",
        end: `+=${SERVICES_PIN_END_PERCENT}%`,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          stateRef.current.scrollT = mapServicesScrollProgress(self.progress);

          /* ── Stripe reveal during hold phase ── */
          const holdStart = (SERVICES_SHUTTER_VH + SERVICES_SCRUB_VH) / SERVICES_PIN_END_PERCENT;
          const holdT = Math.max(0, Math.min(1, (self.progress - holdStart) / (1 - holdStart)));
          const stripes = stripesRef.current;
          const stripeCount = stripes.length;
          if (stripeCount > 0) {
            const staggerAmount = 0.3;
            const perStripe = (0.6 - staggerAmount) / 1; // duration per stripe within normalized 0-1
            for (let i = 0; i < stripeCount; i++) {
              // stagger from end (last stripe animates first)
              const staggerIdx = stripeCount - 1 - i;
              const stripeStart = (staggerAmount * staggerIdx) / (stripeCount - 1 || 1);
              const stripeEnd = stripeStart + perStripe;
              const stripeProgress = Math.max(0, Math.min(1, (holdT - stripeStart) / (stripeEnd - stripeStart)));
              gsap.set(stripes[i]!, { scaleY: stripeProgress });
            }
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  /* ── Main effect — init everything ── */
  useEffect(() => {
    const s = stateRef.current;

    resize();

    const handleResize = () => {
      resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    /* RAF loop */
    let rafId: number;
    const raf = (_time: number) => {
      rafId = requestAnimationFrame(raf);
      if (!s.loaded) return;

      const targetFrame = s.scrollT * (TOTAL - 1);
      s.videoIdx += (targetFrame - s.videoIdx) * 0.12;

      const inZone = s.scrollT >= EXPLODE_START && s.scrollT <= EXPLODE_END;
      const pastZone = s.scrollT > EXPLODE_END;
      const explodeT = inZone
        ? (s.scrollT - EXPLODE_START) / (EXPLODE_END - EXPLODE_START)
        : 0;

      if (inZone && !s.prevInZone) createParticles();
      if (!inZone && s.prevInZone) clearParticles();
      s.prevInZone = inZone;

      drawFrame(s.videoIdx);

      if (inZone && s.gsapTL) {
        s.gsapTL.progress(explodeT);
        setOverlay(false);
      } else if (pastZone) {
        setOverlay(false);
      } else {
        setOverlay(true);
      }

      /* ── Background video: always playing ── */
      const vid = bgVideoRef.current;
      if (vid && vid.paused) vid.play().catch(() => {});

      // Add simple lerp for the cards to provide a smooth scrub without vibration
      s.cardsT += (s.scrollT - s.cardsT) * 0.08;
      updateCards(s.cardsT);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      clearParticles();
      if (s.cardsTL) s.cardsTL.kill();
    };
  }, [
    resize,
    preload,
    drawFrame,
    createParticles,
    clearParticles,
    setOverlay,
    updateCards,
    TOTAL,
    EXPLODE_START,
    EXPLODE_END,
  ]);

  return (
    <section
      className="relative isolate bg-[#000] overflow-hidden"
      style={{ zIndex: 1, marginTop: `-${SERVICES_SHUTTER_VH}vh` }}
    >
      {/* ── Scroll driver (pin spacing from ScrollTrigger) ── */}
      <div ref={scrollDriverRef} className="relative min-h-screen min-h-[100dvh]">
        {/* Viewport stack: avoid position:sticky here — it fights GSAP pin and causes jerk */}
        <div
          ref={stickyWrapRef}
          className="relative h-[100dvh] w-full overflow-hidden bg-[#000]"
        >
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            id="c"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block h-[100dvh] w-auto max-w-none"
          />

          {/* Background video — full-bleed cover so no strip shows at bottom */}
          <video
            ref={bgVideoRef}
            src="/video/homepage-services-video.mp4"
            muted
            loop
            playsInline
            preload="auto"
            className="pointer-events-none object-cover rotate-180 opacity-50 z-1 mix-blend-screen absolute inset-0 h-full w-full min-h-full min-w-full"
          />

          {/* Cards overlay */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden z-2"
            style={{ perspective: "93.75rem" }}
          >
            {LEFT_CARDS.map((card) => (
              <div
                key={card.id}
                ref={setCardRef(card.id)}
                className="svc-card absolute top-0 left-0 will-change-[transform,opacity] transform-3d p-1.5"
              >
                <ServiceCard data={card} />
              </div>
            ))}
            {RIGHT_CARDS.map((card) => (
              <div
                key={card.id}
                ref={setCardRef(card.id)}
                className="svc-card absolute top-0 left-0 will-change-[transform,opacity] transform-3d p-1.5"
              >
                <ServiceCard data={card} />
              </div>
            ))}
          </div>
          <div className="tr__container py-25 relative flex flex-col justify-between items-center h-full">
            <BlurTextReveal
              as="span"
              html={`OUR SERVICES`}
              animationType="chars"
              stagger={0.05}
              className="text-light-font title text-center block relative z-20"
            />
            <div
              ref={textOverlayRef}
              className=" flex items-center justify-center pointer-events-none mix-blend-difference z-20 my-20 w-full"
            >
              <div className="text-center">
                {TEXT_LINES.map((line, i) => (
                  <div
                    key={i}
                    data-line
                    className={`text-light-font block mrquee-text uppercase`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between w-full">
              <div className="hidden lg:block w-1/3"></div>
              <div className="w-full sm:w-1/2 lg:w-1/3 text-center">
                <BlurTextReveal
                  as="span"
                  html={`✦ Design with intent. Built to work.`}
                  animationType="chars"
                  stagger={0.05}
                  className="text-light-font title block relative z-20"
                />
              </div>
              <div className="w-full sm:w-1/2 lg:w-1/3 flex justify-end">
                <WordShiftButton
                  text={"view services"}
                  href={"#"}
                  customClass="relative z-20"
                  styleVars={{ buttonWrapperColor: "#D8D8D8" }}
                />
              </div>
            </div>
          </div>
          {/* ── Stripes overlay (covers content during hold phase) ── */}
          <div className="absolute inset-0 pointer-events-none flex flex-col w-full h-full z-30">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) stripesRef.current[i] = el;
                }}
                style={{
                  flex: 1,
                  width: "100%",
                  marginTop: i > 0 ? "-0.5px" : undefined,
                  paddingBottom: "0.5px",
                  backgroundColor: "#fff",
                  transform: "scaleY(0)",
                  transformOrigin: "bottom",
                  willChange: "transform",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
