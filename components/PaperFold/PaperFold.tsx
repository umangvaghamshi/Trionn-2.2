'use client';

import { useRef } from 'react';
import type { PaperFoldProps, PaperFoldCard } from './types';
import { usePaperFoldAnimation } from './usePaperFoldAnimation';

const DEFAULT_CARDS: PaperFoldCard[] = [
  {
    title: 'Driven by excellence',
    description:
      'Our work is shaped by high standards, continuous learning, and deep respect for craft — pushing every project beyond the expected.',
  },
  {
    title: 'Honesty and authenticity',
    description:
      "In an industry full of noise and inflated promises, we focus on clarity, transparency, and results we're proud to stand behind.",
  },
  {
    title: 'Designs that last',
    description:
      'We design systems, products, and brands built to endure — balancing creativity, technology, and purpose for long-term impact.',
  },
  {
    title: 'Purposeful decisions',
    description:
      "We're an independent studio of design and coding experts, prioritizing quality and emotional value — even above profit when it matters.",
  },
  {
    title: 'Creativity with impact',
    description:
      "We don't chase trends. We shape ideas that add real value. For us, creativity matters only when it serves purpose and endures over time.",
  },
  {
    title: 'Experience  and attitude',
    description:
      'Our experience comes from years of exploration, learning, and solving complex challenges — evolving with every project we take on.',
  },
];

export default function PaperFold({
  sectionTitle = 'Our values',
  sectionSubtitle = "We're proud to be one of India's most creative and recognized web design studios, driven by purpose, aesthetics, and bold ideas.",
  cards = DEFAULT_CARDS,
  backgroundColor = '#ebebeb',
  footerTagline = '✦ WHAT WE BELIEVE SHAPES BETTER WORK.',
  className = '',
}: PaperFoldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  usePaperFoldAnimation(containerRef, cards.length);

  return (
    <section
      ref={containerRef}
      className={`paperfold-section relative w-full ${className}`}
      style={{ backgroundColor }}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-20 md:py-28 lg:py-36">
        {/* Top: Title + Subtitle */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 lg:gap-16 xl:gap-24 mb-10 sm:mb-14 md:mb-20">
          <div className="shrink-0 flex flex-row items-start gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            <h2
              className="paperfold-title shrink-0 text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(2.2rem,5vw,5rem)] text-[#1a1a1a] leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: "'Georgia', serif", fontWeight: 400 }}
            >
              {sectionTitle}
            </h2>
            <p
              className="paperfold-subtitle pt-1 sm:pt-2 text-[11px] sm:text-[13px] md:text-[14px] text-[#555] leading-[1.6] sm:leading-[1.75] max-w-[340px] font-light"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {sectionSubtitle}
            </p>
          </div>
        </div>

        {/* Card Stack */}
        <div className="w-full lg:max-w-[750px] lg:ml-auto">
          <div
            className="paperfold-stack"
            style={{ perspective: '2500px' }}
          >
            {cards.map((card, i) => {
              return (
                <div
                  key={i}
                  className="paperfold-card relative"
                  style={{
                    transformOrigin: 'top center',
                  }}
                >
                  <div
                    className="paperfold-card-inner flex items-center gap-3 sm:gap-6 md:gap-10 lg:gap-14 px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-6 lg:py-7"
                    style={{
                      backgroundColor: '#ffffff',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <h3 className="w-[38%] sm:w-[40%] shrink-0 text-[0.85rem] sm:text-lg md:text-[1.5rem] lg:text-[1.85rem] text-[#1a1a1a] leading-[1.2] font-medium tracking-[-0.01em]">
                      {card.title}
                    </h3>
                    <p className="flex-1 text-[10px] sm:text-[11.5px] md:text-[13px] lg:text-[13.5px] text-[#666] leading-[1.5] sm:leading-[1.6] md:leading-[1.7] font-light">
                      {card.description}
                    </p>
                  </div>
                  {/* Shadow overlay for fold depth */}
                  <div
                    className="paperfold-shadow absolute inset-0 bg-black/80 pointer-events-none"
                    style={{ opacity: 0 }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer tagline */}
        <div className="mt-10 sm:mt-14 md:mt-20 flex flex-col items-center gap-3 sm:gap-4">
          <p className="paperfold-footer text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-[#666] font-light text-center">
            {footerTagline}
          </p>
          <div className="paperfold-scroll-hint flex items-center gap-3 sm:gap-4 opacity-30">
            <div className="w-8 sm:w-10 md:w-14 h-px bg-[#999]" />
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#999]">
              scroll to unfold
            </span>
            <div className="w-8 sm:w-10 md:w-14 h-px bg-[#999]" />
          </div>
        </div>
      </div>
    </section>
  );
}
