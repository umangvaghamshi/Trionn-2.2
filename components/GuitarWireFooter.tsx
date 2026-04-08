"use client";

import { useRef } from "react";
import { useGuitarSound, useFogEffect, useGuitarStrings } from "@/hooks";
import { GUITAR_WIRE_PATHS, SVG_VIEWBOX } from "@/data/svg-paths";

export default function GuitarWireFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { soundEnabled, toggleSound, pluck, smokeState, analyserRef } =
    useGuitarSound();

  useFogEffect(canvasRef, { analyserRef, smokeState });
  useGuitarStrings(svgRef, { pluck, smokeState });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#000]">
      {/* Fog background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      />

      {/* Sound toggle */}
      <div className="absolute top-3.5 right-3.5 z-[9999]">
        <button
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          className={`
            border rounded-full px-[18px] py-2.5 text-[13px] text-white
            cursor-pointer select-none tracking-wide
            backdrop-blur-lg shadow-[0_6px_18px_rgba(0,0,0,0.28)]
            transition-all duration-150 ease-out
            hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(0,0,0,0.38)]
            ${
              soundEnabled
                ? "border-white/[0.38] bg-white/[0.14]"
                : "border-white/[0.18] bg-white/[0.08]"
            }
          `}
        >
          Sound: {soundEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {/* SVG stage */}
      <div className="absolute inset-0 w-screen h-screen flex flex-col justify-end z-[1] mix-blend-difference">
        <svg
          ref={svgRef}
          viewBox={SVG_VIEWBOX}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block shrink-0"
        >
          {GUITAR_WIRE_PATHS.map((d, i) => (
            <path key={i} d={d} stroke="#D8D8D8" />
          ))}
        </svg>
      </div>

      {/* Guitar string styles (non-Tailwind SVG specifics) */}
      <style jsx global>{`
        .guitar-string {
          stroke-width: 0.6 !important;
          cursor: pointer;
          vector-effect: non-scaling-stroke;
          stroke-linecap: round;
        }
        .guitar-string:hover {
          stroke-width: 0.6 !important;
        }
      `}</style>
    </div>
  );
}
