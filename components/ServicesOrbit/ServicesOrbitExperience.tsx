"use client";

import { useSiteSound } from "@/components/SiteSoundContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";
import Marquee from "@/components/Marquee";
import { useServicesOrbitScene } from "./useServicesOrbitScene";

gsap.registerPlugin(ScrollTrigger);


const BG = "#0a0a0a";
const FG = "#e8e8e8";
const MUTED = "#666666";

const CROSS_ICON = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-[4.582vw] w-[2.291vw] h-[2.291vw] shrink-0"
    aria-hidden
  >
    <line
      x1="20.2256"
      y1="-2.18557e-08"
      x2="20.2256"
      y2="40"
      stroke="#FFFFFF"
    />
    <line x1="40" y1="20.226" x2="-4.37114e-08" y2="20.226" stroke="#FFFFFF" />
  </svg>
);

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

  const stripesRef = useRef<HTMLDivElement[]>([]);

  const [activeService, setActiveService] = useState<number | null>(null);
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
    const st = ScrollTrigger.create({
      trigger: "#services-orbit-scope",
      start: "top top",
      end: "bottom top",
      pin: canvasWrapRef.current,
      pinSpacing: false,
      markers: false,
    });
    return () => st.kill();
  }, []);

  useGSAP(() => {
    if (!sec3Ref.current) return;

    const stripes = stripesRef.current;
    gsap.set(stripes, { scaleY: 0, transformOrigin: "bottom" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec3Ref.current,
        start: "top top",
        end: "+=100%",
        pin: sec3Ref.current,
        pinSpacing: true,
        markers: false,
        scrub: true,
      },
      defaults: { ease: "none" },
    });

    // ---- Pull next sibling flush — no gap after pin spacer ----
    const nextSection = document.getElementById("services-orbit-scope")
      ?.nextElementSibling as HTMLElement | null;
    if (nextSection) {
      gsap.set(nextSection, { marginTop: "-100vh" });
    }

    const stripeCount = stripes.length;
    const staggerAmount = 0.5;
    const perStripe = 1 - staggerAmount;
    const totalStripeDuration = 1;

    tl.addLabel("stripes_start");

    for (let i = 0; i < stripeCount; i++) {
      const staggerIdx = stripeCount - 1 - i;
      const stripeOffset =
        (staggerAmount * staggerIdx) / (stripeCount - 1 || 1);
      const start = stripeOffset * totalStripeDuration;
      const end = start + perStripe * totalStripeDuration;

      tl.fromTo(
        stripes[i]!,
        { scaleY: 0 },
        { scaleY: 1, duration: end - start, ease: "none" },
        `stripes_start+=${start}`,
      );
    }

    tl.to({}, { duration: 0.2 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      id="services-orbit-scope"
      className="services-orbit-scope relative min-h-screen font-[Helvetica_Neue,Helvetica,Arial,sans-serif] text-[#e8e8e8] overflow-x-hidden"
      style={{ background: BG, color: FG }}
    >
      <div
        ref={canvasWrapRef}
        className="absolute top-0 left-0 w-full h-screen z-0 isolate transform-[translateZ(0)] backface-hidden max-[768px]:contain-[layout_style] max-[768px]:transform-[translateZ(0)]"
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
        />
      </div>

      <section className="sec-expertise relative z-1 flex min-h-screen w-screen flex-col justify-center bg-transparent px-6 pt-12 pb-14 sm:px-10 sm:pt-12 sm:pb-14 contain-[layout_style] transform-[translateZ(0)] backface-hidden text-light-font">
        <div className="exp-left flex flex-col gap-4 justify-center items-center">
          <div className="exp-top-label">
            <BlurTextReveal
              as="span"
              text="✦ WHAT WE DO BEST"
              animationType="chars"
              stagger={0.05}
              className="title block text-center"
            />
          </div>
          <BlurTextReveal
            as="h1"
            text="Area of expertise"
            animationType="chars"
            stagger={0.05}
            className="text-center"
          />
        </div>
        <div className="exp-bottom flex justify-center max-w-130 text-center mx-auto mt-auto absolute bottom-20 left-1/2 -translate-x-1/2">
          <div className="exp-services flex flex-col justify-center items-center">
            <ul
              ref={servicesListRef}
              className="srv-list flex justify-center list-none flex-wrap gap-2"
            >
              {(
                [
                  "A.I. Development",
                  "Web Development",
                  "Product Design",
                  "Website & Mobile Design",
                  "WordPress Development",
                  "Branding",
                ] as const
              ).map((label, i) => (
                <li
                  key={label}
                  role="presentation"
                  onMouseEnter={() => setActiveService(i)}
                  onMouseLeave={() => setActiveService(null)}
                  className="cursor-pointer title transition-colors duration-200"
                  style={{
                    color: activeService === i ? FG : MUTED,
                  }}
                  onFocus={() => setActiveService(i)}
                  onBlur={() => setActiveService(null)}
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
        className="sec-focused relative z-1 flex min-h-screen w-screen items-center bg-transparent contain-[layout_style] transform-[translateZ(0)]"
        id="sec2"
      >
        <div className="foc-inner tr__container grid grid-cols-12 gap-6 text-light-font">
          <div className="col-span-6 col-start-5 gap-20 flex flex-col">
            <BlurTextReveal
              as="h2"
              text="Focused disciplines where strategy, design, and technology work as one."
              animationType="chars"
              stagger={0.01}
              className="max-w-200 foc-title"
            />
            <div className="flex gap-10 foc-cta">
              <WordShiftButton
                text="View our projects"
                href="#"
                styleVars={{ buttonWrapperColor: "#D8D8D8" }}
              />
              <WordShiftButton
                text="let's connect"
                href="#"
                styleVars={{ buttonWrapperColor: "#D8D8D8" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        ref={sec3Ref}
        className="sec-disciplines relative z-1 flex min-h-screen w-screen items-center justify-center bg-transparent contain-[layout_style]"
        id="sec3"
      >
        <div className="disc-inner flex w-full flex-col items-center justify-center gap-20">
          <Marquee gap={0} speed={0.8}>
            <div className="uppercase mrquee-text flex items-center">
              <span className="marquee-text-item">Branding</span>
              {CROSS_ICON}
              <span className="marquee-text-item">A.I.</span>
              {CROSS_ICON}
              <span className="marquee-text-item">Design</span>
              {CROSS_ICON}
              <span className="marquee-text-item">Develpment</span>
              {CROSS_ICON}
            </div>
          </Marquee>
          <div className="tr__container w-full">
            <BlurTextReveal
              as="span"
              text="Capabilities shaped to scale with ambition."
              animationType="chars"
              stagger={0.02}
              className="title block text-center"
            />
          </div>
        </div>

        {/* ── Stripes overlay (covers content after animation ends) ── */}
        <div className="absolute inset-0 pointer-events-none flex flex-col w-full h-full z-30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) stripesRef.current[i] = el;
              }}
              style={{
                flex: 1,
                width: "100%",
                marginTop: i > 0 ? "-0.5px" : undefined,
                paddingBottom: "0.5px",
                backgroundColor: "#fff",
                transform: "scaleY(0)",
                transformOrigin: "bottom",
                willChange: "transform",
              }}
            />
          ))}
        </div>
      </section>

      {/* Zero-height sentinel — required by useServicesOrbitScene.
          Its top Y = bottom of sec3, which is what computePhaseScrollUntilSec4Top
          uses as the "phase = 1" anchor (orbit/grid/woosh all complete here).
          The IntersectionObserver on this element still fires on a 0-height rect
          as it crosses viewport edges, so canvas pin/unpin stays correct.
          Do NOT give this element any height — doing so reintroduces a blank section. */}
      <section
        ref={sec4Ref}
        aria-hidden="true"
        className="sec-orbit-anchor pointer-events-none relative z-1 block w-screen"
        style={{ height: 0 }}
        id="sec4"
      />
    </div>
  );
}
