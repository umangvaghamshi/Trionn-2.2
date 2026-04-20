'use client';

import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * CASCADE DECK — current card flies off to the right with rotation,
 * revealing the next card sitting slightly behind.
 */
export function useCascadeDeckAnimation(): AnimateFn {
  return (current, next) => {
    const tl = gsap.timeline();

    // Next sits behind: slightly smaller, shifted back
    gsap.set(next, {
      scale: 0.93,
      x: 0,
      y: 6,
      opacity: 0.5,
      visibility: 'visible',
      zIndex: 0,
    });

    // Current is on top
    gsap.set(current, { zIndex: 2 });

    // Current flies off to the right with rotation
    tl.to(current, {
      xPercent: 120,
      rotate: 10,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
    }, 0);

    // Next scales up to full and comes forward
    tl.to(next, {
      scale: 1,
      y: 0,
      opacity: 1,
      duration: 0.45,
      ease: 'power2.out',
    }, 0.12);

    // Clean up current
    tl.set(current, {
      visibility: 'hidden',
      xPercent: 0,
      rotate: 0,
      opacity: 0,
      scale: 1,
      zIndex: 'auto',
    });
    tl.set(next, { zIndex: 'auto' });

    return tl;
  };
}
