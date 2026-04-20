'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import type { AnimationVariant, AnimateFn } from './types';
import {
  useShutterSliceAnimation,
  useCubeRotateAnimation,
  useOrigamiFoldAnimation,
  useOrigamiFoldInAnimation,
  useCrossDissolveAnimation,
  useClipWipeAnimation,
  useCardStackAnimation,
  useCascadeDeckAnimation,
  useSlideRevealAnimation,
  useElasticPopAnimation,
  useSpiralDepthAnimation,
  useAceCardAnimation,
} from './animations';

/**
 * Force every image layer into a clean, hidden base state.
 * Uses direct style assignment (no clearProps) to avoid flicker.
 */
function resetLayer(layer: HTMLElement) {
  gsap.killTweensOf(layer);
  gsap.set(layer, {
    visibility: 'hidden',
    opacity: 0,
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
    scale: 1,
    scaleX: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    clipPath: 'none',
    zIndex: 'auto',
    boxShadow: 'none',
    transformOrigin: '50% 50%',
  });
}

function resetAllLayers(
  wrapper: HTMLElement,
  exceptIndices: number[]
) {
  const layers = wrapper.querySelectorAll<HTMLElement>('.brand-image-layer');
  layers.forEach((layer, i) => {
    if (exceptIndices.includes(i)) return;
    resetLayer(layer);
  });
}

/**
 * Remove any leftover shutter-slice overlay divs (created by the DOM-based animation).
 */
function cleanupShutterOverlays(wrapper: HTMLElement) {
  wrapper.querySelectorAll<HTMLElement>(':scope > div[style*="z-index"]').forEach((el) => {
    if (el.classList.contains('brand-image-layer')) return;
    // gradient / label overlays have z-index 10/11 — shutter overlay uses 20
    if (el.style.zIndex === '20') el.remove();
  });
}

