'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import parse from 'html-react-parser';
import { BlurTextReveal } from '@/components/TextAnimation';
import LinePlus from '@/components/LinePlus';
import Marquee from '@/components/Marquee';
import { ServicesListData } from '@/data';

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
          end: 'top top',
          pinSpacing: false,
          pin: true,
        });
      });
    },
    {
      scope: serviceListRef,
    }
  );

  return (
    <section className="relative text-dark-font">
      <div className="pt-37.5 pb-25">
        <Marquee gap={0} speed={0.8}>
          <div className="uppercase mrquee-text flex items-center">
            <span className="marquee-text-item">services</span>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-[4.582vw] w-[2.291vw] h-[2.291vw]"
            >
              <line x1="20.2256" y1="-2.18557e-08" x2="20.2256" y2="40" stroke="#434343" />
              <line x1="40" y1="20.226" x2="-4.37114e-08" y2="20.226" stroke="#434343" />
            </svg>
          </div>
        </Marquee>
        <div className="tr__container relative w-full text-center pt-20">
          <p>Capabilities shaped to scale with ambition.</p>
        </div>
      </div>
      <div className="services-list flex flex-col" ref={serviceListRef}>
        {ServicesListData.map((service, index) => (
          <div
            className="services-item min-h-screen flex w-full relative group z-2 bg-white"
            ref={(self) => {
              if (self && cardsRef.current) {
                cardsRef.current[index] = self;
              }
            }}
            key={index}
          >
            <LinePlus
              customClass={'absolute! top-0 left-0 -translate-y-1/2 w-full'}
              lineClass={'opacity-15 bg-grey-line left-1/2 -translate-x-1/2'}
              plusClass={'col-span-12 mx-auto translate-x-0'}
              iconColor={'#272727'}
            />
            <div className="flex w-full">
              <div className="image-block w-1/2 py-37.5 px-20 text-center flex flex-col items-center justify-center border-r border-grey-line/15">
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
                <div className="flex flex-col justify-between h-full col-span-4 col-start-2">
                  <div className="service-title-block">
                    <h2 className="service-title mb-10">{service.title}</h2>
                    <p className="small max-w-99">{parse(service.description)}</p>
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
                        <div className="service-info-item" key={index}>
                          <p>{capability.capabilitiesItem}</p>
                        </div>
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
          customClass={'absolute! top-0 left-0 -translate-y-1/2 w-full'}
          lineClass={'opacity-15 bg-grey-line left-1/2 -translate-x-1/2'}
          plusClass={'col-span-12 mx-auto translate-x-0'}
          iconColor={'#272727'}
        />
        <BlurTextReveal
          as="span"
          html="✦ Services are outputs. Systems are outcomes."
          animationType="chars"
          stagger={0.05}
          className="title block text-center"
        />
        <LinePlus
          customClass={'absolute! bottom-0 left-0 translate-y-1/2 w-full'}
          lineClass={'opacity-15 bg-grey-line left-1/2 -translate-x-1/2'}
          plusClass={'col-span-12 mx-auto translate-x-0'}
          iconColor={'#272727'}
        />
      </div>
    </section>
  );
}
