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
  /**
   * Fraction of scroll progress [0–1] before stripes start animating.
   * 0 = stripes animate immediately, 0.5 = stripes only animate in the last 50%.
   * Higher values = slower / more deliberate reveal. (default: 0.5)
   */
  holdStart?: number;
  /**
   * Stagger spread across stripes as a fraction of the per-stripe animation window.
   * Lower values = stripes animate more in unison. (default: 0.3)
   */
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
  holdStart = 0.5,
  staggerAmount = 0.3,
  scrollEndTrigger = "#keyfacts-section",
  scrollEnd = "top center",
  className = "",
  pinnedClassName = "",
  stripesClassName = "",
  markers = false,
}: StripeRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stripesRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      const stripes = stripesRef.current;

      if (!container || stripes.length === 0) return;

      const origin = stripeOrigin === "bottom" ? "bottom" : "top";
      gsap.set(stripes, { scaleY: 0, transformOrigin: origin });

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        endTrigger: scrollEndTrigger,
        end: scrollEnd,
        scrub: true,
        pin: true,
        markers,
        pinSpacing: false,
        onUpdate: (self) => {
          const count = stripes.length;
          if (count === 0) return;

          // Stripes only animate after `holdStart` progress fraction
          const holdT = Math.max(
            0,
            Math.min(1, (self.progress - holdStart) / (1 - holdStart)),
          );

          // Each stripe gets a window of (1 - staggerAmount) of the holdT range,
          // staggered so the last stripe animates first (matching TrionnServices)
          const perStripe = 1 - staggerAmount;

          for (let i = 0; i < count; i++) {
            // stagger from end: last stripe starts first
            const staggerIdx = count - 1 - i;
            const stripeStart =
              (staggerAmount * staggerIdx) / (count - 1 || 1);
            const stripeEnd = stripeStart + perStripe;
            const stripeProgress = Math.max(
              0,
              Math.min(
                1,
                (holdT - stripeStart) / (stripeEnd - stripeStart),
              ),
            );
            gsap.set(stripes[i]!, { scaleY: stripeProgress });
          }
        },
      });
    },
    {
      dependencies: [
        stripeCount,
        stripeColor,
        stripeOrigin,
        holdStart,
        staggerAmount,
        scrollEndTrigger,
        scrollEnd,
        markers,
      ],
    },
  );

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
              style={{
                backgroundColor: stripeColor,
                willChange: "transform",
                marginTop: index > 0 ? "-0.5px" : undefined,
                paddingBottom: "0.5px",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
