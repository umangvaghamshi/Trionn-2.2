"use client";

import { useEffect } from "react";
import Stats from "stats.js";

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.dom.style.position = "fixed";
    stats.dom.style.top = "0px";
    stats.dom.style.left = "0px";
    stats.dom.style.zIndex = "9999999";
    stats.dom.style.pointerEvents = "none";
    document.body.appendChild(stats.dom);

    let animationFrameId: number;
    const animate = () => {
      stats.begin();
      // monitored code goes here
      stats.end();
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (document.body.contains(stats.dom)) {
        document.body.removeChild(stats.dom);
      }
    };
  }, []);

  return null;
}
