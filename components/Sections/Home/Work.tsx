"use client";

import { WordShiftButton } from "@/components/Button";
import WorkProjectPanel, {
  type WorkProjectPanelHandle,
} from "@/components/Sections/Home/WorkProjectPanel";
import { BlurTextReveal } from "@/components/TextAnimation";
import { workData } from "@/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type WorkHandle = {
  playPanel: (index: number) => void;
};

export default function Work({
  trackRef,
  workHandleRef,
}: {
  trackRef: React.RefObject<HTMLDivElement | null>;
  workHandleRef?: React.MutableRefObject<WorkHandle | null>;
}) {
  const panelRefs = useRef<(WorkProjectPanelHandle | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const borderLineRef = useRef<HTMLDivElement>(null);
  const plusIconRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!borderLineRef.current || !trackRef.current) return;

      gsap.set(borderLineRef.current, {
        scaleY: 0,
        transformOrigin: "center center",
      });
      gsap.set(plusIconRef.current, { rotation: 0 });

      let plusHidden = false;
      const rotQuickTo = gsap.quickTo(plusIconRef.current, "rotation", {
        duration: 0.3,
        ease: "power2.out",
      });
      const lineQuickTo = gsap.quickTo(borderLineRef.current, "scaleY", {
        duration: 0.3,
        ease: "power2.out",
      });
      const check = () => {
        if (!trackRef.current) return;
        const vw = window.innerWidth;
        const right = trackRef.current.getBoundingClientRect().right;
        // Scrub plus-icon rotation from 0° → 360° as the track's right edge
        // travels from the viewport's right edge to its left edge.
        const rotScrub = gsap.utils.clamp(0, 1, 1 - right / vw);
        rotQuickTo(rotScrub * 360);

        // Scrub border-line draw 0 → 1 as the track's right edge travels from
        // the viewport's right edge to the viewport's center (finishes early).
        const lineScrub = gsap.utils.clamp(0, 1, (vw - right) / (vw * 0.5));
        lineQuickTo(lineScrub);

        // Hide the plus icon once the track's right edge passes the viewport's left edge.
        const shouldHide = right <= 0;
        if (shouldHide !== plusHidden) {
          plusHidden = shouldHide;
          gsap.to(plusIconRef.current, {
            autoAlpha: shouldHide ? 0 : 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };

      const st = ScrollTrigger.create({ onUpdate: check, onRefresh: check });
      // Also poll on rAF since the track's transform updates inside another ST's onUpdate
      let rafId = 0;
      const loop = () => {
        check();
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);

      return () => {
        st.kill();
        cancelAnimationFrame(rafId);
      };
    },
    { scope: sectionRef },
  );

  // Wire handle so parent can fire individual panel timelines
  if (workHandleRef) {
    workHandleRef.current = {
      playPanel: (index: number) => {
        panelRefs.current[index]?.play();
      },
    };
  }

  return (
    <div
      ref={sectionRef}
      className="relative overflow-visible h-full w-full bg-[linear-gradient(0deg,#D2D2D2_0%,#FFFFFF_100%)]"
    >
      {/* Horizontal track — GSAP scrubs translateX via trackRef */}
      <div className="absolute inset-0 flex items-center overflow-hidden z-10">
        <div
          ref={trackRef}
          className="flex h-[min(80vh,860px)] flex-nowrap items-center will-change-transform"
        >
          {/* ── Intro Text Block (Responsive width) ── */}
          <div className="pointer-events-auto flex w-screen md:w-[50vw] shrink-0 h-full flex-col justify-center items-center px-6 md:px-10">
            <div className="title-block flex flex-col items-center text-center gap-6 md:gap-12">
              <BlurTextReveal
                as="h2"
                html={`Selected work <br />&amp; explorations`}
                animationType="chars"
                stagger={0.05}
                className="text-dark-font text-[2.5rem] leading-[1.1] md:text-5xl font-medium tracking-tight"
              />
              <div className="whitespace-nowrap">
                <WordShiftButton text="view all projects" href="#" />
              </div>
            </div>
          </div>

          {/* ── Project Cards with divider lines ── */}
          {workData.map((item, i) => (
            <div
              key={item.id}
              className="js-work-card relative flex w-[85vw] md:w-[50vw] shrink-0 min-w-0 h-full items-center pointer-events-none"
            >
              {/* Vertical divider line — draws top→bottom on scrub */}
              <div
                className="js-card-line absolute left-0 top-1/2 -translate-y-1/2 h-screen w-px bg-grey-line/30 origin-top"
                style={{ transform: "scaleY(0)" }}
              />

              {/* Card content */}
              <div className="js-work-card-inner w-full will-change-transform px-4 md:px-20">
                <WorkProjectPanel
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  item={item}
                />
              </div>
            </div>
          ))}

          {/* ── View All Projects card ── */}
          <div className="js-work-card relative flex w-[85vw] md:w-[50vw] shrink-0 min-w-0 h-full items-center pointer-events-none min-h-screen">
            <div
              className="js-card-line absolute left-0 top-1/2 -translate-y-1/2 h-screen w-px bg-grey-line/30 origin-top"
              style={{ transform: "scaleY(0)" }}
            />
            <div className="js-work-card-inner w-full will-change-transform px-4 md:px-10 lg:px-16 xl:px-20">
              <div className="relative flex flex-col items-center justify-center w-full pointer-events-auto">
                <div className="group flex flex-col items-center justify-center gap-10 text-center cursor-pointer w-full h-full">
                  <h3 className=" text-dark-font transition-transform duration-700 max-w-116">
                    Discover our complete collection of digital experiences,
                    brands, and platforms.
                  </h3>
                  <div className="relative inline-flex items-center gap-4 transition-transform duration-700 mt-2">
                    <WordShiftButton text="view all projects" href="#" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section right-border line + plus icon (independent timeline) */}
      <div className="absolute right-0 top-0 h-full w-0 pointer-events-none z-20">
        <div
          ref={borderLineRef}
          className="absolute top-0 -left-px h-full w-px bg-grey-line/30"
        />
        <svg
          ref={plusIconRef}
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible z-[30] svg-plus-icon"
        >
          <line
            x1="6.5"
            y1="0"
            x2="6.5"
            y2="13"
            strokeWidth="1"
            stroke="#2F323B"
          />
          <line
            x1="0"
            y1="6.5"
            x2="13"
            y2="6.5"
            strokeWidth="1"
            stroke="#2F323B"
          />
        </svg>
      </div>
    </div>
  );
}
