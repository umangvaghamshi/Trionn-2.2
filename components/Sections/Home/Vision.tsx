"use client";
import { BlurTextReveal } from "@/components/TextAnimation";
import Marquee from "@/components/Marquee";

export default function Vision() {
  return (
    <section className=" ">
      <div
        id="s3-text"
        className="w-screen h-screen relative z-20 flex flex-col justify-center bg-transparent text-left  overflow-hidden items-center py-37.5 pb-20 mix-blend-difference text-light-font"
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
        <div
          className="relative z-3 flex-col flex justify-center items-start pointer-events-none pt-40 pb-20"
          id="s3-marquee"
        >
          <div className="w-full overflow-hidden">
            <div
              id="marquee-track"
              className="flex items-center gap-0 whitespace-nowrap will-change-transform mrquee-text uppercase"
            >
              <span className="marquee-text-item">Inspire</span>
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
                <line
                  x1="40"
                  y1="20.226"
                  x2="-4.37114e-08"
                  y2="20.226"
                  stroke="#D8D8D8"
                />
              </svg>
              <span className="marquee-text-item">Innovate</span>
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
                <line
                  x1="40"
                  y1="20.226"
                  x2="-4.37114e-08"
                  y2="20.226"
                  stroke="#D8D8D8"
                />
              </svg>
              <span className="marquee-text-item">Impact</span>
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
                <line
                  x1="40"
                  y1="20.226"
                  x2="-4.37114e-08"
                  y2="20.226"
                  stroke="#D8D8D8"
                />
              </svg>
              <span className="marquee-text-item">Inspire</span>
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
                <line
                  x1="40"
                  y1="20.226"
                  x2="-4.37114e-08"
                  y2="20.226"
                  stroke="#D8D8D8"
                />
              </svg>
              <span className="marquee-text-item">Innovate</span>
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
                <line
                  x1="40"
                  y1="20.226"
                  x2="-4.37114e-08"
                  y2="20.226"
                  stroke="#D8D8D8"
                />
              </svg>
              <span className="marquee-text-item">Impact</span>
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
                <line
                  x1="40"
                  y1="20.226"
                  x2="-4.37114e-08"
                  y2="20.226"
                  stroke="#D8D8D8"
                />
              </svg>
            </div>
          </div>
        </div>
        <div
          className="tr__container w-full grid grid-cols-12 grid-rows-1 gap-x-6 pb-10"
          id="s3-bottom-text"
        >
          <BlurTextReveal
            as="span"
            html={`✦ From idea to outcome.`}
            animationType="chars"
            stagger={0.05}
            className="title z-3 col-span-12 text-center"
          />
        </div>
      </div>
    </section>
  );
}
