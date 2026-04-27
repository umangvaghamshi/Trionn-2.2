'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

function setLayerHidden(layer: HTMLElement) {
  gsap.killTweensOf(layer);
  gsap.set(layer, {
    visibility: 'hidden',
    opacity: 0,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    zIndex: 'auto',
  });
}

export function useBrandShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  /** Brand index after the last settled hover; `null` after pointer leaves (allows re-hovering the same name). */
  const committedBrandRef = useRef<number | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLSpanElement[]>([]);
  const currentTl = useRef<gsap.core.Timeline | null>(null);
  const isAnimating = useRef(false);
  const queuedIndexRef = useRef<number | null>(null);
  const handleBrandHoverRef = useRef<((index: number) => void) | null>(null);

  const playQueuedHover = useCallback((completedIndex: number) => {
    const nextQueuedIndex = queuedIndexRef.current;
    queuedIndexRef.current = null;

    if (nextQueuedIndex !== null && nextQueuedIndex !== completedIndex) {
      handleBrandHoverRef.current?.(nextQueuedIndex);
    }
  }, []);

  const setTextRef = useCallback((el: HTMLSpanElement | null, index: number) => {
    if (el) textRefs.current[index] = el;
  }, []);

  const handleBrandHover = useCallback(
    (index: number) => {
      if (
        index === activeIndexRef.current &&
        committedBrandRef.current === index
      ) {
        queuedIndexRef.current = null;
        return;
      }

      if (isAnimating.current) {
        queuedIndexRef.current = index;
        return;
      }

      const wrapper = imageWrapperRef.current;
      if (!wrapper) return;

      const images = wrapper.querySelectorAll<HTMLElement>('.brand-image-layer');
      const prevIndex = activeIndexRef.current;
      const currentImg = images[prevIndex];
      const nextImg = images[index];
      if (!currentImg || !nextImg) return;

      activeIndexRef.current = index;
      setActiveIndex(index);
      isAnimating.current = true;

      images.forEach((layer, layerIndex) => {
        if (layerIndex !== prevIndex && layerIndex !== index) {
          setLayerHidden(layer);
        }
      });

      gsap.set(currentImg, {
        visibility: 'visible',
        opacity: 1,
        zIndex: 1,
      });
      gsap.set(nextImg, {
        visibility: 'visible',
        opacity: 0,
        zIndex: 2,
      });

      const oldOverlay = textRefs.current[prevIndex]?.querySelector<HTMLElement>(
        '.text-fill-overlay'
      );
      const newOverlay = textRefs.current[index]?.querySelector<HTMLElement>(
        '.text-fill-overlay'
      );

      currentTl.current?.kill();
      currentTl.current = gsap.timeline({
        onComplete: () => {
          currentTl.current = null;
          isAnimating.current = false;

          images.forEach((layer, layerIndex) => {
            if (layerIndex === index) {
              gsap.set(layer, {
                visibility: 'visible',
                opacity: 1,
                zIndex: 1,
              });
            } else {
              setLayerHidden(layer);
            }
          });

          committedBrandRef.current = index;
          playQueuedHover(index);
        },
      });

      if (oldOverlay) {
        currentTl.current.to(
          oldOverlay,
          {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        );
      }

      if (newOverlay) {
        gsap.set(newOverlay, { clipPath: 'inset(0 100% 0 0)' });
        currentTl.current.to(
          newOverlay,
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.3,
            ease: 'power2.out',
          },
          0.08
        );
      }

      currentTl.current
        .to(
          currentImg,
          {
            opacity: 0,
            duration: 0.36,
            ease: 'power2.out',
          },
          0
        )
        .to(
          nextImg,
          {
            opacity: 1,
            duration: 0.42,
            ease: 'power2.out',
          },
          0.04
        );
    },
    [playQueuedHover]
  );

  useEffect(() => {
    handleBrandHoverRef.current = handleBrandHover;
  }, [handleBrandHover]);

  const playEntryAnimation = useCallback(() => {
    const wrapper = imageWrapperRef.current;
    if (!wrapper) return;

    const images = wrapper.querySelectorAll<HTMLElement>('.brand-image-layer');
    images.forEach((layer, index) => {
      if (index === 0) {
        gsap.set(layer, {
          visibility: 'visible',
          opacity: 1,
          zIndex: 1,
        });
      } else {
        setLayerHidden(layer);
      }
    });

    const firstOverlay = textRefs.current[0]?.querySelector<HTMLElement>(
      '.text-fill-overlay'
    );
    if (firstOverlay) {
      gsap.fromTo(
        firstOverlay,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.3,
          onComplete: () => {
            committedBrandRef.current = 0;
          },
        }
      );
    }
  }, []);

  /** Pointer left the brands row: collapse fills, idle images, clear queue. */
  const deactivateBrandHover = useCallback(() => {
    currentTl.current?.kill();
    currentTl.current = null;
    isAnimating.current = false;
    queuedIndexRef.current = null;
    committedBrandRef.current = null;

    textRefs.current.forEach((ref) => {
      const overlay = ref?.querySelector<HTMLElement>('.text-fill-overlay');
      if (!overlay) return;
      gsap.killTweensOf(overlay);
      gsap.to(overlay, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.28,
        ease: 'power2.in',
        overwrite: true,
      });
    });

    const wrapper = imageWrapperRef.current;
    if (wrapper) {
      const images = wrapper.querySelectorAll<HTMLElement>('.brand-image-layer');
      images.forEach((layer, index) => {
        if (index === 0) {
          gsap.killTweensOf(layer);
          gsap.set(layer, {
            visibility: 'visible',
            opacity: 1,
            zIndex: 1,
          });
        } else {
          setLayerHidden(layer);
        }
      });
    }

    activeIndexRef.current = 0;
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  return {
    activeIndex,
    imageWrapperRef,
    setTextRef,
    handleBrandHover,
    playEntryAnimation,
    deactivateBrandHover,
  };
}
