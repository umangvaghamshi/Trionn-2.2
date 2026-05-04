"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTransition } from "./TransitionContext";
import "./page-loader.css";

/* ── Constants (from Page-Loader/main.js) ─────────────────────────────── */
const BELT_COUNT = 10;
const BELT_MIN_SCALE = 0.008;
const BELT_STAGGER_MS = 38;
const CORNER_GAP = 6;
const CORNER_SIZE = 6.5;
const CORNER_OFFSET = CORNER_GAP + CORNER_SIZE;
const SWEEP_IN_DUR = 500;
const SWEEP_OUT_DUR = 420;
const LABEL_ENTER_DUR = 840;
const LABEL_EXIT_DUR = 760;
const FLY_PLUS_IN_DUR = 840;
const FLY_PLUS_OUT_DUR = 760;
const REVEAL_LINE_WIDTH = 100;
const FLY_OUT_FADE_START = 0.6;
const HOLD = 60;

const rotDirs = [1, -1, -1, 1];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;

function requestVisibleFrame(tick: (now: number) => void) {
  requestAnimationFrame((now) => {
    if (document.hidden) { requestVisibleFrame(tick); return; }
    tick(now);
  });
}

function animateFrame(duration: number, render: (progress: number) => void, done?: () => void) {
  let elapsed = 0, lastTime: number | undefined;
  function tick(now: number) {
    if (lastTime !== undefined) elapsed += now - lastTime;
    lastTime = now;
    const progress = Math.min(elapsed / duration, 1);
    render(progress);
    if (progress < 1) { requestVisibleFrame(tick); } else if (done) { done(); }
  }
  requestVisibleFrame(tick);
}

const PLUS_SVG = (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="6.5" y1="0" x2="6.5" y2="13" stroke="#555" />
    <line x1="13" y1="6.5" x2="0" y2="6.5" stroke="#555" />
  </svg>
);

