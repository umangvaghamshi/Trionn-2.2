"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSiteSound } from "@/components/SiteSoundContext";

const LINE_SETTINGS = [
  { min: 0.42, max: 0.95, speed: 0.46 },
  { min: 0.2, max: 1.0, speed: 0.38 },
  { min: 0.34, max: 0.88, speed: 0.52 },
  { min: 0.18, max: 1.0, speed: 0.42 },
  { min: 0.3, max: 0.92, speed: 0.49 },
  { min: 0.44, max: 0.84, speed: 0.44 },
];

export function HeaderSoundToggle() {
  const { soundEnabled, toggleSound } = useSiteSound();

  const containerRef = useRef<HTMLButtonElement>(null);
  const isPlayingRef = useRef(soundEnabled);

  useEffect(() => {
    isPlayingRef.current = soundEnabled;

    if (!containerRef.current) return;

    // Scope GSAP selectors to this component instance
    const q = gsap.utils.selector(containerRef.current);
    const soundLines = q(".sound-line");
    const offLine = q(".off-line");

    const randomHeight = (min: number, max: number) =>
      gsap.utils.random(min, max, 0.01);

    const animateSingleLine = (line: Element, index: number) => {
      if (!isPlayingRef.current) return;

      const setting = LINE_SETTINGS[index];

      gsap.to(line, {
        scaleY: randomHeight(setting.min, setting.max),
        duration: gsap.utils.random(setting.speed * 0.75, setting.speed * 1.35),
        ease: "sine.inOut",
        delay: gsap.utils.random(0, 0.12),
        onComplete: () => animateSingleLine(line, index),
      });
    };

    if (soundEnabled) {
      // --- Start Sound Animation ---
      gsap.killTweensOf(offLine);
      gsap.to(offLine, {
        opacity: 0,
        strokeDashoffset: 26,
        duration: 0.25,
        ease: "power2.out",
      });

      soundLines.forEach((line, index) => {
        gsap.killTweensOf(line);
        gsap.to(line, {
          opacity: 1,
          duration: 0.18,
          ease: "power2.out",
        });
        animateSingleLine(line, index);
      });
    } else {
      // --- Stop Sound Animation ---
      soundLines.forEach((line) => {
        gsap.killTweensOf(line);
      });

      gsap.to(soundLines, {
        opacity: 1,
        duration: 0.18,
        ease: "power2.out",
      });

      gsap.killTweensOf(offLine);
      gsap.fromTo(
        offLine,
        {
          opacity: 1,
          strokeDashoffset: 26,
        },
        {
          strokeDashoffset: 0,
          duration: 0.38,
          ease: "power3.out",
          delay: 0.03, // Matches updated snappy delay
        },
      );
    }

    return () => {
      gsap.killTweensOf(soundLines);
      gsap.killTweensOf(offLine);
    };
  }, [soundEnabled]);

  return (
    <button
      ref={containerRef}
      type="button"
      id="sound-toggle"
      onClick={toggleSound}
      title={soundEnabled ? "Mute sound" : "Enable sound"}
      aria-pressed={soundEnabled}
      aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-white/80 shadow-sm backdrop-blur-sm transition hover:text-white"
    >
      <svg
        className="h-6 w-6 overflow-visible"
        viewBox="-4 -4 24 24"
        fill="none"
        aria-hidden="true"
      >
        <g className="sound-bars">
          <rect
            className="sound-line origin-center fill-current"
            x="0"
            y="0"
            width="1"
            height="16"
            rx="0.5"
          />
          <rect
            className="sound-line origin-center fill-current"
            x="3"
            y="0"
            width="1"
            height="16"
            rx="0.5"
          />
          <rect
            className="sound-line origin-center fill-current"
            x="6"
            y="0"
            width="1"
            height="16"
            rx="0.5"
          />
          <rect
            className="sound-line origin-center fill-current"
            x="9"
            y="0"
            width="1"
            height="16"
            rx="0.5"
          />
          <rect
            className="sound-line origin-center fill-current"
            x="12"
            y="0"
            width="1"
            height="16"
            rx="0.5"
          />
          <rect
            className="sound-line origin-center fill-current"
            x="15"
            y="0"
            width="1"
            height="16"
            rx="0.5"
          />
        </g>
        <line
          className="off-line pointer-events-none stroke-current stroke-[1.35] stroke-linecap-round opacity-0"
          style={{ strokeDasharray: 26, strokeDashoffset: 26 }}
          x1="1.8"
          y1="1.8"
          x2="13.8"
          y2="13.8"
        />
      </svg>
    </button>
  );
}
