'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { BrandShowcaseProps, Brand } from './types';
import { useBrandShowcase } from './useBrandShowcase';

const DEFAULT_BRANDS: Brand[] = [
  {
    name: 'Luxury Presence',
    image: '/images/orbit-01.jpg',
    label: 'REAL ESTATE PLATFORM',
  },
  {
    name: 'Credible',
    image: '/images/orbit-02.jpg',
    label: 'LOAN COMPARISON',
  },
  {
    name: 'Yellowtail',
    image: '/images/orbit-03.jpg',
    label: 'WINE & SPIRITS',
  },
  {
    name: 'My Worker',
    image: '/images/orbit-04.jpg',
    label: 'WORKFORCE MANAGEMENT',
  },
  {
    name: 'Re-events',
    image: '/images/orbit-05.jpg',
    label: 'EVENT PLATFORM',
  },
  {
    name: 'Ockto',
    image: '/images/orbit-09.jpg',
    label: 'DATA SERVICES',
  },
  {
    name: 'Improvi',
    image: '/images/orbit-07.jpg',
    label: 'HEALTH & WELLNESS',
  },
  {
    name: 'Technish',
    image: '/images/orbit-08.jpg',
    label: 'TECH CONSULTING',
  },
];

// Animations that need overflow:visible to allow cards to move outside bounds
const OVERFLOW_VISIBLE_VARIANTS = new Set([
  'cardStack',
  'cascadeDeck',
  'slideReveal',
  'elasticPop',
  'spiralDepth',
  'aceCard',
  'origamiFold',
  'origamiFoldIn',
]);

export default function BrandShowcase({
  sectionLabel = 'BRANDS WE\u2019VE\nPARTNERED WITH',
  trustedByLabel = 'TRUSTED BY',
  brands = DEFAULT_BRANDS,
  footerTagline = '\u2726 PARTNERSHIPS BUILT ON TRUST, CRAFT, AND RESULTS.',
  backgroundColor = '#ffffff',
  animationVariant = 'shutterSlice',
  className = '',
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
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-20 md:py-28 lg:py-36">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-20">
          {/* ── LEFT: Brand names ── */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#888] font-medium leading-[1.6] mb-10 sm:mb-14 md:mb-20 whitespace-pre-line"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {sectionLabel}
            </p>

            {/* Brand name list with clip-path fill overlay */}
            <div className="flex flex-wrap gap-x-2 items-baseline">
              {brands.map((brand, i) => {
                const isLast = i === brands.length - 1;
                return (
                  <span
                    key={brand.name}
                    ref={(el) => setTextRef(el, i)}
                    className="brand-name-item inline cursor-pointer relative"
                    onMouseEnter={() => handleBrandHover(i)}
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: 'clamp(2rem, 5.5vw, 4.8rem)',
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {/* Base layer: always light gray */}
                    <span
                      style={{
                        color: '#c8c8c8',
                        fontWeight: 300,
                      }}
                    >
                      {brand.name}
                    </span>

                    {/* Fill overlay: dark color, clip-path animated from left to right */}
                    <span
                      className="text-fill-overlay"
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        color: '#1a1a1a',
                        fontWeight: 400,
                        clipPath: i === 0 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                        pointerEvents: 'none',
                        willChange: 'clip-path',
                      }}
                    >
                      {brand.name}
                    </span>

                    {/* Comma separator */}
                    {!isLast && (
                      <span style={{ color: '#c8c8c8', fontWeight: 300 }}>
                        ,{' '}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>

            <p
              className="mt-12 sm:mt-16 md:mt-24 text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#888] font-light"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {footerTagline}
            </p>
          </div>

          {/* ── RIGHT: Image card ── */}
          <div className="lg:w-[400px] xl:w-[440px] shrink-0 flex flex-col">
            <p
              className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#888] font-medium mb-6 sm:mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {trustedByLabel}
            </p>

            {/* Image stack wrapper — overflow visible for outside animations */}
            <div
              ref={imageWrapperRef}
              className="relative w-full aspect-[4/5] rounded-md"
              style={{
                perspective: '1400px',
                overflow: needsOverflowVisible ? 'visible' : 'hidden',
                marginBottom: animationVariant === 'aceCard' ? '60px' : undefined,
              }}
            >
              {/* All images stacked — only active one is visible */}
              {brands.map((brand, i) => (
                <div
                  key={brand.name}
                  className="brand-image-layer absolute inset-0 rounded-md overflow-hidden"
                  style={{
                    visibility: i === 0 ? 'visible' : 'hidden',
                    opacity: i === 0 ? 1 : 0,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
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
                    className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none transition-opacity duration-700 ease-out"
                    style={{
                      zIndex: 10,
                      opacity: activeIndex === i ? 1 : 0.4
                    }}
                  />

                  {/* Animated text securely pinned into each card's 3D space */}
                  <div
                    className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      zIndex: 11,
                      opacity: activeIndex === i ? 1 : 0,
                      transform: activeIndex === i ? 'translateY(0)' : 'translateY(12px)',
                    }}
                  >
                    <span
                      className="text-white text-base sm:text-lg md:text-xl font-medium tracking-[-0.01em]"
                      style={{ fontFamily: "'Georgia', serif", textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                    >
                      {brand.name.toLowerCase()}
                    </span>
                    {brand.label && (
                      <span
                        className="text-white/90 text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-medium"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {brand.label}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom divider with + icon */}
        <div className="mt-12 sm:mt-16 md:mt-20 relative">
          <div className="w-full h-px bg-[#ddd]" />
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-6 h-6 flex items-center justify-center bg-white">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 0V12M0 6H12" stroke="#999" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
