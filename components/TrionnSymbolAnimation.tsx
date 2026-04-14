"use client";

import { useSiteSound } from "@/components/SiteSoundContext";
import { useTrionnSymbolScene } from "@/hooks/useTrionnSymbolScene";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
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

  const { soundEnabled } = useSiteSound();
  siteSoundRef.current = soundEnabled;

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
        excludeSelectors={["#keyfacts-section", ".stripe-item"]}
      />
    </div>
  );
}

export default TrionnSymbolAnimation;
