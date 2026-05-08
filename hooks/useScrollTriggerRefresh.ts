import { useEffect, RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

/**
 * Refreshes ScrollTrigger (and optionally a timeline's ScrollTrigger) on:
 * - window resize
 * - a custom DOM event (default: "accordion-settled")
 *
 * Pass `tlRef` when the section has a pinned gsap.timeline whose ScrollTrigger
 * needs to be individually refreshed (e.g. HowWork). The ref is read inside
 * the effect so it is always current without causing render-time ref access.
 * Omit it to fall back to a global ScrollTrigger.refresh().
 */
export function useScrollTriggerRefresh(
  tlRef?: RefObject<gsap.core.Timeline | null>,
  eventName: string = "accordion-settled",
) {
  useEffect(() => {
    const handleEvent = () => {
      if (tlRef?.current) {
        tlRef.current.scrollTrigger?.refresh();
      } else {
        ScrollTrigger.refresh();
      }
    };

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener(eventName, handleEvent);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(eventName, handleEvent);
      window.removeEventListener("resize", handleResize);
    };
  }, [tlRef, eventName]);
}
