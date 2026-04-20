"use client";

import React, { useRef } from "react";
import LinePlus from "@/components/LinePlus";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";
import WorkProjectPanel, {
  type WorkProjectPanelHandle,
} from "@/components/Sections/Home/WorkProjectPanel";
import { workData } from "@/data";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  // Wire handle so parent can fire individual panel timelines
  if (workHandleRef) {
    workHandleRef.current = {
      playPanel: (index: number) => {
        panelRefs.current[index]?.play();
      },
    };
  }

  return (
    <div className="relative h-full w-full bg-[linear-gradient(0deg,#D2D2D2_0%,#FFFFFF_100%)]">

      {/* Horizontal track — GSAP scrubs translateX via trackRef */}
      <div className="absolute inset-0 flex items-center overflow-visible z-10">
        <div
          ref={trackRef}
          className="flex h-[min(80vh,860px)] flex-nowrap items-center will-change-transform"
        >
          {/* ── Intro Text Block (Responsive width) ── */}
          <div className="pointer-events-auto flex w-[100vw] md:w-[50vw] shrink-0 h-full flex-col justify-center px-6 sm:px-8 md:pl-12 md:pr-16 xl:pl-16">
            <div className="title-block flex flex-col gap-6 md:gap-12">
              <BlurTextReveal
                as="h2"
                html={`Selected work <br />&amp; explorations`}
                animationType="chars"
                stagger={0.05}
                className="text-dark-font text-[2.5rem] leading-[1.1] md:text-5xl font-medium tracking-tight"
              />
              <div className="self-start whitespace-nowrap">
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
                className="js-card-line absolute left-0 top-1/2 -translate-y-1/2 h-[100vh] w-[1px] bg-grey-line/30 origin-top"
                style={{ transform: "scaleY(0)" }}
              />

              {/* Card content */}
              <div className="js-work-card-inner w-full will-change-transform px-4 md:px-10 lg:px-16 xl:px-20">
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
          <div className="js-work-card relative flex w-[85vw] md:w-[50vw] shrink-0 min-w-0 h-full items-center pointer-events-none">
            <div
              className="js-card-line absolute left-0 top-1/2 -translate-y-1/2 h-[100vh] w-[1px] bg-grey-line/30 origin-top"
              style={{ transform: "scaleY(0)" }}
            />
            <div className="js-work-card-inner w-full will-change-transform px-4 md:px-10 lg:px-16 xl:px-20">
              <div className="relative flex flex-col items-center justify-center w-full pointer-events-auto aspect-[670/460]">
                <div className="group flex flex-col items-center justify-center gap-10 text-center cursor-pointer w-full h-full">
                  <h3 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] xl:text-[3.5rem] text-dark-font/80 font-medium leading-[1.1] tracking-tight transition-transform duration-700">
                    Discover our complete collection of digital experiences, brands, and platforms.
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
    </div>
  );
}
