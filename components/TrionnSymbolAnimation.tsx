"use client";

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

  // ── Sound toggle ──────────────────────────────────────────────────────────
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleSoundToggle = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      audio.setSoundEnabled(next);
      if (!next) {
        audio.stopAllSounds();
      } else {
        audio.autoStartWoosh();
      }
      return next;
    });
  };

  // ── Sticky pin via GSAP ScrollTrigger ────────────────────────────────────
  const userSoundPreferenceRef = useRef(false);

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
        // Save the user's preference before silencing so we can restore it
        userSoundPreferenceRef.current = audio.soundEnabledRef.current;
        audio.stopAllSounds();
        audio.setSoundEnabled(false);
      },
      onEnterBack: () => {
        if (userSoundPreferenceRef.current) {
          audio.setSoundEnabled(true);
          audio.autoStartWoosh();
        }
      },
    });
  }, []);

  return (
    <div>
      {/* Sound Toggle */}
      <button
        id="sound-toggle"
        onClick={handleSoundToggle}
        title="Toggle Sound"
        className="fixed top-25 right-10 z-999 w-10 h-10 cursor-pointer flex justify-center items-center opacity-60 ease-in-out transition-all duration-300 border-0 background-transprant p-0"
        // style={{
        //   position: "fixed",
        //   top: 100,
        //   right: 40,
        //   zIndex: 9999,
        //   width: 36,
        //   height: 36,
        //   cursor: "pointer",
        //   display: "flex",
        //   alignItems: "center",
        //   justifyContent: "center",
        //   opacity: 0.6,
        //   transition: "opacity 0.2s ease",
        //   background: "none",
        //   border: "none",
        //   padding: 0,
        // }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
      >
        {soundEnabled ? (
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path
              d="M11 5L6 9H2v6h4l5 4V5z"
              stroke="#D8D8D8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.07 4.93a10 10 0 0 1 0 14.14"
              stroke="#D8D8D8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M15.54 8.46a5 5 0 0 1 0 7.07"
              stroke="#D8D8D8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path
              d="M11 5L6 9H2v6h4l5 4V5z"
              stroke="#D8D8D8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 9l-6 6M17 9l6 6"
              stroke="#D8D8D8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

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
