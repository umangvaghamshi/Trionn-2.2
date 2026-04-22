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
  const containerRef = useRef<HTMLDivElement>(null);
  const drawLine = useRef<HTMLDivElement>(null);
  const plusWrapperRef = useRef<HTMLDivElement>(null);
  const PlusIcon = useRef<SVGSVGElement>(null);
  const isDrawn = useRef(false);
  const wasLineComplete = useRef(false);

  useEffect(() => {
    if (!drawLine.current) return;

    const setDrawnFromScroll = (progress: number) => {
      const complete = progress >= 0.95;
      isDrawn.current = complete;
      if (wasLineComplete.current && !complete && PlusIcon.current) {
        gsap.set(PlusIcon.current, { x: 0 });
      }
      wasLineComplete.current = complete;
    };

    const ctx = gsap.context(() => {
      const lineTween = gsap.to(drawLine.current, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: drawLine.current,
          start: "top bottom",
          end: "top center",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setDrawnFromScroll(self.progress);
          },
          onRefresh: (self) => {
            setDrawnFromScroll(self.progress);
          },
        },
      });
      // Sync on load / layout when line is already past the draw end (e.g. short viewport)
      queueMicrotask(() => {
        const st = lineTween.scrollTrigger;
        if (st) setDrawnFromScroll(st.progress);
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawn.current || !containerRef.current || !PlusIcon.current || !drawLine.current) return;

    const lineRect = drawLine.current.getBoundingClientRect();
    const plusWrap = plusWrapperRef.current;
    if (!plusWrap) return;

    const parentRect = plusWrap.getBoundingClientRect();
    // Rest position of the plus (horizontal center of the icon column / wrapper)
    const parentCenterX = parentRect.left + parentRect.width / 2;

    let offsetX = e.clientX - parentCenterX;

    // Keep icon on the line segment (left/right edges in screen space, relative to rest center)
    const minX = lineRect.left - parentCenterX;
    const maxX = lineRect.right - parentCenterX;
    const lo = Math.min(minX, maxX);
    const hi = Math.max(minX, maxX);
    offsetX = Math.max(lo, Math.min(offsetX, hi));

    gsap.to(PlusIcon.current, {
      x: offsetX,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!PlusIcon.current) return;
    gsap.to(PlusIcon.current, {
      x: 0,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative z-[2] line-plus-block pointer-events-auto grid grid-cols-12 gap-x-6 py-4 cursor-default ${customClass ? customClass : ""}`}
    >
      <div
        className={`line absolute top-1/2 left-0 -translate-y-1/2 bg-cream-line h-[0.063rem] w-0 ${lineClass ? lineClass : ""}`}
        ref={drawLine}
      />
      {PlusIcon && (
        <div
          ref={plusWrapperRef}
          className={`flex items-center justify-center ${plusClass ? plusClass : ""}`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3.25 h-3.25`}
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
        </div>
      )}
    </div>
  );
}
