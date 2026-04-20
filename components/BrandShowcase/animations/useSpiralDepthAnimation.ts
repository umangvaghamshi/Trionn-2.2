'use client';

import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * SPIRAL DEPTH — current card spirals away into the background,
 * next card spirals in from the foreground.
 */
export function useSpiralDepthAnimation(): AnimateFn {
  return (current, next) => {
    const tl = gsap.timeline();

    // Next starts large, rotated, invisible
    gsap.set(next, {
      scale: 1.6,
      rotate: -12,
      opacity: 0,
      visibility: 'visible',
      transformOrigin: 'center center',
    });

    // Current spirals into the background
    tl.to(current, {
      scale: 0.3,
      rotate: 15,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
    }, 0);

    // Next spirals in from the foreground — overlapping
    tl.to(next, {
      scale: 1,
      rotate: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.15);

    // Clean up
    tl.set(current, {
      visibility: 'hidden',
      scale: 1,
      rotate: 0,
      opacity: 0,
    });

    return tl;
  };
}
