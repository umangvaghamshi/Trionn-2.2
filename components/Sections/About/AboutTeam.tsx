"use client";

import { WordShiftButton } from "@/components/Button";
import LinePlus from "@/components/LinePlus";
import { BlurTextReveal } from "@/components/TextAnimation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TeamSection from "@/components/TeamSection";

gsap.registerPlugin(ScrollTrigger);

export default function AboutTeam() {
  return (
    <section className="bg-[#040508]">
      <div className="tr__container relative w-full text-light-font flex flex-col">
        <div className="min-h-screen flex flex-col justify-center py-37.5">
          <div className="grid grid-cols-12 gap-x-6 ">
            <BlurTextReveal
              as="h2"
              html="Different"
              animationType="chars"
              stagger={0.08}
              className="mrquee-text leading-[0.8]! uppercase z-2 col-span-11 col-start-2"
            />
            <BlurTextReveal
              as="h2"
              html="skills. One"
              animationType="chars"
              stagger={0.08}
              className="mrquee-text leading-[0.8]! uppercase z-2 col-span-10 col-start-4"
            />
            <BlurTextReveal
              as="h2"
              html="standard."
              animationType="chars"
              stagger={0.08}
              className="mrquee-text leading-[0.8]! uppercase z-2 col-span-6 col-start-7"
            />
            <div className="relative col-span-8 col-start-4 max-w-[16rem]">
              <BlurTextReveal
                as="span"
                html="A collective shaped by shared standards, not job titles."
                animationType="words"
                stagger={0.08}
                className="title uppercase z-2 absolute -translate-y-full block"
              />
            </div>
          </div>
        </div>
        <LinePlus
          lineClass={"opacity-25 bg-cream-line left-1/2! -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto translate-x-0!"}
          iconColor={"#D8D8D8"}
        />
        <div className="pt-25 flex flex-col items-center text-center gap-6">
          <BlurTextReveal
            as="h2"
            html="Our team"
            animationType="chars"
            stagger={0.08}
          />
          <p className="max-w-86 small">
            Let&apos;s give it up for our designers, coders, and strategists who
            make it all happen!
          </p>
        </div>
      </div>
      <TeamSection />
      <div className="tr__container relative w-full text-light-font flex flex-col">
        <div className="pb-37.5 flex flex-col items-center">
          <WordShiftButton
            text="Join the team?"
            href="#"
            styleVars={{ buttonWrapperColor: "#D8D8D8" }}
          />
        </div>
      </div>
    </section>
  );
}
