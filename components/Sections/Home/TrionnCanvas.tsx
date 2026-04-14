"use client";

import { useSiteSound } from "@/components/SiteSoundContext";
import { useRef, useEffect } from "react";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TrionnCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroActiveRef = useRef(true);
  const siteSoundRef = useRef(false);
  const audio = useThreeScene(containerRef);

  const { soundEnabled } = useSiteSound();
  siteSoundRef.current = soundEnabled;

  useEffect(() => {
    if (!soundEnabled) {
      audio.setSoundEnabled(false);
      audio.stopAllSounds();
      return;
    }
    if (!heroActiveRef.current) return;
    audio.setSoundEnabled(true);
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
        heroActiveRef.current = false;
        audio.stopAllSounds();
        audio.setSoundEnabled(false);
      },
      onEnterBack: () => {
        heroActiveRef.current = true;
        if (siteSoundRef.current) {
          audio.setSoundEnabled(true);
        }
      },
    });
  }, []);

  return (
    <>
      {/* Three.js canvas mount point */}
      <div
        id="canvas-wrap"
        className="absolute top-0 left-0 w-screen h-screen z-0 pointer-events-none"
        ref={containerRef}
      />
    </>
  );
}
