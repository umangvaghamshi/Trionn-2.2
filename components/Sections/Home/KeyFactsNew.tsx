"use client";

import { Odometer } from "@/components/Odometer";
import { BlurTextReveal } from "@/components/TextAnimation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { partnersLogo } from "@/data";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinePlus from "@/components/LinePlus";

gsap.registerPlugin(ScrollTrigger);

export default function KeyFactsNew() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [odoTick, setOdoTick] = useState(0);
  const odoFiredRef = useRef(false);

  const triggerOdometerOnce = useCallback(() => {
    if (odoFiredRef.current) return;
    odoFiredRef.current = true;
    setOdoTick((n) => n + 1);
  }, []);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-kf-card]"),
      );
      if (cards.length !== 3) return;

      const list = root.querySelector(".key-card-list") as HTMLElement | null;
      if (list) gsap.set(list, { perspective: 1400 });

      // const lineWrap = root.querySelector(".js-kf-line-wrap");
      // if (lineWrap) {
      //   gsap.fromTo(
      //     lineWrap,
      //     { scaleY: 0, transformOrigin: "top" },
      //     {
      //       scaleY: 1,
      //       ease: "sine.inOut",
      //       duration: 1.5,
      //       scrollTrigger: {
      //         trigger: lineWrap,
      //         start: "top 70%",
      //         toggleActions: "play none none reverse",
      //       },
      //     },
      //   );
      // }

      gsap.set(cards, {
        rotateX: -92,
        autoAlpha: 0,
        transformOrigin: "center top",
        force3D: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top center",
          end: "top top",
          scrub: 2,
          markers: false,
        },
      });

      const cardDuration = 2.65;
      const staggerEach = 0.6;

      tl.to(cards, {
        rotateX: 0,
        autoAlpha: 1,
        stagger: { each: staggerEach, from: "start" },
        ease: "none",
        force3D: true,
        duration: cardDuration,
      });

      tl.call(triggerOdometerOnce, undefined, staggerEach * 1.5);
    },
    { scope: containerRef, dependencies: [triggerOdometerOnce] },
  );

  return (
    <section
      id="keyfacts-section"
      className="pt-24 pb-40 bg-[linear-gradient(0deg,#FFFFFF_0%,#D2D2D2_100%)] relative z-20 min-h-screen"
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
        <div className="key-card-list flex gap-6 justify-center flex-wrap lg:flex-nowrap [transform-style:preserve-3d]">
          <FeaturedCard odoSync={odoTick} />
          <ProjectCard odoSync={odoTick} />
          <TeamCard odoSync={odoTick} />
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
      {/* Bottom decoration line (Moved from Work section) */}
      <div className="js-kf-line-wrap tr__container pointer-events-none absolute bottom-0 left-0 right-0 z-0 max-md:px-4 hidden md:block">
        <LinePlus
          lineClass={"opacity-25 bg-grey-line left-1/2 -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto translate-x-1/2!"}
          iconColor={"#272727"}
        />
      </div>
    </section>
  );
}

function FeaturedCard({ odoSync }: { odoSync: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const awardsImages = ["/images/FAW.svg", "/images/awwwards.svg"];

  useGSAP(
    () => {
      if (!cardRef.current) return;

      const imgs = gsap.utils.toArray<HTMLImageElement>(
        cardRef.current.querySelectorAll("[data-img]"),
      );
      if (!imgs.length) return;

      gsap.set(imgs, { opacity: 0 });
      gsap.set(imgs[0], { opacity: 1 });

      const tl = gsap.timeline({ repeat: -1 });
      const duration = 1.2;
      const pause = 2;

      imgs.forEach((img, i) => {
        const nextIndex = (i + 1) % imgs.length;
        const nextImg = imgs[nextIndex];

        tl.to(
          img,
          {
            opacity: 0,
            duration,
            ease: "power1.inOut",
          },
          `+=${pause}`,
        ).to(
          nextImg,
          {
            opacity: 1,
            duration,
            ease: "power1.inOut",
          },
          `<`,
        );
      });
    },
    { scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      data-kf-card
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
              <Odometer
                value="50+"
                className="max-h-12"
                syncPlayCount={odoSync}
                duration={1.55}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ odoSync }: { odoSync: number }) {
  return (
    <div
      data-kf-card
      className="project-card relative max-w-99 w-full h-122 rounded-lg bg-cream p-10 flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-[1.02] transition-colors duration-500 text-center will-change-transform backface-hidden transform-3d"
    >
      <h4 className="uppercase text-dark-font">projects completed</h4>
      <div className="flex flex-col items-center justify-center flex-1 relative">
        <div className="w-50 h-50 rounded-full bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-2 flex items-center">
          <span className="flex items-start tabular-nums text-dark-font number-small">
            <Odometer
              value="999+"
              className="max-h-12"
              syncPlayCount={odoSync}
              duration={1.85}
            />
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

function TeamCard({ odoSync }: { odoSync: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
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
      data-kf-card
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
            <Odometer
              value="20+"
              className="max-h-12"
              syncPlayCount={odoSync}
              duration={1.55}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
