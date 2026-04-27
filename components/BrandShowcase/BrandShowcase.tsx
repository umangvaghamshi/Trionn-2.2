"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { BrandShowcaseProps, Brand } from "./types";
import { useBrandShowcase } from "./useBrandShowcase";
import { BlurTextReveal } from "@/components/TextAnimation";
import LinePlus from "@/components/LinePlus";
import gsap from "gsap";

const CARD_WIDTH = 225;
const CARD_HEIGHT = 140;
const CARD_TEXT_OVERLAP = 8;

const DEFAULT_BRANDS: Brand[] = [
  {
    name: "Luxury Presence",
    image: "/images/orbit-01.jpg",
    label: "REAL ESTATE PLATFORM",
  },
  {
    name: "Credible",
    image: "/images/orbit-02.jpg",
    label: "LOAN COMPARISON",
  },
  {
    name: "Yellowtail",
    image: "/images/orbit-03.jpg",
    label: "WINE & SPIRITS",
  },
  {
    name: "My Worker",
    image: "/images/orbit-04.jpg",
    label: "WORKFORCE MANAGEMENT",
  },
  {
    name: "Re-events",
    image: "/images/orbit-05.jpg",
    label: "EVENT PLATFORM",
  },
  {
    name: "Ockto",
    image: "/images/orbit-09.jpg",
    label: "DATA SERVICES",
  },
  {
    name: "Improvi",
    image: "/images/orbit-07.jpg",
    label: "HEALTH & WELLNESS",
  },
  {
    name: "Technish",
    image: "/images/orbit-08.jpg",
    label: "TECH CONSULTING",
  },
];

