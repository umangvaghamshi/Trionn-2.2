"use client";

import { useSiteSound } from "@/components/SiteSoundContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);
import { useServicesOrbitScene } from "./useServicesOrbitScene";

const BG = "#0a0a0a";
const FG = "#e8e8e8";
const MUTED = "#666666";
const DIM = "#333333";
const BORDER = "#1a1a1a";
const ACCENT = "#c8a882";

export default function ServicesOrbitExperience() {
  const lenis = useLenis();

  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const glowCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const sec2Ref = useRef<HTMLElement>(null);
  const sec3Ref = useRef<HTMLElement>(null);
  const sec4Ref = useRef<HTMLElement>(null);
  const servicesListRef = useRef<HTMLUListElement>(null);
  const soundEnabledRef = useRef(false);

  const [activeService, setActiveService] = useState(1);
  const { soundEnabled } = useSiteSound();

  const getSmoothScroll = useCallback(() => {
    if (typeof window === "undefined") return 0;
    return lenis?.scroll ?? window.scrollY;
  }, [lenis]);

  /** Fallback normalized scroll when #sec4 is missing; orbit/grid use anchored phase from sec4 in the scene hook. */
  const getScrollProgress = useCallback(() => {
    if (typeof window === "undefined") return 0;
    if (lenis) {
      const lim = lenis.limit;
      if (lim > 0) return Math.min(Math.max(lenis.scroll / lim, 0), 1);
      const p = lenis.progress;
      if (typeof p === "number" && Number.isFinite(p))
        return Math.min(Math.max(p, 0), 1);
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
  }, [lenis]);

  useEffect(() => {
    const onResize = () => {
      lenis?.resize();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;
    const ro = new ResizeObserver(() => {
      lenis.resize();
    });
    const s2 = sec2Ref.current;
    const s3 = sec3Ref.current;
    if (s2) ro.observe(s2);
    if (s3) ro.observe(s3);
    return () => ro.disconnect();
  }, [lenis]);

  const orbitAudioRef = useServicesOrbitScene(mainCanvasRef, glowCanvasRef, {
    getSmoothScroll,
    getScrollProgress,
    soundEnabledRef,
    canvasWrapRef,
    sec4Ref,
    servicesListRef,
  });

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    if (typeof window !== "undefined") {
      (window as Window & { _soundEnabled?: boolean })._soundEnabled =
        soundEnabled;
    }
    if (soundEnabled) orbitAudioRef.current?.primeWoosh();
    else orbitAudioRef.current?.muteWoosh();
  }, [soundEnabled]);

  useGSAP(() => {
    if (!canvasWrapRef.current) return;
    ScrollTrigger.create({
      trigger: "#services-orbit-scope",
      start: "top top",
      end: "bottom bottom",
      pin: canvasWrapRef.current,
      pinSpacing: false,
      markers: false,
    });
  }, []);

  return (
    <div
      id="services-orbit-scope"
      className="services-orbit-scope min-h-screen font-[Helvetica_Neue,Helvetica,Arial,sans-serif] text-[#e8e8e8] overflow-x-hidden"
      style={{ background: BG, color: FG }}
    >
      <div
        ref={canvasWrapRef}
        className="absolute inset-0 w-full h-screen z-0 [isolation:isolate] [transform:translateZ(0)] [backface-visibility:hidden] max-[768px]:[contain:layout_style] max-[768px]:[transform:translateZ(0)]"
      >
        <canvas
          ref={mainCanvasRef}
          id="main-canvas"
          className="block h-full w-full"
        />
        <canvas
          ref={glowCanvasRef}
          id="glow-canvas"
          className="pointer-events-none absolute top-0 left-0"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>

      <section className="sec-expertise relative z-[1] flex min-h-screen w-screen flex-col justify-between bg-transparent px-6 pt-12 pb-14 sm:px-10 sm:pt-12 sm:pb-14 [contain:layout_style] [transform:translateZ(0)] [backface-visibility:hidden]">
        <div className="exp-left flex flex-col gap-[1.2rem]">
          <div
            className="exp-top-label flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em]"
            style={{ color: MUTED }}
          >
            <span className="diamond text-[0.65rem]" style={{ color: FG }}>
              ✦
            </span>{" "}
            WHAT WE DO BEST
          </div>
          <h2
            className="exp-title text-[clamp(2.8rem,12vw,8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] sm:text-[clamp(3.8rem,7vw,8rem)]"
            style={{ color: FG }}
          >
            AREA OF
            <br />
            EXPERTISE
          </h2>
        </div>
        <div className="exp-bottom flex justify-start sm:justify-end">
          <div className="exp-services flex flex-col items-start gap-[0.9rem] sm:items-end">
            <p
              className="srv-heading text-[0.68rem] uppercase tracking-[0.16em]"
              style={{ color: MUTED }}
            >
              SERVICES
            </p>
            <ul ref={servicesListRef} className="srv-list flex list-none flex-col gap-[0.28rem] sm:items-end">
              {(
                [
                  "Product Design",
                  "Website & Mobile Design",
                  "WordPress Development",
                  "Web Development",
                  "A.I. Development",
                  "Branding",
                ] as const
              ).map((label, i) => (
                <li
                  key={label}
                  role="presentation"
                  onMouseEnter={() => setActiveService(i)}
                  className={`cursor-pointer text-[0.95rem] transition-colors duration-200 ${
                    activeService === i
                      ? "font-semibold"
                      : "font-normal"
                  }`}
                  style={{
                    color: activeService === i ? FG : MUTED,
                  }}
                  onFocus={() => setActiveService(i)}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        ref={sec2Ref}
        className="sec-focused relative z-[1] flex min-h-screen w-screen items-center bg-transparent [contain:layout_style] [transform:translateZ(0)]"
        id="sec2"
      >
        <div className="foc-inner ml-0 flex flex-col gap-8 px-6 sm:ml-[30%] sm:gap-[2.8rem] sm:px-14">
          <h2
            className="foc-title max-w-[90vw] text-[clamp(1.8rem,7vw,5.6rem)] font-bold leading-[1.08] tracking-[-0.025em] sm:max-w-none sm:text-[clamp(2.4rem,4.8vw,5.6rem)]"
            style={{ color: FG }}
          >
            Focused disciplines
            <br />
            where strategy, design,
            <br />
            and technology work
            <br />
            as one.
          </h2>
          <a
            className="foc-cta inline-flex w-fit items-center gap-[1.4rem] border-b pb-2 text-[0.72rem] uppercase tracking-[0.16em] no-underline transition-[border-color] duration-200"
            style={{ color: FG, borderColor: DIM }}
            href="#"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = FG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = DIM;
            }}
          >
            LET&apos;S CONNECT <span className="text-base tracking-normal">→</span>
          </a>
        </div>
      </section>

      <section
        ref={sec3Ref}
        className="sec-disciplines relative z-[1] flex min-h-screen w-screen items-center justify-center bg-transparent [contain:layout_style]"
        id="sec3"
      >
        <div className="disc-inner flex w-full flex-col items-center gap-[2.8rem] px-4">
          <div className="disc-words flex w-full max-w-[100vw] flex-col items-center justify-center gap-0.5 sm:flex-row sm:gap-0">
            <span
              className="disc-word min-w-0 shrink text-center text-[clamp(2.4rem,14vw,12rem)] font-extrabold tracking-[-0.03em] uppercase whitespace-nowrap sm:text-[clamp(3.2rem,9.5vw,12rem)]"
              style={{ color: FG }}
            >
              BRANDING
            </span>
            <span
              className="disc-plus px-0 text-[clamp(1.2rem,5vw,5rem)] font-light leading-none opacity-70 sm:px-[clamp(1rem,2.5vw,3rem)] sm:text-[clamp(1.8rem,4vw,5rem)]"
              style={{ color: FG }}
            >
              +
            </span>
            <span
              className="disc-word min-w-0 shrink text-center text-[clamp(2.4rem,14vw,12rem)] font-extrabold tracking-[-0.03em] uppercase whitespace-nowrap sm:text-[clamp(3.2rem,9.5vw,12rem)]"
              style={{ color: FG }}
            >
              A.I.
            </span>
            <span
              className="disc-plus px-0 text-[clamp(1.2rem,5vw,5rem)] font-light leading-none opacity-70 sm:px-[clamp(1rem,2.5vw,3rem)] sm:text-[clamp(1.8rem,4vw,5rem)]"
              style={{ color: FG }}
            >
              +
            </span>
            <span
              className="disc-word min-w-0 shrink text-center text-[clamp(2.4rem,14vw,12rem)] font-extrabold tracking-[-0.03em] uppercase whitespace-nowrap sm:text-[clamp(3.2rem,9.5vw,12rem)]"
              style={{ color: FG }}
            >
              DESIGN
            </span>
          </div>
          <p
            className="disc-sub text-center text-[0.72rem] uppercase tracking-[0.18em]"
            style={{ color: MUTED }}
          >
            CAPABILITIES SHAPED TO SCALE WITH AMBITION.
          </p>
        </div>
      </section>

      <section
        ref={sec4Ref}
        className="sec-cta relative z-[1] flex min-h-screen w-screen flex-col justify-between overflow-hidden border-t px-6 pt-12 pb-14 sm:px-14"
        style={{ background: "#000000", borderColor: BORDER }}
        id="sec4"
      >
        <div
          className="cta-bg-text pointer-events-none absolute -bottom-[0.15em] -right-[0.04em] select-none leading-none font-black uppercase text-transparent sm:-bottom-[0.15em]"
          style={{
            fontSize: "clamp(6rem, 28vw, 28rem)",
            WebkitTextStroke: "1px rgba(232,232,232,0.04)",
          }}
        >
          START
        </div>
        <div
          className="cta-top-label relative z-[1] flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em]"
          style={{ color: MUTED }}
        >
          <span className="text-[0.65rem]" style={{ color: FG }}>
            ✦
          </span>{" "}
          NEXT STEP
        </div>
        <div className="cta-inner relative z-[1] flex flex-col gap-8">
          <h2
            className="cta-title text-[clamp(2.2rem,10vw,8.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.035em] sm:text-[clamp(3rem,7vw,8.5rem)]"
            style={{ color: FG }}
          >
            Have a project
            <br />
            in mind?
          </h2>
          <p
            className="cta-sub max-w-[36ch] text-[0.9rem] leading-[1.7] tracking-[0.02em]"
            style={{ color: MUTED }}
          >
            We turn ambitious visions into
            <br />
            award-worthy digital experiences.
          </p>
          <a
            className="cta-btn inline-flex w-fit items-center gap-[1.2rem] px-8 py-4 text-[0.72rem] uppercase tracking-[0.18em] no-underline transition-[background,color] duration-[250ms]"
            style={{ background: FG, color: BG }}
            href="#"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = ACCENT;
              e.currentTarget.style.color = BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = FG;
              e.currentTarget.style.color = BG;
            }}
          >
            <span>BEGIN THE CONVERSATION</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 9H15M15 9L10 4M15 9L10 14"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        <div
          className="cta-footer-row relative z-[1] flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center"
          style={{ borderColor: BORDER }}
        >
          <span
            className="cta-copy text-[0.68rem] tracking-[0.1em]"
            style={{ color: MUTED }}
          >
            © 2026 TRIONN® All rights reserved.
          </span>
          <div className="cta-links flex gap-8">
            {["Instagram", "Behance", "LinkedIn"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[0.68rem] uppercase tracking-[0.14em] no-underline transition-colors duration-200"
                style={{ color: MUTED }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = FG;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = MUTED;
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
