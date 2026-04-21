"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ScheduleButton = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [time, setTime] = useState<string>("");

  useGSAP(() => {
    // Collapsed Logic
    ScrollTrigger.create({
      trigger: ".hero-section",
      start: 100,
      end: 101,
      onEnter: () => setCollapsed(true),
      onLeaveBack: () => setCollapsed(false),
    });
  }, []);

  useEffect(() => {
    const updateISTTime = () => {
      const now = new Date();
      const istString = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24-hour format
      });
      setTime(istString); // Format: HH:MM
    };

    updateISTTime(); // Initial call
    const timerId = setInterval(updateISTTime, 10000); // Update every 10s

    return () => clearInterval(timerId);
  }, []);

  return (
    <div
      className={`fixed right-10 mix-blend-difference bg-cream/4 hover:bg-cream/6 z-99 transition-all ease-in rounded-lg ${
        collapsed ? "bottom-10" : "bottom-10"
      }`}
    >
      <Link
        href="#"
        className="group schedule-btn px-6.5 py-4 flex justify-between items-center h-17.5"
      >
        <div
          className={`
          left-block flex flex-col overflow-hidden
          transition-[width,opacity] duration-300 ease-in-out
          ${
            collapsed
              ? "w-0 opacity-0 group-hover:w-40 group-hover:opacity-100"
              : "w-40 opacity-100"
          }
        `}
        >
          <span className="title mb-0.5 z-2 pr-5 whitespace-nowrap text-light-font">
            Schedule a call
          </span>
          <span className="text-light-font/40 title z-2 pr-5 whitespace-nowrap capitalize!">
            IST → {time || "Loading..."}
          </span>
        </div>
        <div className="right-block">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="z-2 relative w-4.5 h-4.5"
          >
            <path
              d="M1 13H0.5V13.5H1V13ZM17.3536 13.3536C17.5488 13.1583 17.5488 12.8417 17.3536 12.6464L14.1716 9.46447C13.9763 9.2692 13.6597 9.2692 13.4645 9.46447C13.2692 9.65973 13.2692 9.97631 13.4645 10.1716L16.2929 13L13.4645 15.8284C13.2692 16.0237 13.2692 16.3403 13.4645 16.5355C13.6597 16.7308 13.9763 16.7308 14.1716 16.5355L17.3536 13.3536ZM1 1H0.5L0.5 13H1H1.5L1.5 1H1ZM1 13V13.5H17V13V12.5H1V13Z"
              fill="white"
            />
          </svg>
        </div>
      </Link>
    </div>
  );
};

export default ScheduleButton;
