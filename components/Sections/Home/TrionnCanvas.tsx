"use client";

import { useRef, useState, useCallback } from "react";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TrionnCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audio = useThreeScene(containerRef);

  // Tracks the user's manual sound preference independently of scroll visibility
  const soundPreferenceRef = useRef(false);

  const handleSoundToggle = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundPreferenceRef.current = next;
    audio.setSoundEnabled(next);
    if (!next) audio.stopAllSounds();
  }, [soundEnabled, audio]);

  useGSAP(() => {
    if (!containerRef.current) return;

    ScrollTrigger.create({
      trigger: "#hero-section",
      start: "top top",
      end: "bottom top",
      pin: containerRef.current,
      pinSpacing: false,
      onLeave: () => {
        // Section scrolled out of view — silence all sounds
        audio.stopAllSounds();
        audio.setSoundEnabled(false);
      },
      onEnterBack: () => {
        // Section back in view — restore user's preference
        audio.setSoundEnabled(soundPreferenceRef.current);
      },
    });
  }, []);

  return (
    <>
      {/* Sound Toggle */}
      <div
        id="sound-toggle"
        className="absolute top-25 right-10 z-10"
        title="Toggle Sound"
        onClick={handleSoundToggle}
      >
        <svg
          id="icon-sound-on"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: soundEnabled ? "block" : "none" }}
          className="w-5"
        >
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
        <svg
          id="icon-sound-off"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: soundEnabled ? "none" : "block" }}
          className="w-5"
        >
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
      </div>

      {/* Three.js canvas mount point */}
      <div
        id="canvas-wrap"
        className="absolute top-0 left-0 w-screen h-screen z-0 pointer-events-none"
        ref={containerRef}
      />
    </>
  );
}
