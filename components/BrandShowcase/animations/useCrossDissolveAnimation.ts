'use client';

import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * CROSS DISSOLVE — buttery smooth crossfade with subtle scale breath.
 */
export function useCrossDissolveAnimation(): AnimateFn {
  return (current, next) => {
    const tl = gsap.timeline();

    // Next starts invisible at slightly larger scale
    gsap.set(next, { opacity: 0, scale: 1.03, visibility: 'visible' });

    // Simultaneous crossfade — both running together for smoothness
    tl.to(current, {
      opacity: 0,
      scale: 0.97,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 0);

    tl.to(next, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 0);

    tl.set(current, { visibility: 'hidden', opacity: 0, scale: 1 });

    return tl;
  };
}
