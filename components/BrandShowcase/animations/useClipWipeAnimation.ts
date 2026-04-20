'use client';

import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * CLIP WIPE — smooth left-to-right clip-path wipe revealing
 * the new image underneath.
 */
export function useClipWipeAnimation(): AnimateFn {
  return (current, next) => {
    const tl = gsap.timeline();

    // Next sits behind, fully visible under current
    gsap.set(next, {
      visibility: 'visible',
      opacity: 1,
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    });

    // Current on top, will be wiped away
    gsap.set(current, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      zIndex: 2,
    });

    tl.to(current, {
      clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
      duration: 0.55,
      ease: 'power2.inOut',
    });

    tl.set(current, {
      visibility: 'hidden',
      opacity: 0,
      clipPath: 'none',
      zIndex: 'auto',
    });

    return tl;
  };
}
