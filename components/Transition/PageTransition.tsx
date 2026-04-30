"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTransition } from "./TransitionContext";
import "./PageLoader.css";

const BELT_COUNT = 10;
const HOLD = 60;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;

/**
 * Between-page belt transition overlay.
 * Triggered by TransitionLink — belts sweep in, page label shows,
 * then after route change the wrapper calls sweepOut.
 */
export default function PageTransition() {
  const {
    phase,
    setPhase,
    transitionLabel,
    isLoaderComplete,
    notifyBeltsClosed,
    setContentVisible,
  } = useTransition();

  const overlayRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const beltRefs = useRef<HTMLDivElement[]>([]);
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  /* ── sweep in ──────────────────────────────────────────────────────── */
  const sweepIn = useCallback((cb: () => void) => {
    const belts = beltRefs.current;
    const overlay = overlayRef.current;
    if (!overlay) return;

    belts.forEach((b) => {
      b.style.transform = "scaleY(0.008)";
      b.style.transformOrigin = "center center";
      b.style.opacity = "1";
    });

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        overlay.classList.add("active");
        let done = 0;
        const need = belts.length;
        const fin = () => { if (++done === need) cb(); };
        const DUR = 500;
        belts.forEach((b, i) => {
          setTimeout(() => {
            const s = performance.now();
            (function f(n: number) {
              const r = Math.min((n - s) / DUR, 1);
              const p = 1 - Math.pow(1 - r, 3);
              b.style.transform = `scaleY(${0.008 + (1 - 0.008) * p})`;
              r < 1 ? requestAnimationFrame(f) : ((b.style.transform = "scaleY(1)"), fin());
            })(performance.now());
          }, i * 38);
        });
      }),
    );
  }, []);

  /* ── sweep out ─────────────────────────────────────────────────────── */
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

  /* ── show label ────────────────────────────────────────────────────── */
  const showLabel = useCallback((label: string, cb: () => void) => {
    const center = centerRef.current;
    const lbl = labelRef.current;
    if (!center || !lbl) { cb(); return; }

    center.style.visibility = "visible";
    lbl.textContent = label;
    lbl.style.opacity = "0";
    lbl.style.transform = "translateY(6px)";

    const s = performance.now();
    (function f(n: number) {
      const r = Math.min((n - s) / 200, 1);
      const p = easeOut(r);
      lbl.style.opacity = String(p);
      lbl.style.transform = `translateY(${6 * (1 - p)}px)`;
      r < 1 ? requestAnimationFrame(f) : cb();
    })(performance.now());
  }, []);

  /* ── hide label ────────────────────────────────────────────────────── */
  const hideLabel = useCallback((cb: () => void) => {
    const center = centerRef.current;
    const lbl = labelRef.current;
    if (!center || !lbl) { cb(); return; }

    const s = performance.now();
    (function f(n: number) {
      const r = Math.min((n - s) / 250, 1);
      const p = 1 - easeIn(r);
      lbl.style.opacity = String(p);
      if (r < 1) { requestAnimationFrame(f); return; }
      center.style.visibility = "hidden";
      lbl.textContent = "";
      lbl.style.opacity = "0";
      cb();
    })(performance.now());
  }, []);

  /* ── trigger sweep-in when phase becomes "sweep-in" ────────────────── */
  useEffect(() => {
    if (phase !== "sweep-in" || !isLoaderComplete) return;

    // Clear the ready marker so new-page components wait for transition:complete
    document.documentElement.dataset.trionnReady = "false";
    setContentVisible(false);

    sweepIn(() => {
      setPhase("label-show");
      showLabel(transitionLabel, () => {
        setTimeout(() => {
          // Belts are fully closed, safe to swap page
          notifyBeltsClosed();
        }, HOLD);
      });
    });
  }, [phase, isLoaderComplete, sweepIn, showLabel, transitionLabel, setPhase, notifyBeltsClosed, setContentVisible]);

  /* ── detect route change → sweep out ───────────────────────────────── */
  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    if (phase !== "label-show" && phase !== "sweep-in") return;

    // Route has changed underneath, now sweep out
    setPhase("sweep-out");

    // Reveal content NOW while belts still fully cover the screen.
    // This flips visibility:hidden → visible + opacity:0 → 0
    // The browser starts painting the page content.
    setContentVisible(true);

    // Give the browser 2 frames to paint the newly-visible content
    // before belts start retracting. This prevents jank on GPU-heavy
    // pages (canvas/WebGL). Same strategy as PageLoader.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hideLabel(() => {
          sweepOut(() => {
            const overlay = overlayRef.current;
            if (overlay) overlay.classList.remove("active");
            setPhase("idle");
            // Small delay so canvas inits don't compete with last belt frames
            requestAnimationFrame(() => {
              window.dispatchEvent(new CustomEvent("trionn-transition:complete"));
            });
          });
        });
      });
    });
  }, [pathname, phase, setPhase, hideLabel, sweepOut, setContentVisible]);

  return (
    <>
      {/* Belt overlay */}
      <div ref={overlayRef} className="trionn-overlay">
        {Array.from({ length: BELT_COUNT }, (_, i) => (
          <div
            key={`trans-belt-${i}`}
            ref={(el) => { if (el) beltRefs.current[i] = el; }}
            className="trionn-belt"
          />
        ))}
      </div>

      {/* Center label */}
      <div ref={centerRef} className="trionn-overlay-center">
        <div ref={labelRef} className="trionn-page-label" />
      </div>
    </>
  );
}
