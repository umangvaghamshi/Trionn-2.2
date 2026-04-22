"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { BrandShowcaseProps, Brand } from "./types";
import { useBrandShowcase } from "./useBrandShowcase";
import { BlurTextReveal } from "@/components/TextAnimation";
import LinePlus from "@/components/LinePlus";

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

// Animations that need overflow:visible to allow cards to move outside bounds
const OVERFLOW_VISIBLE_VARIANTS = new Set([
  "cardStack",
  "cascadeDeck",
  "slideReveal",
  "elasticPop",
  "spiralDepth",
  "aceCard",
  "origamiFold",
  "origamiFoldIn",
]);

export default function BrandShowcase({
  sectionLabel = "BRANDS WE\u2019VE\nPARTNERED WITH",
  trustedByLabel = "TRUSTED BY",
  brands = DEFAULT_BRANDS,
  footerTagline = "\u2726 PARTNERSHIPS BUILT ON TRUST, CRAFT, AND RESULTS.",
  backgroundColor = "#ffffff",
  animationVariant = "shutterSlice",
  className = "",
}: BrandShowcaseProps) {
  const {
    activeIndex,
    imageWrapperRef,
    setTextRef,
    handleBrandHover,
    playEntryAnimation,
  } = useBrandShowcase(animationVariant, brands.length);

  useEffect(() => {
    playEntryAnimation();
  }, [playEntryAnimation]);

  const needsOverflowVisible = OVERFLOW_VISIBLE_VARIANTS.has(animationVariant);

  return (
    <section
      className={`brand-showcase relative w-full ${className}`}
      style={{ backgroundColor }}
    >
      <div className="tr__container text-dark-font">
        <div className="grid grid-cols-12 gap-6 py-37.5">
          {/* ── LEFT: Brand names ── */}
          <div className="flex flex-col justify-between col-span-7">
            <BlurTextReveal
              as="span"
              html={sectionLabel}
              animationType="words"
              stagger={0.08}
              className="title uppercase block max-w-40"
            />
            <div className="flex flex-col">
              {/* Brand name list with clip-path fill overlay */}
              <div className="flex flex-wrap gap-x-2 mb-20">
                {brands.map((brand, i) => {
                  const isLast = i === brands.length - 1;
                  return (
                    <span
                      key={brand.name}
                      ref={(el) => setTextRef(el, i)}
                      className="brand-name-item inline-flex items-center cursor-pointer relative h2 leading-[normal]!"
                      onMouseEnter={() => handleBrandHover(i)}
                    >
                      {/* Base layer: always light gray */}
                      <span className="text-dark-font/20 inline-block pr-1">
                        {brand.name}
                      </span>

                      {/* Fill overlay: dark color, clip-path animated from left to right */}
                      <span
                        className="text-fill-overlay text-dark-font absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none pr-1"
                        aria-hidden="true"
                        style={{
                          clipPath:
                            i === 0 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                          pointerEvents: "none",
                          willChange: "clip-path",
                        }}
                      >
                        {brand.name}
                      </span>

                      {/* Comma separator */}
                      {!isLast && (
                        <span style={{ color: "#c8c8c8", fontWeight: 300 }}>
                          ,{" "}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
              <BlurTextReveal
                as="span"
                html={footerTagline}
                animationType="words"
                stagger={0.08}
                className="title uppercase block"
              />
            </div>
          </div>

          {/* ── RIGHT: Image card ── */}
          <div className="col-span-4 shrink-0 flex flex-col col-start-9">
            <BlurTextReveal
              as="span"
              html={trustedByLabel}
              animationType="words"
              stagger={0.08}
              className="title uppercase block text-dark-font/60 mb-10"
            />

            {/* Image stack wrapper — overflow visible for outside animations */}
            <div
              ref={imageWrapperRef}
              className="relative w-full aspect-523/594 rounded-md"
              style={{
                perspective: "1400px",
                overflow: needsOverflowVisible ? "visible" : "hidden",
                marginBottom:
                  animationVariant === "aceCard" ? "60px" : undefined,
              }}
            >
              {/* All images stacked — only active one is visible */}
              {brands.map((brand, i) => (
                <div
                  key={brand.name}
                  className="brand-image-layer absolute inset-0 rounded-md overflow-hidden"
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
                    sizes="(max-width: 1024px) 100vw, 440px"
                    priority={i < 3}
                  />

                  {/* Dynamic Gradient mask attached to each card */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/70 via-black/20 to-transparent pointer-events-none transition-opacity duration-700 ease-out"
                    // style={{
                    //   zIndex: 10,
                    //   opacity: activeIndex === i ? 1 : 0.4,
                    // }}
                  />

                  {/* Animated text securely pinned into each card's 3D space */}
                  <div
                    className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      zIndex: 11,
                      opacity: activeIndex === i ? 1 : 0,
                      transform:
                        activeIndex === i
                          ? "translateY(0)"
                          : "translateY(12px)",
                    }}
                  >
                    <h3 className="text-white">{brand.name.toLowerCase()}</h3>
                    {brand.label && (
                      <span className="title text-white">{brand.label}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
