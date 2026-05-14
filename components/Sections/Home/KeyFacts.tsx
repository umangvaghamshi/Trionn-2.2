"use client";

import { Odometer } from "@/components/Odometer";
import { BlurTextReveal } from "@/components/TextAnimation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import LinePlus from "@/components/LinePlus";
import Marquee from "@/components/Marquee";
import { partnersLogo } from "@/data";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function KeyFacts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [odoTicks, setOdoTicks] = useState([0, 0, 0]);
  const odoFiredRef = useRef([false, false, false]);
  const [windowKey, setWindowKey] = useState(0);

  useEffect(() => {
    const onResize = () => setWindowKey((k) => k + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const triggerOdometer = useCallback((index: number) => {
    if (odoFiredRef.current[index]) return;
    odoFiredRef.current[index] = true;
    setOdoTicks((prev) => {
      const next = [...prev];
      next[index] = next[index] + 1;
      return next;
    });
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
        autoAlpha: 0,
        force3D: true,
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.set(cards, {
          rotateX: -92,
          transformOrigin: "center top",
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

        cards.forEach((_, i) => {
          tl.call(
            () => triggerOdometer(i),
            undefined,
            i * staggerEach + staggerEach * 1.5,
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        if (!list) return;

        gsap.set(list, { x: 0 });
        gsap.set(cards, { rotateX: 0 });

        const scrollTween = gsap.to(list, {
          x: () => {
            const padding = 32;
            return -(list.scrollWidth - window.innerWidth + padding);
          },
          ease: "none",
          scrollTrigger: {
            trigger: root,
            pin: true,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const card = entry.target as HTMLElement;
                const index = cards.indexOf(card);
                if (index !== -1) {
                  triggerOdometer(index);
                  gsap.to(card, {
                    autoAlpha: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    force3D: true,
                  });
                  observer.unobserve(card);
                }
              }
            });
          },
          { threshold: 0.2 },
        );

        cards.forEach((card) => observer.observe(card));

        return () => {
          observer.disconnect();
        };
      });
    },
    { scope: containerRef, dependencies: [triggerOdometer] },
  );

  return (
    <section
      id="keyfacts-section"
      className="pt-20 lg:pt-24 pb-20 lg:pb-40 bg-[linear-gradient(0deg,#FFFFFF_0%,#D2D2D2_100%)] relative z-20 min-h-dvh max-md:overflow-hidden"
      ref={containerRef}
    >
      <div className="tr__container">
        <div className="title-block flex flex-col items-center mb-10 lg:mb-20 gap-6 text-center">
          <BlurTextReveal
            as="h2"
            text={`Key facts`}
            animationType="chars"
            stagger={0.05}
            className="text-dark-font block"
          />
          <p className="text-dark-font small">
            A snapshot of our <br />
            experience and impact.
          </p>
        </div>
        <div
          className="key-card-list flex gap-6 justify-start md:justify-center md:flex-wrap lg:flex-nowrap transform-3d max-lg:-mx-4 max-lg:px-4"
        >
          <FeaturedCard odoSync={odoTicks[0]} />
          <ProjectCard odoSync={odoTicks[1]} />
          <TeamCard odoSync={odoTicks[2]} />
        </div>
        <div className="partners-block mt-20 lg:mt-30 flex flex-col gap-10">
          <BlurTextReveal
            as="span"
            text={`Our business partners`}
            animationType="chars"
            stagger={0.05}
            className="text-black title text-center block"
          />
          <div className="partners-list hidden lg:flex justify-center -mx-4 lg:-mx-10">
            {partnersLogo.map((item, index) => (
              <div
                className="px-6 lg:px-10 border-r border-grey-light/15 flex justify-center items-center last:border-0"
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
          <Marquee gap={0} className="-mx-10 block w-auto! lg:hidden">
            <div className="flex flex-wrap">
              {partnersLogo.map((item, index) => {
                return (
                  <div
                    className="px-10 border-r border-grey-light/15 flex justify-center items-center"
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
                );
              })}
            </div>
          </Marquee>
        </div>
      </div>
      {/* Bottom decoration line (Moved from Work section) */}
      <div className="js-kf-line-wrap tr__container absolute bottom-0 max-md:translate-y-0 translate-y-1/2 left-0 right-0 z-0 max-md:px-4">
        <LinePlus
          key={odoTicks[0]}
          lineClass={"opacity-25 bg-grey-line left-1/2! -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto"}
          iconColor={"#272727"}
        />
      </div>
    </section>
  );
}

function FeaturedCard({ odoSync }: { odoSync: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const awardsImages = [
    "/images/awwwards.svg",
    "/images/ccda.svg",
    "/images/csswinner.svg",
    "/images/adesignaward.svg",
    "/images/gsap.svg",
  ];

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
      className="featured-card shrink-0 w-[85vw] md:w-[380px] lg:w-full max-w-99 max-md:h-[50svh] max-md:max-h-110 max-md:min-h-[300px] md:h-122 rounded-lg bg-black text-light-font overflow-hidden relative  transition-colors duration-500 will-change-transform backface-hidden transform-3d"
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
      <div className="relative z-2 h-full p-8 lg:p-10 flex flex-col justify-between">
        <span className="text-light-font title block">Featured & Awards</span>
        <div>
          <div className="relative w-3/12 h-8 flex items-end justify-end mb-2 awards-logo-list">
            {awardsImages.map((src, i) => (
              <Image
                key={i}
                src={src}
                className="absolute mt-auto w-auto! max-w-30 max-h-20 object-contain"
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
      className="project-card relative shrink-0 w-[85vw] md:w-[380px] lg:w-full max-w-99 max-md:h-[50svh] max-md:max-h-110 max-md:min-h-[300px] md:h-122 rounded-lg bg-cream p-8 lg:p-10 flex flex-col justify-between overflow-hidden   transition-colors duration-500 text-center will-change-transform backface-hidden transform-3d"
    >
      <span className="title block text-dark-font">projects completed</span>
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
      className="team-card shrink-0 w-[85vw] md:w-[380px] lg:w-full max-w-99 max-md:h-[50svh] max-md:max-h-110 max-md:min-h-[300px] md:h-122 rounded-lg bg-[#2F3135] text-light-font overflow-hidden relative  transition-colors duration-500 will-change-transform backface-hidden transform-3d"
    >
      <div className="relative z-3 h-full p-8 lg:p-10 flex flex-col justify-between">
        <span className="title block text-right">our team members</span>
        <div className="team-video overflow-hidden max-lg:py-4 lg:py-10 max-lg:flex-1 rounded-lg">
          <video
            ref={videoRef}
            src="/video/team/rushi.mp4"
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-top rounded-lg scale-101"
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
