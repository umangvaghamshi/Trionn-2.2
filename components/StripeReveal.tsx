"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

/* ── Configuration ─────────────────────────────────────── */

export interface StripeRevealProps {
  /** The "pinned" content that stays fixed while stripes animate over it */
  pinnedContent: ReactNode;

  /** Number of horizontal stripes (default: 5) */
  stripeCount?: number;
  /** Background colour of each stripe (default: "#D2D2D2") */
  stripeColor?: string;
  /** Direction from which the stripes grow – "bottom" or "top" (default: "bottom") */
  stripeOrigin?: "bottom" | "top";
  /** Order in which stripes scale in – "end" means last stripe first (default: "end") */
  staggerFrom?: "start" | "end" | "center" | "edges" | "random";
  /** Total stagger spread across all stripes (default: 0.5) */
  staggerAmount?: number;

  /** ScrollTrigger endTrigger element selector (default: "#keyfacts-section") */
  scrollEndTrigger?: string;
  /** ScrollTrigger end position relative to the endTrigger (default: "top top") */
  scrollEnd?: string;

  /** Extra className applied to the outermost <section> */
  className?: string;
  /** Extra className applied to the pinned-content wrapper */
  pinnedClassName?: string;
  /** Extra className applied to the stripes container */
  stripesClassName?: string;

  /** Enable GSAP ScrollTrigger markers for debugging (default: false) */
  markers?: boolean;
}

/* ── Component ─────────────────────────────────────────── */

export default function StripeReveal({
  pinnedContent,
  stripeCount = 5,
  stripeColor = "#D2D2D2",
  stripeOrigin = "bottom",
  staggerFrom = "end",
  staggerAmount = 0.7,
  scrollEndTrigger = "#keyfacts-section",
  scrollEnd = "top center",
  className = "",
  pinnedClassName = "",
  stripesClassName = "",
  markers = false,
}: StripeRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stripesRef = useRef<HTMLDivElement[]>([]);
  useGSAP(() => {
    const container = containerRef.current;
    const stripes = stripesRef.current;

    if (!container || stripes.length === 0) return;

    gsap.set(stripes, { scaleY: 0, transformOrigin:'bottom' });

    // ── Timeline ───────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        endTrigger: scrollEndTrigger,
        end: scrollEnd,
        scrub: true,
        pin: true,
        markers,
        pinSpacing: false,
      },
    });

    tl.to(stripes, {
      scaleY: 1,
      ease: "none",
      stagger: {
        amount: staggerAmount,
        from: staggerFrom,
      },
    });
  }, [
    stripeCount,
    stripeColor,
    stripeOrigin,
    staggerFrom,
    staggerAmount,
    scrollEndTrigger,
    scrollEnd,
    markers,
  ]);

  return (
    <section className={`relative overflow-visible ${className}`}>
      <div
        ref={containerRef}
        className={`w-full min-h-screen z-20 mix-blend-difference relative overflow-visible ${pinnedClassName}`}
      >
        {/* ── 1. Pinned content ──────────────────────────── */}
        {pinnedContent}

        {/* ── 2. Stripes overlay ─────────────────────────── */}
        <div
          className={`stripes-container absolute inset-0 pointer-events-none flex flex-col w-full h-screen z-30 ${stripesClassName}`}
        >
          {Array.from({ length: stripeCount }).map((_, index) => (
            <div
              key={index}
              ref={(el) => {
                stripesRef.current[index] = el!;
              }}
              className="stripe-item flex-1 w-full h-full"
              style={{ backgroundColor: stripeColor }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
