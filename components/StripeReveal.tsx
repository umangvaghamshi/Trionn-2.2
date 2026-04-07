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
  /** The content that slides up behind the stripes to be revealed */
  revealContent: ReactNode;

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

  /** ScrollTrigger end value – controls how much scroll distance the
   *  animation consumes (default: "+=200%") */
  scrollEnd?: string;
  /** Reveal-content start position in the timeline (default: "<15%") */
  revealPosition?: string;
  /** Reveal-content final y translation (default: "-20%") */
  revealEndY?: string;

  /** Extra className applied to the outermost <section> */
  className?: string;
  /** Extra className applied to the pinned-content wrapper */
  pinnedClassName?: string;
  /** Extra className applied to the stripes container */
  stripesClassName?: string;
  /** Extra className applied to the reveal-content wrapper */
  revealClassName?: string;

  /** Enable GSAP ScrollTrigger markers for debugging (default: false) */
  markers?: boolean;
}

/* ── Component ─────────────────────────────────────────── */

export default function StripeReveal({
  pinnedContent,
  revealContent,
  stripeCount = 5,
  stripeColor = "#D2D2D2",
  stripeOrigin = "bottom",
  staggerFrom = "end",
  staggerAmount = 0.5,
  scrollEnd = "+=200%",
  revealPosition = "<15%",
  revealEndY = "-20%",
  className = "",
  pinnedClassName = "",
  stripesClassName = "",
  revealClassName = "",
  markers = false,
}: StripeRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stripesRef = useRef<HTMLDivElement[]>([]);
  const revealRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const stripes = stripesRef.current;
    const reveal = revealRef.current;

    if (!container || stripes.length === 0) return;

    // ── Initial state ──────────────────────────────────
    gsap.set(stripes, { scaleY: 0, transformOrigin: stripeOrigin });
    if (reveal) {
      gsap.set(reveal, { y: "100%" });
    }

    // ── Timeline ───────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: scrollEnd,
        scrub: true,
        pin: true,
        markers,
      },
    });

    // 1. Scale stripes to full height
    tl.to(stripes, {
      scaleY: 1,
      stagger: { amount: staggerAmount, from: staggerFrom },
      ease: "none",
    });

    // 2. Slide reveal-content upward
    if (reveal) {
      tl.to(
        reveal,
        {
          duration: 1,
          y: revealEndY,
          ease: "none",
        },
        revealPosition,
      );
    }
  }, [
    stripeCount,
    stripeColor,
    stripeOrigin,
    staggerFrom,
    staggerAmount,
    scrollEnd,
    revealPosition,
    revealEndY,
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
              className="stripe-item w-full flex-1"
              style={{ backgroundColor: stripeColor }}
            />
          ))}
        </div>

        {/* ── 3. Reveal content ──────────────────────────── */}
        <div
          ref={revealRef}
          className={`absolute top-0 left-0 w-full z-40 ${revealClassName}`}
        >
          {revealContent}
        </div>
      </div>
    </section>
  );
}
