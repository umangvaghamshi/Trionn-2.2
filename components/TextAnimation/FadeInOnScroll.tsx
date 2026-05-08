"use client";

import React, { ElementType, ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";
import { useTransitionReady } from "@/components/Transition";

interface FadeInOnScrollProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
  once?: boolean;
}

const FadeInOnScroll = ({
  as: Tag = "div",
  children,
  className = "",
  y = 40,
  duration = 0.8,
  delay = 0,
  ease = "power2.out",
  start = "top 85%",
  once = true,
}: FadeInOnScrollProps) => {
  const ref = useRef<HTMLElement>(null);
  const transitionReady = useTransitionReady();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let observer: IntersectionObserver | null = null;
    let cleaned = false;

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y, force3D: true });
    });

    if (!transitionReady) {
      return () => {
        cleaned = true;
        ctx.revert();
      };
    }

    const match = start.match(/top\s+(\d+)%/);
    const bottomMargin = match ? `${-(100 - parseInt(match[1], 10))}%` : "0%";

    const startObserver = () => {
      if (cleaned || observer) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration,
              delay,
              ease,
              force3D: true,
            });
            if (once) observer?.disconnect();
          }
        },
        { threshold: 0, rootMargin: `0px 0px ${bottomMargin} 0px` },
      );

      observer.observe(el);
    };

    startObserver();

    return () => {
      cleaned = true;
      observer?.disconnect();
      ctx.revert();
    };
  }, [y, duration, delay, ease, start, once, transitionReady]);

  return React.createElement(Tag, { ref, className }, children);
};

export default FadeInOnScroll;
