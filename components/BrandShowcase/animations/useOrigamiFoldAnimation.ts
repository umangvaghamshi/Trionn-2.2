'use client';

import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * ORIGAMI FOLD — 3D paper fold. Current folds away to the left,
 * next unfolds from the right.
 */
export function useOrigamiFoldAnimation(): AnimateFn {
  return (current, next) => {
    const tl = gsap.timeline();

    // Next starts folded OUTWARDS (left edge pointing towards user)
    gsap.set(next, {
      rotateY: -80, // Negative rotateY on right-center = left edge swings out (+Z)
      z: 150,       // Pop out towards user
      scaleX: 0.8,  // Slight squish for the origami feel
      opacity: 0,
      visibility: 'visible',
      transformOrigin: 'right center',
    });

    // Current folds OUTWARDS (right edge swings towards user)
    tl.to(current, {
      rotateY: 80,  // Positive rotateY on left-center = right edge swings out (+Z)
      z: 150,       // Pop out towards user
      scaleX: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      transformOrigin: 'left center',
    });

    // Next unfolds back into flat position
    tl.to(
      next,
      {
        rotateY: 0,
        z: 0,
        scaleX: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      0.15 // Same overlap timing as original
    );

    // Reset current completely hidden
    tl.set(current, {
      visibility: 'hidden',
      z: 0,
      rotateY: 0,
      scaleX: 1,
      opacity: 0,
    });

    return tl;
  };
}

/**
 * ORIGAMI FOLD REVERSE — 3D paper fold horizontally, opposite direction.
 */
export function useOrigamiFoldInAnimation(): AnimateFn {
  return (current, next) => {
    const tl = gsap.timeline();

    // Next starts folded OUTWARDS (right edge pointing towards user)
    gsap.set(next, {
      rotateY: -80,  // Positive rotateY on left-center = right edge swings out (+Z)
      z: -150,       // Pop out towards user ('upward on screen')
      scaleX: 0.8,  // Horizontal squish
      opacity: 0,
      visibility: 'visible',
      transformOrigin: 'left center', // Opposite of the original
    });

    // Current folds OUTWARDS (left edge swings towards user)
    tl.to(current, {
      rotateY: 80, // Negative rotateY on right-center = left edge swings out (+Z)
      z: 150,       // Pop out towards user ('upward on screen')
      scaleX: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      transformOrigin: 'right center', // Opposite of the original
    });

    // Next unfolds back into flat position
    tl.to(
      next,
      {
        rotateY: 0,
        z: 0,
        scaleX: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      0.15
    );

    // Reset current completely hidden
    tl.set(current, {
      visibility: 'hidden',
      z: 0,
      rotateY: 0,
      scaleX: 1,
      opacity: 0,
    });

    return tl;
  };
}
