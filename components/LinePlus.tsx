"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/dist/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useRef } from "react";

// Register plugins (only on client)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

interface LinePlusProps {
  customClass?: string;
  lineClass?: string;
  plusClass?: string;
  iconColor?: string;
  /**
   * Shift ScrollTrigger start/end when this component lives inside a
   * CSS-transformed ancestor. Accepts any GSAP offset string, e.g. "100vh"
   * or "800px". Positive = trigger fires later (element visually shifted up).
   */
  scrollOffset?: string;
  scrub?: boolean | number;
}

export default function LinePlus({
  customClass,
  lineClass,
  plusClass,
  iconColor,
  scrollOffset = "",
  scrub = true,
}: LinePlusProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawLine = useRef<HTMLDivElement>(null);
  const PlusIcon = useRef<SVGSVGElement>(null);
  const lineDrawn = useRef(false);

  useGSAP(() => {
    if (!drawLine.current) return;

    const off = scrollOffset ? ` ${scrollOffset}` : "";

    gsap.to(drawLine.current, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: drawLine.current,
        start: `top bottom${off}`,
        end: `top center${off}`,
        scrub,
        invalidateOnRefresh: true,
        markers: false,
        onLeave: () => {
          lineDrawn.current = true;
        },
        onEnterBack: () => {
          lineDrawn.current = false;
        },
      },
    });

    gsap.to(PlusIcon.current, {
      rotation: 360,
      duration: 1,
      ease: "none",
      scrollTrigger: {
        trigger: PlusIcon.current,
        start: `top bottom${off}`,
        end: `bottom top${off}`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    const container = containerRef.current;
    if (!container || !PlusIcon.current) return;

    let iconRestX: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      if (!lineDrawn.current || !drawLine.current || !PlusIcon.current) return;

      const containerRect = container.getBoundingClientRect();

      // Capture rest position on first move after enter
      if (iconRestX === null) {
        const iconRect = PlusIcon.current.getBoundingClientRect();
        iconRestX = iconRect.left - containerRect.left + iconRect.width / 2;
      }

      const cursorX = e.clientX - containerRect.left;
      const lineRect = drawLine.current.getBoundingClientRect();
      const lineLeft = lineRect.left - containerRect.left;
      const lineRight = lineRect.right - containerRect.left;
      const iconHalf = PlusIcon.current.getBoundingClientRect().width / 2;
      const minCenter = lineLeft + iconHalf;
      const maxCenter = lineRight - iconHalf;
      let targetCenterX = cursorX;
      if (maxCenter >= minCenter) {
        targetCenterX = Math.min(Math.max(cursorX, minCenter), maxCenter);
      } else {
        // Line shorter than icon: keep plus centered on the line
        targetCenterX = (lineLeft + lineRight) / 2;
      }

      gsap.to(PlusIcon.current, {
        x: targetCenterX - iconRestX!,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onMouseLeave = () => {
      if (!lineDrawn.current) return;
      iconRestX = null;
      gsap.to(PlusIcon.current, {
        x: 0,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [scrollOffset]);

  return (
    <div
      ref={containerRef}
      className={`relative line-plus-block grid grid-cols-12 gap-x-6 ${customClass ? customClass : ""}`}
    >
      <div
        className={`line absolute top-1/2 left-0 -translate-y-1/2 h-px w-0 ${lineClass ? lineClass : "bg-[#24262E]"}`}
        ref={drawLine}
      />
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
          y1="0"
          x2="6.5"
          y2="13"
          strokeWidth="1"
          style={{ stroke: iconColor }}
        />
        <line
          x1="0"
          y1="6.5"
          x2="13"
          y2="6.5"
          strokeWidth="1"
          style={{ stroke: iconColor }}
        />
      </svg>
    </div>
  );
}