export default function BrandShowcase({
  sectionLabel = "BRANDS WE'VE\nPARTNERED WITH",
  brands = DEFAULT_BRANDS,
  footerTagline = "\u2726 PARTNERSHIPS BUILT ON TRUST, CRAFT, AND RESULTS.",
  backgroundColor = "#ffffff",
  className = "",
}: BrandShowcaseProps) {
  const {
    activeIndex,
    imageWrapperRef,
    setTextRef,
    handleBrandHover,
    playEntryAnimation,
  } = useBrandShowcase();

  const containerRef = useRef<HTMLDivElement>(null);
  const cardMotionTlRef = useRef<gsap.core.Timeline | null>(null);
  const hasHoveredRef = useRef(false);

  useEffect(() => {
    playEntryAnimation();
  }, [playEntryAnimation]);

  const revealCardBehindBrand = useCallback(
    (target: HTMLSpanElement) => {
      const container = containerRef.current;
      const imageWrapper = imageWrapperRef.current;
      if (!container || !imageWrapper) return;

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const finalX =
        targetRect.left -
        containerRect.left +
        targetRect.width / 2 -
        CARD_WIDTH / 2;
      const targetTop = targetRect.top - containerRect.top;
      const finalY = targetTop - CARD_HEIGHT + CARD_TEXT_OVERLAP;
      const hiddenY = targetTop - CARD_HEIGHT * 0.38;
      const targetCenter = targetRect.left + targetRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const distanceFromCenter = targetCenter - containerCenter;
      const isCenterBrand = Math.abs(distanceFromCenter) < CARD_WIDTH * 0.35;
      const enterTilt = distanceFromCenter < 0 ? -16 : 16;
      const settleTilt = isCenterBrand ? 0 : enterTilt > 0 ? 5 : -5;
      const isAlreadyVisible =
        Number(gsap.getProperty(imageWrapper, "opacity")) > 0.2;

      cardMotionTlRef.current?.kill();
      gsap.killTweensOf(imageWrapper);

      if (isAlreadyVisible) {
        cardMotionTlRef.current = gsap.timeline().to(imageWrapper, {
          x: finalX,
          y: finalY,
          opacity: 1,
          scale: 1,
          rotate: settleTilt,
          duration: 0.58,
          ease: "power3.out",
          overwrite: "auto",
        });
        return;
      }

      cardMotionTlRef.current = gsap
        .timeline({ defaults: { overwrite: "auto" } })
        .set(imageWrapper, {
          x: finalX,
          y: hiddenY,
          opacity: 0,
          scale: 0.9,
          rotate: enterTilt,
          transformOrigin: "50% 100%",
        })
        .to(imageWrapper, {
          opacity: 1,
          duration: 0.18,
          ease: "power1.out",
        })
        .to(
          imageWrapper,
          {
            y: finalY,
            scale: 1,
            rotate: settleTilt,
            duration: 0.82,
            ease: "power3.out",
          },
          0.04
        );
    },
    [imageWrapperRef]
  );

  const hideCard = useCallback(() => {
    const imageWrapper = imageWrapperRef.current;
    if (!imageWrapper) return;

    cardMotionTlRef.current?.kill();
    gsap.killTweensOf(imageWrapper);
    gsap.to(imageWrapper, {
      opacity: 0,
      y: "+=32",
      scale: 0.9,
      rotate: -8,
      duration: 0.34,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [imageWrapperRef]);

  const handleBrandEnter = useCallback(
    (index: number, target: HTMLSpanElement) => {
      hasHoveredRef.current = true;
      if (index === activeIndex) {
        revealCardBehindBrand(target);
      }
      handleBrandHover(index);
    },
    [activeIndex, handleBrandHover, revealCardBehindBrand]
  );

  useEffect(() => {
    const imageWrapper = imageWrapperRef.current;
    if (!imageWrapper) return;

    gsap.set(imageWrapper, {
      opacity: 0,
      scale: 0.9,
      rotate: -8,
      transformOrigin: "50% 100%",
    });

    return () => {
      cardMotionTlRef.current?.kill();
      gsap.killTweensOf(imageWrapper);
    };
  }, [imageWrapperRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mouseleave", hideCard);

    return () => {
      container.removeEventListener("mouseleave", hideCard);
    };
  }, [hideCard]);

  useEffect(() => {
    if (!hasHoveredRef.current) return;

    const activeBrand = containerRef.current?.querySelectorAll<HTMLSpanElement>(
      ".brand-name-item"
    )[activeIndex];
    if (!activeBrand) return;

    revealCardBehindBrand(activeBrand);
  }, [activeIndex, revealCardBehindBrand]);

  return (
    <section
      className={`brand-showcase relative w-full overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <div className="tr__container text-dark-font relative">
        <div className="flex flex-col py-37.5 items-center text-center">
          <div className="mb-20">
            <BlurTextReveal
              as="span"
              html={sectionLabel}
              animationType="words"
              stagger={0.08}
              className="title uppercase block whitespace-pre-line text-center text-dark-font/60 text-sm tracking-widest"
            />
          </div>

          <div
            ref={containerRef}
            className="relative isolate w-full max-w-6xl mx-auto flex flex-wrap justify-center gap-x-4 gap-y-2 z-10"
          >
            {brands.map((brand, i) => (
              <span
                key={brand.name}
                ref={(el) => setTextRef(el, i)}
                className={`brand-name-item inline-flex items-center cursor-pointer relative h2 leading-none! group ${
                  activeIndex === i ? "z-30" : "z-10"
                }`}
                onMouseEnter={(event) =>
                  handleBrandEnter(i, event.currentTarget)
                }
              >
                <span className="text-dark-font/20 inline-block transition-colors duration-300">
                  <span className="-mt-3 pr-1">{brand.name}</span>
                  <span className="group-last:hidden">,</span>
                </span>

                <span
                  className="text-dark-font absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                >
                  <span
                    className="text-fill-overlay -mt-3 pr-1"
                    style={{
                      clipPath:
                        i === 0 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                      pointerEvents: "none",
                      willChange: "clip-path",
                    }}
                  >
                    {brand.name}
                  </span>
                  <span className="group-last:hidden opacity-0">,</span>
                </span>
              </span>
            ))}

            <div
              ref={imageWrapperRef}
              className="absolute left-0 top-0 z-20 h-[160px] w-[245px] overflow-hidden rounded-xl pointer-events-none opacity-0 scale-[0.9]"
              style={{
                perspective: "1400px",
                willChange: "transform, opacity",
              }}
            >
              {brands.map((brand, i) => (
                <div
                  key={brand.name}
                  className="brand-image-layer absolute inset-0 rounded-xl overflow-hidden"
                  style={{
                    visibility: i === 0 ? "visible" : "hidden",
                    opacity: i === 0 ? 1 : 0,
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                  }}
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover"
                    sizes="245px"
                    priority={i < 3}
                  />
                  <div className="absolute inset-0 bg-black/30" />

                  <div
                    className="absolute inset-x-0 inset-y-0 p-4 flex flex-col items-center justify-center text-center pointer-events-none"
                    style={{
                      zIndex: 11,
                      opacity: activeIndex === i ? 1 : 0,
                    }}
                  >
                    <h3 className="text-white text-xl font-medium mb-1">
                      {brand.name.toLowerCase()}
                    </h3>
                    {brand.label && (
                      <span className="text-white/80 text-[10px] tracking-wider uppercase">
                        {brand.label}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-24">
            <BlurTextReveal
              as="span"
              html={footerTagline}
              animationType="words"
              stagger={0.08}
              className="text-xs tracking-widest uppercase text-dark-font/60"
            />
          </div>
        </div>

        <LinePlus
          lineClass={"opacity-15 bg-grey-line left-1/2! -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto translate-x-0!"}
          iconColor={"#272727"}
        />
      </div>
    </section>
  );
}
