"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import parse from "html-react-parser";
import { WordShiftButton } from "@/components/Button";
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

        /* ── Build reveal timeline (paused — triggered by parent) ── */
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });

        // No clip-path wipe — just reveal text and lines
        tl.to(yearRef.current, { autoAlpha: 0.6, duration: 0.5 })
          .to(titleRef.current, { autoAlpha: 1, ease: "sine", duration: 0.7 }, "<35%")
          .to(subTitleRef.current, { autoAlpha: 0.6, ease: "sine", duration: 0.6 }, "<")
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
        <div className="relative w-full aspect-670/460 overflow-hidden rounded-sm">
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
          <div className="content-top relative flex flex-col justify-between gap-4 md:gap-6">
            {/* Left: Title & Subtitle */}
            <div className="flex flex-col sm:flex-row justify-between">
              <h3 ref={titleRef} className="m-0">
                {item.title}
              </h3>
              <p ref={yearRef} className="m-0 text-dark-font/60">
                {item.year}
              </p>
            </div>

            {/* Right: Year & Link */}
            <div className="flex flex-col sm:flex-row justify-between">
              <p ref={subTitleRef} className="small text-dark-font/60 max-w-54">
                {parse(item.subtitle)}
              </p>
              <div className="" ref={linkWrapRef}>
                <WordShiftButton text="Explore project" href="#" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default WorkProjectPanel;
