"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { OrbitProps, OrbitLabel } from "./types";
import { BlurTextReveal } from "@/components/TextAnimation";
import LinePlus from "@/components/LinePlus";
import { WordShiftButton } from "@/components/Button";
import { useOrbitScene } from "./useOrbitScene";

gsap.registerPlugin(ScrollTrigger);

/* ── Default Data ── */
const DEFAULT_LABELS: OrbitLabel[] = [
  { name: "VELORA", desc: "Architecture Studio · I" },
  { name: "FORMLINE", desc: "Selected Work · II" },
  { name: "THANK YOU", desc: "For Watching · III" },
  { name: "GRINEX", desc: "10 Projects · IV" },
  { name: "FOUCAULT", desc: "Portfolio Studio · V" },
  { name: "ONE.DOT", desc: "Brand Identity · VI" },
  { name: "AXORA", desc: "Ceramics Collection · VII" },
  { name: "NORTHFORM", desc: "Brand System · VIII" },
  { name: "EXTRA", desc: "Project · IX" },
];

export default function Orbit({
  labels = DEFAULT_LABELS,
  images,
  topCenterText = "Exploring ideas through daily design practice.",
  bottomLeftText = "Concepts, explorations, and interface experiments—shared openly as part of our creative process.",
  ctaText = "View on Dribbble",
  ctaHref = "#",
  backgroundColor = "#C3C3C3",
  autoRotateSpeed = 0.00042,
  orbitRadius = 5.2,
  fontFamily = "'Barlow', sans-serif",
  className = "",
}: OrbitProps) {
  const N = labels.length;
  const imgSrcs =
    images ??
    Array.from(
      { length: N },
      (_, i) => `/images/orbit/orbit-${String(i + 1).padStart(2, "0")}.webp`,
    );

  /* ── Refs ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Three.js Scene Hook ── */
  const { triggerIntro } = useOrbitScene(canvasRef, trailCanvasRef, {
    labels,
    images: imgSrcs,
    backgroundColor,
    autoRotateSpeed,
    orbitRadius,
  });

  /* ── Trigger intro animation when section top hits viewport top ── */
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        once: true,
        markers: false,
        onEnter: triggerIntro,
      });
    },
    { scope: containerRef, dependencies: [triggerIntro] },
  );

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-screen cursor-default ${className}`}
      style={{ backgroundColor, fontFamily }}
    >
      <div className="tr__container">
        <LinePlus
          customClass={"translate-y-1/2 col-span-12 z-20"}
          lineClass={"opacity-15 bg-grey-line left-1/2 -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto -translate-x-0!"}
          iconColor={"#272727"}
        />
      </div>
      <div
        ref={containerRef}
        className={`relative w-full h-screen overflow-hidden cursor-default flex flex-col ${className}`}
        style={{ backgroundColor, fontFamily }}
      >
        {/* Trail Canvas — Motion Blur Layer */}
        <canvas
          ref={trailCanvasRef}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* Main Three.js Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-1 pointer-events-none mt-10"
        />

        {/* ── UI Overlays ── */}

        {/* Top Left — Slide Counter */}
        {/* <div className="absolute top-5 left-5 md:top-[36px] md:left-[40px] pointer-events-none z-10">
          <span
            ref={counterRef}
            className="text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-[#777]"
          >
            01 / {String(N).padStart(2, "0")}
          </span>
        </div> */}
        <div className="tr__container w-full pt-37.5 pb-20 flex flex-col justify-between h-full">
          <div className="title-block flex items-center text-center text-dark-font relative z-3 flex-col gap-6">
            <BlurTextReveal
              as="h2"
              html={`Design in motion`}
              animationType="chars"
              stagger={0.05}
              className="text-dark-font"
            />
            <BlurTextReveal
              as="span"
              html={`${topCenterText}`}
              animationType="chars"
              stagger={0.05}
              className="title block max-w-50"
            />
          </div>
          <div className="bottom-block flex justify-between items-end text-dark-font">
            <p className="small max-w-63 relative z-3">{bottomLeftText}</p>
            <WordShiftButton
              text={ctaText}
              href={ctaHref}
              customClass={"min-w-[15.625rem] z-3 relative"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
