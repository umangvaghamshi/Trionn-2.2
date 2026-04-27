"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Marquee from "@/components/Marquee";
import AboutLion from "./AboutLion";
import { BlurTextReveal } from "@/components/TextAnimation";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

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
  const splitTextRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!isLoaded) return;

    const split = new SplitText(splitTextRef.current, {
      type: "chars",
      aria: "none",
      charsClass: "chars",
      smartWrap: true,
      autoSplit: true,
    });

    gsap.fromTo(
      split.chars,
      { color: "rgba(216,216,216,0.1)" },
      { delay: 0.5, color: "#d8d8d8", stagger: 0.02, ease: "none" },
    );
  }, [isLoaded]);

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
    <section className="relative w-full bg-white text-black overflow-hidden flex flex-col items-center min-h-screen">
      {/* Top: heading */}
      <div className="relative z-20 pt-32 md:pt-40 px-6 md:px-10 w-full mix-blend-difference title-block pointer-events-none">
        <h1
          ref={splitTextRef}
          className="text-center mx-auto max-w-342 text-[rgba(216,216,216,0.1)]"
        >
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
              animationType="words"
              stagger={0.5}
              className="block text-white uppercase"
            />
          </span>
        </div>

        {/* Lion — natural document flow, scales proportionally */}
        <div
          className={`relative w-full flex justify-center pointer-events-none transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative pointer-events-auto w-full flex justify-center items-end">
            <AboutLion onLoad={() => setIsLoaded(true)}>
              {/* Bottom: marquee — sits ON TOP of the lion canvas, but BEHIND the strips */}
              <div
                className={`absolute bottom-[15%] md:bottom-[20%] left-0 right-0 z-1 w-full text-[#D8D8D8] mix-blend-difference pointer-events-none transition-opacity duration-1000 delay-300 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="tr__container grid grid-cols-12 gap-x mb-25">
                  <BlurTextReveal
                    as="span"
                    html={`We design and build digital experiences that scale, perform, and endure.`}
                    animationType="chars"
                    stagger={0.05}
                    className="block title col-span-10 col-start-2  max-w-60"
                  />
                </div>
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
