"use client";

import LinePlus from "@/components/LinePlus";
import TeamSection from "@/components/TeamSection";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutTeam() {
  return (
    <section className="bg-[#040508]">
      <div className="tr__container relative w-full text-light-font flex flex-col">
        <div className="min-h-dvh flex flex-col justify-center items-center py-37.5 gap-20">
          <div className="grid grid-cols-12 gap-x-6 w-full">
            <BlurTextReveal
              as="h2"
              text="Different"
              animationType="chars"
              stagger={0.08}
              className="mrquee-text leading-[0.8]! uppercase z-2 col-span-12 md:col-span-11 md:col-start-2 whitespace-nowrap"
            />
            <BlurTextReveal
              as="h2"
              text="skills. One"
              animationType="chars"
              stagger={0.08}
              className="mrquee-text leading-[0.8]! uppercase z-2 col-span-12 md:col-span-8 md:col-start-4 whitespace-nowrap text-center md:text-left"
            />
            <BlurTextReveal
              as="h2"
              text="standard."
              animationType="chars"
              stagger={0.08}
              className="mrquee-text leading-[0.8]! uppercase z-2 col-span-12 md:col-span-6 md:col-start-7 whitespace-nowrap text-right md:text-left"
            />
            <div className="relative col-span-12 lg:col-span-8 lg:col-start-4 max-w-[20rem] mt-10 lg:mt-0 mx-auto lg:mx-0 text-center lg:text-left">
              <BlurTextReveal
                as="span"
                text="A collective shaped by shared standards, not job titles."
                animationType="words"
                stagger={0.08}
                className="title uppercase z-2 lg:absolute lg:-translate-y-full block"
              />
            </div>
          </div>
          <div className="block lg:hidden">
            <WordShiftButton
              text="Join the team?"
              href="/contact"
              styleVars={{ buttonWrapperColor: "#D8D8D8" }}
            />
          </div>
        </div>
        <LinePlus
          lineClass={"bg-[#2F323B] left-1/2! -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto"}
          iconColor={"#D8D8D8"}
        />
        <div className="pt-25 flex flex-col items-center text-center gap-6">
          <BlurTextReveal
            as="h2"
            text="Our team"
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
    </section>
  );
}
