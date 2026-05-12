"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface HoverBlurProps {
  children: string;
}
export default function HoverBlur({ children }: HoverBlurProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const originalLayerRef = useRef<HTMLSpanElement>(null);
  const cloneLayerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    const originalLayer = originalLayerRef.current;
    const cloneLayer = cloneLayerRef.current;

    if (!link || !originalLayer || !cloneLayer) return;

    const originalChars = originalLayer.querySelectorAll(".char");
    const cloneChars = cloneLayer.querySelectorAll(".char");

    const handleMouseEnter = () => {
      // Kill any active tweens to prevent animation overlapping
      gsap.killTweensOf([originalChars, cloneChars, originalLayer, cloneLayer]);

      const tl = gsap.timeline({
        onComplete: () => {
          // Instant reset state on timeline completion
          gsap.set(originalChars, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
          });
          gsap.set(originalLayer, { opacity: 1 });
          gsap.set(cloneLayer, { opacity: 0 });
          gsap.set(cloneChars, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          });
        },
      });

      // Initialize clone layer layout
      tl.set(cloneLayer, { opacity: 1 });
      tl.set(cloneChars, {
        opacity: 0,
        y: 0,
        filter: "blur(0px)",
      });

      // Animate original letters out (Odd up, Even down with blur)
      tl.to(originalChars, {
        y: (i: number) => (i % 2 === 0 ? -10 : 10),
        opacity: 0,
        filter: "blur(5px)",
        duration: 0.3,
        stagger: 0.025,
        ease: "power2.in",
      });

      // Animate clone letters in
      tl.to(
        cloneChars,
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.055,
          ease: "power2.out",
        },
        "-=0.02",
      );
    };

    link.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      link.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Split string into characters helper
  const renderChars = (text: string) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="char inline-block will-change-[transform,opacity,filter]"
      >
        {char === " " ? "\u00A0" : char} {/* Handles spacing correctly */}
      </span>
    ));
  };

  return (
    <span
      ref={linkRef}
      className="nav-link relative inline-flex text-white cursor-pointer leading-none overflow-visible select-none"
    >
      {/* Original Layer */}
      <span ref={originalLayerRef} className="text-layer original inline-flex">
        {renderChars(children)}
      </span>

      {/* Clone Layer */}
      <span
        ref={cloneLayerRef}
        className="text-layer clone absolute left-0 top-0 inline-flex opacity-0 pointer-events-none"
      >
        {renderChars(children)}
      </span>
    </span>
  );
}
