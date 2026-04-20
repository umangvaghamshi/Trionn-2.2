"use client";

import { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Marquee from "@/components/Marquee";
import AboutLion from "./AboutLion";
import { BlurTextReveal } from "@/components/TextAnimation";

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

/**
 * About page hero: large heading, interactive WebGL lion portrait with
 * overlay labels, and a full-width marquee banner at the bottom.
 *
 * Uses natural document flow so the lion scales proportionally (just like
 * the HTML prototype), rather than being forced into a 100vh container.
 */
export default function AboutHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  useGSAP(() => {
    const updateHeight = () => {
      const titleBlock = document.querySelector(".title-block") as HTMLElement;
      const topContent = document.querySelector(".top-content") as HTMLElement;

      if (titleBlock && topContent) {
        // Calculate height: Viewport height - Title offset height
        const availableHeight = window.innerHeight - titleBlock.offsetHeight;

        // Apply height via GSAP
        gsap.set(topContent, { height: availableHeight });
      }
    };

    // Run once on mount
    updateHeight();

    // Add resize listener for responsiveness
    window.addEventListener("resize", updateHeight);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <section className="relative w-full bg-white text-black overflow-hidden flex flex-col items-center">
      {/* Top: heading */}
      <div className="relative z-10 pt-32 md:pt-40 px-6 md:px-10 w-full mix-blend-difference title-block pointer-events-none">
        <h1 className="text-center mx-auto h2 max-w-342 text-white">
          We are an independent digital studio built on clarity, thoughtful
          craft, and trust earned worldwide.
        </h1>
      </div>

      {/* Lion and Marquee container */}
      <div className="relative w-full flex flex-col items-center -mt-8 md:-mt-30">
        <div className="absolute top-30 left-0 w-full py-15 px-10 z-10 pointer-events-none flex flex-col justify-between top-content">
          <span className="title text-center z-10 block col-span-12">
            <BlurTextReveal
              as="span"
              html={`At the intersection of strategy, <br/>design, and technology.`}
              animationType="chars"
              stagger={0.05}
              className="block text-white uppercase"
            />
          </span>
          <span className="title  grid grid-cols-12 gap-6 w-full">
            <BlurTextReveal
              as="span"
              html={`We design and build digital experiences that scale, perform, and endure.`}
              animationType="chars"
              stagger={0.05}
              className="block text-dark-font uppercase col-span-10 col-start-2 max-w-60"
            />
          </span>
        </div>
        {/* Floating captions positioned relative to the container */}

        {/* <p
          className={`pointer-events-none absolute top-[8%] md:top-[10%] left-1/2 -translate-x-1/2 text-center text-[0.625rem] md:text-[0.688rem] tracking-[0.2em] uppercase text-black/85 leading-[1.55] whitespace-nowrap z-10 transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          AT THE INTERSECTION OF STRATEGY,
          <br />
          DESIGN, AND TECHNOLOGY.
        </p> */}

        {/* <p
          className={`pointer-events-none absolute top-[50%] md:top-[55%] left-[4%] md:left-[10%] text-[0.625rem] md:text-[0.688rem] tracking-[0.2em] uppercase text-black/85 leading-[1.6] max-w-[18ch] z-10 transition-opacity duration-1000 delay-150 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          WE DESIGN AND BUILD DIGITAL
          <br />
          EXPERIENCES THAT SCALE,
          <br />
          PERFORM, AND ENDURE.
        </p> */}

        {/* Lion — natural document flow, scales proportionally */}
        <div
          className={`relative z-1 w-full flex justify-center pointer-events-none transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative pointer-events-auto w-full flex justify-center">
            <AboutLion onLoad={() => setIsLoaded(true)}>
              {/* Bottom: marquee — sits ON TOP of the lion canvas, but BEHIND the strips */}
              <div
                className={`absolute bottom-[15%] md:bottom-[20%] left-0 right-0 z-1 w-full mix-blend-difference text-[#D8D8D8] pointer-events-none transition-opacity duration-1000 delay-300 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                <Marquee gap={0} speed={0.8}>
                  <div className="uppercase mrquee-text flex items-center">
                    <span className="marquee-text-item">Inspire</span>
                    {CROSS_ICON}
                    <span className="marquee-text-item">innovate</span>
                    {CROSS_ICON}
                    <span className="marquee-text-item">Impact</span>
                    {CROSS_ICON}
                  </div>
                </Marquee>
              </div>
            </AboutLion>
          </div>
        </div>
      </div>
    </section>
  );
}