export default function PageTransition() {
  const { phase, setPhase, transitionLabel, isLoaderComplete, notifyBeltsClosed, setContentVisible } = useTransition();

  const overlayRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const beltRefs = useRef<HTMLDivElement[]>([]);

  /* Corner plus refs [tl, tr, bl, br] */
  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerTRRef = useRef<HTMLDivElement>(null);
  const cornerBLRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);

  /* Flying plus refs [tl, tr, bl, br] */
  const flyTLRef = useRef<HTMLDivElement>(null);
  const flyTRRef = useRef<HTMLDivElement>(null);
  const flyBLRef = useRef<HTMLDivElement>(null);
  const flyBRRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  /* ── Get plus positions relative to logo wrap + screen corners ──────── */
  const getPlusPositions = useCallback(() => {
    const wr = logoWrapRef.current!.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight, m = 40;
    return {
      corners: [
        { x: wr.left - CORNER_OFFSET + CORNER_SIZE, y: wr.top - CORNER_OFFSET + CORNER_SIZE },
        { x: wr.right + CORNER_OFFSET - CORNER_SIZE, y: wr.top - CORNER_OFFSET + CORNER_SIZE },
        { x: wr.left - CORNER_OFFSET + CORNER_SIZE, y: wr.bottom + CORNER_OFFSET - CORNER_SIZE },
        { x: wr.right + CORNER_OFFSET - CORNER_SIZE, y: wr.bottom + CORNER_OFFSET - CORNER_SIZE },
      ],
      screen: [{ x: m, y: m }, { x: vw - m, y: m }, { x: m, y: vh - m }, { x: vw - m, y: vh - m }],
    };
  }, []);

  /* ── Sweep in belts ─────────────────────────────────────────────────── */
  const sweepIn = useCallback((cb: () => void) => {
    const belts = beltRefs.current;
    const overlay = overlayRef.current;
    if (!overlay) return;
    belts.forEach((b) => { b.style.transform = `scaleY(${BELT_MIN_SCALE})`; b.style.transformOrigin = "center center"; b.style.opacity = "1"; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.add("active");
      let done = 0;
      const fin = () => { if (++done === BELT_COUNT) cb(); };
      belts.forEach((b, i) => {
        setTimeout(() => {
          animateFrame(SWEEP_IN_DUR, (r) => {
            b.style.transform = `scaleY(${BELT_MIN_SCALE + (1 - BELT_MIN_SCALE) * easeOut(r)})`;
          }, () => { b.style.transform = "scaleY(1)"; fin(); });
        }, i * BELT_STAGGER_MS);
      });
    }));
  }, []);

  /* ── Sweep out belts ─────────────────────────────────────────────────── */
  const sweepOut = useCallback((cb: () => void) => {
    const belts = beltRefs.current;
    let done = 0;
    const fin = () => { if (++done === BELT_COUNT) cb(); };
    [...belts].reverse().forEach((b, i) => {
      setTimeout(() => {
        animateFrame(SWEEP_OUT_DUR, (r) => {
          b.style.transform = `scaleY(${1 - (1 - BELT_MIN_SCALE) * easeIn(r)})`;
        }, () => { b.style.transform = "scaleY(0)"; fin(); });
      }, i * BELT_STAGGER_MS);
    });
  }, []);

  /* ── Fly plus markers in (screen corners → logo corners) ────────────── */
  const flyPlusIn = useCallback((cb: () => void) => {
    const fps = [flyTLRef.current!, flyTRRef.current!, flyBLRef.current!, flyBRRef.current!];
    const { corners: E, screen: S } = getPlusPositions();
    fps.forEach((el, i) => { el.style.left = S[i].x + "px"; el.style.top = S[i].y + "px"; el.style.opacity = "1"; });
    animateFrame(FLY_PLUS_IN_DUR, (r) => {
      const p = easeOut(r);
      fps.forEach((el, i) => {
        el.style.left = (S[i].x + (E[i].x - S[i].x) * p) + "px";
        el.style.top = (S[i].y + (E[i].y - S[i].y) * p) + "px";
        el.style.transform = `translate(-50%,-50%) rotate(${rotDirs[i] * 720 * (1 - p)}deg)`;
      });
    }, cb);
  }, [getPlusPositions]);

  /* ── Fly plus markers out (logo corners → screen corners) ───────────── */
  const flyPlusOut = useCallback(() => {
    const fps = [flyTLRef.current!, flyTRRef.current!, flyBLRef.current!, flyBRRef.current!];
    const { corners: S, screen: E } = getPlusPositions();
    fps.forEach((el, i) => { el.style.left = S[i].x + "px"; el.style.top = S[i].y + "px"; el.style.opacity = "1"; });
    animateFrame(FLY_PLUS_OUT_DUR, (r) => {
      const p = easeIn(r);
      fps.forEach((el, i) => {
        el.style.left = (S[i].x + (E[i].x - S[i].x) * p) + "px";
        el.style.top = (S[i].y + (E[i].y - S[i].y) * p) + "px";
        if (r > FLY_OUT_FADE_START) el.style.opacity = String(1 - (r - FLY_OUT_FADE_START) / (1 - FLY_OUT_FADE_START));
      });
    }, () => fps.forEach((el) => { el.style.opacity = "0"; }));
  }, [getPlusPositions]);

  /* ── Label enter: slides up into centered position ──────────────────── */
  const labelEnter = useCallback((label: string) => {
    const lbl = labelRef.current;
    if (!lbl) return;
    lbl.textContent = label; lbl.style.opacity = "0";
    lbl.style.transform = `translate(-50%, calc(-50% + ${REVEAL_LINE_WIDTH}px))`;
    animateFrame(LABEL_ENTER_DUR, (r) => {
      const p = easeOut(r);
      lbl.style.opacity = String(p);
      lbl.style.transform = `translate(-50%, calc(-50% + ${REVEAL_LINE_WIDTH * (1 - p)}px))`;
    });
  }, []);

  /* ── Label exit: slides up and fades out ────────────────────────────── */
  const labelExit = useCallback((cb: () => void) => {
    const center = centerRef.current, lbl = labelRef.current;
    if (!center || !lbl) { cb(); return; }
    animateFrame(LABEL_EXIT_DUR, (r) => {
      const p = easeIn(r);
      lbl.style.opacity = String(1 - p);
      lbl.style.transform = `translate(-50%, calc(-50% + ${-REVEAL_LINE_WIDTH * p}px))`;
    }, () => {
      lbl.textContent = ""; lbl.style.opacity = "0";
      lbl.style.transform = "translate(-50%,-50%)";
      center.style.visibility = "hidden";
      cb();
    });
  }, []);

  /* ── trigger sweep-in + flyPlusIn when phase becomes "sweep-in" ─────── */
  useEffect(() => {
    if (phase !== "sweep-in" || !isLoaderComplete) return;
    document.documentElement.dataset.trionnReady = "false";
    setContentVisible(false);

    const center = centerRef.current;
    const corners = [cornerTLRef.current!, cornerTRRef.current!, cornerBLRef.current!, cornerBRRef.current!];

    // Show center panel with corners hidden and T-paths/counter hidden
    if (center) center.style.visibility = "visible";
    corners.forEach((c) => { c.style.opacity = "0"; });

    // Kick off label enter animation concurrently with sweepIn (mirrors main.js)
    labelEnter(transitionLabel);

    // sweepIn runs concurrently with flyPlusIn
    sweepIn(() => {});

    flyPlusIn(() => {
      setPhase("label-show");
      setTimeout(() => { notifyBeltsClosed(); }, HOLD);
    });
  }, [phase, isLoaderComplete, sweepIn, flyPlusIn, labelEnter, transitionLabel, setPhase, notifyBeltsClosed, setContentVisible]);

  /* ── detect route change → sweep out ───────────────────────────────── */
  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;
    if (phase !== "label-show" && phase !== "sweep-in") return;

    setPhase("sweep-out");
    setContentVisible(true);

    const corners = [cornerTLRef.current!, cornerTRRef.current!, cornerBLRef.current!, cornerBRRef.current!];

    requestAnimationFrame(() => requestAnimationFrame(() => {
      // sweepOut and flyPlusOut run in parallel (mirrors main.js)
      sweepOut(() => {
        const overlay = overlayRef.current;
        if (overlay) overlay.classList.remove("active");
        corners.forEach((c) => { c.style.opacity = ""; });
        setPhase("idle");
        requestAnimationFrame(() => { window.dispatchEvent(new CustomEvent("trionn-transition:complete")); });
      });

      // Label exits and center hides concurrently with sweepOut
      labelExit(() => {});

      flyPlusOut();
    }));
  }, [pathname, phase, setPhase, sweepOut, flyPlusOut, labelExit, setContentVisible]);

  return (
    <>
      {/* Belt overlay */}
      <div ref={overlayRef} className="pl-trans-overlay">
        {Array.from({ length: BELT_COUNT }, (_, i) => (
          <div key={`trans-belt-${i}`} ref={(el) => { if (el) beltRefs.current[i] = el; }} className="pl-belt" />
        ))}
      </div>

      {/* Flying plus markers */}
      <div ref={flyTLRef} className="pl-flying-plus" style={{ opacity: 0 }}>{PLUS_SVG}</div>
      <div ref={flyTRRef} className="pl-flying-plus" style={{ opacity: 0 }}>{PLUS_SVG}</div>
      <div ref={flyBLRef} className="pl-flying-plus" style={{ opacity: 0 }}>{PLUS_SVG}</div>
      <div ref={flyBRRef} className="pl-flying-plus" style={{ opacity: 0 }}>{PLUS_SVG}</div>

      {/* Center panel — logo wrap (for measuring corner positions) + label */}
      <div ref={centerRef} className="pl-trans-center">
        <div ref={logoWrapRef} className="pl-overlay-logo-wrap" style={{ pointerEvents: "none" }}>
          {/* Corner plus markers — shown during transition */}
          <div ref={cornerTLRef} className="pl-logo-corner-plus tl">{PLUS_SVG}</div>
          <div ref={cornerTRRef} className="pl-logo-corner-plus tr">{PLUS_SVG}</div>
          <div ref={cornerBLRef} className="pl-logo-corner-plus bl">{PLUS_SVG}</div>
          <div ref={cornerBRRef} className="pl-logo-corner-plus br">{PLUS_SVG}</div>
        </div>

        {/* Page label — positioned absolutely centered, slides in/out vertically */}
        <div ref={labelRef} className="pl-overlay-page-label" />
      </div>
    </>
  );
}
