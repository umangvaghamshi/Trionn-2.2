"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import Marquee from "./Marquee";

interface CursorFollowMarqueeProps {
  text: string;
  show?: boolean;
  containerRef?: React.RefObject<HTMLElement | null>;
  excludeSelectors?: string[];
}

export default function CursorFollowMarquee({
  text,
  show = true,
  containerRef,
  excludeSelectors = [],
}: CursorFollowMarqueeProps) {
  const followerRef = useRef<HTMLDivElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(false);
  const isMouseDown = useRef(false);
  const lastMouse = useRef({ x: -9999, y: -9999 });
  const showRef = useRef(show);
  useEffect(() => {
    showRef.current = show;
    // When hidden externally, immediately hide the follower
    if (!show && isVisible.current) {
      gsap.to(followerRef.current, { opacity: 0, scale: 0.5, duration: 0.3 });
      isVisible.current = false;
    }
  }, [show]);

  useGSAP(
    () => {
      const follower = followerRef.current;
      if (!follower) return;

      // Initial state: hidden
      gsap.set(follower, { opacity: 0, scale: 0.5 });

      const checkVisibility = (clientX: number, clientY: number) => {
        if (!containerRef || !containerRef.current) {
          if (showRef.current) {
            gsap.to(follower, {
              x: clientX,
              y: clientY,
              xPercent: 0,
              yPercent: 0,
              duration: 0.6,
              ease: "power3.out",
              opacity: 1,
              scale: 1,
            });
            isVisible.current = true;
          } else {
            gsap.to(follower, { opacity: 0, scale: 0.5, duration: 0.3 });
            isVisible.current = false;
          }
          return;
        }

        // Check if mouse is inside container
        const rect = containerRef.current.getBoundingClientRect();
        let isIn =
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom;

        // Check if cursor is over any excluded selector
        if (isIn && excludeSelectors.length > 0) {
          for (const selector of excludeSelectors) {
            const els = document.querySelectorAll(selector);
            for (const el of els) {
              const exRect = el.getBoundingClientRect();
              const isExcluded =
                clientX >= exRect.left &&
                clientX <= exRect.right &&
                clientY >= exRect.top &&
                clientY <= exRect.bottom;
              if (isExcluded) { isIn = false; break; }
            }
            if (!isIn) break;
          }
        }

        if (isIn && showRef.current && !isMouseDown.current) {
          if (!isVisible.current) {
            gsap.to(follower, { opacity: 1, scale: 1, duration: 0.3 });
            isVisible.current = true;
          }
          gsap.to(follower, {
            x: clientX,
            y: clientY,
            xPercent: 0,
            yPercent: 0,
            duration: 0.6,
            ease: "power3.out",
          });
        } else if (isVisible.current) {
          gsap.to(follower, { opacity: 0, scale: 0.5, duration: 0.3 });
          isVisible.current = false;
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        lastMouse.current.x = e.clientX;
        lastMouse.current.y = e.clientY;
        checkVisibility(e.clientX, e.clientY);

        // Hide marquee text when hovering over a link
        const target = e.target as Element;
        const isLink = !!target.closest("a");
        const marqueeWrap = marqueeWrapRef.current;
        if (marqueeWrap) {
          gsap.to(marqueeWrap, {
            opacity: isLink ? 0 : 1,
            duration: 0.2,
          });
        }
      };

      const handleMouseDown = () => {
        isMouseDown.current = true;
        if (isVisible.current) {
          gsap.to(follower, { opacity: 0, scale: 0.5, duration: 0.3 });
          isVisible.current = false;
        }
      };

      const handleMouseUp = () => {
        isMouseDown.current = false;
      };

      const handleMouseLeave = () => {
        if (isVisible.current) {
          gsap.to(follower, { opacity: 0, scale: 0.5, duration: 0.3 });
          isVisible.current = false;
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseLeave);
      if (containerRef?.current) {
        containerRef.current.addEventListener("mouseleave", handleMouseLeave);
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseLeave);
        if (containerRef?.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          containerRef.current.removeEventListener(
            "mouseleave",
            handleMouseLeave,
          );
        }
      };
    },
    { dependencies: [text], scope: followerRef },
  );

  // Re-check cursor visibility on every Lenis scroll tick (synced with GSAP ticker)
  useLenis(() => {
    const { x, y } = lastMouse.current;
    if (x === -9999) return;
    const follower = followerRef.current;
    if (!follower) return;
    if (!containerRef?.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const isIn =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (isIn && showRef.current && !isMouseDown.current && !isVisible.current) {
      gsap.to(follower, { opacity: 1, scale: 1, duration: 0.3 });
      isVisible.current = true;
    } else if (!isIn && isVisible.current) {
      gsap.to(follower, { opacity: 0, scale: 0.5, duration: 0.3 });
      isVisible.current = false;
    }
  });

  return (
    <div
      ref={followerRef}
      className="fixed top-0 left-0 z-99999 pointer-events-none"
      style={{ width: "180px", opacity: 0 }}
    >
      <div ref={marqueeWrapRef} className="bg-[#000] border py-1 px-2  overflow-hidden ">
        <Marquee speed={1} gap={15}>
          <p className="uppercase tracking-widest text-white text-sm! whitespace-nowrap">
            {text} &nbsp; • &nbsp;
          </p>
        </Marquee>
      </div>
    </div>
  );
}
