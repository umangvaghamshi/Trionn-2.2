"use client";

import { useSiteSound } from "@/components/SiteSoundContext";

export function HeaderSoundToggle() {
  const { soundEnabled, toggleSound } = useSiteSound();

  return (
    <button
      type="button"
      id="sound-toggle"
      onClick={toggleSound}
      title={soundEnabled ? "Mute sound" : "Enable sound"}
      aria-pressed={soundEnabled}
      aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-white/80 shadow-sm backdrop-blur-sm transition hover:text-white"
    >
      {soundEnabled ? <SoundOnGlyph /> : <SoundOffGlyph />}
    </button>
  );
}

function SoundOnGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SoundOffGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 9l-6 6M17 9l6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
