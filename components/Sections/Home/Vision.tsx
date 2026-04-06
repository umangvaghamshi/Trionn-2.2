"use client";
import Marquee from "@/components/Marquee";
import { BlurTextReveal } from "@/components/TextAnimation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import KeyFacts from "./KeyFacts";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CROSS_ICON = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-[4.582vw] w-[2.291vw] h-[2.291vw]"
  >
    <line
      x1="20.2256"
      y1="-2.18557e-08"
      x2="20.2256"
      y2="40"
      stroke="#D8D8D8"
    />
    <line x1="40" y1="20.226" x2="-4.37114e-08" y2="20.226" stroke="#D8D8D8" />
  </svg>
);

export default function Vision() {
  const bannerBottomBlock = useRef<HTMLDivElement | null>(null);
  const stripes = useRef<HTMLDivElement[]>([]);
  const keyFactsRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    if (!bannerBottomBlock.current || stripes.current.length === 0) return;

    gsap.set(stripes.current, { scaleY: 0, transformOrigin: "bottom" });
    // Start KeyFacts exactly one viewport below so it slides up into view
    gsap.set(keyFactsRef.current, { y: "100%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bannerBottomBlock.current,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
      },
    });

    tl.to(stripes.current, {
      scaleY: 1,
      stagger: { amount: 0.5, from: "end" },
      ease: "none",
    }).to(
      keyFactsRef.current,
      {
        duration: 1,
        y: "-20%",
        ease: "none",
      },
      "<15%",
    );
  }, []);

  return (
    <section className="relative overflow-visible">
      <div
        className="w-full min-h-screen z-20 mix-blend-difference relative overflow-visible"
        ref={bannerBottomBlock}
      >
        <div
          id="s3-text"
          className="w-screen min-h-screen flex flex-col justify-center bg-transparent text-left overflow-hidden items-center py-37.5 pb-20 text-light-font"
        >
          <div className="tr__container w-full grid grid-cols-12 grid-rows-1 gap-x-6">
            <BlurTextReveal
              as="span"
              html={`Focused vision. <br/>Measured execution.`}
              animationType="chars"
              stagger={0.05}
              className="title z-3 col-start-2 col-span-11"
            />
          </div>

          <div className="relative z-3 flex-col flex justify-center items-start pointer-events-none pt-40 pb-20">
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

          <div className="tr__container w-full grid grid-cols-12 grid-rows-1 gap-x-6 pb-10">
            <BlurTextReveal
              as="span"
              html={`✦ From idea to outcome.`}
              animationType="chars"
              stagger={0.05}
              className="title z-3 col-span-12 text-center"
            />
          </div>
        </div>

        {/* Stripe overlay */}
        <div className="stripes-container absolute inset-0 pointer-events-none flex flex-col w-full h-screen z-30">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              ref={(self) => {
                stripes.current[index] = self!;
              }}
              className="stripe-item bg-[#D2D2D2] w-full flex-1"
            />
          ))}
        </div>
        <div
          id="keyfacts-section"
          ref={keyFactsRef}
          className="absolute top-0 left-0 w-full z-40"
        >
          <KeyFacts />
        </div>
      </div>
    </section>
  );
}
