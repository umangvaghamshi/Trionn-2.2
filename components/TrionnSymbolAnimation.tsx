"use client";

import { useSiteSound } from "@/components/SiteSoundContext";
import { useTrionnSymbolScene } from "@/hooks/useTrionnSymbolScene";
import { getCanvasManager } from "@/lib/canvasManager";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

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
    audio.autoStartWoosh();
  }, [soundEnabled, audio]);

  // ── Sticky pin via GSAP ScrollTrigger ────────────────────────────────────
  useGSAP(() => {
    if (!canvasWrapRef.current) return;

    const manager = getCanvasManager();
    const PAUSE_REASON = "hero-scrolltrigger";

    ScrollTrigger.create({
      trigger: "#hero-section",
      start: "top top",
      end: "bottom top",
      pin: canvasWrapRef.current,
      pinSpacing: false,
      markers: false,
      anticipatePin:1,
      onLeave: () => {
        heroActiveRef.current = false;
        audio.stopAllSounds();
        audio.setSoundEnabled(false);
        manager.suspend("trionn-hero", PAUSE_REASON);
      },
      onEnterBack: () => {
        heroActiveRef.current = true;
        manager.resume("trionn-hero", PAUSE_REASON);
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
        className="absolute inset-0 w-full h-dvh z-0 pointer-events-none"
      />
    </div>
  );
}

export default TrionnSymbolAnimation;
