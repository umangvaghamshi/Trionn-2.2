"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import parse from "html-react-parser";
import type { workDataItem } from "@/data/dataType";

export type WorkProjectPanelHandle = {
  play: () => void;
};

type WorkProjectPanelProps = {
  item: workDataItem;
};

const WorkProjectPanel = forwardRef<WorkProjectPanelHandle, WorkProjectPanelProps>(
  function WorkProjectPanel({ item }, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const lineLinkRef = useRef<HTMLDivElement>(null);
    const yearRef = useRef<HTMLParagraphElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subTitleRef = useRef<HTMLParagraphElement>(null);
    const linkWrapRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useGSAP(
      () => {
        if (!rootRef.current) return;

        /* ── Set initial hidden states for text/lines only ── */
        gsap.set(
          [yearRef.current, titleRef.current, subTitleRef.current, linkWrapRef.current],
          { autoAlpha: 0 },
        );
        gsap.set([lineLinkRef.current], { scaleX: 0 });

        /* ── Build reveal timeline (paused — triggered by parent) ── */
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });

        // No clip-path wipe — just reveal text and lines
        tl.to(yearRef.current, { autoAlpha: 0.6, duration: 0.5 })
          .to(titleRef.current, { autoAlpha: 1, ease: "sine", duration: 0.7 }, "<35%")
          .to(subTitleRef.current, { autoAlpha: 0.6, ease: "sine", duration: 0.6 }, "<")
          .to(lineLinkRef.current, { scaleX: 1, ease: "expo.out", duration: 1.0 }, "<")
          .to(linkWrapRef.current, { autoAlpha: 1, duration: 0.4 }, "<50%");

        tlRef.current = tl;

        return () => {
          tl.kill();
        };
      },
      { dependencies: [] },
    );

    useImperativeHandle(ref, () => ({
      play: () => {
        tlRef.current?.play();
      },
    }));

    return (
      <div ref={rootRef} className="relative flex flex-col w-full pointer-events-auto">
        {/* Image — directly visible, no clip-path wipe */}
        <div className="relative w-full aspect-[670/460] overflow-hidden rounded-sm">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 45vw"
            priority
          />
        </div>

        {/* Content */}
        <div className="mt-6 flex flex-col text-dark-font">
          <div className="content-top relative pt-5 flex flex-col md:flex-row justify-between gap-4">
            {/* Left: Title & Subtitle */}
            <div className="flex flex-col text-left">
              <h3 ref={titleRef} className="m-0 text-[1.25rem] font-medium leading-tight">
                {item.title}
              </h3>
              <p ref={subTitleRef} className="mt-2 text-[0.875rem] text-dark-font/60 max-w-[280px] leading-snug">
                {parse(item.subtitle)}
              </p>
            </div>

            {/* Right: Year & Link */}
            <div className="flex flex-row md:flex-col text-left md:text-right items-center md:items-end justify-between mt-6 md:mt-0 w-full md:w-auto">
              <p ref={yearRef} className="m-0 text-[0.875rem] text-dark-font/60 order-2 md:order-1">
                {item.year}
              </p>
              <div className="md:mt-4 order-1 md:order-2" ref={linkWrapRef}>
                <div className="relative inline-block group">
                  <span className="text-[0.75rem] font-medium tracking-widest uppercase transition-colors whitespace-nowrap flex items-center gap-1.5">
                    EXPLORE PROJECT <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                  <div
                    ref={lineLinkRef}
                    className="absolute left-0 -bottom-1 h-[1px] w-full origin-left bg-dark-font/40"
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default WorkProjectPanel;
