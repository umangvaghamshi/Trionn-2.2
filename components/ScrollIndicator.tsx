"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Register the GSAP plugin safely for Next.js environments
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function ScrollIndicator() {
  const arrowContainerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const arrow = arrowRef.current;
      if (!arrow) return;

      // Create the infinite looping timeline
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.08 });

      tl.set(arrow, { y: -15, opacity: 0 })
        .to(arrow, {
          y: 0,
          opacity: 1,
          duration: 0.62,
          ease: "power3.out",
        })
        .to(arrow, {
          y: 0,
          opacity: 1,
          duration: 0.36,
          ease: "none",
        })
        .to(arrow, {
          y: 15,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        });
    },
    { scope: arrowContainerRef },
  ); // Scope minimizes selectors and safely cleans up on unmount

  return (
    <div
      className="flex items-center title selective-transition"
      ref={arrowContainerRef}
    >
      <span>scroll</span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4.5 h-4.5 ml-1.5 mt-0.5 overflow-visible"
      >
        <defs>
          <clipPath id="circleClip">
            <circle cx="9" cy="9" r="8.5" />
          </clipPath>
        </defs>

        {/* Static circle border from your design */}
        <circle cx="9" cy="9" r="8.5" stroke="currentColor" />

        {/* Masked and animated arrow */}
        <g clipPath="url(#circleClip)">
          <path
            ref={arrowRef}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}
            d="M8.64645 12.3536C8.84171 12.5488 9.15829 12.5488 9.35355 12.3536L12.5355 9.17157C12.7308 8.97631 12.7308 8.65973 12.5355 8.46447C12.3403 8.2692 12.0237 8.2692 11.8284 8.46447L9 11.2929L6.17157 8.46447C5.97631 8.2692 5.65973 8.2692 5.46447 8.46447C5.2692 8.65973 5.2692 8.97631 5.46447 9.17157L8.64645 12.3536ZM9 5L8.5 5L8.5 12L9 12L9.5 12L9.5 5L9 5Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}
