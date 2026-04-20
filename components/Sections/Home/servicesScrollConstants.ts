/**
 * Scroll layout: Work horizontal + services overlap + canvas scrub + testimonials hold.
 * Pin `end` uses viewport-relative % (e.g. 700 ≈ 700vh of scroll).
 */

/** Vertical scroll budget mapped to horizontal Work track scrub (intro + project panels). */
export const WORK_HORIZONTAL_VH = 120;
/** Side overlap: TrionnServices layer slides in from the right (white intro). */
export const WORK_SERVICES_OVERLAP_VH = 120;
/** Scroll distance for services animation scrollT 0→1 (canvas / video / cards). */
export const SERVICES_SCRUB_VH = 500;
/** After scrollT reaches 1, pin holds while testimonials overlaps. */
export const SERVICES_HOLD_VH = 100;

/** @deprecated Use WORK_HORIZONTAL_VH + WORK_SERVICES_OVERLAP_VH; kept for imports that expected “shutter” length. */
export const SERVICES_SHUTTER_VH =
  WORK_HORIZONTAL_VH + WORK_SERVICES_OVERLAP_VH;

/** Total pinned scroll distance as ScrollTrigger `+=N%`. */
export const SERVICES_PIN_END_PERCENT =
  WORK_HORIZONTAL_VH +
  WORK_SERVICES_OVERLAP_VH +
  SERVICES_SCRUB_VH +
  SERVICES_HOLD_VH;

/**
 * Linear pin progress (0–1) → animation scrollT (0–1).
 * During horizontal + overlap, scrollT stays 0. Hold phase stays at 1.
 */
export function mapServicesScrollProgress(linear: number): number {
  const total = SERVICES_PIN_END_PERCENT;
  const scrubStart =
    (WORK_HORIZONTAL_VH + WORK_SERVICES_OVERLAP_VH) / total;
  const scrubEnd =
    (WORK_HORIZONTAL_VH +
      WORK_SERVICES_OVERLAP_VH +
      SERVICES_SCRUB_VH) /
    total;
  if (linear < scrubStart) return 0;
  if (linear > scrubEnd) return 1;
  return (linear - scrubStart) / (scrubEnd - scrubStart);
}

/** 0–1 progress through the horizontal Work phase only. */
export function mapWorkHorizontalProgress(linear: number): number {
  const total = SERVICES_PIN_END_PERCENT;
  const end = WORK_HORIZONTAL_VH / total;
  if (linear <= 0) return 0;
  if (linear >= end) return 1;
  return linear / end;
}

/** 0–1: services layer slides from right during overlap window (after horizontal). */
export function mapOverlapProgress(linear: number): number {
  const total = SERVICES_PIN_END_PERCENT;
  const start = WORK_HORIZONTAL_VH / total;
  const end = (WORK_HORIZONTAL_VH + WORK_SERVICES_OVERLAP_VH) / total;
  if (linear <= start) return 0;
  if (linear >= end) return 1;
  return (linear - start) / (end - start);
}

/** White scrim fades as scrollT advances (early scrub). */
export function mapServicesScrimOpacity(scrollT: number): number {
  const fadeEnd = 0.12;
  if (scrollT <= 0) return 1;
  if (scrollT >= fadeEnd) return 0;
  return 1 - scrollT / fadeEnd;
}

/** Stripe hold phase start (fraction of full pin), matches previous formula with new names. */
export function servicesStripeHoldStartLinear(): number {
  return (
    (WORK_HORIZONTAL_VH +
      WORK_SERVICES_OVERLAP_VH +
      SERVICES_SCRUB_VH) /
    SERVICES_PIN_END_PERCENT
  );
}
