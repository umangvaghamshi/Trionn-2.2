"use client";
import Marquee from "@/components/Marquee";
import { BlurTextReveal } from "@/components/TextAnimation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { WordShiftButton } from "@/components/Button";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "✦ GSAP",
    awards: [
      {
        title: "Website of the day  — (2X)",
        image: "/images/awards.webp",
      },
      {
        title: "Website of the day  — (2X)",
        image: "/images/rushi.webp",
      },
    ],
  },
  {
    title: "✦ CSSDA",
    awards: [
      {
        title: "2X - Website of the day",
        image: "/images/rushi.webp",
      },
    ],
  },
  {
    title: "✦ Orpetron",
    awards: [
      {
        title: "Website of the day  — (2X)",
        image: "/images/rushi.webp",
      },
      {
        title: "Website of the day  — (2X)",
        image: "/images/awards.webp",
      },
    ],
  },
  {
    title: "✦ Awwwards",
    awards: [
      {
        title: "2X - Honnerable Mention",
        image: "/images/rushi.webp",
      },
      {
        title: "Website of the day  — (2X)",
        image: "/images/awards.webp",
      },
    ],
  },
  {
    title: "✦ The FWA",
    awards: [
      {
        title: "2X - Honnerable Mention",
        image: "/images/rushi.webp",
      },
      {
        title: "Website of the day  — (2X)",
        image: "/images/awards.webp",
      },
    ],
  },
  {
    title: "✦ A Design Awards",
    awards: [
      {
        title: "Silver Medal",
        image: "/images/rushi.webp",
      },
      {
        title: "Website of the day  — (2X)",
        image: "/images/awards.webp",
      },
    ],
  },
  {
    title: "✦ Landing.Love",
    awards: [
      {
        title: "Website of the day  — (2X)",
        image: "/images/awards.webp",
      },
    ],
  },
  {
    title: "✦ CSS Winner",
    awards: [
      {
        title: "2X - Website of the day",
        image: "/images/awards.webp",
      },
    ],
  },
  {
    title: "✦ CSSnectar",
    awards: [
      {
        title: "Website of the day  — (2X)",
        image: "/images/awards.webp",
      },
    ],
  },
  {
    title: "✦ Codrops",
    awards: [
      {
        title: "Website of the day  — (2X)",
        image: "/images/awards.webp",
      },
    ],
  },
];

