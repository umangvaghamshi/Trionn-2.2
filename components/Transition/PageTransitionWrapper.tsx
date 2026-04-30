"use client";

import { useTransition } from "./TransitionContext";
import { type ReactNode } from "react";

interface PageTransitionWrapperProps {
  children: ReactNode;
}

/**
 * Wraps page content and controls its visibility during loader/transitions.
 *
 * During the INITIAL LOADER phase:
 *   - Uses `visibility:hidden` so the browser skips painting the content
 *     entirely. This prevents page animations (GSAP, canvas) from
 *     visually completing before the user sees the page.
 *
 * During PAGE TRANSITIONS (after loader has completed once):
 *   - Uses only `opacity:0` + `pointer-events:none`. Content stays
 *     `visibility:visible` so the browser can pre-render it behind
 *     the belts without a rendering spike when revealed.
 */
export default function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const { isContentVisible, isLoaderComplete } = useTransition();

  // During the initial loader (before it has ever completed),
  // use visibility:hidden to truly prevent painting.
  // After loader has completed once, only use opacity for transitions.
  const duringInitialLoader = !isLoaderComplete && !isContentVisible;

  return (
    <div
      style={{
        opacity: isContentVisible ? 1 : 0,
        visibility: duringInitialLoader ? "hidden" : "visible",
        pointerEvents: isContentVisible ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
}
