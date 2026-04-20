'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// First N cards are visible immediately, folding starts from this index
const FOLD_START_INDEX = 0;

export function usePaperFoldAnimation(
  containerRef: React.RefObject<HTMLDivElement | null>,
  cardsCount: number
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('.paperfold-card');
    const shadows = container.querySelectorAll<HTMLElement>('.paperfold-shadow');
    const stack = container.querySelector<HTMLElement>('.paperfold-stack');
    if (!cards.length || !stack) return;

    const ctx = gsap.context(() => {
      // Cards before FOLD_START_INDEX are already flat, rest start hidden & folded
      cards.forEach((card, i) => {
        if (i < FOLD_START_INDEX) return;
        gsap.set(card, {
          rotateX: -90,
          transformOrigin: 'top center',
          visibility: 'hidden',
          opacity: 0,
        });
      });

      shadows.forEach((shadow) => {
        gsap.set(shadow, { opacity: 0 });
      });

      // Single timeline on the stack — all cards unfold in sequence
      const foldCount = cardsCount - FOLD_START_INDEX;
      const isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stack,
          start: isMobile ? 'top bottom' : 'top 80%',
          end: `+=${foldCount * 150}`,
          scrub: 0.5,
          markers: false,
        },
      });

      const duration = 0.6;
      const stagger = 0.5;

      for (let idx = 0; idx < foldCount; idx++) {
        const i = idx + FOLD_START_INDEX;
        const card = cards[i];
        const inner = card.querySelector('.paperfold-card-inner');
        const shadow = shadows[i];
        const start = idx * stagger;

        // Make visible immediately at start of this card's animation
        tl.set(card, {
          visibility: 'visible',
          opacity: 1,
        }, start);

        // Unfold from -90 (perpendicular) to 0 (flat)
        tl.to(card, {
          rotateX: 0,
          duration,
          ease: 'power2.out',
        }, start);

        // Fade in content as card unfolds
        if (inner) {
          tl.fromTo(inner,
            { opacity: 0 },
            {
              opacity: 1,
              duration: duration * 0.6,
              ease: 'power1.in',
            }, start + duration * 0.15);
        }

        // Shadow on card — subtle darkening then clear
        if (shadow) {
          tl.fromTo(shadow,
            { opacity: 0.08 },
            { opacity: 0, duration: duration * 0.7, ease: 'power1.out' },
            start + duration * 0.3
          );
        }
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, [cardsCount, containerRef]);
}