export default function Awards() {
  const awardsSectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  const HorizontalScrollerRef = useRef<HTMLDivElement | null>(null);
  const HorizontalScrollerContentRef = useRef<HTMLDivElement | null>(null);

  const sliderHeaderRef = useRef<HTMLDivElement>(null);

  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const section = HorizontalScrollerRef.current;
      const sliderEl = HorizontalScrollerContentRef.current;

      if (!section || !sliderEl) return;

      const scrollDistance = sliderEl.scrollWidth - window.innerWidth + 40;

      // 1️⃣ Initial state
      gsap.set(sliderEl, {
        xPercent: 100,
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: awardsSectionRef.current,
          start: "top top",
          end: () => `+=500%`,
          scrub: 1,
          pin: true,
          markers: false,
          anticipatePin: 1,
        },
      });

      tl.addLabel("start_animation")

        // 2️⃣ Clip-path reveal
        .fromTo(
          maskRef.current,
          {
            width: 534,
            height: 700,
            borderRadius: 999,
          },
          {
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            duration: 0.15,
          },
        )

        .addLabel("reveal_clip_path")

        // 3️⃣ Headings move (THIS is your trigger moment)
        .to(
          titleContainerRef.current,
          {
            y: 0,
            duration: 0.15,
          },
          "reveal_clip_path",
        )
        .to(
          marqueeContainerRef.current,
          {
            y: -window.innerHeight,
            duration: 0.15,
          },
          "<",
        )
        .to(
          scrollTextRef.current,
          {
            y: window.innerHeight,
            duration: 0.15,
          },
          "<",
        )

        // 4️⃣ Slider starts sliding EXACTLY here
        .to(
          sliderEl,
          {
            xPercent: 0,
            x: () => -scrollDistance,
            ease: "none",
            // duration: 0.15,
          },
          "reveal_clip_path-=0.18",
        )

        // 5️⃣ Slider header fade in
        .fromTo(
          sliderHeaderRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.05 },
          "<50%",
        );
    },
    { scope: awardsSectionRef },
  );

  // Card Fadein FadeOut Effect
  useGSAP(
    () => {
      if (!awardsSectionRef.current) {
        return;
      }

      cardsRef.current.forEach((card) => {
        const imgs = card.querySelectorAll(".awards-image-wrapper img");
        // Show only First Image
        if (imgs.length > 1) {
          gsap.set(imgs, { opacity: 0 });
          gsap.set(imgs[0], { opacity: 1 });
        }

        const tl = gsap.timeline({ repeat: -1 });
        const duration = 1.2; // How long the fade takes
        const pause = 2; // How long the logo stays visible

        imgs.forEach((img, i) => {
          const nextIndex = (i + 1) % imgs.length;
          const nextImg = imgs[nextIndex];

          // 1. Wait for 'pause' seconds
          // 2. Fade OUT current and Fade IN next simultaneously
          tl.to(
            img,
            {
              opacity: 0,
              duration: duration,
              ease: "power1.inOut",
            },
            `+=${pause}`,
          ).to(
            nextImg,
            {
              opacity: 1,
              duration: duration,
              ease: "power1.inOut",
            },
            `<`,
          ); // "<" means start at the same time as the previous animation
        });
      });
    },
    {
      scope: awardsSectionRef,
    },
  );

  return (
    <section
      ref={awardsSectionRef}
      className="relative h-screen w-full  bg-[#F7F7F7] overflow-hidden "
    >
      {/* 1. Background Video (Masked) */}
      {/* We apply the clip-path via GSAP, but set initial state here to avoid FOUC */}
      <div
        ref={videoContainerRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div ref={maskRef} className="overflow-hidden w-full h-full">
          <video
            className="h-screen w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            // Replace with your actual video URL
            src="/video/awards-video.mp4"
            preload="metadata"
          />
        </div>

        {/* Overlay to darken video slightly for text readability */}
        {/* <div className="absolute inset-0 bg-black/30"></div> */}
      </div>

      {/* 2. Marquee Component (Centered) */}
      <div className="z-10 flex flex-col justify-center min-h-screen pt-37.5 pb-25 mix-blend-difference">
        <div
          className="tr__container w-full absolute top-37.5 left-0"
          ref={titleContainerRef}
        >
          <BlurTextReveal
            as="span"
            html="Results matter most. Awards add recognition and value."
            animationType="words"
            stagger={0.03}
            className="title max-w-50 text-light-font block"
          />
        </div>
        {/* Using your component */}
        <div ref={marqueeContainerRef}>
          <Marquee gap={0} speed={0.8} className="text-white">
            <div className="uppercase mrquee-text flex items-center ">
              <span className="marquee-text-item">AWARDS</span>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-[4.582vw] w-[2.291vw] h-[2.291vw]"
              >
                <line
                  x1="20.2256"
                  y1="-2.18557e-08"
                  x2="20.2256"
                  y2="40"
                  stroke="#FFFFFF"
                />
                <line
                  x1="40"
                  y1="20.226"
                  x2="-4.37114e-08"
                  y2="20.226"
                  stroke="#FFFFFF"
                />
              </svg>
              <span className="marquee-text-item">RECOGNITION</span>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-[4.582vw] w-[2.291vw] h-[2.291vw]"
              >
                <line
                  x1="20.2256"
                  y1="-2.18557e-08"
                  x2="20.2256"
                  y2="40"
                  stroke="#FFFFFF"
                />
                <line
                  x1="40"
                  y1="20.226"
                  x2="-4.37114e-08"
                  y2="20.226"
                  stroke="#FFFFFF"
                />
              </svg>
            </div>
          </Marquee>
        </div>
        {/* <div
          className="title overflow-hidden relative flex items-center justify-center text-grey-light pointer-events-none"
          ref={scrollTextRef}
        >
          <span className="block animate-arrow mr-1">↓</span>
          <span>keep scrolling</span>
          <span className="block animate-arrow ml-1">↓</span>
        </div> */}
      </div>
      <div className="absolute bottom-25 flex flex-col gap-10">
        <div
          ref={sliderHeaderRef}
          className="w-full max-w-screen flex items-center justify-between tr__container mx-0!"
        >
          <BlurTextReveal
            as="span"
            html="✦ Recognition follows work done with care."
            animationType="chars"
            stagger={0.03}
            className="title text-light-font block"
          />
          <WordShiftButton
            text="win an award"
            href="#"
            styleVars={{ buttonWrapperColor: "#D8D8D8" }}
          />
        </div>

        <div ref={HorizontalScrollerRef}>
          <div
            ref={HorizontalScrollerContentRef}
            className="col-span-10 col-start-3 flex gap-x-6 w-max"
          >
            {cards.map((item, idx) => {
              return (
                <div
                  key={idx}
                  ref={(self) => {
                    if (cardsRef.current && self) {
                      cardsRef.current[idx] = self;
                    }
                  }}
                  className={`overflow-hidden relative w-134 h-77 p-10 bg-white/90 even:bg-black/90 text-dark-font even:text-light-font rounded-lg flex justify-between`}
                >
                  <div className="flex-1 flex flex-col items-start justify-between pr-10">
                    <BlurTextReveal
                      as="h4"
                      html={item.title}
                      animationType="words"
                      stagger={0.03}
                      className="uppercase"
                    />
                    <div className="flex flex-col gap-1">
                      {item.awards.map((award, i) => {
                        return (
                          <p key={i} className="small">
                            {award.title}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                  <div className="awards-image-wrapper w-full max-w-40 overflow-hidden relative">
                    {item.awards.map((award, index) => {
                      return (
                        <Image
                          className="inset-0 absolute rounded-sm"
                          src={award.image}
                          key={index}
                          alt={award.title}
                          height={460}
                          width={320}
                        ></Image>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
