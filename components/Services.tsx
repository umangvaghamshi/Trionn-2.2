"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import parse from "html-react-parser";
import { BlurTextReveal } from "@/components/TextAnimation";
import LinePlus from "@/components/LinePlus";
import { ServicesListData } from "@/data";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const serviceListRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[] | []>([]);

  useGSAP(
    () => {
      cardsRef.current.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          endTrigger: cardsRef.current[cardsRef.current.length - 1],
          anticipatePin: 1,
          start: `top top`,
          end: "top top",
          pinSpacing: false,
          pin: true,
        });
      });
    },
    {
      scope: serviceListRef,
    },
  );

  return (
    <section className="relative text-dark-font bg-white">
      <div className="services-list flex flex-col group" ref={serviceListRef}>
        {ServicesListData.map((service, index) => (
          <div
            className="services-item min-h-screen flex w-full relative z-2 bg-white"
            ref={(self) => {
              if (self && cardsRef.current) {
                cardsRef.current[index] = self;
              }
            }}
            key={index}
          >
            <LinePlus
              customClass={"absolute! top-0 left-0 -translate-y-1/2 w-full"}
              lineClass={"opacity-15 bg-grey-line left-1/2 -translate-x-1/2"}
              plusClass={"col-span-12 mx-auto translate-x-0"}
              iconColor={"#272727"}
            />
            <div className="flex w-full">
              <div
                className={`image-block w-1/2 py-37.5 px-20 text-center flex flex-col items-center justify-center border-r border-grey-line/15 ${
                  index % 2 !== 0 ? "bg-[#040508] text-light-font" : ""
                }`}
              >
                <BlurTextReveal
                  as="span"
                  html={service.subText}
                  animationType="chars"
                  stagger={0.05}
                  className="title block mb-12"
                />
                <Image
                  src={service.imgUrl}
                  className="mx-auto max-w-176"
                  width={704}
                  height={457}
                  alt="service"
                />
              </div>
              <div className="content-block w-1/2 py-37.5 grid grid-cols-6 gap-x-6">
                <div className="flex flex-col h-full col-span-4 col-start-2">
                  <div className="service-title-block mb-25">
                    <BlurTextReveal
                      as="h3"
                      html={service.title}
                      animationType="chars"
                      stagger={0.05}
                      className="service-title mb-10 text-[3.5rem]! leading-10.5! -tracking-[0.04em]!"
                    />
                    <p className="small max-w-99">
                      {parse(service.description)}
                    </p>
                  </div>
                  <div className="service-info max-w-99">
                    <BlurTextReveal
                      as="span"
                      html="Our Core Capabilities"
                      animationType="chars"
                      stagger={0.05}
                      className="title block mb-10 opacity-60!"
                    />
                    <div className="service-info-list">
                      {service.capabilities.map((capability, index) => (
                        <React.Fragment key={index}>
                          <div className="service-info-item text-black py-4 first:pt-0 last:pb-0">
                            <p>{capability.capabilitiesItem}</p>
                          </div>
                          <LinePlus
                            customClass="last:hidden"
                            lineClass={"bg-dark-font"}
                            plusClass={"hidden"}
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
      <div className="py-25 relative">
        <LinePlus
          customClass={"absolute! top-0 left-0 -translate-y-1/2 w-full"}
          lineClass={"opacity-15 bg-grey-line left-1/2 -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto translate-x-0"}
          iconColor={"#272727"}
        />
        <BlurTextReveal
          as="span"
          html="✦ Services are outputs. Systems are outcomes."
          animationType="chars"
          stagger={0.05}
          className="title block text-center"
        />
        <LinePlus
          customClass={"absolute! bottom-0 left-0 translate-y-1/2 w-full"}
          lineClass={"opacity-15 bg-grey-line left-1/2 -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto translate-x-0"}
          iconColor={"#272727"}
        />
      </div>
    </section>
  );
}