export function useBrandShowcase(variant: AnimationVariant, brandsCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLSpanElement[]>([]);
  const currentTl = useRef<gsap.core.Timeline | null>(null);
  const isAnimating = useRef(false);
  const queuedIndexRef = useRef<number | null>(null);

  // All animation hooks
  const animationMap: Record<AnimationVariant, AnimateFn> = {
    shutterSlice: useShutterSliceAnimation(),
    cubeRotate: useCubeRotateAnimation(),
    origamiFold: useOrigamiFoldAnimation(),
    origamiFoldIn: useOrigamiFoldInAnimation(),
    crossDissolve: useCrossDissolveAnimation(),
    clipWipe: useClipWipeAnimation(),
    cardStack: useCardStackAnimation(),
    cascadeDeck: useCascadeDeckAnimation(),
    slideReveal: useSlideRevealAnimation(),
    elasticPop: useElasticPopAnimation(),
    spiralDepth: useSpiralDepthAnimation(),
    aceCard: useAceCardAnimation(),
  };

  const setTextRef = useCallback((el: HTMLSpanElement | null, index: number) => {
    if (el) textRefs.current[index] = el;
  }, []);

  const handleBrandHover = useCallback(
    (index: number) => {
      if (index === activeIndexRef.current) {
        queuedIndexRef.current = null; // Clear if returning to active
        return;
      }

      // ── UNIVERSAL QUEUE CONTROL ──
      if (isAnimating.current) {
        // If an animation is ongoing, just queue this target index and wait
        queuedIndexRef.current = index;
        return;
      }

      const wrapper = imageWrapperRef.current;
      if (!wrapper) return;

      if (variant === 'aceCard') {
        // ═══════════════════════════════════════════════════
        //  ACE CARD: Queue Based Flow
        // ═══════════════════════════════════════════════════
        isAnimating.current = true;

        const prevIndex = activeIndexRef.current;
        const images = wrapper.querySelectorAll<HTMLElement>('.brand-image-layer');
        const currentImg = images[prevIndex];
        const nextImg = images[index];
        if (!currentImg || !nextImg) {
          isAnimating.current = false;
          return;
        }

        // Update refs
        activeIndexRef.current = index;
        setActiveIndex(index);

        // Text: unfill old name
        const oldOverlay = textRefs.current[prevIndex]?.querySelector<HTMLElement>('.text-fill-overlay');
        if (oldOverlay) {
          gsap.to(oldOverlay, {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true,
          });
        }

        // Text: fill new name
        const newOverlay = textRefs.current[index]?.querySelector<HTMLElement>('.text-fill-overlay');
        if (newOverlay) {
          gsap.to(newOverlay, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true,
          });
        }

        // Cards: run animation and hook into universal completion check
        const animate = animationMap[variant];
        const master = animate(currentImg, nextImg);

        master.eventCallback('onComplete', () => {
          isAnimating.current = false;
          const nextQueuedIndex = queuedIndexRef.current;
          if (nextQueuedIndex !== null) {
            queuedIndexRef.current = null;
            if (nextQueuedIndex !== index) {
              handleBrandHover(nextQueuedIndex);
            }
          }
        });

        return; // Skip the timeline-based DOM reset flow
      }

      // ── Non-aceCard variants: queue-based timeline flow ──

      const prevIndex = activeIndexRef.current;
      const images = wrapper.querySelectorAll<HTMLElement>('.brand-image-layer');
      const currentImg = images[prevIndex];
      const nextImg = images[index];
      if (!currentImg || !nextImg) return;

      // Clean up any leftover DOM overlays (shutter slices)
      cleanupShutterOverlays(wrapper);

      // Reset ALL layers to clean state, then make the previous one visible & clean
      resetAllLayers(wrapper, []);

      // Set prev image as the clean "current" starting point
      gsap.set(currentImg, {
        visibility: 'visible',
        opacity: 1,
        x: 0, y: 0, xPercent: 0, yPercent: 0,
        scale: 1, scaleX: 1,
        rotate: 0, rotateX: 0, rotateY: 0,
        clipPath: 'none',
        zIndex: 'auto',
        boxShadow: 'none',
      });

      // Also reset text overlays for all brands
      textRefs.current.forEach((ref, i) => {
        const overlay = ref?.querySelector<HTMLElement>('.text-fill-overlay');
        if (!overlay) return;
        gsap.killTweensOf(overlay);
        if (i === prevIndex) {
          gsap.set(overlay, { clipPath: 'inset(0 0% 0 0)' });
        } else {
          gsap.set(overlay, { clipPath: 'inset(0 100% 0 0)' });
        }
      });

      // Update refs immediately
      activeIndexRef.current = index;
      setActiveIndex(index);

      // ── Master timeline ──
      isAnimating.current = true;
      const master = gsap.timeline({
        onComplete: () => {
          currentTl.current = null;
          isAnimating.current = false;
          // Final cleanup: ensure only active layer visible
          resetAllLayers(wrapper, [index]);
          gsap.set(images[index], {
            visibility: 'visible',
            opacity: 1,
          });

          // If another index was queued during the animation, play it immediately
          const nextQueuedIndex = queuedIndexRef.current;
          if (nextQueuedIndex !== null) {
            queuedIndexRef.current = null;
            if (nextQueuedIndex !== index) {
              handleBrandHover(nextQueuedIndex);
            }
          }
        },
      });

      // 1) TEXT: unfill old name
      const oldOverlay = textRefs.current[prevIndex]?.querySelector('.text-fill-overlay');
      if (oldOverlay) {
        master.to(
          oldOverlay,
          {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        );
      }

      // 2) TEXT: fill new name
      const newOverlay = textRefs.current[index]?.querySelector('.text-fill-overlay');
      if (newOverlay) {
        gsap.set(newOverlay, { clipPath: 'inset(0 100% 0 0)' });
        master.to(
          newOverlay,
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.3,
            ease: 'power2.out',
          },
          0.08
        );
      }

      // 3) IMAGE: run selected animation variant
      const animate = animationMap[variant];
      const imgTl = animate(currentImg, nextImg);
      master.add(imgTl, 0);

      currentTl.current = master;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variant, brandsCount]
  );

  const playEntryAnimation = useCallback(() => {
    const wrapper = imageWrapperRef.current;
    if (!wrapper) return;

    if (variant === 'aceCard') {
      const { deckSlot, MAX_VISIBLE_STACK } = require('./animations/useAceCardAnimation');
      const layers = wrapper.querySelectorAll<HTMLElement>('.brand-image-layer');

      layers.forEach((layer, i) => {
        const slot = deckSlot(i);

        if (i >= MAX_VISIBLE_STACK) {
          gsap.set(layer, { visibility: 'hidden', opacity: 0 });
          return;
        }

        // Premium entry: cards fly up from below the container and land in their deck slots
        gsap.fromTo(
          layer,
          {
            visibility: 'visible',
            opacity: 0,
            y: 300,                      // Start well below the container
            z: slot.z - 60,
            x: 0,
            scale: slot.scale * 0.8,
            rotateX: 20,                 // Tilted away as if being dealt upward
            rotateY: 0,
            rotateZ: 0,
            zIndex: slot.zIndex,
            transformOrigin: '50% 100%',
            boxShadow: 'none',
          },
          {
            ...slot,
            duration: 0.9,
            ease: 'power3.out',
            delay: i * 0.08,            // Front card lands first, then the rest cascade in
          }
        );
      });
    } else {
      const firstImage = wrapper.querySelector<HTMLElement>('.brand-image-layer');
      if (firstImage) {
        gsap.fromTo(
          firstImage,
          { opacity: 0, y: 30, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            onStart: () => {
              firstImage.style.visibility = 'visible';
            },
          }
        );
      }
    }

    // Fill first text overlay
    const firstOverlay = textRefs.current[0]?.querySelector('.text-fill-overlay');
    if (firstOverlay) {
      gsap.fromTo(
        firstOverlay,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, [variant]);

  // Sync ref when state changes externally
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  return {
    activeIndex,
    imageWrapperRef,
    setTextRef,
    handleBrandHover,
    playEntryAnimation,
  };
}
