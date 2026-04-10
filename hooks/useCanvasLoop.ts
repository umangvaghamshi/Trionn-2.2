"use client";

import { useEffect, useRef } from "react";
import { getCanvasManager } from "@/lib/canvasManager";

interface Options {
  /**
   * The element to observe for visibility.
   * When null/undefined the loop runs unconditionally (no pause on scroll-away).
   */
  observeRef?: React.RefObject<Element | null>;
  /**
   * IntersectionObserver rootMargin — how much buffer to keep the loop alive
   * before the element actually enters the viewport (default "64px 0px").
   */
  rootMargin?: string;
  /**
   * IntersectionObserver threshold (default 0).
   */
  threshold?: number;
  /**
   * Start paused. Useful when the element is initially off-screen.
   * Default: true when observeRef is provided, false otherwise.
   */
  startPaused?: boolean;
}

/**
 * Register an animation loop with the global canvas manager.
 *
 * The loop is automatically:
 *  - paused when the observed element leaves the viewport
 *  - resumed when it re-enters
 *  - paused when the browser tab is hidden
 *  - cleaned up on unmount
 *
 * @param fn  The per-frame callback. Receives the RAF timestamp.
 * @param deps  Re-runs the hook when these change (same as useEffect deps).
 * @param opts  Visibility observation options.
 */
export function useCanvasLoop(
  fn: (timestamp: number) => void,
  deps: React.DependencyList,
  opts: Options = {},
) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const { observeRef, rootMargin = "64px 0px", threshold = 0 } = opts;

  useEffect(() => {
    const manager = getCanvasManager();

    const wrapper: (ts: number) => void = (ts) => fnRef.current(ts);

    const startPaused =
      opts.startPaused !== undefined ? opts.startPaused : !!observeRef;

    const id = manager.register(wrapper, !startPaused);

    let io: IntersectionObserver | null = null;

    if (observeRef) {
      io = new IntersectionObserver(
        ([entry]) => {
          manager.setActive(id, entry.isIntersecting);
        },
        { rootMargin, threshold },
      );

      const el = observeRef.current;
      if (el) io.observe(el);
    }

    return () => {
      manager.unregister(id);
      io?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Capped device pixel ratio — prevents over-rendering on high-DPI screens.
 * Uses 1.0 on mobile, capped at 1.5 on desktop.
 */
export function getCappedDPR(): number {
  if (typeof window === "undefined") return 1;
  const mobile = window.innerWidth < 768;
  return mobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
}
