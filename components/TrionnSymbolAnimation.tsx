"use client";

import { useSiteSound } from "@/components/SiteSoundContext";
import { useTrionnSymbolScene } from "@/hooks/useTrionnSymbolScene";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
// import CursorFollowMarquee from "./CursorFollowMarquee";
// import { createPerfMonitor } from "@/lib/perf-monitor";

gsap.registerPlugin(ScrollTrigger);

// const perfMonitorEnabled = process.env.NODE_ENV !== "production";

interface TrionnSymbolAnimationProps {
  /** IDs of elements that should receive the vibrate/orbit effect */
  vibrateElementIds?: string[];
}

export function TrionnSymbolAnimation({
  vibrateElementIds = [],
}: TrionnSymbolAnimationProps) {
  // ── DOM refs ──────────────────────────────────────────────────────────────
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const s4ElRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const vibrateElsRef = useRef<(HTMLElement | null)[]>([]);
  const heroActiveRef = useRef(true);
  const siteSoundRef = useRef(false);
  const disableHoldRef = useRef(false);
  const [showMarquee, setShowMarquee] = useState(true);

  const { soundEnabled } = useSiteSound();
  useEffect(() => {
    siteSoundRef.current = soundEnabled;
  }, [soundEnabled]);

  // ── Resolve element IDs → DOM elements for vibrate/orbit effect ──────────
  useEffect(() => {
    vibrateElsRef.current = vibrateElementIds.map((id) =>
      document.getElementById(id),
    );
  }, [vibrateElementIds]);

  // ── Disable hold-to-blast when Vision section is visible ─────────────────
  useEffect(() => {
    const el = document.getElementById("s3-text");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        disableHoldRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Scene + audio via hook ────────────────────────────────────────────────
  const { audio, stateRef } = useTrionnSymbolScene(
    canvasWrapRef,
    s4ElRef,
    scrollHintRef,
    vibrateElsRef,
    disableHoldRef,
  );

  useEffect(() => {
    if (!soundEnabled) {
      audio.setSoundEnabled(false);
      audio.stopAllSounds();
      return;
    }
    audio.setSoundEnabled(true);
    // Only start woosh if the hero section is actually visible in the viewport
    const heroEl = document.getElementById("hero-section");
    if (heroEl) {
      const { top, bottom } = heroEl.getBoundingClientRect();
      const inView = top < window.innerHeight && bottom > 0;
      if (inView) audio.autoStartWoosh();
    } else {
      audio.autoStartWoosh();
    }
  }, [soundEnabled, audio]);

  // ── Perf monitor ──────────────────────────────────────────────────────────
  // useEffect(() => {
  //   let rafId: number;
  //   let lastTime = performance.now();
  //   let monitor: ReturnType<typeof createPerfMonitor> | null = null;

  //   const syncClockAfterBackground = () => {
  //     lastTime = performance.now();
  //   };
  //   document.addEventListener("visibilitychange", syncClockAfterBackground);
  //   window.addEventListener("focus", syncClockAfterBackground);

  //   function waitForRenderer() {
  //     const renderer = stateRef.current?.renderer ?? null;
  //     if (!renderer) {
  //       rafId = requestAnimationFrame(waitForRenderer);
  //       return;
  //     }
  //     monitor = createPerfMonitor({
  //       label: "Trionn Hero Canvas",
  //       enabled: perfMonitorEnabled,
  //       renderer,
  //       position: "top-right",
  //       toggleKey: "p",
  //     });
  //     lastTime = performance.now();
  //     function tick() {
  //       const now = performance.now();
  //       const dt = (now - lastTime) / 1000;
  //       lastTime = now;
  //       monitor!.tick(dt, { sleeping: !heroActiveRef.current });
  //       rafId = requestAnimationFrame(tick);
  //     }
  //     rafId = requestAnimationFrame(tick);
  //   }

  //   rafId = requestAnimationFrame(waitForRenderer);
  //   return () => {
  //     document.removeEventListener("visibilitychange", syncClockAfterBackground);
  //     window.removeEventListener("focus", syncClockAfterBackground);
  //     cancelAnimationFrame(rafId);
  //     monitor?.destroy();
  //   };
  // }, [perfMonitorEnabled]);

  // ── Sticky pin via GSAP ScrollTrigger ────────────────────────────────────
  useGSAP(() => {
    if (!canvasWrapRef.current) return;

    ScrollTrigger.create({
      trigger: "#hero-section",
      start: "top top",
      end: "bottom bottom",
      pin: canvasWrapRef.current,
      pinType: "fixed",
      pinSpacing: false,
      markers: false,
      onLeave: () => {
        heroActiveRef.current = false;
        audio.stopAllSounds();
        audio.setSoundEnabled(false);
      },
      onEnterBack: () => {
        heroActiveRef.current = true;
        if (siteSoundRef.current) {
          audio.setSoundEnabled(true);
          audio.autoStartWoosh();
        }
      },
    });

    // ── Marquee visibility based on scroll progress ───────────────────────
    // default: shown → hide at 10% → show at 80% → hide at 100%
    ScrollTrigger.create({
      trigger: "#hero-section",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        if (p >= 0.9) {
          setShowMarquee(true);
        } else if (p >= 0.1) {
          setShowMarquee(false);
        } else {
          setShowMarquee(true);
        }
      },
    });
  }, []);

  return (
    <div>
      {/* 3D canvas wrap — position:absolute so GSAP ScrollTrigger pin can manage sticky */}
      <div
        ref={canvasWrapRef}
        className="absolute inset-0 w-full h-dvh z-0 pointer-events-none"
      />

      {/* Cursor Follow Marquee */}
      {/* <CursorFollowMarquee
        text="Hold to blast. Touch lines at your own risk."
        containerRef={canvasWrapRef}
        excludeSelectors={["#keyfacts-section", ".stripe-item", "#nav"]}
        show={showMarquee}
      /> */}
    </div>
  );
}

export default TrionnSymbolAnimation;
