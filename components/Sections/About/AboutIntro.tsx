"use client";

import { WordShiftButton } from "@/components/Button";
import LinePlus from "@/components/LinePlus";
import MagneticLinePlus from "@/components/MagneticLinePlus";
import { BlurTextReveal } from "@/components/TextAnimation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutIntro() {
  return (
    <section className="relative w-full pb-37.5 bg-white z-3 overflow-hidden text-dark-font">
      <div className="tr__container  flex flex-col justify-between">
        <div className="title-block grid grid-cols-12 gap-x-6">
          <div className="col-span-11 col-start-2 mb-10">
            <BlurTextReveal
              as="span"
              html={`At Trionn,`}
              animationType="chars"
              stagger={0.05}
              className="title block mb-4"
            />
            <h3 className="max-w-167.5 w-full">
              We build teams around ideas. Each project is led by designers,
              engineers, and specialists chosen specifically for the challenge
              at hand.
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 my-25">
          <div className="col-span-11 col-start-2">
            <MagneticLinePlus plusCol={9.2} totalCols={12} lineColor="#434343" plusColor="#272727" plusHalfSize={6} bgColor="white" />
          </div>
        </div>
         
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-11 col-start-2 grid grid-cols-12 gap-x-6 grid-rows-1">
            <div className="left-block grid grid-cols-3 gap-x-6 col-span-3 align-top">
              <div className="col-span-1">
                <BlurTextReveal
                  as="span"
                  html={`Est. 2012 —`}
                  animationType="chars"
                  stagger={0.05}
                  className="title block bg-cream py-1.5 px-2 rounded-sm"
                />
              </div>
              <BlurTextReveal
                as="span"
                html={`13+ years <br/>shaping digital <br/>direction.`}
                animationType="chars"
                stagger={0.02}
                className="title block col-span-2"
              />
            </div>
            <div className="left-block flex flex-col col-span-3 col-start-9">
              <p className="mb-18 max-w-98">
                We&apos;ve grown through experimentation, learning, and
                refinement — shaping a practice focused on clarity, craft, and
                long-term impact.
                <br />
                <br />
                Today, we partner with startups and global brands to design
                digital products, platforms, and systems that scale with purpose
                — and endure.
              </p>
              <WordShiftButton text="let's connect" href="#" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
