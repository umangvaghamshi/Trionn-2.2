import type { ReactNode } from "react";

export interface OrbitLabel {
  /** Display name for the card */
  name: string;
  /** Subtitle / description for the card */
  desc: string;
}

export interface OrbitProps {
  /** Array of label objects for each orbit card */
  labels?: OrbitLabel[];
  /** Array of image paths (relative to public/) for each orbit card */
  images?: string[];
  /** Top center descriptive text (supports JSX) */
  topCenterText?: ReactNode;
  /** Bottom left descriptive paragraph */
  bottomLeftText?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA button href */
  ctaHref?: string;
  /** Background color as hex string */
  backgroundColor?: string;
  /** Auto-rotation speed (default: 0.00042) */
  autoRotateSpeed?: number;
  /** 3D orbit radius (default: 5.2) */
  orbitRadius?: number;
  /** Font family string for canvas-rendered text */
  fontFamily?: string;
  /** Hero title rendered in 3D scene (default: "DESIGN IN") */
  heroTitle?: string;
  /** Hero subtitle rendered in 3D scene (default: "MOTION") */
  heroSubtitle?: string;
  /** Additional CSS class for the container */
  className?: string;
}
