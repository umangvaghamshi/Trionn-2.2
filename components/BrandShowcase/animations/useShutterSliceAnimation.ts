'use client';

import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * SHUTTER SLICE — horizontal blind strips sweep across, covering then
 * revealing the new image underneath.
 */
const SLICE_COUNT = 6;

export function useShutterSliceAnimation(): AnimateFn {
  return (current, next) => {
    const parent = current.parentElement!;
    const slices: HTMLElement[] = [];

    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:absolute;inset:0;z-index:20;overflow:hidden;pointer-events:none;';
    parent.appendChild(overlay);

    for (let i = 0; i < SLICE_COUNT; i++) {
      const slice = document.createElement('div');
      const h = 100 / SLICE_COUNT;
      slice.style.cssText = `position:absolute;left:0;right:0;top:${h * i}%;height:${h + 0.5}%;background:#1a1a1a;transform:scaleX(0);transform-origin:left center;will-change:transform;`;
      overlay.appendChild(slice);
      slices.push(slice);
    }

    const tl = gsap.timeline({
      onComplete: () => overlay.remove(),
      // If timeline is killed mid-way, still clean up
      onInterrupt: () => overlay.remove(),
    });

    // Slices cover (staggered top→bottom)
    tl.to(slices, {
      scaleX: 1,
      duration: 0.25,
      stagger: 0.03,
      ease: 'power2.inOut',
    });

    // Fully covered — swap
    tl.set(next, { visibility: 'visible', opacity: 1 });
    tl.set(current, { visibility: 'hidden', opacity: 0 });

    // Slices reveal (staggered bottom→top)
    tl.to(slices, {
      scaleX: 0,
      duration: 0.25,
      stagger: { each: 0.03, from: 'end' },
      ease: 'power2.inOut',
      transformOrigin: 'right center',
    });

    return tl;
  };
}
