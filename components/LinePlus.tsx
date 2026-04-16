"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/dist/DrawSVGPlugin";

// Register plugins (only on client)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

interface LinePlusProps {
  customClass?: string;
  lineClass?: string;
  plusClass?: string;
  iconColor?: string;
}
export default function LinePlus({
  customClass,
  lineClass,
  plusClass,
  iconColor,
}: LinePlusProps) {
  const drawLine = useRef<HTMLDivElement>(null);
  const PlusIcon = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!drawLine.current) return;

    const ctx = gsap.context(() => {
      gsap.to(drawLine.current, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: drawLine.current,
          start: "top bottom",
          end: "top center",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      gsap.to(PlusIcon.current, {
        rotation: 360,
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: PlusIcon.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, drawLine);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className={`relative line-plus-block grid grid-cols-12 gap-x-6 ${customClass ? customClass : ""}`}
    >
      <div
        className={`line absolute top-1/2 left-0 -translate-y-1/2 bg-cream-line h-[0.063rem] w-0 ${lineClass ? lineClass : ""}`}
        ref={drawLine}
      />
      {PlusIcon && (
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`-translate-x-1/2 w-3.25 h-3.25 ${plusClass ? plusClass : ""}`}
          ref={PlusIcon}
        >
          <line
            x1="6.5"
            y1="-2.18557e-08"
            x2="6.5"
            y2="13"
            style={{ stroke: iconColor }}
          />
          <line
            x1="13"
            y1="6.5"
            x2="-4.37114e-08"
            y2="6.5"
            style={{ stroke: iconColor }}
          />
        </svg>
      )}
    </div>
  );
}
