'use client';

import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * CARD STACK — next card slides in from below and stacks on top
 * with a slight offset and shadow.
 */
export function useCardStackAnimation(): AnimateFn {
  return (current, next) => {
    const tl = gsap.timeline();

    // Next starts below & slightly rotated
    gsap.set(next, {
      yPercent: 110,
      rotate: 2,
      scale: 1,
      opacity: 1,
      visibility: 'visible',
      boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
    });

    // Current shrinks back like going behind the deck
    tl.to(current, {
      scale: 0.9,
      y: -15,
      opacity: 0.3,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 0);

    // Next slides up on top, straightening out
    tl.to(next, {
      yPercent: 0,
      rotate: 0,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      duration: 0.55,
      ease: 'power2.out',
    }, 0.05);

    // Clean up
    tl.set(current, {
      visibility: 'hidden',
      scale: 1,
      y: 0,
      opacity: 0,
      boxShadow: 'none',
    });

    return tl;
  };
}
