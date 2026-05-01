"use client";
import { BlurTextReveal } from "@/components/TextAnimation";
import LinePlus from "@/components/LinePlus";
import { faqData } from "@/data";
import TechAccordion from "@/components/TechAccordion";

export default function Technology() {
  return (
    <section className="py-37.5 bg-white">
      <div className="tr__container relative w-full text-dark-font flex flex-col">
        <div className="grid grid-cols-12 gap-x-6 pb-37.5">
          <BlurTextReveal
            as="h2"
            text="technology"
            animationType="chars"
            stagger={0.08}
            className="mrquee-text leading-[0.8]! uppercase z-2 col-span-10 col-start-3"
          />
          <BlurTextReveal
            as="h2"
            text="stack"
            animationType="chars"
            stagger={0.08}
            className="mrquee-text leading-[0.8]! uppercase z-2 col-span-5 col-start-8"
          />
          <BlurTextReveal
            as="span"
            text="Built with performance-first, scalable front-end architecture."
            animationType="words"
            stagger={0.08}
            className="title z-2 col-span-8 col-start-5 max-w-70 -translate-y-full block"
          />
        </div>
        <LinePlus
          customClass={""}
          lineClass={"opacity-15 bg-grey-line"}
          plusClass={"col-span-8 col-start-5 -translate-x-1/2"}
          iconColor={"#272727"}
        />
        <TechAccordion items={faqData} customClass={"tech-faq"} />
      </div>
    </section>
  );
}
