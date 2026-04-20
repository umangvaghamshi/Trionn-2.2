'use client';

import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import type { AnimateFn } from '../types';

/**
 * ═══════════════════════════════════════════════════════════
 *  ACE CARD — Award-winning 3D card-deal animation
 * ═══════════════════════════════════════════════════════════
 *
 *  VISUAL:
 *  Cards are stacked with the front card on top.
 *  Deeper cards peek their bottom edges below the front card.
 *
 *  ON HOVER:
 *  The target card LIFTS UP from the stack (dramatic upward arc),
 *  flies above the deck with 3D tilt and cinematic shadow,
 *  then sweeps DOWN and settles as the new front card.
 *
 *  TECH:
 *  Uses standalone gsap.to() + overwrite:true for zero-jerk
 *  rapid hover. GSAP keyframes give multi-phase motion in
 *  a single overwritable tween.
 */

/* ─── STACK GEOMETRY ─── */
const MAX_VISIBLE = 5;
const PEEK_Y = 14;      // Each deeper card peeks 14px BELOW the front card
const PEEK_SCALE = 0.025;   // Scale reduction per depth
const Z_STEP = -35;     // Z depth per card

/* ─── SHADOWS ─── */
function shadowAt(d: number): string {
  if (d === 0) return '0px 25px 50px -12px rgba(0,0,0,0.4), 0px 10px 20px -8px rgba(0,0,0,0.2)';
  const alpha1 = Math.max(0.02, 0.15 - d * 0.03);
  const alpha2 = Math.max(0.01, 0.08 - d * 0.02);
  const y1 = 4 + d * 2;
  const blur1 = 8 + d * 4;
  const spread1 = -2 - d;

  const y2 = 2 + d;
  const blur2 = 4 + d * 2;
  const spread2 = -1 - d;

  return `0px ${y1}px ${blur1}px ${spread1}px rgba(0,0,0,${alpha1.toFixed(2)}), 0px ${y2}px ${blur2}px ${spread2}px rgba(0,0,0,${alpha2.toFixed(2)})`;
}

const SHADOW_FLYING = '0px 60px 120px -20px rgba(0,0,0,0.5), 0px 25px 50px -10px rgba(0,0,0,0.3)';

/**
 * Resting pose for a card at depth d in the deck.
 * Depth 0 = front card (top of stack, fully visible)
 * Depth 1+ = behind, peeking below
 */
export function deckSlot(depth: number) {
  const d = Math.min(depth, MAX_VISIBLE);
  const hidden = d >= MAX_VISIBLE;

  return {
    x: 0,
    y: d * PEEK_Y,                // Peek DOWNWARD (positive Y)
    z: d * Z_STEP,
    scale: 1 - d * PEEK_SCALE,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    zIndex: 100 - d,
    opacity: hidden ? 0 : Math.max(0.35, 1 - d * 0.14),
    visibility: (hidden ? 'hidden' : 'visible') as 'hidden' | 'visible',
    transformOrigin: '50% 100%',
    boxShadow: shadowAt(d),
  };
}

export { MAX_VISIBLE as MAX_VISIBLE_STACK };


export function useAceCardAnimation() {
  const deckOrderRef = useRef<number[] | null>(null);

  const animate: AnimateFn = useCallback(
    (_currentImg: HTMLElement, nextImg: HTMLElement) => {
      const wrapper = _currentImg.parentElement;
      if (!wrapper) return gsap.timeline();

      const layers = Array.from(
        wrapper.querySelectorAll<HTMLElement>('.brand-image-layer'),
      );
      const total = layers.length;

      // Initialize
      if (!deckOrderRef.current || deckOrderRef.current.length !== total) {
        deckOrderRef.current = Array.from({ length: total }, (_, i) => i);
      }

      const deck = deckOrderRef.current;
      const targetIdx = layers.indexOf(nextImg);
      const targetDepth = deck.indexOf(targetIdx);

      if (targetDepth <= 0) return gsap.timeline();

      // New deck order
      const newDeck = [targetIdx, ...deck.filter(i => i !== targetIdx)];
      deckOrderRef.current = newDeck;

      // ═══════════════════════════════════════════════
      //  TARGET CARD — Cinematic 3D bottom-to-top arc
      //
      //  Phase 1 (LIFT): Card rises UP from the stack,
      //           tilting back with a dramatic shadow.
      //  Phase 2 (SETTLE): Card swoops down and lands
      //           at the front with a satisfying bounce.
      //
      //  Uses GSAP keyframes for multi-step motion in
      //  a single overwritable tween (zero jerk).
      // ═══════════════════════════════════════════════

      // ═══════════════════════════════════════════════
      //  TARGET CARD — Flawless 3D "Pull from behind"
      // ═══════════════════════════════════════════════

      const front = deckSlot(0);
      const { zIndex: frontZIndex, ...frontState } = front;

      // Make visible, but keep its current lower z-index so it stays behind the deck
      gsap.set(nextImg, { visibility: 'visible' });

      // Build a timeline for the target card to ensure sequence integrity.
      const targetTl = gsap.timeline();

      // 1. EXTRACT FROM BEHIND AND SWOOP DOWN
      targetTl
        .to(nextImg, {
          y: -260,
          z: 60,
          rotateX: -8,
          rotateY: -4,
          rotateZ: 8,
          scale: 1.05,
          opacity: 1,
          boxShadow: SHADOW_FLYING,
          transformOrigin: '50% 100%',
          duration: 0.35,
          ease: 'power3.out',
        })
        .set(nextImg, { zIndex: 200 }) // Pop in front once it clears the deck
        .to(nextImg, {
          ...frontState, // settling into front slot
          duration: 0.55,
          ease: 'back.out(1.2)',
        })
        .set(nextImg, { zIndex: frontZIndex });

      // ═══════════════════════════════════════════════
      //  REMAINING CARDS — Clean z-index handoffs
      // ═══════════════════════════════════════════════
      newDeck.forEach((layerIdx, newDepth) => {
        if (layerIdx === targetIdx) return;

        const layer = layers[layerIdx];
        const { zIndex, ...slotState } = deckSlot(newDepth);

        if (newDepth === 1) {
          // OLD FRONT CARD: Duck down into the 2nd slot.
          // Keep its z-index high momentarily so it covers the newly lifting card from behind.
          const oldFrontTl = gsap.timeline();

          oldFrontTl
            .to(layer, {
              ...slotState, // NO zIndex tweening
              duration: 0.45,
              ease: 'power2.out',
            })
            // Gracefully downgrade its z-index right when the lifting card passes the vertex (0.35s)
            .set(layer, { zIndex }, 0.35);
        } else {
          // Deeper cards can safely drop z-index immediately
          gsap.set(layer, { zIndex });
          gsap.to(layer, {
            ...slotState, // NO zIndex tweening
            duration: 0.6,
            ease: 'power3.out',
            delay: (newDepth - 1) * 0.04,
          });
        }
      });

      return targetTl; // Return timeline to queue mechanism natively!
    },
    [],
  );

  return animate;
}
