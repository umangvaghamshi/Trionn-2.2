"use client";

import { useRef } from "react";
import styles from "./TrionnGallery.module.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

type RGB = { r: number; g: number; b: number };
type Position = { x: number; y: number; r: number; s: number };

const DEFAULT_BG = "#C3C3C3";

const IMAGES: { src: string; alt: string }[] = [
  { src: "/gallery/gallery-01.jpg", alt: "" },
  { src: "/gallery/gallery-02.jpg", alt: "" },
  { src: "/gallery/gallery-03.jpg", alt: "" },
  { src: "/gallery/gallery-04.jpg", alt: "" },
  { src: "/gallery/gallery-05.jpg", alt: "" },
  { src: "/gallery/gallery-06.jpg", alt: "" },
  { src: "/gallery/gallery-07.jpg", alt: "" },
  { src: "/gallery/gallery-08.jpg", alt: "" },
  { src: "/gallery/gallery-09.jpg", alt: "" },
  { src: "/gallery/gallery-10.jpg", alt: "" },
];

export default function TrionnGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const stripesRef = useRef<HTMLDivElement[]>([]);
  const headerText = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<ReturnType<typeof useLenis> | null>(null);

  useLenis((lenis) => {
    lenisRef.current = lenis;
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;

      const items = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(`.${styles.galleryItem}`),
      );

      let activeZIndex = 50;
      let isCardAnimating = false;
      let galleryTimeline: gsap.core.Timeline | null = null;

      const animateBackgroundColor = (color: string, duration = 1.15) => {
        gsap.to([document.body, section, stage], {
          backgroundColor: color,
          duration,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      };

      const rgbToCss = (c: RGB) => `rgb(${c.r}, ${c.g}, ${c.b})`;

      const softenTone = (color: RGB): RGB => {
        const base = { r: 244, g: 244, b: 244 };
        const mix = 0.24;
        return {
          r: Math.min(246, Math.round(color.r * mix + base.r * (1 - mix))),
          g: Math.min(246, Math.round(color.g * mix + base.g * (1 - mix))),
          b: Math.min(246, Math.round(color.b * mix + base.b * (1 - mix))),
        };
      };

      const getDominantImageColor = (img: HTMLImageElement): RGB => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const size = 72;
        canvas.width = size;
        canvas.height = size;
        if (!ctx) return { r: 195, g: 195, b: 195 };
        ctx.drawImage(img, 0, 0, size, size);
        const pixels = ctx.getImageData(0, 0, size, size).data;
        const buckets = new Map<
          string,
          { count: number; r: number; g: number; b: number; score: number }
        >();

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          if (a < 220) continue;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const brightness = (r + g + b) / 3;
          const saturation = max - min;
          if (brightness < 25 || brightness > 245 || saturation < 12) continue;
          const qr = Math.round(r / 22) * 22;
          const qg = Math.round(g / 22) * 22;
          const qb = Math.round(b / 22) * 22;
          const key = `${qr},${qg},${qb}`;
          const bucket = buckets.get(key) || {
            count: 0,
            r: 0,
            g: 0,
            b: 0,
            score: 0,
          };
          bucket.count += 1;
          bucket.r += r;
          bucket.g += g;
          bucket.b += b;
          bucket.score += saturation * 1.9 + Math.abs(150 - brightness) * 0.1;
          buckets.set(key, bucket);
        }

        type Bucket = {
          count: number;
          r: number;
          g: number;
          b: number;
          score: number;
        };
        let winner: Bucket | null = null;
        let bestWeighted = -Infinity;
        buckets.forEach((bucket) => {
          const weighted = bucket.count * 2 + bucket.score * 0.12;
          if (weighted > bestWeighted) {
            winner = bucket;
            bestWeighted = weighted;
          }
        });

        if (!winner) return { r: 195, g: 195, b: 195 };
        const w: Bucket = winner;
        return {
          r: Math.round(w.r / w.count),
          g: Math.round(w.g / w.count),
          b: Math.round(w.b / w.count),
        };
      };

      const prepareImageTone = async (item: HTMLElement) => {
        const img = item.querySelector("img") as HTMLImageElement | null;
        if (!img) return;
        try {
          if (!img.complete || img.naturalWidth === 0) {
            await img.decode();
          }
          const dominant = getDominantImageColor(img);
          item.dataset.bgTone = rgbToCss(softenTone(dominant));
        } catch {
          item.dataset.bgTone = DEFAULT_BG;
        }
      };

      const prepareAllImageTones = () =>
        items.forEach((item) => prepareImageTone(item));

      const updateBackgroundTone = (item: HTMLElement) => {
        const tone = item.dataset.bgTone;
        if (tone && tone !== DEFAULT_BG) {
          animateBackgroundColor(tone, 0.95);
          return;
        }
        prepareImageTone(item).then(() => {
          animateBackgroundColor(item.dataset.bgTone || DEFAULT_BG, 0.95);
        });
      };

      const clamp = (v: number, mn: number, mx: number) =>
        Math.min(Math.max(v, mn), mx);
      const randomBetween = (mn: number, mx: number) =>
        mn + Math.random() * (mx - mn);

      const getRotatedBounds = (w: number, h: number, deg: number) => {
        const a = (Math.abs(deg) * Math.PI) / 180;
        return {
          width: Math.abs(w * Math.cos(a)) + Math.abs(h * Math.sin(a)),
          height: Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a)),
        };
      };

      const createSafeRandomPositions = (): Position[] => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isMobile = vw <= 768;
        const sidePadding = isMobile ? 14 : 28;
        const verticalBoundary = 100;

        const cells: [number, number][] = isMobile
          ? [
              [0.3, 0.14],
              [0.72, 0.16],
              [0.47, 0.3],
              [0.25, 0.43],
              [0.73, 0.43],
              [0.42, 0.57],
              [0.72, 0.67],
              [0.27, 0.71],
              [0.5, 0.84],
              [0.76, 0.84],
            ]
          : [
              [0.15, 0.17],
              [0.38, 0.16],
              [0.7, 0.17],
              [0.86, 0.32],
              [0.18, 0.43],
              [0.46, 0.44],
              [0.73, 0.47],
              [0.28, 0.69],
              [0.57, 0.71],
              [0.82, 0.69],
            ];

        const shuffled = cells
          .map((cell) => ({ cell, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map((x) => x.cell);

        return items.map((item, index) => {
          const rect = item.getBoundingClientRect();
          const rotation = randomBetween(-4, 4);
          const bounds = getRotatedBounds(rect.width, rect.height, rotation);
          const halfW = bounds.width / 2;
          const halfH = bounds.height / 2;
          const minX = -vw / 2 + halfW + sidePadding;
          const maxX = vw / 2 - halfW - sidePadding;
          const minY = -vh / 2 + halfH + verticalBoundary;
          const maxY = vh / 2 - halfH - verticalBoundary;
          const cell = shuffled[index];
          const jitterX = isMobile
            ? randomBetween(-12, 12)
            : randomBetween(-36, 36);
          const jitterY = isMobile
            ? randomBetween(-10, 10)
            : randomBetween(-24, 24);
          return {
            x: clamp(cell[0] * vw - vw / 2 + jitterX, minX, maxX),
            y: clamp(cell[1] * vh - vh / 2 + jitterY, minY, maxY),
            r: rotation,
            s: 1,
          };
        });
      };

      const getStartPosition = (index: number) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const gap = Math.max(vw, vh) * 0.72;
        const starts = [
          { x: -vw / 2 - gap, y: -vh / 2 - 80 },
          { x: vw / 2 + gap, y: -vh / 2 + 30 },
          { x: -vw / 2 - gap, y: vh / 2 + 70 },
          { x: vw / 2 + gap, y: vh / 2 + 20 },
          { x: -80, y: -vh / 2 - gap },
          { x: 130, y: vh / 2 + gap },
          { x: -vw / 2 - gap, y: 20 },
          { x: vw / 2 + gap, y: -100 },
          { x: -220, y: vh / 2 + gap },
          { x: 260, y: -vh / 2 - gap },
        ];
        return starts[index % starts.length];
      };

      const resetInnerCard = (item: HTMLElement) => {
        const inner = item.querySelector(`.${styles.cardInner}`);
        if (inner)
          gsap.set(inner, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });
      };

      const isOverlapping = (a: DOMRect, b: DOMRect) =>
        !(
          a.right < b.left ||
          a.left > b.right ||
          a.bottom < b.top ||
          a.top > b.bottom
        );

      const moveOverlappingCards = (clickedItem: HTMLElement) => {
        const clickedRect = clickedItem.getBoundingClientRect();
        const cx = clickedRect.left + clickedRect.width / 2;
        const cy = clickedRect.top + clickedRect.height / 2;

        items.forEach((otherItem) => {
          if (otherItem === clickedItem) return;
          const otherRect = otherItem.getBoundingClientRect();
          if (!isOverlapping(clickedRect, otherRect)) return;
          const inner = otherItem.querySelector(`.${styles.cardInner}`);
          if (!inner) return;
          const ox = otherRect.left + otherRect.width / 2;
          const oy = otherRect.top + otherRect.height / 2;
          const dx = ox >= cx ? 1 : -1;
          const dy = oy >= cy ? 1 : -1;
          gsap.killTweensOf(inner);
          gsap
            .timeline({ defaults: { overwrite: "auto" } })
            .to(inner, {
              x: dx * gsap.utils.random(18, 34),
              y: dy * gsap.utils.random(12, 24),
              rotation: dx * gsap.utils.random(1.4, 2.8),
              scale: 0.992,
              duration: 0.34,
              ease: "power3.out",
            })
            .to(inner, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 0.52,
              ease: "power3.out",
            });
        });
      };

      const itemListeners: Array<{
        el: HTMLElement;
        type: string;
        fn: EventListener;
      }> = [];

      const setupInteractions = () => {
        items.forEach((item) => {
          const inner = item.querySelector(`.${styles.cardInner}`);
          if (!inner) return;

          const onEnter = () => {
            if (isCardAnimating) return;
            gsap.to(inner, {
              scale: 1.025,
              duration: 0.22,
              ease: "power2.out",
              overwrite: "auto",
            });
          };
          const onLeave = () => {
            if (isCardAnimating) return;
            gsap.to(inner, {
              scale: 1,
              duration: 0.26,
              ease: "power2.out",
              overwrite: "auto",
            });
          };
          const onClick = () => {
            if (isCardAnimating) return;
            isCardAnimating = true;
            activeZIndex += 1;
            const direction =
              (gsap.getProperty(item, "x") as number) < 0 ? 1 : -1;
            const pullX = direction * 38;
            const pullY = -30;
            updateBackgroundTone(item);
            moveOverlappingCards(item);
            gsap
              .timeline({
                defaults: { overwrite: "auto" },
                onComplete: () => {
                  resetInnerCard(item);
                  isCardAnimating = false;
                },
              })
              .to(inner, {
                x: pullX,
                y: pullY,
                rotation: direction * 4.5,
                scale: 1.035,
                opacity: 0.18,
                duration: 0.34,
                ease: "power3.out",
              })
              .set(item, { zIndex: activeZIndex })
              .set(inner, {
                x: pullX * 0.42,
                y: pullY * 0.42,
                rotation: direction * 1.6,
                scale: 1.02,
              })
              .to(inner, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
                duration: 0.56,
                ease: "power3.out",
              });
          };

          item.addEventListener("mouseenter", onEnter);
          item.addEventListener("mouseleave", onLeave);
          item.addEventListener("click", onClick);
          itemListeners.push({ el: item, type: "mouseenter", fn: onEnter });
          itemListeners.push({ el: item, type: "mouseleave", fn: onLeave });
          itemListeners.push({ el: item, type: "click", fn: onClick });
        });
      };

      const buildGalleryAnimation = () => {
        if (galleryTimeline) {
          if (galleryTimeline.scrollTrigger)
            galleryTimeline.scrollTrigger.kill();
          galleryTimeline.kill();
        }

        gsap.set(items, {
          xPercent: -50,
          yPercent: -50,
          opacity: 1,
          scale: 0.9,
        });
        const positions = createSafeRandomPositions();

        items.forEach((item, index) => {
          const start = getStartPosition(index);
          const end = positions[index];
          gsap.set(item, {
            xPercent: -50,
            yPercent: -50,
            x: start.x,
            y: start.y,
            rotate: end.r * 1.5,
            scale: 0.92,
            opacity: 1,
            zIndex: index + 3,
          });
          const img = item.querySelector("img");
          if (img) gsap.set(img, { scale: 1.04 });
          resetInnerCard(item);
        });

        const animationEnd = 3300 / 4300; // gallery animation portion; remainder is stripe reveal
        galleryTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=4300",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            markers: false,
            onUpdate: (self) => {
              if (self.progress < 0.02) {
                items.forEach((item, index) => {
                  resetInnerCard(item);
                  gsap.set(item, { zIndex: index + 3 });
                });
                activeZIndex = 50;
                animateBackgroundColor(DEFAULT_BG, 1.25);
              }

              const holdT = Math.max(
                0,
                Math.min(
                  1,
                  (self.progress - animationEnd) / (1 - animationEnd),
                ),
              );
              const stripes = stripesRef.current;
              const stripeCount = stripes.length;
              if (stripeCount > 0) {
                const staggerAmount = 0.3;
                const perStripe = 0.6 - staggerAmount;
                for (let i = 0; i < stripeCount; i++) {
                  const staggerIdx = stripeCount - 1 - i;
                  const stripeStart =
                    (staggerAmount * staggerIdx) / (stripeCount - 1 || 1);
                  const stripeEnd = stripeStart + perStripe;
                  const stripeProgress = Math.max(
                    0,
                    Math.min(
                      1,
                      (holdT - stripeStart) / (stripeEnd - stripeStart),
                    ),
                  );
                  gsap.set(stripes[i]!, { scaleY: stripeProgress });
                }
              }
            },
            onLeave: () => animateBackgroundColor(DEFAULT_BG, 1.35),
            onLeaveBack: () => {
              animateBackgroundColor(DEFAULT_BG, 1.35);
            },
          },
        });

        galleryTimeline.to(headerText.current, {
          opacity: 0,
          delay: 0.7,
        });

        items.forEach((item, index) => {
          const end = positions[index];
          galleryTimeline!.to(
            item,
            {
              x: end.x,
              y: end.y,
              rotate: end.r,
              scale: end.s,
              duration: 1.2,
            },
            index * 0.34,
          );
          const img = item.querySelector("img");
          if (img) {
            galleryTimeline!.to(img, { scale: 1, duration: 1.2 }, index * 0.34);
          }
        });

        galleryTimeline.to(items, { duration: 0.8 });
      };

      prepareAllImageTones();
      setupInteractions();
      buildGalleryAnimation();

      let resizeTimer: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          buildGalleryAnimation();
        }, 180);
      };

      window.addEventListener("resize", onResize);

      const handler = () => {
        galleryTimeline?.scrollTrigger?.refresh();
      };

      window.addEventListener("trionn:about-hero-loaded", handler);

      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeTimer);
        itemListeners.forEach(({ el, type, fn }) =>
          el.removeEventListener(type, fn),
        );
        window.removeEventListener("trionn:about-hero-loaded", handler);
        if (galleryTimeline) {
          if (galleryTimeline.scrollTrigger)
            galleryTimeline.scrollTrigger.refresh();
        }
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="h-dvh overflow-hidden relative bg-[#c3c3c3] will-change-transform translate-z-0 z-10 text-dark-font"
    >
      <div
        ref={stageRef}
        className="overflow-hidden relative bg-[#c3c3c3] h-dvh w-screen transform-[translate3d(0,0,0)] will-change-transform contain-[layout_paint]"
      >
        <div
          ref={headerText}
          className="absolute top-1/2 left-1/2 -translate-1/2 text-center z-1 pointer-events-none w-[min(50rem,82vw)]"
        >
          <h2 className="mb-6">Work hard. Play loud.</h2>
          <p className="max-w-80 sm:max-w-105 mx-auto small">
            A glimpse into the creative chaos, team culture, fun moments, and
            everyday life behind TRIONN.
          </p>
        </div>

        {IMAGES.map((img, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <figure
              key={n}
              className={`${styles.galleryItem} ${styles[`item${n}`]}`}
            >
              <div className={styles.cardInner}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} crossOrigin="anonymous" />
              </div>
            </figure>
          );
        })}
      </div>
      <div
        className="absolute inset-0 pointer-events-none flex flex-col w-full h-full"
        style={{ zIndex: 98 }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`stripe-${i}`}
            ref={(el) => {
              if (el) stripesRef.current[i] = el;
            }}
            style={{
              flex: 1,
              width: "100%",
              marginTop: i > 0 ? "-1px" : undefined,
              paddingBottom: "1px",
              backgroundColor: "#040508",
              transform: "scaleY(0)",
              transformOrigin: "bottom",
              willChange: "transform",
            }}
          />
        ))}
      </div>
    </section>
  );
}
