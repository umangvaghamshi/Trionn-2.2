"use client";
import LinePlus from "@/components/LinePlus";
import { BlurTextReveal } from "@/components/TextAnimation";
import { BlurTextRevealHandle } from "@/components/TextAnimation/BlurTextReveal";
import { ServicesListData } from "@/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import parse from "html-react-parser";
import Image from "next/image";
import React, { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const serviceListRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const [tlComplted, setTlComplted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Per-card blur refs: [cardIndex][0=subText, 1=title, 2=capabilities label]
  const blurRefs = useRef<(BlurTextRevealHandle | null)[][]>(
    ServicesListData.map(() => [null, null, null]),
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        setIsDesktop(true);
        const cards = cardsRef.current;
        if (!cards.length || !sectionRef.current) return;

        const totalCards = cards.length;

        // Set initial states for stacking effect
        gsap.set(cards[0], { yPercent: 0 });
        cards.slice(1).forEach((card) => gsap.set(card, { yPercent: 100 }));

        const played = new Array(totalCards).fill(false);
        const playCard = (i: number) => {
          if (played[i]) return;
          played[i] = true;
          blurRefs.current[i]?.forEach((ref) => ref?.play());
        };

        const tl = gsap.timeline({
          onComplete: () => setTlComplted(true),
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.2 * cards.length}`,
            scrub: true,
            pin: serviceListRef.current,
            pinSpacing: true,
            anticipatePin: 0.5,
          },
          defaults: { ease: "none" },
        });

        // Initial pause/buffer
        tl.to({}, { duration: 0.5 });

        cards.forEach((card, i) => {
          if (i === 0) return;

          const lines = card.querySelectorAll(".service-info-list .line");
          const plusIcon = card.querySelectorAll(".services-item .plus-icon");
          const prevContentBlock = cards[i - 1].querySelector(".content-block");

          gsap.set(lines, { scaleX: 0, transformOrigin: "left" });

          const startPosition = "<0.2";

          tl.to(card, { yPercent: 0, duration: 1 })
            .to(plusIcon, { rotation: "+=360", duration: 1 }, "<")
            .to(prevContentBlock, { yPercent: -100, duration: 1 }, "<")
            .call(() => playCard(i), undefined, startPosition)
            .call(
              () => {
                gsap.to(lines, { scaleX: 1, stagger: 0.08 });
              },
              undefined,
              startPosition,
            );

          tl.to({}, { duration: 0.5 });
        });

        return () => setIsDesktop(false);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="relative text-dark-font bg-white md:min-h-dvh z-31"
      >
        <div
          className="services-list min-h-fit md:min-h-dvh relative flex flex-col group"
          ref={serviceListRef}
        >
          {ServicesListData.map((service, index) => (
            <div
              className="services-item min-h-fit md:min-h-dvh flex w-full relative md:absolute z-2 bg-white"
              ref={(self) => {
                if (self) cardsRef.current[index] = self;
              }}
              key={index}
            >
              <LinePlus
                customClass={"absolute! top-0 left-0 -translate-y-1/2 w-full"}
                lineClass={"opacity-15 bg-grey-line left-1/2 -translate-x-1/2"}
                plusClass={"col-span-12 mx-auto plus-icon"}
                iconColor={"#272727"}
                scrub={false}
              />
              <div className="flex flex-col md:flex-row w-full">
                {/* Image / Subtext Block */}
                <div
                  className={`image-block w-full md:w-1/2 pt-20 md:py-20 lg:py-37.5 px-6 md:px-10 lg:px-20 text-center flex flex-col items-center justify-center border-r border-grey-line/15 ${
                    index % 2 !== 0
                      ? "md:bg-[#040508] md:text-light-font text-dark-font"
                      : ""
                  }`}
                >
                  <BlurTextReveal
                    {...(index > 0 && isDesktop
                      ? {
                          ref: (el: BlurTextRevealHandle | null) => {
                            blurRefs.current[index][0] = el;
                          },
                          manual: true,
                        }
                      : { manual: false })}
                    as="span"
                    html={service.subText}
                    animationType="chars"
                    stagger={0.02}
                    className="title block mb-12"
                  />
                  <Image
                    src={service.imgUrl}
                    className="mx-auto w-full max-w-176"
                    width={704}
                    height={457}
                    alt="service"
                  />
                </div>

                {/* Content Block */}
                <div className="content-block w-full md:w-1/2 pt-16 pb-20 md:py-20 lg:py-37.5 grid grid-cols-6 gap-x-6 px-6 md:px-10 lg:px-0">
                  <div className="flex flex-col h-full col-span-6 lg:col-span-5 xl:col-span-4 lg:col-start-2 xl:col-start-2 justify-center">
                    <div className="service-title-block mb-10 md:mb-16 lg:mb-25">
                      <BlurTextReveal
                        {...(index > 0 && isDesktop
                          ? {
                              ref: (el: BlurTextRevealHandle | null) => {
                                blurRefs.current[index][1] = el;
                              },
                              manual: true,
                            }
                          : { manual: false })}
                        as="h3"
                        text={service.title}
                        animationType="chars"
                        stagger={0.02}
                        className="service-title mb-10 text-[3.5rem]! leading-10.5! -tracking-[0.04em]!"
                        waitForTransition={false}
                      />
                      <p className="small max-w-99">
                        {parse(service.description)}
                      </p>
                    </div>

                    <div className="service-info md:max-w-99">
                      <BlurTextReveal
                        {...(index > 0 && isDesktop
                          ? {
                              ref: (el: BlurTextRevealHandle | null) => {
                                blurRefs.current[index][2] = el;
                              },
                              manual: true,
                            }
                          : { manual: false })}
                        as="span"
                        text="Our Core Capabilities"
                        animationType="chars"
                        stagger={0.05}
                        className="title block mb-10 opacity-60!"
                        waitForTransition={false}
                      />
                      <div className="service-info-list">
                        {service.capabilities.map((capability, idx) => (
                          <React.Fragment key={idx}>
                            <div className="service-info-item text-black py-4 first:pt-0 last:pb-0">
                              <p>{capability.capabilitiesItem}</p>
                            </div>
                            <LinePlus
                              customClass="last:hidden"
                              lineClass={"bg-dark-font"}
                              plusClass={"hidden plus-icon"}
                              scrub={false}
                            />
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="pb-20 md:py-25 relative z-31">
          <BlurTextReveal
            as="span"
            text="✦ Services are outputs. Systems are outcomes."
            animationType="chars"
            stagger={0.05}
            className="title block text-center"
          />
          {/* Only show line if timeline completed on desktop, or always on mobile */}
          {(tlComplted || !isDesktop) && (
            <LinePlus
              customClass={"absolute! bottom-0 left-0 translate-y-1/2 w-full"}
              lineClass={"opacity-15 bg-grey-line left-1/2 -translate-x-1/2"}
              plusClass={"col-span-12 mx-auto"}
              iconColor={"#272727"}
            />
          )}
        </div>
      </section>
    </>
  );
}
