"use client";
import Marquee from "@/components/Marquee";
import StripeReveal from "@/components/StripeReveal";
import { BlurTextReveal } from "@/components/TextAnimation";

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
  return (
    <StripeReveal
      pinnedContent={
        <div
          id="s3-text"
          className="w-screen min-h-screen flex flex-col justify-between bg-transparent text-left overflow-hidden items-center py-37.5 text-light-font"
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

          <div className="relative z-3 flex-col flex justify-center items-start pointer-events-none py-20">
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
      }
      stripeCount={5}
      stripeColor="#D2D2D2"
      scrollEndTrigger="#keyfacts-section"
      scrollEnd="top center"
      staggerAmount={0.5}
      holdStart={0.1}
    />
  );
}
