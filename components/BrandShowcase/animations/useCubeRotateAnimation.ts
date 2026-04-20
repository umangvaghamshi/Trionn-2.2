'use client';

import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * CUBE ROTATE — 3D cube face rotation on X-axis.
 * Current rotates up and away, next rotates in from below.
 */
export function useCubeRotateAnimation(): AnimateFn {
  return (current, next) => {
    const tl = gsap.timeline();

    // Next starts pre-positioned below
    gsap.set(next, {
      rotateX: -90,
      opacity: 0,
      visibility: 'visible',
      transformOrigin: 'center top',
    });

    // Current rotates up — smooth single motion
    tl.to(current, {
      rotateX: 90,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      transformOrigin: 'center bottom',
    });

    // Next rotates in — overlaps with current leaving
    tl.to(
      next,
      {
        rotateX: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      0.15
    );

    // Clean up current at end
    tl.set(current, { visibility: 'hidden', rotateX: 0, opacity: 0 });

    return tl;
  };
}
