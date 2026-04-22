"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useInView } from "react-intersection-observer";

interface OdometerProps {
  value: string | number;
  duration?: number;
  className?: string;
  trigger?: boolean; // hover trigger
  /** When set, skips in-view autoplay; roll runs once the count goes above 0 (first time only per mount). */
  syncPlayCount?: number;
}

export function Odometer({
  value,
  duration = 2,
  className = "",
  trigger = false,
  syncPlayCount,
}: OdometerProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const digitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sampleDigitRef = useRef<HTMLSpanElement | null>(null);

  const [digitHeight, setDigitHeight] = useState(0);

  // ✅ Track first view animation
  const hasAnimatedOnView = useRef(false);
  const hasSyncRolled = useRef(false);

  // ✅ Track hover state change
  const prevTrigger = useRef(false);

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true, // ✅ only first time
  });

  const numberStack = Array.from({ length: 10 }, (_, i) => i);
  const displayValue = String(value);

  const tokens = displayValue.split("").map((char) => {
    if (/\d/.test(char)) {
      return { type: "digit" as const, value: Number(char) };
    }
    return { type: "static" as const, value: char };
  });

  /* 📏 Measure digit height */
  useLayoutEffect(() => {
    if (!sampleDigitRef.current) return;

    const measure = () => {
      const h = sampleDigitRef.current!.getBoundingClientRect().height;
      if (h > 0) setDigitHeight(h);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { contextSafe } = useGSAP({ scope: containerRef });

  /* 🎬 Animate */
  const animateOdometer = contextSafe(() => {
    let digitIndex = 0;

    tokens.forEach((token, i) => {
      if (token.type !== "digit") return;

      const col = digitRefs.current[i];
      if (!col) return;

      gsap.killTweensOf(col); // ✅ prevent stacking
      gsap.set(col, { y: 0 });

      gsap.to(col, {
        y: -token.value * digitHeight,
        duration,
        delay: digitIndex * 0.1,
        ease: "power3.inOut",
      });

      digitIndex++;
    });
  });

  /* 🎯 Control logic */
  useEffect(() => {
    if (!digitHeight) return;

    if (syncPlayCount !== undefined) {
      if (hasSyncRolled.current) {
        prevTrigger.current = trigger;
        return;
      }
      if (syncPlayCount > 0) {
        hasSyncRolled.current = true;
        animateOdometer();
      }
      prevTrigger.current = trigger;
      return;
    }

    // ✅ First time in view
    if (inView && !hasAnimatedOnView.current) {
      animateOdometer();
      hasAnimatedOnView.current = true;
    }

    // ✅ Hover IN only (false → true)
    if (trigger && !prevTrigger.current) {
      animateOdometer();
    }

    // ❌ Hover OUT → do nothing

    prevTrigger.current = trigger;
  }, [inView, trigger, digitHeight, displayValue, syncPlayCount]);

  return (
    <span className="relative inline-flex" ref={(el) => {
      containerRef.current = el;
      inViewRef(el);
    }}>
      {/* 👻 Hidden measurement */}
      <span
        ref={sampleDigitRef}
        className={`pointer-events-none absolute inline-block tabular-nums opacity-0 ${className}`}
        aria-hidden="true"
      >
        0
      </span>

      {/* Static fallback */}
      <span
        className={`pr-2 whitespace-nowrap tabular-nums ${className} ${
          digitHeight > 0 ? "invisible" : "visible"
        }`}
      >
        {displayValue}
      </span>

      {/* 🎡 Odometer */}
      {digitHeight > 0 && (
        <div
          className={`absolute inset-0 flex justify-center overflow-hidden ${className}`}
          style={{ height: digitHeight }}
        >
          {tokens.map((token, i) =>
            token.type === "static" ? (
              <span
                key={i}
                className="inline-flex items-center justify-center tabular-nums"
                style={{ height: digitHeight }}
              >
                {token.value}
              </span>
            ) : (
              <div
                key={i}
                className="flex flex-col"
                ref={(el) => {
                  digitRefs.current[i] = el;
                }}
              >
                {numberStack.map((num) => (
                  <span
                    key={num}
                    className="inline-flex items-center justify-center tabular-nums"
                    style={{ height: digitHeight }}
                  >
                    {num}
                  </span>
                ))}
              </div>
            ),
          )}
        </div>
      )}
    </span>
  );
}
