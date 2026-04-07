'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useEffect } from 'react';
import Marquee from './Marquee';

interface CursorFollowMarqueeProps {
  text: string;
  show?: boolean;
  containerRef?: React.RefObject<HTMLElement | null>;
  excludeRef?: React.RefObject<HTMLElement | null>;
}

export default function CursorFollowMarquee({
  text,
  show = true,
  containerRef,
  excludeRef,
}: CursorFollowMarqueeProps) {
  const followerRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(false);
  const isMouseDown = useRef(false);

  useGSAP(
    () => {
      const follower = followerRef.current;
      if (!follower) return;

      // Initial state: hidden
      gsap.set(follower, { opacity: 0, scale: 0.5 });

      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef || !containerRef.current) {
          // If no container provided, follow everywhere (if show is true)
          if (show) {
            gsap.to(follower, {
              x: e.clientX,
              y: e.clientY,
              xPercent: 0,
              yPercent: 0,
              duration: 0.6,
              ease: 'power3.out',
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
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        // Check if cursor should be excluded
        if (isIn && excludeRef?.current) {
          const exRect = excludeRef.current.getBoundingClientRect();
          const isExcluded =
            e.clientX >= exRect.left &&
            e.clientX <= exRect.right &&
            e.clientY >= exRect.top &&
            e.clientY <= exRect.bottom;
          if (isExcluded) isIn = false;
        }

        if (isIn && show && !isMouseDown.current) {
          if (!isVisible.current) {
            gsap.to(follower, { opacity: 1, scale: 1, duration: 0.3 });
            isVisible.current = true;
          }
          gsap.to(follower, {
            x: e.clientX,
            y: e.clientY,
            xPercent: 0,
            yPercent: 0,
            duration: 0.6,
            ease: 'power3.out',
          });
        } else if (isVisible.current) {
          gsap.to(follower, { opacity: 0, scale: 0.5, duration: 0.3 });
          isVisible.current = false;
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

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      if (containerRef?.current) {
        containerRef.current.addEventListener('mouseleave', handleMouseLeave);
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        if (containerRef?.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    },
    { dependencies: [show, text], scope: followerRef }
  );

  return (
    <div
      ref={followerRef}
      className="fixed top-0 left-0 z-99999 pointer-events-none"
      style={{ width: '180px', opacity: 0 }}
    >
      <div className="bg-[#000] border py-1 px-2  overflow-hidden text-[9px]">
        <Marquee speed={1} gap={15}>
          <p className="uppercase tracking-widest text-white whitespace-nowrap">
            {text} &nbsp; • &nbsp;
          </p>
        </Marquee>
      </div>
    </div>
  );
}
