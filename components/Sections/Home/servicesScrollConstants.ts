/**
 * Scroll layout for TrionnServices: GSAP pin duration + mapped scrub/hold.
 * Pin `end` uses viewport-relative % (e.g. 300% ≈ 300vh of scroll).
 */
/** Scroll distance for scrollT 0→1 (matches original pin `+=300%`). */
export const SERVICES_SCRUB_VH = 300;
/** After scrollT reaches 1, pin holds while testimonials overlaps. */
export const SERVICES_HOLD_VH = 100;
/** Total pinned scroll distance as ScrollTrigger `+=N%` (scrub + hold). */
export const SERVICES_PIN_END_PERCENT = SERVICES_SCRUB_VH + SERVICES_HOLD_VH;

/**
 * Linear pin progress (0–1 over full pin including hold) → animation scrollT (0–1).
 */
export function mapServicesScrollProgress(linear: number): number {
  const scrubFrac = SERVICES_SCRUB_VH / SERVICES_PIN_END_PERCENT;
  return linear < scrubFrac ? linear / scrubFrac : 1;
}
