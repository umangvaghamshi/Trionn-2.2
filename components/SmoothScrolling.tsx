'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useLayoutEffect } from 'react';
import { useTransition } from './Transition/TransitionContext';
gsap.registerPlugin(ScrollTrigger);

type SmoothScrollingProps = {
  children: React.ReactNode;
};

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  const lenisRef = useRef<LenisRef | null>(null);
  const isSpacePressed = useRef(false);
  const pathname = usePathname();
  const { isLoaderComplete, phase } = useTransition();

  // Disable browser scroll restoration globally
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Force overflow hidden if loader is active or transition is in progress
  useLayoutEffect(() => {
    const isLoading = !isLoaderComplete || phase !== 'idle';

    const blockScroll = (e: Event) => {
      if (e.type === 'keydown') {
        const keys = [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'];
        if (!keys.includes((e as KeyboardEvent).key)) return;
      }
      if (e.cancelable) e.preventDefault();
    };

    if (isLoading) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      lenisRef.current?.lenis?.stop();

      // Nuclear option: prevent wheel, touchmove, and keydown at the window level
      window.addEventListener('wheel', blockScroll, { passive: false });
      window.addEventListener('touchmove', blockScroll, { passive: false });
      window.addEventListener('keydown', blockScroll, { passive: false });
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      if (lenisRef.current?.lenis) {
        lenisRef.current.lenis.start();
        lenisRef.current.lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    }

    return () => {
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
      window.removeEventListener('keydown', blockScroll);
    };
  }, [isLoaderComplete, phase]);

  // Sync Lenis stopped state with loader/transition state
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    const isLoading = !isLoaderComplete || phase !== 'idle';
    if (isLoading) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isLoaderComplete, phase]);

  // Reset scroll position on route change and page load
  useLayoutEffect(() => {
    // Reset Lenis scroll position immediately
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
    }
    // Also reset native scroll as fallback
    window.scrollTo(0, 0);
  }, [pathname]);

  // Disable scroll while page is loading/transitioning, enable after transition completes
  useEffect(() => {
    const enableScroll = () => {
      if (lenisRef.current?.lenis) {
        lenisRef.current.lenis.start();
        // Show the scrollbar now that the page is ready
        document.documentElement.style.overflow = '';
        // Refresh ScrollTrigger after load (skip full recalc for perf)
        ScrollTrigger.refresh();
      }
    };

    const stopScroll = () => {
      if (lenisRef.current?.lenis) {
        lenisRef.current.lenis.stop();
        // Hide the scrollbar during transition
        document.documentElement.style.overflow = 'hidden';
      }
    };

    // Enable scroll when page loader completes
    window.addEventListener('trionn-loader:complete', enableScroll);
    // Enable scroll when page transition completes
    window.addEventListener('trionn-transition:complete', enableScroll);
    // Stop scroll when transition starts
    window.addEventListener('trionn-transition:start', stopScroll);
    // Stop scroll when belts close (transition in progress)
    window.addEventListener('trionn-transition:belts-closed', stopScroll);

    // Fallback: if no transition system, enable on window load
    if (document.readyState === 'complete') {
      // Check if the transition system has already completed
      if (document.documentElement.dataset.trionnLoaderComplete === 'true') {
        enableScroll();
      }
    }

    return () => {
      window.removeEventListener('trionn-loader:complete', enableScroll);
      window.removeEventListener('trionn-transition:complete', enableScroll);
      window.removeEventListener('trionn-transition:start', stopScroll);
      window.removeEventListener('trionn-transition:belts-closed', stopScroll);
    };
  }, []);

  // Refresh ScrollTrigger after scroll reset and DOM updates
  useEffect(() => {
    const timeoutId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(timeoutId);
  }, [pathname]);

  // Handle page reload/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Reset scroll before page unloads
      if (lenisRef.current?.lenis) {
        lenisRef.current.lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // 1. Handle Spacebar Press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isSpacePressed.current = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') isSpacePressed.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 2. Lenis → ScrollTrigger: update ST on every Lenis scroll frame.
    // scrollerProxy is NOT needed because autoRaf:false + gsap.ticker already
    // drives lenis.raf(), which means Lenis and GSAP share the same RAF loop.
    // ScrollTrigger reads scroll position via its own internal hooks once ST.update() is called.
    const lenis = lenisRef.current?.lenis;
    lenis?.on('scroll', ScrollTrigger.update);

    // 3. The Animation Loop (GSAP ticker drives Lenis for smooth sync)
    gsap.ticker.lagSmoothing(0);
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);

      // Manual Spacebar Scrolling
      if (isSpacePressed.current && lenisRef.current?.lenis) {
        const scrollSpeed = 15;
        const currentScroll = lenisRef.current.lenis.scroll;

        lenisRef.current.lenis.scrollTo(currentScroll + scrollSpeed, {
          immediate: true,
        });
      }
    }

    gsap.ticker.add(update);

    return () => {
      lenisRef.current?.lenis?.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(update);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 3. Lenis Settings for Mouse Wheel
  const lenisOptions = {
    autoRaf: false, // We manage the loop manually via GSAP
    duration: 1.2, // Slightly reduced for snappier scroll (was 1.5)
    wheelMultiplier: 0.8,
    touchMultiplier: 2,
    infinite: false,
    stopped: !isLoaderComplete, // Start stopped if loader is active
  };

  return (
    <ReactLenis root options={lenisOptions} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
