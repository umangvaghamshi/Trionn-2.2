"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useSiteSound } from "@/components/SiteSoundContext";
import { getCanvasManager } from "@/lib/canvasManager";

/**
 * TeamSection — App Router compatible client component.
 *
 * Converts the original plain HTML/CSS/JS "TRIONN team identification"
 * animation into a single, reusable Next.js component.
 *
 * Drop into any page:
 *   import TeamSection from "@/components/TeamSection";
 *   export default function Page() { return <TeamSection />; }
 *
 * Place /public/images/<file>.jpg + <file>.mp4 for each PEOPLE entry.
 */

type Person = { name: string; file: string; role: string };

const PEOPLE: Person[] = [
  { name: "PRABHATSINH MAKA", file: "prabhat", role: "Backend Developer" },
  { name: "GAURAV JOSHI", file: "gaurav", role: "Backend Developer" },
  { name: "RUSHI VASANI", file: "rushi", role: "Backend Developer" },
  { name: "DHRUV SOLANKI", file: "dhruv", role: "Backend Developer" },
  { name: "SANDIP RATHOD", file: "sandip", role: "Backend Developer" },
  { name: "HARDIK VATUKIYA", file: "hardik", role: "Backend Developer" },
  { name: "VIRAL MARU", file: "viral", role: "Frontend Developer" },
  { name: "UMANG VAGHAMSHI", file: "umang", role: "Frontend Developer" },
  { name: "RAHUL SOLANKI", file: "rahul", role: "Frontend Developer" },
  { name: "BHAGIRATHSINH JADEJA", file: "bhagirath", role: "Designer" },
  { name: "AYAZ KADRI", file: "ayaz", role: "Designer" },
  { name: "DHAVAL BHADUKIYA", file: "dhaval", role: "Designer" },
  { name: "VAISHNAVI KACHA", file: "vaishnavi", role: "Designer" },
  { name: "NILESH GUJARATI", file: "nilesh", role: "Designer" },
];

