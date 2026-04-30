"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns `true` only after the transition system has finished
 * (either the initial loader or a page transition sweep-out).
 *
 * Canvas/WebGL components should gate their RAF loop start on this
 * flag to avoid competing with belt sweep-out animations for GPU time.
 *
 * Usage:
 *   const ready = useTransitionReady();
 *   useEffect(() => {
 *     if (!ready) return;
 *     // start RAF loop, init WebGL, etc.
 *   }, [ready]);
 */
export function useTransitionReady(): boolean {
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  useEffect(() => {
    // If loader already completed before this component mounted
    // (e.g. hard reload on a page with canvas), check immediately
    const checkImmediate = () => {
      // The loader dispatches 'trionn-loader:complete' once.
      // If it already fired, the phase is 'idle' and we can start.
      // We detect this via a simple marker on document.
      if (document.documentElement.dataset.trionnReady === "true") {
        readyRef.current = true;
        setReady(true);
        return true;
      }
      return false;
    };

    if (checkImmediate()) return;

    const onComplete = () => {
      if (readyRef.current) return;
      readyRef.current = true;
      // Mark document so late-mounting components know immediately
      document.documentElement.dataset.trionnReady = "true";
      setReady(true);
    };

    window.addEventListener("trionn-loader:complete", onComplete);
    window.addEventListener("trionn-transition:complete", onComplete);

    return () => {
      window.removeEventListener("trionn-loader:complete", onComplete);
      window.removeEventListener("trionn-transition:complete", onComplete);
    };
  }, []);

  return ready;
}
