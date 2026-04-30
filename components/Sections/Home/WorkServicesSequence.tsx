"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import TrionnServices from "@/components/Sections/Home/TrionnServices";
import Work, { type WorkHandle } from "@/components/Sections/Home/Work";
import {
  SERVICES_PIN_END_PERCENT,
  mapOverlapProgress,
  mapWorkHorizontalProgress,
} from "@/components/Sections/Home/servicesScrollConstants";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cards simply rise from below and stick at center (Y=0).
 * No staircase, no upward exit, no clip-path wipe.
 * Vertical divider lines draw top→bottom with stagger.
 */
export default function WorkServicesSequence() {
  const bridgeRef = useRef<HTMLDivElement>(null);
  const workTrackRef = useRef<HTMLDivElement>(null);
  const workLayerRef = useRef<HTMLDivElement>(null);
  const servicesLayerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const workHandleRef = useRef<WorkHandle | null>(null);

  useGSAP(
    () => {
      const bridge = bridgeRef.current;
      const track = workTrackRef.current;
      const workLayer = workLayerRef.current;
      const services = servicesLayerRef.current;
      if (!bridge || !track || !services || !workLayer) return;

      const lineFired = new Set<number>();
      const panelFired = new Set<number>();

      const getMaxX = () =>
        Math.max(0, track.scrollWidth - workLayer.clientWidth);

      const progressObj = { p: 0 };

      // Cards start below center
      const initCards = () => {
        const vw = window.innerWidth;
        const isMobile = vw < 768;

        const cardEls = bridge.querySelectorAll<HTMLElement>(".js-work-card");
        cardEls.forEach((card, index) => {
          const inner = card.querySelector<HTMLElement>(".js-work-card-inner");
          if (!inner) return;
          // On mobile, start at Y=0 (no bottom animation). On desktop, start at Y=550.
          gsap.set(inner, { y: isMobile ? 0 : 550, opacity: 1, force3D: true });
        });

        const lineEls = bridge.querySelectorAll<HTMLElement>(".js-card-line");
        lineEls.forEach((line) => {
          gsap.set(line, { scaleY: 0, transformOrigin: "top", force3D: true });
        });

        gsap.set(services, { xPercent: 0 });
      };

      const renderTransforms = () => {
        const p = progressObj.p;
        progressRef.current = p;

        const maxX = getMaxX();
        const hx = mapWorkHorizontalProgress(p);
        const ox = mapOverlapProgress(p);

        // Horizontal track scrub
        const currentTrackX = hx * maxX;
        gsap.set(track, { x: -currentTrackX, force3D: true });

        // Services stays behind
        gsap.set(services, { xPercent: 0, force3D: true });

        // Work layer slides left during overlap
        gsap.set(workLayer, {
          x: -window.innerWidth * ox,
          force3D: true,
        });

        // Card entrance: simply rise from below to Y=0 and stay there
        const cardEls = bridge.querySelectorAll<HTMLElement>(".js-work-card");
        const vw = window.innerWidth;
        const isMobile = vw < 768; // matches tailwind md breakpoint
        const introW = isMobile ? vw : 0.5 * vw;
        const cardW = isMobile ? 0.85 * vw : 0.5 * vw;

        cardEls.forEach((card, index) => {
          const inner = card.querySelector<HTMLElement>(".js-work-card-inner");
          const lines = card.querySelectorAll<HTMLElement>(".js-card-line");
          if (!inner) return;

          // Card center on screen
          const cardLeftInTrack = introW + index * cardW;
          const cardCenterInTrack = cardLeftInTrack + cardW / 2;
          const screenX = cardCenterInTrack - currentTrackX;
          const norm = screenX / vw;

          // Simple entry: card rises from below (+550) to Y=0 and stays
          // Card 3 only ever reaches norm = 0.75 at max scroll, so it MUST finish rising before then.
          const entryStart = 1.2; // starts rising much later (when card is almost fully in view horizontally)
          const entryEnd = 0.5; // fully settled by here
          let y: number;

          if (isMobile) {
            // No rising animation on mobile, just stay at 0
            y = 0;
          } else if (norm > entryStart) {
            // Not yet visible
            y = 550;
          } else if (norm > entryEnd) {
            // Rising from bottom to center
            // p goes from 0 (just entering) to 1 (fully arrived)
            const p = (entryStart - norm) / (entryStart - entryEnd);

            // True power3.out ease: starts fast, slows down smoothly at the end
            const easeOut = 1 - Math.pow(1 - p, 3);

            // y goes from 550 to 0 based on the easeOut curve
            y = 550 * (1 - easeOut);
          } else {
            // Arrived — stays here
            y = 0;
          }

          gsap.set(inner, { y, force3D: true });

          // Text content reveal timeline
          if (norm < 1.05 && !panelFired.has(index)) {
            panelFired.add(index);
            workHandleRef.current?.playPanel(index);
          }

          // Divider line draws top→bottom when card enters viewport
          if (lines.length && norm < 1.1 && !lineFired.has(index)) {
            lineFired.add(index);
            gsap.to(lines, {
              scaleY: 1,
              duration: 1.2,
              ease: "power2.out",
              delay: index * 0.1,
            });
          }
        });
      };

      initCards();

      const progressTo = gsap.quickTo(progressObj, "p", {
        duration: 0.5,
        ease: "power3.out",
        onUpdate: renderTransforms,
      });

      const st = ScrollTrigger.create({
        trigger: bridge,
        start: "top top",
        end: `+=${SERVICES_PIN_END_PERCENT}%`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          progressTo(self.progress);
        },
      });

      requestAnimationFrame(() => {
        progressObj.p = st.progress;
        renderTransforms();
      });

      const onResize = () => {
        progressObj.p = st.progress;
        renderTransforms();
      };
      window.addEventListener("resize", onResize);

      // Refresh on window load to fix hard reload layout shifts
      const onLoad = () => {
        ScrollTrigger.refresh();
      };
      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }

      // Additional refresh to catch late-loading fonts/images
      const timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("load", onLoad);
        clearTimeout(timeoutId);
        st.kill();
      };
    },
    { dependencies: [] },
  );

  return (
    <div
      ref={bridgeRef}
      id="work-section"
      className="relative h-screen w-full overflow-hidden bg-white"
    >
      <div
        ref={servicesLayerRef}
        className="absolute inset-0 z-1 will-change-transform"
      >
        <TrionnServices scrollProgressRef={progressRef} embedded />
      </div>

      <div
        ref={workLayerRef}
        className="absolute inset-0 z-2 overflow-visible pointer-events-none will-change-transform"
      >
        <Work trackRef={workTrackRef} workHandleRef={workHandleRef} />
      </div>
    </div>
  );
}