export default function TeamSection() {
  useLenis(); // subscribe to the global Lenis instance provided by SmoothScrolling
  const { soundEnabled } = useSiteSound();
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    if (!soundEnabled && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [soundEnabled]);

  // Refs for every DOM node touched by the original logic
  const sceneRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const crtRef = useRef<HTMLDivElement>(null);
  const centerFrameRef = useRef<HTMLDivElement>(null);
  const frameOuterRef = useRef<HTMLDivElement>(null);
  const arcCanvasRef = useRef<HTMLCanvasElement>(null);
  const centerFrameInnerRef = useRef<HTMLDivElement>(null);
  const frameHintRef = useRef<HTMLDivElement>(null);
  const frameImgRef = useRef<HTMLImageElement>(null);
  const frameVidRef = useRef<HTMLVideoElement>(null);
  const scanGridRef = useRef<HTMLCanvasElement>(null);
  const scanOverlayRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const glitchCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameDetectionRef = useRef<HTMLDivElement>(null);
  const identifyingTextRef = useRef<HTMLDivElement>(null);
  const detectionStatusRef = useRef<HTMLDivElement>(null);
  const hudOverlayRef = useRef<HTMLDivElement>(null);
  const hudDeptRef = useRef<HTMLDivElement>(null);
  const hudBarFillRef = useRef<HTMLDivElement>(null);
  const frameCaptionRef = useRef<HTMLDivElement>(null);
  const frameNameRef = useRef<HTMLDivElement>(null);
  const frameRoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard against SSR — we're already in a "use client" component
    // but useEffect won't run on the server, so window/document are safe here.
    if (typeof window === "undefined") return;

    crtRef.current?.classList.add("visible");
    vignetteRef.current?.classList.add("visible");

    /* ───────── ORIGINAL LOGIC (preserved) ───────── */

    const RATIO = 705 / 573;
    const _mob = window.innerWidth <= 600;
    const _tab = window.innerWidth > 600 && window.innerWidth <= 1024;
    const _lap = window.innerWidth > 1024 && window.innerWidth <= 1440;
    const FRAME_W = _mob ? 260 : _tab ? 310 : _lap ? 345 : 400;
    const FRAME_H = Math.round(FRAME_W * RATIO);
    const CARD_SIZES = _mob
      ? [68, 68, 68, 68]
      : _tab
      ? [80, 95, 110, 125]
      : _lap
      ? [105, 120, 138, 155]
      : [130, 150, 170, 195];
    let _zTop = 10;

    function randW() {
      return CARD_SIZES[Math.floor(Math.random() * CARD_SIZES.length)];
    }

    const CARD_POS_DESK: [number, number][] = [
      [0.72, 0.08], [0.28, 0.2], [0.88, 0.46], [0.06, 0.59],
      [0.64, 0.72], [0.36, 0.86], [0.92, 0.2], [0.14, 0.08],
      [0.78, 0.59], [0.22, 0.72], [0.68, 0.86], [0.04, 0.33],
      [0.84, 0.33], [0.18, 0.46],
    ];
    const CARD_POS_MOB: [number, number][] = [
      [0.18, 0.13], [0.5, 0.13], [0.82, 0.13],
      [0.12, 0.26], [0.37, 0.26], [0.63, 0.26], [0.88, 0.26],
      [0.12, 0.62], [0.37, 0.62], [0.63, 0.62], [0.88, 0.62],
      [0.18, 0.76], [0.5, 0.76], [0.82, 0.76],
    ];
    const CARD_POS = _mob ? CARD_POS_MOB : CARD_POS_DESK;

    /* DOM */
    const scene = sceneRef.current!;
    const vignette = vignetteRef.current!;
    const frameOuter = frameOuterRef.current!;
    const scanGrid = scanGridRef.current!;
    const glitchCanvas = glitchCanvasRef.current!;
    const hudOverlay = hudOverlayRef.current!;
    const hudDept = hudDeptRef.current!;
    const hudBarFill = hudBarFillRef.current!;
    const centerFrame = centerFrameRef.current!;
    const centerFrameInner = centerFrameInnerRef.current!;
    const frameHint = frameHintRef.current!;
    if (_mob) frameHint.textContent = "TAP A MEMBER TO IDENTIFY";
    const frameImg = frameImgRef.current!;
    const frameVid = frameVidRef.current!;
    const scanLine = scanLineRef.current!;
    const scanOverlay = scanOverlayRef.current!;
    const frameDetection = frameDetectionRef.current!;
    const detectionStatus = detectionStatusRef.current!;
    const identifyingText = identifyingTextRef.current!;
    const frameCaption = frameCaptionRef.current!;
    const frameName = frameNameRef.current! as HTMLDivElement & {
      _twAbort?: (() => void) | null;
    };
    const frameRole = frameRoleRef.current!;

    type CardState = {
      i: number;
      w: number;
      h: number;
      baseW: number;
      baseH: number;
      ox: number;
      oy: number;
      x: number;
      y: number;
      angle: number;
      phaseY: number;
      speed: number;
      rx: number;
      ry: number;
      floating: boolean;
      dragging: boolean;
      flyingBack?: boolean;
      _flyTween?: gsap.core.Tween | null;
    };

    const state: CardState[] = PEOPLE.map((_p, i) => {
      const w = randW();
      const h = Math.round(w * RATIO);
      return {
        i, w, h, baseW: w, baseH: h,
        ox: 0, oy: 0, x: 0, y: 0,
        angle: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speed: 0.00028 + Math.random() * 0.0002,
        rx: 35 + Math.random() * 50,
        ry: 25 + Math.random() * 40,
        floating: true,
        dragging: false,
      };
    });

    let _mobSceneH = 0;

    /* ── BUILD CARDS ── */
    const cardEls: HTMLDivElement[] = [];
    PEOPLE.forEach((p, i) => {
      const s = state[i];
      const card = document.createElement("div");
      card.className = "vcard";
      card.style.cssText =
        "position:absolute;left:0;top:0;z-index:5;will-change:transform;overflow:visible;cursor:grab;user-select:none;";
      card.style.width = s.w + "px";
      card.style.height = s.h + "px";

      const inner = document.createElement("div");
      inner.className = "card-inner";
      inner.style.cssText =
        "position:relative;width:100%;height:100%;border-radius:8px;overflow:hidden;background:#0c0c10;";

      const img = document.createElement("img");
      img.src = `/images/${p.file}.jpg`;
      img.alt = p.name;
      img.draggable = false;
      img.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;z-index:2;opacity:1;transition:opacity .32s ease;";

      const vid = document.createElement("video");
      vid.src = `/images/${p.file}.mp4`;
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = "auto";
      vid.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;z-index:1;opacity:0;";

      inner.appendChild(img);
      inner.appendChild(vid);
      card.appendChild(inner);
      scene.appendChild(card);
      cardEls.push(card);
    });

    /* ── FLOAT INIT ── */
    function initFloat() {
      const vw = window.innerWidth, vh = window.innerHeight;

      if (_mob) {
        const cw = 68;
        const ch = Math.round(cw * RATIO);
        const gap = 14;
        const rowH = ch + gap;
        const topPad = 50;
        const boxGap = 40;
        const boxTop = topPad + 2 * rowH + boxGap;
        const boxBottom = boxTop + 318 + boxGap;

        const rowsAbove = [[3, 4, 5, 6], [0, 1, 2]];
        rowsAbove.forEach((row, ri) => {
          const rowCenterY = boxTop - boxGap - ch / 2 - ri * rowH;
          const totalW = row.length * cw + (row.length - 1) * gap;
          const startX = (vw - totalW) / 2 + cw / 2;
          row.forEach((idx, ci) => {
            const s = state[idx];
            s.baseW = cw; s.baseH = ch; s.w = cw; s.h = ch;
            s.ox = startX + ci * (cw + gap);
            s.oy = rowCenterY;
            s.rx = 5 + Math.random() * 5;
            s.ry = 5 + Math.random() * 5;
            s.x = s.ox; s.y = s.oy;
            const el = cardEls[idx];
            if (el) { el.style.width = cw + "px"; el.style.height = ch + "px"; }
          });
        });

        const rowsBelow = [[7, 8, 9, 10], [11, 12, 13]];
        rowsBelow.forEach((row, ri) => {
          const rowCenterY = boxBottom + ch / 2 + ri * rowH;
          const totalW = row.length * cw + (row.length - 1) * gap;
          const startX = (vw - totalW) / 2 + cw / 2;
          row.forEach((idx, ci) => {
            const s = state[idx];
            s.baseW = cw; s.baseH = ch; s.w = cw; s.h = ch;
            s.ox = startX + ci * (cw + gap);
            s.oy = rowCenterY;
            s.rx = 5 + Math.random() * 5;
            s.ry = 5 + Math.random() * 5;
            s.x = s.ox; s.y = s.oy;
            const el = cardEls[idx];
            if (el) { el.style.width = cw + "px"; el.style.height = ch + "px"; }
          });
        });

        const sceneH = boxBottom + 2 * rowH + 50;
        _mobSceneH = sceneH;
        scene.style.minHeight = sceneH + "px";
        scene.style.height = sceneH + "px";
        return;
      }

      state.forEach((s, i) => {
        s.ox = CARD_POS[i][0] * vw;
        s.oy = CARD_POS[i][1] * vh;
        const marginH = s.w / 2 + (_mob ? 8 : 40);
        const marginV = _mob ? s.h / 2 + 8 : s.h / 2 + 150;
        s.rx = Math.min(s.rx, s.ox - marginH, vw - s.ox - marginH);
        s.ry = Math.min(s.ry, s.oy - marginV, vh - s.oy - marginV);
        s.rx = Math.max(s.rx, 5); s.ry = Math.max(s.ry, 5);
        s.x = s.ox; s.y = s.oy;
      });

      const PAD = 18;
      for (let iter = 0; iter < 80; iter++) {
        let moved = false;
        for (let i = 0; i < state.length; i++) {
          for (let j = i + 1; j < state.length; j++) {
            const si = state[i], sj = state[j];
            const dx = si.ox - sj.ox, dy = si.oy - sj.oy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
            const minD = (si.w + sj.w) / 2 + PAD;
            if (dist < minD) {
              const push = (minD - dist) / 2;
              const nx = (dx / dist) * push, ny = (dy / dist) * push;
              si.ox += nx; si.oy += ny; sj.ox -= nx; sj.oy -= ny;
              const mi = Math.max(si.w, si.h) / 2 + 4, mj = Math.max(sj.w, sj.h) / 2 + 4;
              si.ox = Math.max(mi, Math.min(vw - mi, si.ox));
              si.oy = Math.max(mi, Math.min(vh - mi, si.oy));
              sj.ox = Math.max(mj, Math.min(vw - mj, sj.ox));
              sj.oy = Math.max(mj, Math.min(vh - mj, sj.oy));
              moved = true;
            }
          }
        }
        if (!moved) break;
      }

      state.forEach((s) => {
        const z = getCFZone(s.baseW, s.baseH);
        if (s.ox > z.l && s.ox < z.r && s.oy > z.t && s.oy < z.b) {
          const ddx = s.ox - z.cx, ddy = s.oy - z.cy;
          if (Math.abs(ddx) / (z.r - z.l) > Math.abs(ddy) / (z.b - z.t)) {
            s.ox = ddx >= 0 ? z.r : z.l;
          } else {
            s.oy = ddy >= 0 ? z.b : z.t;
          }
          s.ox = Math.max(s.baseW / 2 + (_mob ? 8 : 40), Math.min(vw - s.baseW / 2 - (_mob ? 8 : 40), s.ox));
          s.oy = Math.max(s.baseH / 2 + 80, Math.min(vh - s.baseH / 2 - 80, s.oy));
        }
      });

      state.forEach((s) => {
        s.x = s.ox + Math.cos(s.angle) * s.rx;
        s.y = s.oy + Math.sin(s.angle * 0.73 + s.phaseY) * s.ry;
      });
    }

    /* ── FLOAT LOOP ── */
    let lastTime: number | null = null;
    const DESKTOP_FLOAT_EASE = 0.1;
    const DESKTOP_EDGE_EASE = 0.09;
    const DESKTOP_CENTER_EASE = 0.14;

    const manager = getCanvasManager();

    function loop(ts: number) {
      if (lastTime === null) lastTime = ts;
      const dt = Math.min(ts - lastTime, 50);
      lastTime = ts;
      const vw = window.innerWidth, vh = window.innerHeight;
      state.forEach((s, i) => {
        if (!s.floating || s.dragging || s.flyingBack) return;
        s.angle += s.speed * dt;
        const nx = s.ox + Math.cos(s.angle) * s.rx;
        const ny = s.oy + Math.sin(s.angle * 0.73 + s.phaseY) * s.ry;

        let cx, cy;
        if (_mob) {
          cx = Math.max(s.baseW / 2 + 4, Math.min(vw - s.baseW / 2 - 4, nx));
          cy = Math.max(
            s.baseH / 2,
            Math.min(
              (_mobSceneH > 0 ? _mobSceneH : s.oy + s.ry) - s.baseH / 2,
              Math.max(s.oy - s.ry, Math.min(s.oy + s.ry, ny))
            )
          );
        } else {
          const clamped = clampDesktopFloatPos(nx, ny, s.baseW, s.baseH);
          const hitX = clamped.x !== nx;
          const hitY = clamped.y !== ny;
          const preX = hitX ? s.x + (clamped.x - s.x) * DESKTOP_EDGE_EASE : clamped.x;
          const preY = hitY ? s.y + (clamped.y - s.y) * DESKTOP_EDGE_EASE : clamped.y;
          const easedAway = easeDesktopAwayFromCenter(preX, preY, s.baseW, s.baseH, s.x, s.y);
          const targetX = easedAway.x;
          const targetY = easedAway.y;
          cx = s.x + (targetX - s.x) * (hitX ? DESKTOP_EDGE_EASE : DESKTOP_FLOAT_EASE);
          cy = s.y + (targetY - s.y) * (hitY ? DESKTOP_EDGE_EASE : DESKTOP_FLOAT_EASE);
        }

        s.x = cx; s.y = cy;
        cardEls[i].style.transform = `translate(${s.x - s.baseW / 2}px,${s.y - s.baseH / 2}px)`;
      });
      void vh;
    }
    const loopId = manager.register(loop);

    // Pause float loop when scene is off-screen
    const loopIo = new IntersectionObserver(
      ([entry]) => manager.setActive(loopId, entry.isIntersecting),
      { rootMargin: "64px 0px" }
    );
    loopIo.observe(scene);
    initFloat();

    // Smaller cards on top initially
    (function setInitialZ() {
      const sorted = [...state].sort((a, b) => b.baseW - a.baseW);
      sorted.forEach((s) => {
        _zTop++;
        cardEls[s.i].style.zIndex = String(_zTop);
      });
    })();

    const onResize = () => initFloat();
    window.addEventListener("resize", onResize);

    /* ── INTRO REVEAL ── */
    let introObs: IntersectionObserver | null = null;
    (function introReveal() {
      const vw = window.innerWidth, vh = window.innerHeight;
      const cx = vw / 2, cy = _mob ? 445 : vh / 2;

      cardEls.forEach((el, i) => {
        const s = state[i];
        el.style.zIndex = "3";
        gsap.set(el, { x: cx - s.baseW / 2, y: cy - s.baseH / 2, opacity: 0 });
      });

      let triggered = false;
      introObs = new IntersectionObserver(
        (entries) => {
          if (triggered) return;
          if (!entries[0].isIntersecting) return;
          triggered = true;
          introObs?.disconnect();

          const finalZ = cardEls.map(() => { _zTop++; return _zTop; });
          let landedCount = 0;

          cardEls.forEach((el, i) => {
            const s = state[i];
            const delay = 0.05 + i * 0.055;
            s.floating = false;
            el.style.zIndex = "2";
            gsap.to(el, {
              x: s.x - s.baseW / 2,
              y: s.y - s.baseH / 2,
              opacity: 1,
              duration: 0.9,
              delay: delay,
              ease: "power3.out",
              onComplete() {
                gsap.set(el, { clearProps: "x,y" });
                el.style.transform = `translate(${s.x - s.baseW / 2}px,${s.y - s.baseH / 2}px)`;
                s.floating = true;
                landedCount++;
                if (landedCount === cardEls.length) {
                  cardEls.forEach((cel, ci) => { cel.style.zIndex = String(finalZ[ci]); });
                }
              },
            });
          });
        },
        { threshold: 0.3 }
      );
      introObs.observe(scene);
    })();

    /* ── HELPERS ── */
    function getCFZone(cardW: number, cardH: number) {
      const vw = window.innerWidth, vh = window.innerHeight;
      const gap = 40 + (cardW || 0) / 2;
      const gapV = (_mob ? 40 : 120) + (cardH || 0) / 2;
      const _fw = _mob ? 268 : _tab ? 280 : _lap ? 300 : 352,
        _fh = _mob ? 326 : _tab ? 338 : _lap ? 363 : 426;
      const cy = _mob ? 445 : vh / 2;
      return {
        l: vw / 2 - _fw / 2 - gap,
        r: vw / 2 + _fw / 2 + gap,
        t: cy - _fh / 2 - gapV,
        b: cy + _fh / 2 + gapV,
        cx: vw / 2,
        cy: cy,
      };
    }

    function getDesktopBounds(cardW: number, cardH: number) {
      return {
        minX: cardW / 2 + 40,
        maxX: window.innerWidth - cardW / 2 - 40,
        minY: cardH / 2 + 80,
        maxY: window.innerHeight - cardH / 2 - 96,
      };
    }
    function clampDesktopFloatPos(x: number, y: number, cardW: number, cardH: number) {
      const b = getDesktopBounds(cardW, cardH);
      return {
        x: Math.max(b.minX, Math.min(b.maxX, x)),
        y: Math.max(b.minY, Math.min(b.maxY, y)),
      };
    }
    function clampMobileFloatPos(x: number, y: number, s: CardState) {
      const minX = s.baseW / 2 + 4;
      const maxX = window.innerWidth - s.baseW / 2 - 4;
      const minY = s.baseH / 2;
      const maxY = (_mobSceneH > 0 ? _mobSceneH : s.oy + s.ry) - s.baseH / 2;
      return {
        x: Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, Math.max(s.oy - s.ry, Math.min(s.oy + s.ry, y)))),
      };
    }
    function getFloatTarget(s: CardState, currentX: number, currentY: number) {
      const rawX = s.ox + Math.cos(s.angle) * s.rx;
      const rawY = s.oy + Math.sin(s.angle * 0.73 + s.phaseY) * s.ry;
      if (_mob) return clampMobileFloatPos(rawX, rawY, s);
      const dest = clampDesktopFloatPos(rawX, rawY, s.baseW, s.baseH);
      return easeDesktopAwayFromCenter(dest.x, dest.y, s.baseW, s.baseH, currentX, currentY);
    }
    function easeDesktopAwayFromCenter(
      x: number, y: number, cardW: number, cardH: number,
      currentX?: number, currentY?: number
    ) {
      const z = getCFZone(cardW, cardH);
      if (!(x > z.l && x < z.r && y > z.t && y < z.b)) return { x, y };
      let tx = x, ty = y;
      const dx = x - z.cx, dy = y - z.cy;
      if (Math.abs(dx) / Math.max(1, z.r - z.l) > Math.abs(dy) / Math.max(1, z.b - z.t)) {
        tx = dx >= 0 ? z.r : z.l;
      } else {
        ty = dy >= 0 ? z.b : z.t;
      }
      if (typeof currentX === "number" && typeof currentY === "number") {
        tx = currentX + (tx - currentX) * DESKTOP_CENTER_EASE;
        ty = currentY + (ty - currentY) * DESKTOP_CENTER_EASE;
      }
      return clampDesktopFloatPos(tx, ty, cardW, cardH);
    }
    function getSceneOffset() {
      const sr = scene.getBoundingClientRect();
      return { dx: sr.left, dy: sr.top };
    }
    function isOverCenter(cx: number, cy: number) {
      const r = centerFrame.getBoundingClientRect();
      return cx > r.left && cx < r.right && cy > r.top && cy < r.bottom;
    }
    function getCenterPos() {
      const r = centerFrame.getBoundingClientRect();
      const so = getSceneOffset();
      return { x: r.left + r.width / 2 - so.dx, y: r.top + r.height / 2 - so.dy };
    }

    /* ── SCAN SEQUENCE ── */
    let activeTl: gsap.core.Timeline | null = null;
    let activeCardIdx = -1;
    let stopFlickerFn: (() => void) | null = null;

    function hardResetFrame() {
      if (activeTl) { activeTl.kill(); activeTl = null; }
      if (stopFlickerFn) { stopFlickerFn(); stopFlickerFn = null; }
      gsap.killTweensOf(scanLine);
      gsap.killTweensOf(frameDetection);
      gsap.killTweensOf(detectionStatus);
      gsap.killTweensOf(identifyingText);
      gsap.killTweensOf(frameCaption);
      gsap.killTweensOf(scanOverlay);
      scanLine.style.opacity = "0";
      scanLine.style.filter = "";
      scanLine.style.top = "0px";
      scanOverlay.style.opacity = "0";
      frameDetection.style.opacity = "0";
      frameDetection.classList.remove("detected");
      detectionStatus.style.opacity = "0";
      identifyingText.style.opacity = "0";
      gsap.set(frameCaption, { opacity: 0 });
      gsap.set(frameRole, { opacity: 0 });
      frameDetection.classList.remove("brackets-in");
      gsap.set(hudOverlay, { opacity: 0 });
      gsap.set(scanGrid, { opacity: 0 });
      gsap.set(glitchCanvas, { opacity: 0 });
      const bar = scene.querySelector(".scan-id-bar");
      if (bar) gsap.set(bar, { opacity: 1 });
      vignette.classList.remove("intense");
      vignette.classList.add("visible");
      if (frameName._twAbort) { frameName._twAbort(); frameName._twAbort = null; }
      frameName.textContent = "";
      frameRole.textContent = "";
    }

    function fadeOutFrameContent(duration: number) {
      gsap.killTweensOf(frameImg);
      gsap.killTweensOf(frameVid);
      gsap.killTweensOf(frameCaption);
      gsap.killTweensOf(frameName);
      gsap.killTweensOf(frameRole);
      frameVid.pause();
      gsap.to(frameImg, { opacity: 0, duration, ease: "power1.in" });
      gsap.to(frameVid, { opacity: 0, duration, ease: "power1.in" });
      gsap.to(frameCaption, { opacity: 0, duration, ease: "power1.in" });
      const cur = frameName.querySelector(".tw-cursor");
      if (cur) cur.remove();
    }

    function typeWrite(el: HTMLElement, text: string, charDelay: number, onDone?: () => void) {
      const CURSOR = "|";
      let i = 0;
      let tid: ReturnType<typeof setTimeout> | null = null;
      let blinkTid: ReturnType<typeof setInterval> | null = null;
      let pausedForSpace = false;
      let done = false;

      function stopAll() {
        if (tid) clearTimeout(tid);
        if (blinkTid) clearInterval(blinkTid);
        tid = null; blinkTid = null;
      }
      (el as HTMLElement & { _twAbort?: () => void })._twAbort = () => {
        stopAll(); done = true; el.textContent = text;
      };
      function blink(typed: string) {
        if (blinkTid) clearInterval(blinkTid);
        let on = true;
        blinkTid = setInterval(() => {
          if (done) { if (blinkTid) clearInterval(blinkTid); return; }
          on = !on;
          el.textContent = typed + (on ? CURSOR : "");
        }, 300);
      }
      function next() {
        if (blinkTid) clearInterval(blinkTid);
        if (done) return;
        if (i >= text.length) {
          done = true;
          el.textContent = text;
          if (onDone) onDone();
          return;
        }
        const ch = text[i]; i++;
        const typed = text.slice(0, i);
        el.textContent = typed + CURSOR;
        let delay = charDelay + (Math.random() * 10 - 5);
        if (ch === " " && !pausedForSpace) {
          pausedForSpace = true;
          delay = charDelay * 4;
        }
        blink(typed);
        tid = setTimeout(next, delay);
      }
      el.textContent = CURSOR;
      blink("");
      tid = setTimeout(next, 300);
    }

    function runScanSequence(idx: number) {
      if (activeCardIdx >= 0 && activeCardIdx !== idx) {
        const pi = activeCardIdx;
        const prev = cardEls[pi];
        const ps = state[pi];
        gsap.killTweensOf(prev);
        gsap.killTweensOf(ps);

        ps.flyingBack = true;
        ps.floating = false;

        const flyTarget = getFloatTarget(ps, ps.x, ps.y);
        const destX = flyTarget.x;
        const destY = flyTarget.y;

        const cp = getCenterPos();
        const fw = _mob ? 268 : _tab ? 280 : _lap ? 300 : 352;
        const fh = _mob ? 326 : _tab ? 338 : _lap ? 363 : 426;
        const frameBounds = {
          l: cp.x - fw / 2, r: cp.x + fw / 2,
          t: cp.y - fh / 2, b: cp.y + fh / 2,
        };
        ps.x = cp.x; ps.y = cp.y;
        _zTop++;
        const restoreZ = _zTop;
        prev.style.zIndex = "2";
        prev.style.opacity = "0";
        prev.style.width = ps.baseW + "px";
        prev.style.height = ps.baseH + "px";
        prev.style.transform = `translate(${ps.x - ps.baseW / 2}px,${ps.y - ps.baseH / 2}px)`;

        let hasAppeared = false;
        const flyProxy = { x: cp.x, y: cp.y };
        gsap.to(flyProxy, {
          x: destX, y: destY,
          duration: 1.2, ease: "power2.out",
          onUpdate: () => {
            ps.x = flyProxy.x; ps.y = flyProxy.y;
            prev.style.transform = `translate(${ps.x - ps.baseW / 2}px,${ps.y - ps.baseH / 2}px)`;
            if (!hasAppeared) {
              const outside = ps.x < frameBounds.l || ps.x > frameBounds.r || ps.y < frameBounds.t || ps.y > frameBounds.b;
              if (outside) {
                hasAppeared = true;
                prev.style.zIndex = String(restoreZ);
                prev.style.pointerEvents = "";
                gsap.to(prev, { opacity: 1, duration: 0.25 });
              }
            }
          },
          onComplete: () => {
            ps.x = destX; ps.y = destY;
            prev.style.opacity = "1";
            ps.flyingBack = false;
            ps.floating = true;
          },
        });
      }

      hardResetFrame();
      activeCardIdx = idx;
      const p = PEOPLE[idx];

      // VOICE
      function speakRobotic(text: string, onEnd?: () => void) {
        if (!soundEnabledRef.current) { if (onEnd) onEnd(); return; }
        if (!window.speechSynthesis) { if (onEnd) onEnd(); return; }
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.78; utt.pitch = 0.55; utt.volume = 1;
        const voices = window.speechSynthesis.getVoices();
        const female =
          voices.find((v) =>
            /female|woman|zira|samantha|karen|tessa|moira|fiona|victoria|susan|google us english/i.test(v.name)
          ) || voices.find((v) => v.lang === "en-US") || voices[0];
        if (female) utt.voice = female;
        if (onEnd) utt.onend = onEnd;
        window.speechSynthesis.speak(utt);
      }
      speakRobotic("Identifying.");

      // AUDIO
      const w = window as unknown as {
        _trionn_ac?: AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const _ac =
        w._trionn_ac ||
        (w._trionn_ac = new (window.AudioContext || (w.webkitAudioContext as typeof AudioContext))());

      function playDetectedBeep() {
        if (!soundEnabledRef.current) return;
        const now = _ac.currentTime;
        [0, 0.09].forEach((offset, i) => {
          const osc = _ac.createOscillator();
          const gain = _ac.createGain();
          osc.type = "sine";
          osc.frequency.value = i === 0 ? 880 : 1100;
          gain.gain.setValueAtTime(0, now + offset);
          gain.gain.linearRampToValueAtTime(0.07, now + offset + 0.01);
          gain.gain.linearRampToValueAtTime(0, now + offset + 0.07);
          osc.connect(gain); gain.connect(_ac.destination);
          osc.start(now + offset); osc.stop(now + offset + 0.1);
        });
      }
      frameName.textContent = "";
      frameRole.textContent = "";

      frameImg.src = `/images/${p.file}.jpg`;
      frameImg.style.opacity = "0";
      frameVid.style.opacity = "0";
      const _img = new Image();
      _img.onload = () => { frameImg.style.opacity = "0.22"; };
      _img.src = `/images/${p.file}.jpg`;
      frameVid.src = `/images/${p.file}.mp4`;
      frameVid.load();

      // Flicker
      let flickerTimer: ReturnType<typeof setTimeout> | null = null;
      function startFlicker() {
        function tick() {
          if (!flickerTimer) return;
          const b = 0.78 + Math.random() * 0.22;
          scanLine.style.filter = `brightness(${b.toFixed(2)})`;
          flickerTimer = setTimeout(() => requestAnimationFrame(tick), 25 + Math.random() * 55);
        }
        flickerTimer = setTimeout(() => requestAnimationFrame(tick), 0);
      }
      function stopFlicker() {
        if (flickerTimer) clearTimeout(flickerTimer);
        flickerTimer = null;
        scanLine.style.filter = "";
      }
      stopFlickerFn = stopFlicker;

      const tl = gsap.timeline();
      activeTl = tl;

      scanGrid.width = FRAME_W; scanGrid.height = FRAME_H;
      glitchCanvas.width = FRAME_W; glitchCanvas.height = FRAME_H;
      const sgCtx = scanGrid.getContext("2d")!;
      const gcCtx = glitchCanvas.getContext("2d")!;

      vignette.classList.add("intense");

      function drawScanGrid(alpha: number) {
        sgCtx.clearRect(0, 0, FRAME_W, FRAME_H);
        sgCtx.strokeStyle = `rgba(220,220,220,${alpha})`;
        sgCtx.lineWidth = 0.4;
        const cols = 12, rows = 15;
        for (let c = 0; c <= cols; c++) {
          sgCtx.beginPath();
          sgCtx.moveTo((c / cols) * FRAME_W, 0);
          sgCtx.lineTo((c / cols) * FRAME_W, FRAME_H);
          sgCtx.stroke();
        }
        for (let r = 0; r <= rows; r++) {
          sgCtx.beginPath();
          sgCtx.moveTo(0, (r / rows) * FRAME_H);
          sgCtx.lineTo(FRAME_W, (r / rows) * FRAME_H);
          sgCtx.stroke();
        }
      }
      drawScanGrid(0.07);

      scanLine.style.top = "0px";
      scanLine.style.left = "0";
      scanLine.style.opacity = "0";

      tl.to(scanGrid, { opacity: 1, duration: 0.3 });
      tl.to(scanLine, { opacity: 1, duration: 0.18, onComplete: () => startFlicker() }, "<+=0.1");
      tl.to(scanOverlay, { opacity: 1, duration: 0.25 }, "<");
      tl.to(frameDetection, { opacity: 1, duration: 0.2 }, "<");
      tl.to(identifyingText, { opacity: 1, duration: 0.28 }, "<+=0.08");

      tl.add(() => {
        hudDept.textContent = "";
        gsap.to(hudBarFill, { width: "0%", duration: 0 });
        gsap.to(hudBarFill, { width: "100%", duration: 1.6, ease: "power1.inOut" });
      });
      tl.to(hudOverlay, { opacity: 1, duration: 0.3 }, "<");

      tl.to(scanLine, { top: FRAME_H + "px", duration: 0.85, ease: "power1.inOut" });
      tl.to(scanLine, { top: "0px", duration: 0.85, ease: "power1.inOut" });

      tl.add(() => stopFlicker());
      tl.to(scanLine, { opacity: 0, duration: 0.18 });
      tl.to(scanOverlay, { opacity: 0, duration: 0.22 }, "<");
      tl.to(identifyingText, { opacity: 0, duration: 0.18 }, "<");
      const idBar = scene.querySelector(".scan-id-bar");
      if (idBar) tl.to(idBar, { opacity: 0, duration: 0.18 }, "<");
      tl.to(scanGrid, { opacity: 0, duration: 0.3 }, "<");

      tl.add(() => {
        let gf = 0;
        function glitch() {
          if (gf >= 6) {
            gcCtx.clearRect(0, 0, FRAME_W, FRAME_H);
            gsap.set(glitchCanvas, { opacity: 0 });
            return;
          }
          gcCtx.clearRect(0, 0, FRAME_W, FRAME_H);
          for (let s = 0; s < 4; s++) {
            const y = Math.random() * FRAME_H;
            const h = 1 + Math.random() * 3;
            const dx = (Math.random() - 0.5) * 16;
            const a = 0.12 + Math.random() * 0.15;
            gcCtx.fillStyle = `rgba(255,255,255,${a})`;
            gcCtx.fillRect(dx, y, FRAME_W, h);
          }
          if (Math.random() > 0.4) {
            const y = Math.random() * FRAME_H;
            gcCtx.fillStyle = "rgba(255,255,255,0.06)";
            gcCtx.fillRect(0, y, FRAME_W, 1);
          }
          glitchCanvas.style.opacity = (0.55 + Math.random() * 0.35).toString();
          gf++;
          setTimeout(glitch, 50);
        }
        glitch();
      });

      tl.to(frameImg, { opacity: 1, duration: 0.28, ease: "power2.out" }, "+=0.25");

      tl.add(() => {
        detectionStatus.textContent = "DETECTED...";
        frameDetection.classList.add("detected");
        setTimeout(() => frameDetection.classList.add("brackets-in"), 50);
        playDetectedBeep();
        speakRobotic("Detected.");
      }, "<+=0.1");
      tl.to(detectionStatus, { opacity: 1, duration: 0.4, ease: "power2.out" }, "<");

      tl.add(() => {
        frameRole.textContent = p.role;
        frameRole.style.opacity = "0";
        gsap.set(frameCaption, { opacity: 1 });
        frameName.textContent = "";
        scanOverlay.style.opacity = "0";
        frameVid.currentTime = 0;
        frameVid.style.opacity = "1";
        frameVid.play().catch(() => {});
        frameImg.style.opacity = "0";
        gsap.to(frameDetection, { opacity: 0, duration: 0.4, ease: "power1.in" });
        gsap.to(hudOverlay, { opacity: 0, duration: 0.5, delay: 0.2 });
        vignette.classList.remove("intense");
        vignette.classList.add("visible");
        typeWrite(frameName, p.name, 90, () => {
          gsap.to(frameRole, { opacity: 1, duration: 0.5, ease: "power2.out" });
        });
      }, "+=0.3");

      tl.add(() => { activeTl = null; });
    }

    /* ── DRAG ── */
    let dragIdx = -1;
    let dragOffX = 0, dragOffY = 0;
    let dragCX = 0, dragCY = 0;

    const cardListeners: Array<() => void> = [];

    cardEls.forEach((card, i) => {
      if (_mob) {
        const onClick = (e: Event) => {
          e.preventDefault();
          if (activeCardIdx === i) return;
          if (dragIdx >= 0) return;
          const s = state[i];
          s.x = s.ox + Math.cos(s.angle) * s.rx;
          s.y = s.oy + Math.sin(s.angle * 0.73 + s.phaseY) * s.ry;
          card.style.transform = `translate(${s.x - s.baseW / 2}px,${s.y - s.baseH / 2}px)`;
          dragIdx = i;
          dragOffX = 0; dragOffY = 0;
          s.floating = false;
          s.dragging = true;
          card.classList.add("dragging");
          bringToFront(card);
          const cfr = centerFrame.getBoundingClientRect();
          endDrag(cfr.left + cfr.width / 2, cfr.top + cfr.height / 2);
        };
        card.addEventListener("click", onClick);
        cardListeners.push(() => card.removeEventListener("click", onClick));
      } else {
        const onMouseDown = (e: MouseEvent) => startDrag(e, i, e.clientX, e.clientY);
        const onTouchStart = (e: TouchEvent) => {
          const t = e.touches[0];
          startDrag(e, i, t.clientX, t.clientY);
        };
        card.addEventListener("mousedown", onMouseDown);
        card.addEventListener("touchstart", onTouchStart, { passive: false });
        cardListeners.push(() => {
          card.removeEventListener("mousedown", onMouseDown);
          card.removeEventListener("touchstart", onTouchStart);
        });
      }
    });

    function bringToFront(card: HTMLElement) { _zTop++; card.style.zIndex = "10000"; }

    function startDrag(e: Event, i: number, cx: number, cy: number) {
      e.preventDefault();
      if (dragIdx >= 0) return;
      dragIdx = i;
      dragCX = cx; dragCY = cy;
      const s = state[i];
      const card = cardEls[i];
      const r = card.getBoundingClientRect();
      const so = getSceneOffset();
      s.x = r.left + r.width / 2 - so.dx;
      s.y = r.top + r.height / 2 - so.dy;
      dragOffX = cx - so.dx - s.x;
      dragOffY = cy - so.dy - s.y;
      s.floating = false;
      s.flyingBack = false;
      s.dragging = true;
      card.classList.add("dragging");
      bringToFront(card);
      if (s._flyTween) { s._flyTween.kill(); s._flyTween = null; }
      gsap.killTweensOf(s);
      void dragCX; void dragCY;
    }

    function moveDrag(cx: number, cy: number) {
      if (dragIdx < 0) return;
      dragCX = cx; dragCY = cy;
      const s = state[dragIdx];
      const card = cardEls[dragIdx];
      const so = getSceneOffset();
      s.x = cx - so.dx - dragOffX;
      s.y = cy - so.dy - dragOffY;
      card.style.transform = `translate(${s.x - s.baseW / 2}px,${s.y - s.baseH / 2}px)`;
      centerFrame.classList.toggle("over", isOverCenter(cx, cy));
    }

    function endDrag(cx: number, cy: number) {
      if (dragIdx < 0) return;
      const i = dragIdx;
      const s = state[i];
      const card = cardEls[i];
      dragIdx = -1;
      s.dragging = false;
      centerFrame.classList.remove("over");

      if (isOverCenter(cx, cy)) {
        const cp = getCenterPos();
        gsap.to(frameHint, { opacity: 0, duration: 0.2 });
        fadeOutFrameContent(0.35);
        gsap.killTweensOf("__proxy__");

        const innerR = centerFrameInner.getBoundingClientRect();
        const targetW = innerR.width;
        const targetH = innerR.height;

        const proxy = { x: s.x, y: s.y, w: s.baseW, h: s.baseH };
        gsap.to(card, { opacity: 0.35, duration: 0.5, ease: "power1.in" });

        if (_mob) {
          gsap.to(proxy, {
            x: cp.x, y: cp.y,
            duration: 0.35, ease: "power2.inOut",
            onUpdate: () => {
              s.x = proxy.x; s.y = proxy.y;
              card.style.transform = `translate(${proxy.x - proxy.w / 2}px,${proxy.y - proxy.h / 2}px)`;
            },
            onComplete: () => {
              gsap.to(proxy, {
                w: targetW, h: targetH,
                duration: 0.3, ease: "power2.inOut",
                onUpdate: () => {
                  card.style.width = proxy.w + "px";
                  card.style.height = proxy.h + "px";
                  card.style.transform = `translate(${proxy.x - proxy.w / 2}px,${proxy.y - proxy.h / 2}px)`;
                },
                onComplete: () => {
                  card.classList.remove("dragging");
                  card.style.width = s.baseW + "px";
                  card.style.height = s.baseH + "px";
                  s.x = s.ox; s.y = s.oy;
                  card.style.transform = `translate(${s.x - s.baseW / 2}px,${s.y - s.baseH / 2}px)`;
                  card.style.opacity = "0";
                  card.style.pointerEvents = "none";
                  s.floating = false;
                  runScanSequence(i);
                },
              });
            },
          });
        } else {
          gsap.to(proxy, {
            id: "__proxy__",
            x: cp.x, y: cp.y, w: targetW, h: targetH,
            duration: 0.5, ease: "power2.inOut",
            onUpdate: () => {
              s.x = proxy.x; s.y = proxy.y;
              card.style.width = proxy.w + "px";
              card.style.height = proxy.h + "px";
              card.style.transform = `translate(${proxy.x - proxy.w / 2}px,${proxy.y - proxy.h / 2}px)`;
            },
            onComplete: () => {
              card.classList.remove("dragging");
              card.style.width = s.baseW + "px";
              card.style.height = s.baseH + "px";
              s.x = s.ox; s.y = s.oy;
              card.style.transform = `translate(${s.x - s.baseW / 2}px,${s.y - s.baseH / 2}px)`;
              card.style.opacity = "0";
              card.style.pointerEvents = "none";
              s.floating = false;
              runScanSequence(i);
            },
          } as gsap.TweenVars);
        }
      } else {
        card.classList.remove("dragging");
        card.style.zIndex = String(_zTop);
        s.flyingBack = true;
        s.floating = false;
        const floatTarget = getFloatTarget(s, s.x, s.y);
        const dx = floatTarget.x;
        const dy = floatTarget.y;

        const rp = { x: s.x, y: s.y };
        s._flyTween = gsap.to(rp, {
          x: dx, y: dy, duration: 2.2, ease: "power3.out",
          onUpdate: () => {
            s.x = rp.x; s.y = rp.y;
            card.style.transform = `translate(${s.x - s.baseW / 2}px,${s.y - s.baseH / 2}px)`;
          },
          onComplete: () => {
            s.x = dx; s.y = dy;
            s.flyingBack = false;
            s.floating = true;
            s._flyTween = null;
          },
        });
      }
    }

    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (dragIdx >= 0) {
        e.preventDefault();
        const t = e.touches[0];
        moveDrag(t.clientX, t.clientY);
      }
    };
    const onMouseUp = (e: MouseEvent) => endDrag(e.clientX, e.clientY);
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      endDrag(t.clientX, t.clientY);
    };

    if (!_mob) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchend", onTouchEnd);
    }

    /* ── ELECTRIC ARC ── */
    let arcLoopCleanup = () => {};
    (function () {
      const canvas = arcCanvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const W = _mob ? 268 : _tab ? 280 : _lap ? 300 : 352,
        H = _mob ? 326 : _tab ? 338 : _lap ? 363 : 426,
        R = 8;
      canvas.width = W;
      canvas.height = H;

      const TOTAL = 400;
      function buildPerimeter() {
        const pts: { x: number; y: number }[] = [];
        const perim = 2 * (W - 2 * R) + 2 * (H - 2 * R) + 2 * Math.PI * R;
        const step = perim / TOTAL;

        function addCorner(cx: number, cy: number, a0: number, a1: number) {
          const len = Math.abs(a1 - a0) * R;
          const steps = Math.max(2, Math.round(len / step));
          for (let k = 0; k <= steps; k++) {
            const a = a0 + (a1 - a0) * (k / steps);
            pts.push({ x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R });
          }
        }
        function addEdge(x0: number, y0: number, x1: number, y1: number) {
          const len = Math.hypot(x1 - x0, y1 - y0);
          const steps = Math.max(2, Math.round(len / step));
          for (let k = 0; k <= steps; k++) {
            const t = k / steps;
            pts.push({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t });
          }
        }

        addCorner(R, R, Math.PI, Math.PI * 1.5);
        addEdge(R, 0, W - R, 0);
        addCorner(W - R, R, -Math.PI / 2, 0);
        addEdge(W, R, W, H - R);
        addCorner(W - R, H - R, 0, Math.PI / 2);
        addEdge(W - R, H, R, H);
        addCorner(R, H - R, Math.PI / 2, Math.PI);
        addEdge(0, H - R, 0, R);
        return pts;
      }

      const PTS = buildPerimeter();
      const N = PTS.length;
      const JITTER = PTS.map(() => (Math.random() - 0.5) * 1.2);

      let floatPos = 0;
      const SEG = 12;
      const SPD = 0.55;

      function getPoint(floatIdx: number) {
        const i0 = Math.floor(floatIdx) % N;
        const i1 = (i0 + 1) % N;
        const t = floatIdx - Math.floor(floatIdx);
        return {
          x: PTS[i0].x + (PTS[i1].x - PTS[i0].x) * t,
          y: PTS[i0].y + (PTS[i1].y - PTS[i0].y) * t,
          j: JITTER[i0] + (JITTER[i1] - JITTER[i0]) * t,
        };
      }

      function arcLoop() {
        ctx.clearRect(0, 0, W, H);
        floatPos = (floatPos + SPD) % N;
        const TAIL = 5;
        const path: { x: number; y: number; fade: number }[] = [];
        for (let k = -TAIL; k <= SEG + TAIL; k++) {
          const fi = (floatPos + k + N) % N;
          const pt = getPoint(fi);
          const t = k / SEG;
          const coreFade = Math.sin(Math.max(0, Math.min(1, t)) * Math.PI);
          let tailFade;
          if (k < 0) tailFade = (k + TAIL) / TAIL;
          else if (k > SEG) tailFade = (TAIL - (k - SEG)) / TAIL;
          else tailFade = 1;
          const fade = coreFade * tailFade;
          path.push({ x: pt.x + pt.j * Math.max(0, coreFade), y: pt.y + pt.j * Math.max(0, coreFade), fade });
        }

        for (let k = 0; k < path.length - 1; k++) {
          const fade = path[k].fade;
          ctx.beginPath();
          ctx.moveTo(path[k].x, path[k].y);
          ctx.lineTo(path[k + 1].x, path[k + 1].y);
          ctx.strokeStyle = `rgba(160,190,220,${(0.18 * fade).toFixed(3)})`;
          ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.lineJoin = "round";
          ctx.stroke();
        }
        for (let k = 0; k < path.length - 1; k++) {
          const fade = path[k].fade;
          ctx.beginPath();
          ctx.moveTo(path[k].x, path[k].y);
          ctx.lineTo(path[k + 1].x, path[k + 1].y);
          ctx.strokeStyle = `rgba(180,210,240,${(0.4 * fade).toFixed(3)})`;
          ctx.lineWidth = 1.8; ctx.lineCap = "round"; ctx.lineJoin = "round";
          ctx.stroke();
        }
        for (let k = 0; k < path.length - 1; k++) {
          const a = path[k].fade * 0.95;
          ctx.beginPath();
          ctx.moveTo(path[k].x, path[k].y);
          ctx.lineTo(path[k + 1].x, path[k + 1].y);
          ctx.strokeStyle = `rgba(230,240,255,${a.toFixed(2)})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
      const arcId = manager.register(arcLoop);
      const arcIo = new IntersectionObserver(
        ([entry]) => manager.setActive(arcId, entry.isIntersecting),
        { rootMargin: "64px 0px" }
      );
      arcIo.observe(scene);
      arcLoopCleanup = () => { manager.unregister(arcId); arcIo.disconnect(); };
    })();

    /* ── MOUSE PARALLAX ── */
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    const onMouseMoveTrack = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    document.addEventListener("mousemove", onMouseMoveTrack);

    /* ── PROXIMITY PULSE ── */
    const proxId = manager.register(function check() {
      if (dragIdx >= 0) {
        const z = getCFZone(0, 0);
        const near = mouseX > z.l - 60 && mouseX < z.r + 60 && mouseY > z.t - 60 && mouseY < z.b + 60;
        frameOuter.classList.toggle("proximity", near);
      } else {
        frameOuter.classList.remove("proximity");
      }
    });

    /* ── CONNECTOR LINES ── */
    const lineSvgs: SVGSVGElement[] = [];
    const lines: SVGLineElement[] = [];
    PEOPLE.forEach(() => {
      const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      s.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;";
      s.style.zIndex = "2";
      scene.appendChild(s);
      lineSvgs.push(s);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("stroke", "rgba(255,255,255,0.1)");
      line.setAttribute("stroke-width", "1");
      s.appendChild(line);
      lines.push(line);
    });

    const MAX_SPARKS = 1;
    type Spark = {
      el: SVGPolylineElement; active: boolean; t: number;
      lineIdx: number; speed: number; jitter?: number[];
    };
    const sparks: Spark[] = [];
    for (let i = 0; i < MAX_SPARKS; i++) {
      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      poly.setAttribute("fill", "none");
      poly.setAttribute("stroke-linecap", "round");
      poly.setAttribute("stroke-linejoin", "round");
      poly.setAttribute("opacity", "0");
      lineSvgs[0].appendChild(poly);
      sparks.push({ el: poly, active: false, t: 0, lineIdx: -1, speed: 0 });
    }

    function arcSegment(x1: number, y1: number, x2: number, y2: number, t: number, jitter: number[]) {
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const segLen = 24;
      const half = (segLen / len) * 0.5;
      const t0 = Math.max(0, t - half);
      const t1 = Math.min(1, t + half);
      const nx = -dy / len, ny = dx / len;
      const steps = 6;
      const pts: string[] = [];
      for (let k = 0; k <= steps; k++) {
        const p = t0 + (t1 - t0) * (k / steps);
        const bx = x1 + dx * p;
        const by = y1 + dy * p;
        const envelope = Math.sin(((p - t0) / (t1 - t0)) * Math.PI);
        const j = jitter[k % jitter.length] * 1.5 * envelope;
        pts.push((bx + nx * j).toFixed(1) + "," + (by + ny * j).toFixed(1));
      }
      return pts.join(" ");
    }

    function maybeFireSpark() {
      const free = sparks.find((s) => !s.active);
      if (!free) return;
      const candidates = lines.map((_, i) => i).filter((i) => {
        const card = cardEls[i];
        const op = parseFloat(card.style.opacity);
        return !(op === 0 || card.style.opacity === "0");
      });
      if (!candidates.length) return;
      const idx = candidates[Math.floor(Math.random() * candidates.length)];
      const jitter = Array.from({ length: 12 }, () => (Math.random() - 0.5) * 1);
      free.active = true;
      free.t = 0.02;
      free.lineIdx = idx;
      free.speed = 0.012 + Math.random() * 0.006;
      free.jitter = jitter;
    }

    let lastFire = 0;
    function updateLines(ts: number) {
      const cr = centerFrame.getBoundingClientRect();
      const cx = cr.left + cr.width / 2;
      const cy = cr.top + cr.height / 2;

      state.forEach((_s, i) => {
        const card = cardEls[i];
        const op = parseFloat(card.style.opacity);
        const hidden = op === 0 || card.style.opacity === "0";
        const cardZ = parseInt(card.style.zIndex) || 5;
        lineSvgs[i].style.zIndex = String(Math.min(cardZ - 1, 9998));
        if (hidden) { lines[i].setAttribute("opacity", "0"); return; }
        const r = card.getBoundingClientRect();
        const ex = r.left + r.width / 2;
        const ey = r.top + r.height / 2;
        lines[i].setAttribute("opacity", "1");
        lines[i].setAttribute("x1", String(ex));
        lines[i].setAttribute("y1", String(ey));
        lines[i].setAttribute("x2", String(cx));
        lines[i].setAttribute("y2", String(cy));
      });

      if (ts - lastFire > 800 + Math.random() * 1600) {
        maybeFireSpark();
        lastFire = ts;
      }

      sparks.forEach((sp) => {
        if (!sp.active) return;
        sp.t += sp.speed;
        if (sp.t >= 1) { sp.active = false; sp.el.setAttribute("opacity", "0"); return; }
        const card = cardEls[sp.lineIdx];
        const op = parseFloat(card.style.opacity);
        if (op === 0 || card.style.opacity === "0") {
          sp.active = false; sp.el.setAttribute("opacity", "0"); return;
        }
        const fade = sp.t < 0.05 ? sp.t / 0.05 : sp.t > 0.95 ? (1 - sp.t) / 0.05 : 1;
        sp.jitter = Array.from({ length: 12 }, () => (Math.random() - 0.5) * 1);
        const sr = cardEls[sp.lineIdx].getBoundingClientRect();
        const pts = arcSegment(cx, cy, sr.left + sr.width / 2, sr.top + sr.height / 2, sp.t, sp.jitter!);
        sp.el.setAttribute("points", pts);
        sp.el.setAttribute("stroke", "rgba(160,190,220,0.55)");
        sp.el.setAttribute("stroke-width", "0.9");
        sp.el.setAttribute("opacity", String((fade * 0.95).toFixed(2)));
      });

    }
    const linesId = manager.register(updateLines);
    const linesIo = new IntersectionObserver(
      ([entry]) => manager.setActive(linesId, entry.isIntersecting),
      { rootMargin: "64px 0px" }
    );
    linesIo.observe(scene);

    /* ── PRE-LOAD SPEECH VOICES ── */
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    /* ── CLEANUP ── */
    return () => {
      manager.unregister(loopId);
      loopIo.disconnect();
      arcLoopCleanup();
      manager.unregister(proxId);
      manager.unregister(linesId);
      linesIo.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("mousemove", onMouseMoveTrack);
      cardListeners.forEach((off) => off());
      cardEls.forEach((el) => el.parentNode?.removeChild(el));
      lineSvgs.forEach((s) => s.parentNode?.removeChild(s));
      introObs?.disconnect();
      if (activeTl) activeTl.kill();
      if (stopFlickerFn) stopFlickerFn();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <>
      {/* Inline styles for things Tailwind utility classes can't express:
          dynamic CSS variables, ::before/::after pseudo elements, keyframes,
          and a couple of state-driven class toggles used by the JS. */}
      <style jsx global>{`
        :root {
          --ts-font-family: 'Barlow', sans-serif;
          --ts-color-bg: #040508;
          --ts-color-hint: rgba(255, 255, 255, 0.75);
          --ts-color-name: #c8c8c8;
          --ts-color-role: rgba(255, 255, 255, 0.6);
          --ts-color-scan-id: rgba(255, 255, 255, 0.75);
          --ts-color-detected: rgba(255, 255, 255, 0.92);
        }
        .ts-root, .ts-root * { box-sizing: border-box; font-family: var(--ts-font-family); }
        .ts-scene { background: var(--ts-color-bg); }
        .ts-crt {
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px
          );
          opacity: 0;
          transition: opacity .4s ease;
        }
        .ts-crt.visible { opacity: 1; }
        .ts-vignette {
          background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%);
          opacity: 0;
          transition: opacity .4s ease;
        }
        .ts-vignette.visible { opacity: 0.5; }
        .ts-vignette.intense { opacity: 0.85; }

        .ts-frame-outer { transition: border-color .3s ease; }
        .ts-center-frame.over .ts-frame-outer { border-color: #3a3a42; }

        .ts-frame-detection::before,
        .ts-frame-detection::after {
          content: ''; position: absolute;
          width: 32px; height: 32px;
          border-color: rgba(220,35,15,0.55);
          border-style: solid;
        }
        .ts-frame-detection::before {
          top: 24px; left: 24px;
          border-width: 1.5px 0 0 1.5px;
          transition: top .35s ease, left .35s ease, border-color .4s ease;
        }
        .ts-frame-detection::after {
          bottom: 24px; right: 24px;
          border-width: 0 1.5px 1.5px 0;
          transition: bottom .35s ease, right .35s ease, border-color .4s ease;
        }
        .ts-frame-detection.brackets-in::before { top: 14px; left: 14px; }
        .ts-frame-detection.brackets-in::after  { bottom: 14px; right: 14px; }
        .ts-frame-detection.detected::before,
        .ts-frame-detection.detected::after { border-color: rgba(255,255,255,0.85); }

        .ts-scan-line {
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(220,10,0,0.3) 15%,
            rgba(220,10,0,0.85) 40%,
            rgba(240,20,10,1) 50%,
            rgba(220,10,0,0.85) 60%,
            rgba(220,10,0,0.3) 85%,
            transparent 100%);
          box-shadow:
            0 0 6px 2px rgba(200,0,0,0.2),
            0 0 2px 1px rgba(220,10,0,0.5);
        }

        @keyframes ts-borderPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(160,190,220,0); }
          50%      { box-shadow: 0 0 12px 3px rgba(160,190,220,0.2); }
        }
        .ts-frame-outer.proximity { animation: ts-borderPulse 1.2s ease-in-out infinite; }

        .vcard:active { cursor: grabbing; }
        .vcard.dragging { z-index: 10000; }

        /* Responsive frame sizing — matches original media queries */
        .ts-frame-outer { width: 352px; height: 426px; top: -16px; left: -16px; }
        .ts-arc-canvas  { width: 352px; height: 426px; top: -16px; left: -16px; }
        .ts-center-frame-inner { width: 320px; height: 394px; }

        @media (min-width: 1025px) and (max-width: 1440px) {
          .ts-frame-outer { width: 300px; height: 363px; top: -14px; left: -14px; }
          .ts-arc-canvas  { width: 300px; height: 363px; top: -14px; left: -14px; }
          .ts-center-frame-inner { width: 272px; height: 335px; }
        }
        @media (min-width: 601px) and (max-width: 1024px) {
          .ts-frame-outer { width: 280px; height: 338px; top: -14px; left: -14px; }
          .ts-arc-canvas  { width: 280px; height: 338px; top: -14px; left: -14px; }
          .ts-center-frame-inner { width: 252px; height: 310px; }
        }
        @media (max-width: 600px) {
          .ts-scene { height: auto; min-height: 0; overflow-y: auto; overflow-x: hidden; }
          .ts-center-frame { top: 286px; left: 50%; transform: translateX(-50%); }
          .ts-frame-outer { width: 268px; height: 326px; top: -4px; left: -4px; }
          .ts-arc-canvas  { width: 268px; height: 326px; top: -4px; left: -4px; }
          .ts-center-frame-inner { width: 260px; height: 318px; }
          .ts-frame-name { font-size: 11px; letter-spacing: 0.12em;
            text-shadow: 0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8); }
          .ts-frame-role { font-size: 9px;
            text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.8); }
          .ts-frame-hint { font-size: 9px; padding: 0 16px; }
          .ts-frame-caption {
            top: auto; bottom: 16px; left: 50%;
            transform: translateX(-50%); width: 100%; z-index: 25;
          }
          .ts-frame-name-row { margin-bottom: 2px; }
          .ts-ui-tr { top: 20px; right: 16px; }
          .vcard, .vcard:active { cursor: default; }
        }

        html, body { background: var(--ts-color-bg); overflow-x: hidden; }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
      `}</style>

     

      <div className="ts-root">
        {/* Top blank section */}
        <div className="w-full h-screen bg-white" />

        {/* Scene */}
        <div ref={sceneRef} className="ts-scene relative w-screen min-h-screen overflow-hidden">
          <div ref={crtRef} className="ts-crt absolute inset-0 z-[200] pointer-events-none" />
          <div ref={vignetteRef} className="ts-vignette absolute inset-0 z-[199] pointer-events-none" />

          <div
            ref={centerFrameRef}
            className="ts-center-frame absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none"
          >
            <div
              ref={frameOuterRef}
              className="ts-frame-outer absolute rounded-lg pointer-events-none"
              style={{
                border: "1px solid #191D21",
                background: "var(--ts-color-bg)",
              }}
            />
            <canvas
              ref={arcCanvasRef}
              className="ts-arc-canvas absolute rounded-lg pointer-events-none z-[4]"
            />

            <div
              ref={centerFrameInnerRef}
              className="ts-center-frame-inner relative rounded-lg overflow-hidden flex items-center justify-center"
              style={{ background: "var(--ts-color-bg)" }}
            >
              <div
                ref={frameHintRef}
                className="ts-frame-hint absolute inset-0 flex items-center justify-center text-center uppercase z-[2] pointer-events-none"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  color: "var(--ts-color-hint)",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  padding: "0 32px",
                }}
              >
                DRAG A MEMBER TO IDENTIFY
              </div>

              <img
                ref={frameImgRef}
                className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none z-[2]"
                src=""
                alt=""
              />
              <video
                ref={frameVidRef}
                className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none z-[1]"
                muted
                playsInline
                preload="auto"
              />

              <canvas
                ref={scanGridRef}
                className="absolute inset-0 w-full h-full z-[16] pointer-events-none opacity-0"
              />

              <div
                ref={scanOverlayRef}
                className="absolute inset-0 z-[15] opacity-0 pointer-events-none"
                style={{ background: "transparent" }}
              />
              <div
                ref={scanLineRef}
                className="ts-scan-line absolute left-0 w-full h-px top-0 z-[20] opacity-0 pointer-events-none"
              />

              <canvas
                ref={glitchCanvasRef}
                className="absolute inset-0 w-full h-full z-[19] pointer-events-none opacity-0"
              />

              <div
                ref={frameDetectionRef}
                className="ts-frame-detection absolute inset-0 z-[18] flex flex-col items-center justify-center pointer-events-none opacity-0"
              >
                <div
                  ref={identifyingTextRef}
                  className="uppercase opacity-0 text-center"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.28em",
                    color: "var(--ts-color-scan-id)",
                    fontWeight: 300,
                  }}
                >
                  IDENTIFYING...
                </div>
                <div
                  className="scan-id-bar overflow-hidden mt-1.5 rounded-[1px]"
                  style={{ width: "60px", height: "1.5px", background: "rgba(255,255,255,0.12)" }}
                >
                  <div
                    ref={hudBarFillRef}
                    className="h-full w-0 rounded-[1px]"
                    style={{ background: "rgba(255,255,255,0.55)" }}
                  />
                </div>
                <div
                  ref={detectionStatusRef}
                  className="uppercase opacity-0 text-center"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.28em",
                    color: "var(--ts-color-detected)",
                    fontWeight: 300,
                  }}
                />
              </div>

              <div
                ref={hudOverlayRef}
                className="absolute inset-0 z-[17] pointer-events-none opacity-0"
              >
                <div className="absolute bottom-8 left-3.5 flex flex-col gap-[3px]">
                  <div
                    ref={hudDeptRef}
                    className="uppercase"
                    style={{
                      fontSize: "6.5px",
                      letterSpacing: "0.14em",
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 300,
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              ref={frameCaptionRef}
              className="ts-frame-caption absolute left-1/2 -translate-x-1/2 text-center opacity-0 pointer-events-none whitespace-nowrap flex flex-col items-center"
              style={{ top: "calc(100% + 32px)" }}
            >
              <div className="ts-frame-name-row block mb-2">
                <div
                  ref={frameNameRef}
                  className="ts-frame-name uppercase whitespace-nowrap"
                  style={{
                    fontSize: "14px",
                    fontWeight: 300,
                    letterSpacing: 0,
                    color: "var(--ts-color-name)",
                  }}
                />
              </div>
              <div
                ref={frameRoleRef}
                className="ts-frame-role uppercase"
                style={{
                  fontSize: "11px",
                  fontWeight: 300,
                  letterSpacing: "0.14em",
                  color: "var(--ts-color-role)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom blank section */}
        <div className="w-full h-screen" style={{ background: "#e8e8e8" }} />
      </div>
    </>
  );
}
