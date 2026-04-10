/**
 * Scroll layout for TrionnServices: GSAP pin duration + mapped scrub/hold.
 * Pin `end` uses viewport-relative % (e.g. 300% ≈ 300vh of scroll).
 */
/** Shutter reveal: services is pinned behind Work for this many vh before animation starts. */
export const SERVICES_SHUTTER_VH = 100;
/** Scroll distance for scrollT 0→1 (matches original pin `+=300%`). */
export const SERVICES_SCRUB_VH = 500;
/** After scrollT reaches 1, pin holds while testimonials overlaps. */
export const SERVICES_HOLD_VH = 100;
/** Total pinned scroll distance as ScrollTrigger `+=N%` (shutter reveal + scrub + hold). */
export const SERVICES_PIN_END_PERCENT = SERVICES_SHUTTER_VH + SERVICES_SCRUB_VH + SERVICES_HOLD_VH;

/**
 * Linear pin progress (0–1 over full pin including shutter + hold) → animation scrollT (0–1).
 * During the shutter phase (Work scrolling away), scrollT stays at 0.
 * During the hold phase (testimonials overlap), scrollT stays at 1.
 */
export function mapServicesScrollProgress(linear: number): number {
  const shutterFrac = SERVICES_SHUTTER_VH / SERVICES_PIN_END_PERCENT;
  const scrubFrac = (SERVICES_SHUTTER_VH + SERVICES_SCRUB_VH) / SERVICES_PIN_END_PERCENT;
  if (linear < shutterFrac) return 0;
  if (linear > scrubFrac) return 1;
  return (linear - shutterFrac) / (scrubFrac - shutterFrac);
}
