'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/all';
import { ReactElement, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

interface MarqueeProps {
  children: ReactElement;
  speed?: number;
  direction?: 'left' | 'right';
  gap?: number;
  className?: string;
  draggable?: boolean;
  pauseOnHover?: boolean;
  defaultPaused?: boolean;
  stopSpeed?: number;
}

export default function Marquee({
  children,
  speed = 0.5,
  direction = 'left',
  gap = 40,
  className = '',
  draggable = false,
  pauseOnHover = false,
  defaultPaused = false,
  stopSpeed = 0.5,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const x = useRef(0);
  const dir = useRef(direction === 'left' ? -1 : 1);
  const itemWidth = useRef(0);

  const raf = useRef<number | null>(null);

  // State refs
  const isHovering = useRef(false);
  const isDragging = useRef(false);

  // 0 = stopped, 1 = full speed.
  // If defaultPaused is true, we start at 0, otherwise 1.
  const velocityFactor = useRef(defaultPaused ? 0 : 1);

  useGSAP(
    () => {
      if (!containerRef.current || !trackRef.current) return;

      const container = containerRef.current!;
      const track = trackRef.current!;
      const original = track.children[0] as HTMLElement;

      // 1. Setup Content
      original.style.marginRight = `${gap}px`;
      itemWidth.current = original.offsetWidth + gap;

      const clones = Math.ceil(container.offsetWidth / itemWidth.current) + 2;

      for (let i = 0; i < clones; i++) {
        const clone = original.cloneNode(true) as HTMLElement;
        clone.style.marginRight = `${gap}px`;
        track.appendChild(clone);
      }

      // 2. Scroll Direction Control
      // ScrollTrigger.create({
      //   trigger: document.documentElement,
      //   start: 'top bottom',
      //   end: 'bottom top',
      //   onUpdate(self) {
      //     // Only update direction if we aren't dragging
      //     if (!isDragging.current) {
      //       dir.current = self.direction === 1 ? 1 : -1;
      //       if (direction === 'left') dir.current *= -1;
      //     }
      //   },
      // });

      const wrap = () => {
        if (x.current <= -itemWidth.current) {
          x.current += itemWidth.current;
        } else if (x.current >= 0) {
          x.current -= itemWidth.current;
        }
      };

      // 3. The Animation Loop
      const animate = () => {
        if (!isDragging.current) {
          // Determine Target Speed based on configuration and state
          let targetFactor = 1;

          if (defaultPaused) {
            // If defaultPaused: Run only when hovering
            targetFactor = isHovering.current ? 1 : 0;
          } else if (pauseOnHover) {
            // If NOT defaultPaused (standard): Stop when hovering
            targetFactor = isHovering.current ? 0 : 1;
          }

          // LERP (Linear Interpolation) for smooth start/stop
          // 0.05 is the "friction" - lower = slower stop, higher = faster stop
          velocityFactor.current += (targetFactor - velocityFactor.current) * stopSpeed;

          // Optimization: stop calculation if completely stopped
          if (Math.abs(velocityFactor.current) > 0.001) {
            x.current += speed * dir.current * velocityFactor.current;
            wrap();
            gsap.set(track, { x: x.current });
          }
        }

        raf.current = requestAnimationFrame(animate);
      };

      animate();

      // 4. Draggable Logic
      if (draggable) {
        Draggable.create(track, {
          type: 'x',
          inertia: true,
          dragResistance: 0.12, //  higher = slower drag
          throwResistance: 2500, // higher = slower throw

          onPress() {
            isDragging.current = true;
            gsap.killTweensOf(track);
          },
          onDrag() {
            x.current = this.x;
            // Calculate direction based on drag
            // dir.current = this.deltaX > 0 ? 1 : -1;
            wrap();
          },
          onThrowUpdate() {
            x.current = this.x;
            wrap();
          },
          onRelease() {
            // Resume automatic movement logic
            isDragging.current = false;
          },
        });
      }

      // 5. Hover Listeners
      const handleMouseEnter = () => {
        isHovering.current = true;
      };
      const handleMouseLeave = () => {
        isHovering.current = false;
      };

      // We attach these if either feature is enabled
      if (pauseOnHover || defaultPaused) {
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);
      }

      return () => {
        if (raf.current) cancelAnimationFrame(raf.current);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    },
    {
      scope: containerRef,
      dependencies: [direction, speed, gap, draggable, pauseOnHover, defaultPaused],
    }
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${draggable ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}
