"use client";

import TrionnServices from "@/components/Sections/Home/TrionnServices";
import Work, { type WorkHandle } from "@/components/Sections/Home/Work";
import {
  SERVICES_PIN_END_PERCENT,
  mapOverlapProgress,
  mapWorkHorizontalProgress,
} from "@/components/Sections/Home/servicesScrollConstants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

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
      const getMaxY = () =>
        Math.max(0, track.scrollHeight - workLayer.clientHeight);

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
        const maxY = getMaxY();
        const hx = mapWorkHorizontalProgress(p);
        const ox = mapOverlapProgress(p);

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isMobile = vw < 768; // matches tailwind md breakpoint

        let currentTrackX = 0;
        let currentTrackY = 0;

        if (isMobile) {
          // Vertical track scrub
          currentTrackY = hx * maxY;
          gsap.set(track, { x: 0, y: -currentTrackY, force3D: true });

          // Services stays behind
          gsap.set(services, { xPercent: 0, yPercent: 0, force3D: true });

          // Work layer slides up during overlap
          gsap.set(workLayer, {
            x: 0,
            y: -vh * ox,
            force3D: true,
          });
        } else {
          // Horizontal track scrub
          currentTrackX = hx * maxX;
          gsap.set(track, { x: -currentTrackX, y: 0, force3D: true });

          // Services stays behind
          gsap.set(services, { xPercent: 0, yPercent: 0, force3D: true });

          // Work layer slides left during overlap
          gsap.set(workLayer, {
            x: -vw * ox,
            y: 0,
            force3D: true,
          });
        }

        // Card entrance: simply rise from below to Y=0 and stay there
        const cardEls = bridge.querySelectorAll<HTMLElement>(".js-work-card");
        const introW = isMobile ? vw : 0.5 * vw;
        const cardW = isMobile ? 0.85 * vw : 0.5 * vw;

        cardEls.forEach((card, index) => {
          const inner = card.querySelector<HTMLElement>(".js-work-card-inner");
          const lines = card.querySelectorAll<HTMLElement>(".js-card-line");
          if (!inner) return;

          let norm: number;
          if (isMobile) {
            // Use actual DOM positions since vertical height can vary
            const cardTop = card.offsetTop;
            const cardCenterInTrack = cardTop + card.offsetHeight / 2;
            const screenY = cardCenterInTrack - currentTrackY;
            norm = screenY / vh;
          } else {
            // Card center on screen
            const cardLeftInTrack = introW + index * cardW;
            const cardCenterInTrack = cardLeftInTrack + cardW / 2;
            const screenX = cardCenterInTrack - currentTrackX;
            norm = screenX / vw;
          }

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

          // Divider line draws when card enters viewport
          if (norm < 1.0 && !lineFired.has(index)) {
            lineFired.add(index);
            const hLines = card.querySelectorAll<HTMLElement>(
              ".js-card-line-horizontal",
            );

            if (lines.length) {
              gsap.to(lines, {
                scaleY: 1,
                duration: 1.2,
                ease: "power2.out",
                delay: index * 0.1,
              });
            }
            if (hLines.length) {
              gsap.to(hLines, {
                scaleX: 1,
                duration: 1.2,
                ease: "power2.out",
                delay: index * 0.1,
              });
            }
          }
        });
      };

      initCards();

      const st = ScrollTrigger.create({
        trigger: bridge,
        start: "top top",
        end: `+=${SERVICES_PIN_END_PERCENT}%`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        markers: false,
        onUpdate: (self) => {
          progressObj.p = self.progress;
          renderTransforms();
        },
      });

      requestAnimationFrame(() => {
        progressObj.p = st.progress;
        renderTransforms();
      });

      let resizeRafId = 0;
      const onResize = () => {
        cancelAnimationFrame(resizeRafId);
        resizeRafId = requestAnimationFrame(() => {
          st.refresh();
          progressObj.p = st.progress;
          renderTransforms();
        });
      };

      const handleReady = () => {
        st.refresh();
      };

      window.addEventListener("resize", onResize);
      window.addEventListener("trionn-keyfacts:ready", handleReady);

      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("trionn-keyfacts:ready", handleReady);
        cancelAnimationFrame(resizeRafId);
      };
    },
    { dependencies: [] },
  );

  return (
    <div
      ref={bridgeRef}
      id="work-section"
      className="relative min-h-dvh h-dvh w-full overflow-hidden bg-white"
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
