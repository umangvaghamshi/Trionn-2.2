'use client';

import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * SLIDE REVEAL — current card slides off to the left, next slides in from right.
 */
export function useSlideRevealAnimation(): AnimateFn {
  return (current, next) => {
    const tl = gsap.timeline();

    // Next starts fully off-screen to the right
    gsap.set(next, {
      xPercent: 105,
      opacity: 1,
      visibility: 'visible',
    });

    // Both slide simultaneously for smooth connected motion
    tl.to(current, {
      xPercent: -105,
      duration: 0.55,
      ease: 'power2.inOut',
    }, 0);

    tl.to(next, {
      xPercent: 0,
      duration: 0.55,
      ease: 'power2.inOut',
    }, 0);

    // Clean up
    tl.set(current, {
      visibility: 'hidden',
      opacity: 0,
      xPercent: 0,
    });

    return tl;
  };
}
