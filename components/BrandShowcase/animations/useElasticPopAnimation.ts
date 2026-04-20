'use client';

import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * ELASTIC POP — current card shrinks to nothing (pops away),
 * next card pops in from scale 0 with an elastic overshoot bounce.
 */
export function useElasticPopAnimation(): AnimateFn {
  return (current, next) => {
    const tl = gsap.timeline();

    // Next starts at scale 0, centered
    gsap.set(next, {
      scale: 0,
      opacity: 0,
      visibility: 'visible',
      rotate: -6,
    });

    // Current pops away
    tl.to(current, {
      scale: 0,
      opacity: 0,
      rotate: 6,
      duration: 0.3,
      ease: 'power2.in',
    });

    // Next pops in with elastic bounce — starts slightly before current finishes
    tl.to(
      next,
      {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.65)',
      },
      0.22
    );

    // Clean up
    tl.set(current, {
      visibility: 'hidden',
      scale: 1,
      opacity: 0,
      rotate: 0,
    });

    return tl;
  };
}
