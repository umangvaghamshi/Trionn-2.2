"use client";

import React, { useRef } from "react";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";
import LinePlus from "@/components/LinePlus";
import { Tabs } from "@/components/Tabs";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetailPage({ project }: { project: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Only pin on desktop screens
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: leftColRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#262623] z-3 overflow-hidden text-light-font"
    >
      <div className="tr__container flex flex-col justify-between">
        <div className="grid grid-cols-12 gap-6">
          <div
            className="col-span-4 py-37.5 flex flex-col justify-between gap-10 min-h-screen max-h-screen"
            ref={leftColRef}
          >
            <div className="title-block flex flex-col">
              <LinePlus lineClass={"bg-cream-line/20"} plusClass={"hidden"} />
              <div className="flex flex-col sm:flex-row justify-between mt-10 mb-4">
                <BlurTextReveal
                  as="h1"
                  html={project.title}
                  animationType="chars"
                  stagger={0.08}
                  className="h3"
                />
                <p className="text-light-font/60 small">{project.year}</p>
              </div>
              <p className="small max-w-100 text-light-font/60">
                {project.subTitle}
              </p>
              <ul className="mt-10 list-disc pl-4">
                {project.category.map((cat: string, i: number) => (
                  <li key={i}>{cat}</li>
                ))}
              </ul>
            </div>
            <Tabs tabs={project.tabs} className="max-w-100" />
            <WordShiftButton
              text="view live"
              href={project.liveURL}
              styleVars={{ buttonWrapperColor: "#D8D8D8" }}
            />
          </div>
          <div className="col-span-12 lg:col-span-8 py-20 grid grid-cols-2 gap-6">
            {project.content.map((item: any, index: number) => (
              <div
                key={index}
                className={`${
                  item.layout === "single" ? "col-span-2" : "col-span-1"
                }`}
              >
                <img
                  src={item.image}
                  alt={`${project.title} - ${index}`}
                  className="w-full h-auto object-cover rounded-sm"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
