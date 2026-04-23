"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import type { PaperFoldProps, PaperFoldCard } from "./types";
import { usePaperFoldAnimation } from "./usePaperFoldAnimation";
import { BlurTextReveal } from "@/components/TextAnimation";
import LinePlus from "@/components/LinePlus";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_CARDS: PaperFoldCard[] = [
  {
    title: "Driven by excellence",
    description:
      "Our work is shaped by high standards, continuous learning, and deep respect for craft — pushing every project beyond the expected.",
  },
  {
    title: "Honesty and authenticity",
    description:
      "In an industry full of noise and inflated promises, we focus on clarity, transparency, and results we're proud to stand behind.",
  },
  {
    title: "Designs that last",
    description:
      "We design systems, products, and brands built to endure — balancing creativity, technology, and purpose for long-term impact.",
  },
  {
    title: "Purposeful decisions",
    description:
      "We're an independent studio of design and coding experts, prioritizing quality and emotional value — even above profit when it matters.",
  },
  {
    title: "Creativity with impact",
    description:
      "We don't chase trends. We shape ideas that add real value. For us, creativity matters only when it serves purpose and endures over time.",
  },
  {
    title: "Experience  and attitude",
    description:
      "Our experience comes from years of exploration, learning, and solving complex challenges — evolving with every project we take on.",
  },
];

export default function PaperFold({
  sectionTitle = "Our values",
  sectionSubtitle = "We're proud to be one of India's most creative and recognized web design studios, driven by purpose, aesthetics, and bold ideas.",
  cards = DEFAULT_CARDS,
  footerTagline = "✦ What we believe shapes better work.",
  className = "",
}: PaperFoldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const valueTitle = useRef<HTMLDivElement>(null);

  usePaperFoldAnimation(containerRef, cards.length);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      // Use a function to calculate pixels dynamically
      end: () => {
        const valueBlock = document.querySelector(
          ".velue-block",
        ) as HTMLElement;
        const bottomText = document.querySelector(
          ".bottom-text",
        ) as HTMLElement;

        if (!valueBlock) {
          console.error("Element .velue-block not found!");
          return "bottom center"; // Fallback
        }

        const style = window.getComputedStyle(valueBlock);

        const padding = parseFloat(style.paddingBottom);
        const headerHeight =
          document.querySelector(".site-header")?.clientHeight || 100;
        const bottomTextHeight = bottomText.clientHeight;
        return `bottom ${headerHeight + bottomTextHeight + padding * 2 + 12}px`;
      },
      pin: valueTitle.current,
      pinSpacing: false,
      scrub: false,
      invalidateOnRefresh: true, // IMPORTANT: Allows recalculation on resize
      markers: false,
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className={`paperfold-section relative w-full bg-[linear-gradient(0deg,#D2D2D2_0%,#FFFFFF_100%)] ${className}`}
    >
      <div className="tr__container flex flex-col">
        <LinePlus
          lineClass={"opacity-15 bg-grey-line"}
          plusClass={"col-start-7"}
          iconColor={"#272727"}
        />
        <div className="velue-block text-dark-font flex flex-col py-37.5">
          <div className="grid grid-cols-12 gap-x-6 mb-20">
            <div className="col-span-4" ref={valueTitle}>
              <BlurTextReveal
                as="h2"
                html={sectionTitle}
                animationType="chars"
                stagger={0.05}
                className="text-dark-font block"
              />
            </div>
            <div className="col-span-7 flex items-end">
              <p className="max-w-100">{sectionSubtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-7 col-start-5 flex flex-col gap-10">
              <div
                className="paperfold-stack flex flex-col gap-0.5"
                style={{ perspective: "2500px" }}
              >
                {cards.map((card, i) => {
                  return (
                    <div key={i} className="paperfold-card relative origin-top">
                      <div
                        className="paperfold-card-inner grid grid-cols-7 gap-6 p-8 bg-white rounded-sm"
                        // style={{
                        //   backgroundColor: "#ffffff",
                        //   borderBottom: "4px solid rgba(0,0,0,0.06)",
                        // }}
                      >
                        <div className="col-span-3 flex items-center">
                          <h3>{card.title}</h3>
                        </div>
                        <div className="col-span-3 flex items-center col-start-5 ">
                          <p className="small">{card.description}</p>
                        </div>
                        {/* <p className="flex-1 text-[10px] sm:text-[11.5px] md:text-[13px] lg:text-[13.5px] text-[#666] leading-[1.5] sm:leading-[1.6] md:leading-[1.7] font-light">
                          {card.description}
                        </p> */}
                      </div>
                      {/* Shadow overlay for fold depth */}
                      <div
                        className="paperfold-shadow absolute inset-0 bg-black/80 pointer-events-none"
                        style={{ opacity: 0 }}
                      />
                    </div>
                  );
                })}
              </div>
              <BlurTextReveal
                as="span"
                html={footerTagline}
                animationType="chars"
                stagger={0.05}
                className="text-dark-font title block bottom-text"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
