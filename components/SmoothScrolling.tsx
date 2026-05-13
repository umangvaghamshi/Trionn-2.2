"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useLayoutEffect } from "react";
import { useTransition } from "./Transition/TransitionContext";

export default function SmoothScrolling() {
  const lenisRef = useRef<Lenis | null>(null);
  const isSpacePressed = useRef(false);
  const pathname = usePathname();
  const { isLoaderComplete, phase } = useTransition();

  // Disable browser scroll restoration globally
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Create Lenis instance once on mount
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Start paused if loader is still active
    if (!isLoaderComplete) lenis.stop();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Block/unblock scroll during loading and transitions
  useLayoutEffect(() => {
    const isLoading = !isLoaderComplete || phase !== "idle";

    const blockScroll = (e: Event) => {
      if (e.type === "keydown") {
        const keys = [
          " ",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "PageUp",
          "PageDown",
          "Home",
          "End",
        ];
        if (!keys.includes((e as KeyboardEvent).key)) return;
      }
      if (e.cancelable) e.preventDefault();
    };

    if (isLoading) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      lenisRef.current?.stop();

      window.addEventListener("wheel", blockScroll, { passive: false });
      window.addEventListener("touchmove", blockScroll, { passive: false });
      window.addEventListener("keydown", blockScroll, { passive: false });
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.start();
        lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    }

    return () => {
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", blockScroll);
    };
  }, [isLoaderComplete, phase]);

  // Reset scroll position on route change
  useLayoutEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  // Custom events: loader/transition/modal
  useEffect(() => {
    const enableScroll = () => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.start();
        document.documentElement.style.overflow = "";
      }
    };

    const stopScroll = () => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.stop();
        document.documentElement.style.overflow = "hidden";
      }
    };

    window.addEventListener("trionn-loader:complete", enableScroll);
    window.addEventListener("trionn-transition:complete", enableScroll);
    window.addEventListener("trionn-transition:start", stopScroll);
    window.addEventListener("trionn-transition:belts-closed", stopScroll);
    window.addEventListener("trionn-modal:open", stopScroll);
    window.addEventListener("trionn-modal:close", enableScroll);

    if (document.readyState === "complete") {
      if (document.documentElement.dataset.trionnLoaderComplete === "true") {
        enableScroll();
      }
    }

    return () => {
      window.removeEventListener("trionn-loader:complete", enableScroll);
      window.removeEventListener("trionn-transition:complete", enableScroll);
      window.removeEventListener("trionn-transition:start", stopScroll);
      window.removeEventListener("trionn-transition:belts-closed", stopScroll);
      window.removeEventListener("trionn-modal:open", stopScroll);
      window.removeEventListener("trionn-modal:close", enableScroll);
    };
  }, []);

  // Handle page reload/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      lenisRef.current?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Spacebar manual scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        isSpacePressed.current = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") isSpacePressed.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let rafId: number;
    const tick = () => {
      if (isSpacePressed.current) {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(lenis.scroll + 15, { immediate: true });
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return null;
}
