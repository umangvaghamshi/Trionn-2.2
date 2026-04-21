"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import parse from "html-react-parser";
import React, { useRef } from "react";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";

gsap.registerPlugin(ScrollTrigger);

interface CardItem {
  id: number | string;
  title: string;
  subtitle: string;
  image: string;
  category: string[];
  year: string;
  link: {
    text: string;
    href: string;
  };
  isEven: boolean;
}

const WipeImageCard = (item: CardItem) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<HTMLHeadingElement>(null);
  const subTitleRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLLIElement[]>([]);
  const yearRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const isEven = item.isEven;

  useGSAP(() => {
    if (!containerRef.current || !imageWrapperRef.current || !imageRef.current)
      return;

    const clipStart = isEven ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
    const clipEnd = "inset(0% 0% 0% 0%)";

    //  PARALLAX ANIMATION
    gsap.fromTo(
      imageRef.current,
      { yPercent: -15 },
      {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "top 20%",
        markers: false, // Removed markers for production cleaner look
        // toggleActions: "play none none reverse"
      },
      defaults: { duration: 0.8, ease: "power3.out" },
    });

    gsap.set(
      [
        listRef.current,
        yearRef.current,
        linkRef.current,
        subTitleRef.current,
        titleRef.current,
      ],
      {
        autoAlpha: 0,
      },
    );

    tl.fromTo(
      imageWrapperRef.current,
      { clipPath: clipStart, yPercent: -10 },
      { clipPath: clipEnd, yPercent: 0, ease: "expo.out", duration: 2 },
    )
      .fromTo(
        imageRef.current,
        { filter: "blur(10px)" },
        { filter: "blur(0px)" },
        "<",
      )
      // Line
      .to(
        lineRef.current,
        {
          scaleX: 1,
          ease: "expo.out",
          duration: 2,
        },
        "<",
      )
      .to(
        yearRef.current,
        {
          autoAlpha: 0.6,
          duration: 0.8,
        },
        "<",
      )
      .to(
        titleRef.current,
        {
          autoAlpha: 1,
          ease: "sine",
        },
        "<50%",
      )
      // Text Content Reveal
      .to(
        subTitleRef.current,
        {
          autoAlpha: 0.6,
          ease: "sine",
        },
        "<",
      )
      // List Items
      .to(
        listRef.current,
        {
          autoAlpha: 1,
          ease: "sine",
        },
        "<25%",
      )

      .to(
        linkRef.current,
        {
          autoAlpha: 1,
        },
        "<",
      );
  }, [isEven]);

  return (
    <div
      ref={containerRef}
      className="relative mb-20 last:mb-0 overflow-hidden"
    >
      <div className="mx-auto flex">
        {/* IMAGE WRAPPER */}
        <div
          ref={imageWrapperRef}
          className={`relative overflow-hidden rounded-sm w-1/2 aspect-412/325 ${isEven ? "lg:order-2" : "lg:order-1"}`}
          style={{
            clipPath: isEven ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
          }}
        >
          <Image
            ref={imageRef}
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* CONTENT */}
        <div
          className={`relative flex flex-col justify-between w-1/2 ${isEven ? "lg:order-1 pr-10" : "lg:order-2 pl-10"}`}
        >
          {/* LINE */}
          <div className="content-top text-dark-font relative">
            <div
              ref={lineRef}
              className={`absolute left-0 top-0 h-px w-full scale-x-0 bg-grey-line/15 ${isEven ? "origin-top-left" : "origin-top-right"}`}
            ></div>
            <div className="flex items-start justify-between mt-10">
              <BlurTextReveal
                as="h2"
                text={`${item.id}.`}
                animationType="lines"
                stagger={0.8}
                duration={1}
                start="top 80%"
              />
              <p ref={yearRef} className="text-dark-font/60">
                {item.year}
              </p>
            </div>

            <h3 ref={titleRef} className="mt-10 ">
              {item.title}
            </h3>

            <p
              ref={subTitleRef}
              className="mt-4 small text-dark-font/60 max-w-54"
            >
              {parse(item.subtitle)}
            </p>

            <ul className="mt-8 small list-disc pl-4">
              {item.category.map((li, i) => (
                <li
                  ref={(el) => {
                    if (el) listRef.current[i] = el;
                  }}
                  key={i}
                >
                  {li}
                </li>
              ))}
            </ul>
          </div>

          <div className="content-bottom flex justify-end" ref={linkRef}>
            <WordShiftButton text={item.link.text} href={item.link.href} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WipeImageCard;
