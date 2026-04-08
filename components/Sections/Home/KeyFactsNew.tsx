"use client";
import { Odometer } from "@/components/Odometer";
import { BlurTextReveal } from "@/components/TextAnimation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

import { partnersLogo } from "@/data";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Need this

gsap.registerPlugin(ScrollTrigger); // And this

export default function KeyFactsNew() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".key-card-list > div") as HTMLElement[];
      if (!cards.length) return;

      // Set initial states
      gsap.set(cards[0], {
        rotateZ: -55,
        x: -250,
        y: 500,
        transformOrigin: "center center",
      });
      gsap.set(cards[1], {
        y: 150,
      });
      gsap.set(cards[2], {
        rotateZ: 55,
        x: 250,
        y: 500,
        transformOrigin: "center center",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
          markers: true, // Set to false for production, but can be true for debugging
        },
      });

      // 1. First, animate the center card sliding up
      tl.to(cards[1], {
        y: 0,
        ease: "none",
        force3D: true,
      });

      // 2. Then, animate the side cards rotating and sliding in
      tl.to(
        [cards[0], cards[2]],
        {
          rotateZ: 0,
          x: 0,
          y: 0,
          ease: "none",
          force3D: true,
        },
        "<10%",
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      id="keyfacts-section"
      className="py-20 bg-[linear-gradient(0deg,#FFFFFF_0%,#D2D2D2_100%)] relative z-20 min-h-screen "
      ref={containerRef}
    >
      <div className="tr__container">
        <div className="title-block flex flex-col items-center mb-20 gap-6 text-center">
          <BlurTextReveal
            as="h2"
            html={`Key facts`}
            animationType="chars"
            stagger={0.05}
            className="text-dark-font block"
          />
          <p className="text-dark-font max-w-50">
            A snapshot of our experience and impact.
          </p>
        </div>
        <div className="key-card-list flex gap-6 justify-center">
          <FeaturedCard />
          <ProjectCard />
          <TeamCard />
        </div>
        <div className="partners-block mt-29 flex flex-col gap-6">
          <BlurTextReveal
            as="span"
            html={`Our business partners`}
            animationType="chars"
            stagger={0.05}
            className="text-black title text-center block"
          />
          <div className="partners-list flex justify-center -mx-10">
            {partnersLogo.map((item, index) => (
              <div
                className="px-10 border-r border-grey-light/15 flex justify-center items-center last:border-0"
                key={index}
              >
                <Image
                  src={item.logo}
                  width={108}
                  height={50}
                  className={`h-auto ${item.widthClass}`}
                  alt={`Partners logo ${index}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const awardsImages = ["/images/FAW.svg", "/images/awwwards.svg"];

  useGSAP(() => {
    if (!cardRef.current) return;

    const imgs = gsap.utils.toArray<HTMLImageElement>("[data-img]");
    if (!imgs.length) return;

    gsap.set(imgs, { opacity: 0 });
    gsap.set(imgs[0], { opacity: 1 });

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

  return (
    <div
      ref={cardRef}
      className="featured-card max-w-99 w-full h-122 rounded-lg bg-black text-light-font overflow-hidden relative hover:scale-[1.02] transition-colors duration-500 will-change-transform backface-hidden transform-3d"
    >
      <video
        autoPlay
        src="/video/awards-card-video.mp4"
        muted
        playsInline
        loop
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-2 h-full p-10 flex flex-col justify-between">
        <h4 className="uppercase text-light-font">Featured & Awards</h4>
        <div>
          <div className="relative w-3/12 h-8 flex items-end justify-end mb-6 awards-logo-list">
            {awardsImages.map((src, i) => (
              <Image
                key={i}
                src={src}
                className="absolute mt-auto w-auto! max-w-16 max-h-8 object-contain"
                data-img
                fill
                alt={`Awards logo ${i}`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center gap-x-6">
            <p className="small opacity-60 w-9/12">
              Recognition across leading design platforms worldwide.
            </p>
            <span className="flex items-start tabular-nums text-light-font number-small">
              <Odometer value={"50+"} className="max-h-12" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard() {
  return (
    <div className="project-card relative max-w-99 w-full h-122 rounded-lg bg-cream p-10 flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-[1.02] transition-colors duration-500 text-center will-change-transform backface-hidden transform-3d">
      <h4 className="uppercase text-dark-font">projects completed</h4>
      <div className="flex flex-col items-center justify-center flex-1 relative">
        {/* Circle Background */}
        <div className="w-50 h-50 rounded-full bg-white shadow-sm absolute top-1/2 left-1/2 -translate-1/2" />
        {/* Counter Content */}
        <div className="relative z-2 flex items-center">
          <span className="flex items-start tabular-nums text-dark-font number-small">
            <Odometer value={"999+"} className="max-h-12" />
          </span>
        </div>
      </div>
      <p className="small text-dark-font opacity-60">
        90% of our clients seek our <br />
        services for a second project.
      </p>
    </div>
  );
}

function TeamCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // optional
      videoRef.current.play();
    }
  };

  const handleLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="team-card max-w-99 w-full h-122 rounded-lg bg-[#2F3135] text-light-font overflow-hidden relative hover:scale-[1.02] cursor-pointer transition-colors duration-500 will-change-transform backface-hidden transform-3d"
    >
      <div className="relative z-3 h-full p-10 flex flex-col justify-between">
        <h4 className="uppercase text-right">our team members</h4>
        <div className="team-video overflow-hidden py-10">
          <video
            ref={videoRef}
            src="/video/rushi.mp4"
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-top rounded-lg"
          />
        </div>
        <div className="flex items-end justify-between">
          <p className="small text-light-font/60">
            Different skills. <br />
            One standard.
          </p>
          <span className="flex items-start tabular-nums text-light-font number-small">
            <Odometer value={"20+"} className="max-h-12" />
          </span>
        </div>
      </div>
    </div>
  );
}
