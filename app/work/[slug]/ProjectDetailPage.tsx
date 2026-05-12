"use client";
import parser from "html-react-parser";
import React, { useRef } from "react";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";
import LinePlus from "@/components/LinePlus";
import { Tabs } from "@/components/Tabs";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/Transition";
import { HoverBlur } from "@/components/TextAnimation";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetailPage({
  project,
  prevProject,
  nextProject,
}: {
  project: any;
  prevProject?: any;
  nextProject?: any;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = React.useState(project.tabs?.[0]?.id || "");

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

        if (!project.tabs || project.tabs.length === 0) return;
        project.tabs.forEach((tab: any, i: number) => {
          ScrollTrigger.create({
            trigger: rightColRef.current,
            // We use refresh() logic to ensure height is calculated after images load
            start: () =>
              `top+=${(i * (rightColRef.current?.offsetHeight || 0)) / project.tabs.length} top`,
            end: () =>
              `top+=${((i + 1) * (rightColRef.current?.offsetHeight || 0)) / project.tabs.length} top`,
            onToggle: (self) => {
              if (self.isActive) setActiveTab(tab.id);
            },
          });
        });
      });

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => {
        mm.revert();
        clearTimeout(timer);
      };
    },
    { scope: containerRef, dependencies: [project.tabs] },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#171717] z-3 overflow-hidden text-light-font"
    >
      <div className="tr__container grid grid-cols-12 gap-6 relative">
        <div className="grid grid-cols-12 gap-6 col-span-12">
          <div
            className="col-span-12 lg:col-span-5 xl:col-span-4 pt-25 lg:pt-37.5 pb-10 lg:pb-25 flex flex-col justify-between gap-8 lg:gap-10 lg:min-h-dvh max-h-dvh left-block project-detail-content"
            ref={leftColRef}
          >
            <div className="title-block flex flex-col relative">
              <div className="fixed lg:absolute left-0 max-lg:bottom-16 lg:top-0 lg:-translate-y-full w-full px-6 md:px-10 lg:px-0 z-2 project-navigation">
                <div className="flex justify-between">
                  {prevProject ? (
                    <TransitionLink
                      className="navigation-link title block text-light-font lg:mb-4"
                      href={`/work/${prevProject.slug}`}
                      transitionLabel="Prev"
                    >
                      <HoverBlur>Prev project</HoverBlur>
                    </TransitionLink>
                  ) : (
                    <TransitionLink
                      className="navigation-link title block text-light-font lg:mb-4"
                      href="/work"
                      transitionLabel="Back"
                    >
                      <HoverBlur>Back to work</HoverBlur>
                    </TransitionLink>
                  )}
                  {nextProject && (
                    <TransitionLink
                      className="navigation-link title block text-light-font lg:mb-4 ml-auto"
                      href={`/work/${nextProject.slug}`}
                      transitionLabel="Next"
                    >
                      <HoverBlur>Next project</HoverBlur>
                    </TransitionLink>
                  )}
                </div>
              </div>
              <LinePlus lineClass={"bg-cream-line/20"} plusClass={"hidden"} />
              <div className="flex flex-row justify-between mt-6 lg:mt-10 mb-4 gap-2">
                <BlurTextReveal
                  as="h1"
                  html={project.title}
                  animationType="chars"
                  stagger={0.08}
                  className="text-4xl! leading-none! -tracking-[0.04em]!"
                />
                <p className="text-light-font/60 small">{project.year}</p>
              </div>
              <p className="small text-light-font/60 lg:max-w-75">
                {parser(
                  Array.isArray(project.subTitle)
                    ? project.subTitle.join("")
                    : project.subTitle,
                )}
              </p>
              <ul className="mt-6 lg:mt-10">
                {project.category.map((cat: string, i: number) => (
                  <li key={i}>{cat}</li>
                ))}
              </ul>
            </div>
            {project.tabs && (
              <Tabs
                tabs={project.tabs}
                activeTabId={activeTab}
                onTabChange={setActiveTab}
                className="lg:max-w-135"
              />
            )}
            <WordShiftButton
              text="view live"
              href={project.liveURL}
              styleVars={{ buttonWrapperColor: "#D8D8D8" }}
            />
          </div>
          <div
            className="col-span-12 lg:col-span-7 xl:col-span-8 pt-0 lg:pt-37.5 pb-20 lg:pb-25 grid grid-cols-2 gap-6 right-block"
            ref={rightColRef}
          >
            {project.content.map((item: any, index: number) => (
              <div
                key={index}
                className={`${
                  item.layout === "single"
                    ? "col-span-2"
                    : "col-span-2 sm:col-span-1"
                }`}
              >
                <img
                  src={item.image}
                  alt={`${project.title} - ${index}`}
                  className="w-full h-auto object-cover rounded-sm"
                />
              </div>
            ))}
          </div>
        </div>
        {/* <LinePlus
          lineClass={"bg-[#2F323B] left-1/2! -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto"}
          iconColor={"#D8D8D8"}
        /> */}
      </div>
    </section>
  );
}
