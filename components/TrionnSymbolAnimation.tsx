"use client";

import { useSiteSound } from "@/components/SiteSoundContext";
import { useTrionnSymbolScene } from "@/hooks/useTrionnSymbolScene";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import CursorFollowMarquee from "./CursorFollowMarquee";

gsap.registerPlugin(ScrollTrigger);

interface TrionnSymbolAnimationProps {
  /** IDs of elements that should receive the vibrate/orbit effect */
  vibrateElementIds?: string[];
}

export function TrionnSymbolAnimation({
  vibrateElementIds = [],
}: TrionnSymbolAnimationProps) {
  // ── DOM refs ──────────────────────────────────────────────────────────────
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const glowCanvasRef = useRef<HTMLCanvasElement>(null);
  const s4ElRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const vibrateElsRef = useRef<(HTMLElement | null)[]>([]);
  const heroActiveRef = useRef(true);
  const siteSoundRef = useRef(false);
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

  // ── Scene + audio via hook ────────────────────────────────────────────────
  const { audio } = useTrionnSymbolScene(
    canvasWrapRef,
    glowCanvasRef,
    s4ElRef,
    scrollHintRef,
    vibrateElsRef,
  );

  useEffect(() => {
    if (!soundEnabled) {
      audio.setSoundEnabled(false);
      audio.stopAllSounds();
      return;
    }
    if (!heroActiveRef.current) return;
    audio.setSoundEnabled(true);
    audio.autoStartWoosh();
  }, [soundEnabled, audio]);

  // ── Sticky pin via GSAP ScrollTrigger ────────────────────────────────────
  useGSAP(() => {
    if (!canvasWrapRef.current) return;

    ScrollTrigger.create({
      trigger: "#hero-section",
      start: "top top",
      end: "bottom bottom",
      pin: canvasWrapRef.current,
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
        if (p >= 0.8) {
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
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Glow canvas */}
      <canvas
        ref={glowCanvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* Cursor Follow Marquee */}
      <CursorFollowMarquee
        text="Hold to blast. Touch lines at your own risk."
        containerRef={canvasWrapRef}
        excludeSelectors={["#keyfacts-section", ".stripe-item", "#nav"]}
        show={showMarquee}
      />
    </div>
  );
}

export default TrionnSymbolAnimation;
