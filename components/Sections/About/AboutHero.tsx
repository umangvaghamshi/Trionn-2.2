"use client";

import { useEffect, useRef, useState } from "react";
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
    className="mx-10 lg:mx-16 w-6 lg:w-8 h-6 lg:h-8 mt-2"
    aria-hidden
  >
    <line
      x1="20.2256"
      y1="-2.18557e-08"
      x2="20.2256"
      y2="40"
      stroke="currentColor"
    />
    <line
      x1="40"
      y1="20.226"
      x2="-4.37114e-08"
      y2="20.226"
      stroke="currentColor"
    />
  </svg>
);

export default function AboutHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const splitTextRef = useRef<HTMLHeadingElement>(null);
  const clipInnerRef = useRef<HTMLDivElement>(null);

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

  // Clip the white top of lion-mobile.png so the lion fur appears flush
  // against the "At the intersection" text above, with no white gap.
  useEffect(() => {
    const MOBILE_IMG_W = 660;
    const MOBILE_IMG_H = 1434;
    const CLIP_RATIO = 0.272;

    const applyClip = () => {
      if (!clipInnerRef.current) return;
      if (window.innerWidth > 768) {
        clipInnerRef.current.style.marginTop = "";
        return;
      }
      const cw = Math.min(window.innerWidth, MOBILE_IMG_W);
      const ch = Math.round(MOBILE_IMG_H * (cw / MOBILE_IMG_W));
      clipInnerRef.current.style.marginTop = `-${Math.round(ch * CLIP_RATIO)}px`;
    };

    applyClip();
    window.addEventListener("resize", applyClip);
    return () => window.removeEventListener("resize", applyClip);
  }, []);

  useGSAP(() => {
    const updateHeight = () => {
      const titleBlock = document.querySelector(".title-block") as HTMLElement;
      const topContent = document.querySelector(".top-content") as HTMLElement;

      if (titleBlock && topContent) {
        if (window.innerWidth >= 768) {
          const availableHeight = window.innerHeight - titleBlock.offsetHeight;
          gsap.set(topContent, { height: availableHeight });
        }
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <section className="relative w-full bg-white text-black overflow-hidden flex flex-col items-center">
      {/* Top: heading */}
      <div className="relative z-20 pt-25 md:pt-40 px-6 md:px-10 w-full mix-blend-difference title-block pointer-events-none">
        <h1
          ref={splitTextRef}
          className="text-center mx-auto max-w-342 text-[rgba(216,216,216,0.1)]"
        >
          We are an independent digital studio built on clarity, thoughtful
          craft, and trust earned worldwide.
        </h1>
      </div>

      {/* Mobile: "At the intersection" sits in normal flow directly above the
          lion. With the top clip applied, the lion fur appears flush below. */}
      <div className="md:hidden w-full px-10 pt-8 md:mt-4 pb-0 pointer-events-none mix-blend-difference z-10">
        <span className="title text-center block">
          <BlurTextReveal
            as="span"
            html={`At the intersection of strategy, <br/>design, and technology.`}
            animationType="words"
            stagger={0.5}
            className="block text-white uppercase"
          />
        </span>
      </div>

      {/* Lion and Marquee container — no mobile negative margin so the
          clipped canvas top aligns exactly with the text above. */}
      <div className="relative w-full flex flex-col items-center mt-12 md:-mt-30">
        {/* Desktop only: absolute overlay with "At the intersection" text + height spacer */}
        <div className="top-content hidden md:flex absolute top-30 left-0 w-full py-15 px-10 z-10 pointer-events-none flex-col justify-between">
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
        <div className="tr__container grid grid-cols-12 absolute top-[66%] sm:top-[76%] md:top-[50%] w-full z-5 translate-y-full pointer-events-none">
          <BlurTextReveal
            as="span"
            text={`We design and build digital experiences that scale, perform, and endure.`}
            animationType="chars"
            stagger={0.02}
            className="block title col-span-12 md:col-span-10 md:col-start-2 max-w-60"
          />
        </div>

        {/* Lion — overflow-hidden clips the white top of lion-mobile.png on mobile */}
        <div
          className={`relative w-full overflow-hidden md:overflow-visible transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <div ref={clipInnerRef} className="md:mt-0 w-full">
            <div className="relative pointer-events-auto w-full flex justify-center items-end">
              <AboutLion onLoad={() => setIsLoaded(true)}>
                {/* Marquee — inside lion canvas, behind curtain strips */}
                <div
                  className={`absolute bottom-[2%] md:bottom-[20%] left-0 right-0 z-[1] w-full text-[#D8D8D8] mix-blend-difference pointer-events-none transition-opacity duration-1000 delay-300 ${
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
      </div>
    </section>
  );
}
