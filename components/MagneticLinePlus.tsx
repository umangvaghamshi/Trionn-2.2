"use client";

import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type MagneticLinePlusProps = {
  className?: string;
  /** wrapper div height in px */
  heightPx?: number;
  /** internal SVG viewBox height — lower = tighter magnetic travel */
  svgHeight?: number;
  /** background color of the wrapper */
  bgColor?: string;
  /** stroke color of the horizontal line */
  lineColor?: string;
  /** stroke color of the plus icon */
  plusColor?: string;
  /**
   * Grid column where the plus icon rests (1-based, same as col-start-N).
   * The component converts this to a viewBox X position automatically.
   * Default is the centre column.
   */
  plusCol?: number;
  /** Total number of grid columns in the parent grid. Default 12. */
  totalCols?: number;
  /**
   * Half-arm length of the plus icon in viewBox units.
   * LinePlus renders a 13px icon; at ~1320px container width the scale is
   * 1648/1320 ≈ 1.25, so 13px × 1.25 / 2 ≈ 8 viewBox units per arm half.
   * Default 8 matches LinePlus visually.
   */
  plusHalfSize?: number;
  drawOnMount?: boolean;
};

type Pt = { x: number };

export default function MagneticLinePlus({
  className = "",
  heightPx = 120,
  svgHeight = 120,
  bgColor = "#ffffff",
  lineColor = "#434343",
  plusColor = "#272727",
  plusCol,
  totalCols = 12,
  plusHalfSize = 8,
  drawOnMount = false,
}: MagneticLinePlusProps) {
  const W = 1648;
  // Convert col-start (1-based) to a 0-based fraction then to viewBox X.
  // col-start-9 of 12 means the left edge of column 9, i.e. 8/12 across.
  const plusX = plusCol != null ? (W / totalCols) * (plusCol - 1) : W / 2;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hitRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<SVGPathElement | null>(null);
  const plusRef = useRef<SVGGElement | null>(null);
  const plusWrapperRef = useRef<SVGGElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const H = svgHeight;
  const baseY = svgHeight / 2;

  const segs = 220;
  const tol = 16;
  const spread = 105;
  const maxPull = 190;
  const intentRange = 190;
  const followX = 0.26;
  const followY = 0.34;

  const pts = useMemo<Pt[]>(
    () => Array.from({ length: segs + 1 }, (_, i) => ({ x: (W / segs) * i })),
    [segs]
  );

  useGSAP(() => {
    const svg = svgRef.current;
    const hit = hitRef.current;
    const line = lineRef.current;
    const plus = plusRef.current;
    const plusWrapper = plusWrapperRef.current;

    if (!svg || !hit || !line || !plus || !plusWrapper) return;

    const state = { mx: plusX, my: baseY, amp: 0 };
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    const falloff = (x: number) => {
      const d = Math.abs(x - state.mx) / spread;
      if (d >= 1) return 0;
      return Math.pow(1 - d, 3.4);
    };

    const offsetAt = (x: number) => {
      const pull = clamp(state.my - baseY, -maxPull, maxPull);
      return pull * state.amp * falloff(x);
    };

    const lineYAt = (x: number) => baseY + offsetAt(x);

    const draw = () => {
      let d = `M ${pts[0].x.toFixed(2)} ${lineYAt(pts[0].x).toFixed(2)}`;
      for (let i = 1; i < pts.length; i++) {
        const x = pts[i].x;
        d += ` L ${x.toFixed(2)} ${lineYAt(x).toFixed(2)}`;
      }
      line.setAttribute("d", d);

      const px = clamp(state.mx, 0, W);

      plusWrapper.setAttribute(
        "transform",
        `translate(${px.toFixed(2)}, ${lineYAt(px).toFixed(2)})`
      );
    };


    const pointerToSvg = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * W,
        y: ((e.clientY - r.top) / r.height) * H,
      };
    };

    let active = false;

    const activate = () => {
      if (active) return;
      active = true;
      gsap.killTweensOf(state);
      gsap.to(state, { amp: 1, duration: 0.14, ease: "expo.out" });
    };

    const deactivate = () => {
      if (!active) return;
      active = false;
      gsap.killTweensOf(state);
      gsap.to(state, { amp: 0, duration: 0.9, ease: "expo.out" });
      gsap.to(state, { mx: plusX, my: baseY, duration: 1.0, ease: "expo.out" });
    };

    const applyPointer = (p: { x: number; y: number }) => {
      state.mx += (p.x - state.mx) * followX;
      const projected = lineYAt(p.x);
      const intent = clamp(p.y - projected, -intentRange, intentRange);
      state.my += (projected + intent - state.my) * followY;
    };

    const onMove = (e: PointerEvent) => {
      const p = pointerToSvg(e);
      const near = Math.abs(p.y - lineYAt(p.x)) <= tol;
      if (near) activate();
      else deactivate();

      if (active) applyPointer(p);
    };

    const onLeave = () => deactivate();
    draw();


    // Draw line on scroll
    gsap.set(line, {
      scaleX: 0,
      transformOrigin: 'left'
    });

    //  Draw Line Timeline
    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'none',
      },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
        markers: false,
        onLeave: () => {
          gsap.ticker.add(draw);

        },
        onEnterBack: () => {
          gsap.ticker.remove(draw);
        },
        onEnter: () => {
          gsap.ticker.remove(draw);
        }
      },
    });

    tl.to(line, {
      scaleX: 1,
    });

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        markers: false,
      },
    });

    tl2.to(plus, {
      rotation: 360 * 2,
      transformOrigin: "50% 50%",
      ease: "none",
    });



    hit.addEventListener("pointermove", onMove, { passive: true });
    hit.addEventListener("pointerleave", onLeave);

    return () => {
      hit.removeEventListener("pointermove", onMove);
      hit.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(state);
    };
  }, {
    scope: sectionRef,
    dependencies: [
      pts,
      drawOnMount,
      W,
      H,
      baseY,
      tol,
      spread,
      maxPull,
      intentRange,
      followX,
      followY,
      plusX,
    ]
  });

  return (
    <div ref={sectionRef} className={`grid place-items-center ${className}`} style={{ backgroundColor: bgColor }}>
      <div
        className="relative w-full "
        style={{ height: `${heightPx}px` }}
      >
        <div ref={hitRef} className="absolute inset-0 cursor-default touch-none" />

        <svg
          ref={svgRef}
          viewBox={`0 0 1648 ${svgHeight}`}
          aria-label="Magnetic line"
          className="block h-full w-full overflow-visible "
        >
          <path
            ref={lineRef}
            d=""
            className="vector-effect-non-scaling-stroke"
            style={{
              stroke: lineColor,
              strokeOpacity: 0.15,
              strokeWidth: 1,
              fill: "none",
              strokeLinecap: "butt",
            }}
          />
          <g ref={plusWrapperRef}>
            <g ref={plusRef}>
              <line
                x1="0"
                y1={-plusHalfSize}
                x2="0"
                y2={plusHalfSize}
                style={{ stroke: plusColor, strokeWidth: 1, strokeLinecap: "butt" }}
              />
              <line
                x1={plusHalfSize}
                y1="0"
                x2={-plusHalfSize}
                y2="0"
                style={{ stroke: plusColor, strokeWidth: 1, strokeLinecap: "butt" }}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}