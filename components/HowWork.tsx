"use client";
import { BlurTextReveal } from "@/components/TextAnimation";
import { HowWorkData } from "@/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { useScrollTriggerRefresh } from "@/hooks/useScrollTriggerRefresh";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_STRIPE_COUNT = 6;
const DEFAULT_STRIPE_COLOR = "#040508";

interface HowWorkProps {
  theme?: "light" | "dark";
  stripeCount?: number;
  stripeColor?: string;
}

export default function HowWork({
  theme = "dark",
  stripeCount = DEFAULT_STRIPE_COUNT,
  stripeColor = DEFAULT_STRIPE_COLOR,
}: HowWorkProps) {
  const outerRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const stripesRef = useRef<HTMLDivElement[]>([]);
  const cardLinesRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const cards = HowWorkData;

  useGSAP(
    () => {
      if (!cardsRef.current.length) return;

      const stripes = stripesRef.current;
      gsap.set(stripes, { scaleY: 0, transformOrigin: "bottom" });

      const mm = gsap.matchMedia();

      /* ── DESKTOP ─────────────────────────────── */
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=350%`,
            pin: true,
            anticipatePin: 1,
            scrub: true,
            markers: false,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });

        cardsRef.current.forEach((card, idx) => {
          const plus = card.querySelector(".plus");
          const line = card.querySelector(".line");
          const content = card.querySelector(".content");
          const title = card.querySelector(".work-title");
          const numbers = card.querySelector(".step-no");
          const plusFollow = card.querySelector(".plus-follow");

          gsap.set([plusFollow, plus], { autoAlpha: 0 });
          gsap.set(plus, { autoAlpha: idx == 0 ? 1 : 0 });

          tl.addLabel(`card_${idx}_start`);
          if (idx == 0) tl.set(plusFollow, { autoAlpha: 1 }, "<0.2");
          else tl.set(plusFollow, { autoAlpha: 1 });

          tl.fromTo(
            plusFollow,
            { rotation: 0 },
            { rotation: 360 * 2, right: -12 },
            "<10%",
          )
            .fromTo(
              line,
              { scaleX: 0, transformOrigin: "left" },
              { scaleX: 1 },
              "<",
            )
            .fromTo(
              numbers,
              { autoAlpha: 0, filter: "blur(12px)", force3D: true },
              { autoAlpha: 1, filter: "blur(0px)", duration: 0.2 },
              "<",
            )
            .fromTo(
              title,
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0 },
              "<25%",
            )
            .fromTo(
              content,
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 0.5, y: 0 },
              "<",
            );

          tl.addLabel(`card_${idx}_end`);
        });

        const nextSection = outerRef.current
          ?.nextElementSibling as HTMLElement | null;
        if (nextSection) {
          if (stripeCount > 0) gsap.set(nextSection, { marginTop: "-100dvh" });
          else {
            tl.to({}, { duration: 1 });
            gsap.set(nextSection, { marginTop: "-100dvh" });
          }
        }

        if (stripeCount > 0) {
          tl.addLabel("stripes_start");
          const staggerAmount = 0.6,
            perStripe = 1 - staggerAmount,
            totalStripeDur = 1.2;
          for (let i = 0; i < stripeCount; i++) {
            const staggerIdx = stripeCount - 1 - i;
            const offset =
              (staggerAmount * staggerIdx) / (stripeCount - 1 || 1);
            const s = offset * totalStripeDur,
              e = s + perStripe * totalStripeDur;
            tl.fromTo(
              stripes[i]!,
              { scaleY: 0 },
              { scaleY: 1, duration: e - s, ease: "none" },
              `stripes_start+=${s}`,
            );
          }
        }

        tlRef.current = tl;
        return () => {
          tl.kill();
        };
      });

      /* ── MOBILE / TABLET ─────────────────────────────────────────────────
         Cards: pinned section, each card fades in on scrub (accumulates).
         Lines: scaleX 0→1 scrubbed per card slot.
         Stripes: per-frame ticker (same pattern as DribbleSection) —
           reads ST progress each tick, sets scaleY directly.
           This guarantees stripes are visible regardless of scroll speed.
      ──────────────────────────────────────────────────────────────────── */
      mm.add("(max-width: 767px)", () => {
        const cardCount = cardsRef.current.length;
        const SLOT_VH = 80; // scroll distance per card transition
        const HOLD_VH = 40; // pause after all cards revealed
        // Stripe zone: extra scroll the section stays pinned so the
        // per-frame ticker has plenty of progress range to fill stripes.
        const STRIPE_ZONE_VH = stripeCount > 0 ? 100 : 0;
        const cardScrollVh = cardCount * SLOT_VH + HOLD_VH;
        const totalScrollVh = cardScrollVh + STRIPE_ZONE_VH;
        const T = totalScrollVh;

        // animationEnd: fraction of total scroll at which stripe phase begins
        const animationEnd = stripeCount > 0 ? cardScrollVh / T : 1;

        // ── initial states ──
        cardsRef.current.forEach((card, idx) => {
          const nums = card.querySelector(".step-no");
          const ttl = card.querySelector(".work-title");
          const cnt = card.querySelector(".content");
          gsap.set(
            [nums, ttl, cnt],
            idx === 0 ? { autoAlpha: 1, y: 0 } : { autoAlpha: 0, y: 20 },
          );
        });
        cardLinesRef.current.forEach((el) => {
          if (el)
            gsap.set(el, { scaleX: 0, transformOrigin: "left", autoAlpha: 0 });
        });
        gsap.set(stripes, { scaleY: 0, transformOrigin: "bottom" });

        // ── pinned scrub timeline (cards + lines only) ──
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${totalScrollVh}%`,
            pin: true,
            markers: false,
            scrub: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });

        cardsRef.current.forEach((card, idx) => {
          const nums = card.querySelector(".step-no");
          const ttl = card.querySelector(".work-title");
          const cnt = card.querySelector(".content");
          const fill = cardLinesRef.current[idx];

          const slotStart = (idx * SLOT_VH) / T;
          const slotDur = SLOT_VH / T;

          // Cards 1+ fade in during first 45% of their slot
          if (idx > 0) {
            const fadeDur = slotDur * 0.45;
            mobileTl
              .fromTo(
                nums!,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: fadeDur * 0.55 },
                slotStart,
              )
              .fromTo(
                ttl!,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: fadeDur * 0.55 },
                slotStart + fadeDur * 0.15,
              )
              .fromTo(
                cnt!,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: fadeDur * 0.55 },
                slotStart + fadeDur * 0.3,
              );
          }

          // Line draws left→right across the full slot
          if (fill) {
            mobileTl
              .set(
                fill,
                { autoAlpha: 1, scaleX: 0, transformOrigin: "left" },
                slotStart,
              )
              .fromTo(
                fill,
                { scaleX: 0 },
                { scaleX: 1, duration: slotDur },
                slotStart,
              );
          }
        });

        // Pad so timeline duration covers the full stripe zone
        mobileTl.to({}, { duration: 0.001 }, 1);

        // ── stripe tick: same formula as StripeReveal / Vision ──
        // holdT maps rawProg [animationEnd→1] to [0→1].
        // staggerAmount=0.6 matches desktop HowWork timeline and StripeReveal pattern.
        const staggerAmount = 0.6;
        const perStripe = 1 - staggerAmount; // 0.4 — same as desktop

        const tick = () => {
          const st = mobileTl.scrollTrigger;
          if (!st || stripeCount === 0 || stripes.length === 0) return;

          const rawProg = st.progress;
          const holdT = Math.max(
            0,
            Math.min(1, (rawProg - animationEnd) / (1 - animationEnd)),
          );

          for (let i = 0; i < stripeCount; i++) {
            const staggerIdx = stripeCount - 1 - i;
            const stripeStart =
              (staggerAmount * staggerIdx) / (stripeCount - 1 || 1);
            const stripeEnd = stripeStart + perStripe;
            const stripeProgress = Math.max(
              0,
              Math.min(1, (holdT - stripeStart) / (stripeEnd - stripeStart)),
            );
            gsap.set(stripes[i]!, { scaleY: stripeProgress });
          }
        };

        gsap.ticker.add(tick);

        // Pull next sibling flush — same as desktop
        const nextSection = outerRef.current
          ?.nextElementSibling as HTMLElement | null;
        if (nextSection) gsap.set(nextSection, { marginTop: "-100dvh" });

        tlRef.current = mobileTl;

        return () => {
          gsap.ticker.remove(tick);
          mobileTl.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  useScrollTriggerRefresh(tlRef);

  const lineColor = theme === "dark" ? "#2F323B" : "rgba(39,39,39,0.15)";
  const strokeColor = theme === "dark" ? "#D8D8D8" : "#272727";

  return (
    <section
      ref={outerRef}
      className={`relative ${
        theme === "dark"
          ? "bg-[#040508] text-light-font"
          : "bg-[linear-gradient(0deg,#C3C3C3_0%,#FFFFFF_100%)] text-dark-font"
      }`}
    >
      {/* Mobile: h-dvh so stripe container (h-full) matches viewport exactly.
          Desktop: h-auto min-h-dvh keeps original behaviour. */}
      <div
        ref={sectionRef}
        className="lg:py-37.5 pt-25 pb-20 relative h-dvh lg:h-auto lg:min-h-dvh overflow-hidden lg:overflow-visible"
      >
        <div className="tr__container relative w-full grid grid-cols-12 gap-x-6">
          {/* ── Header ── */}
          <div className="grid grid-cols-12 gap-x-6 mb-16 lg:mb-20 col-span-12">
            <BlurTextReveal
              as="span"
              text="Our process"
              animationType="chars"
              stagger={0.05}
              className="title col-span-4 sm:col-span-3 md:col-span-2 pt-4"
            />
            <div className="col-span-8 sm:col-span-9 md:col-span-10">
              <BlurTextReveal
                as="h2"
                text="How we work"
                animationType="chars"
                stagger={0.05}
                className="mb-6"
              />
              <p className="small max-w-80 2xl:max-w-50 opacity-50">
                A repeatable method applied across every engagement.
              </p>
            </div>
          </div>

          {/* ── Cards ── */}
          <div className="col-span-12 lg:col-span-9 lg:col-start-3 gap-x-6 relative">
            <div className="grid grid-cols-12 md:grid-cols-12">
              {cards.map((card, idx) => (
                <div
                  ref={(self) => {
                    if (self) cardsRef.current[idx] = self;
                  }}
                  key={idx}
                  className="col-span-12 md:col-span-4 relative md:pb-20 pb-10 md:pr-6 md:last:pr-0 not-first:mt-10 md:not-first:mt-0"
                >
                  <div className="grid grid-cols-12 gap-x-6 items-baseline md:gap-x-0">
                    <span className="col-span-4 sm:col-span-3 md:col-span-12 title step-no md:mb-9 opacity-50">
                      Step - {card.id}
                    </span>

                    <div className="col-span-8 sm:col-span-9 md:col-span-12 gap-2">
                      <h3 className="work-title md:mb-8 md:mt-0">
                        {card.title}
                      </h3>

                      <p className="content small max-w-87.5 mt-4 md:mt-0">
                        {card.content}
                      </p>
                    </div>
                  </div>

                  {/* Desktop line — unchanged */}
                  <div className="fill-line absolute left-0 bottom-0 w-full hidden md:block">
                    <div
                      className="line absolute top-1/2 -translate-y-1/2 h-px w-full"
                      style={{ backgroundColor: lineColor }}
                    />
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      className="plus-follow top-1/2 -translate-1/2 absolute z-2"
                    >
                      <line
                        x1="6.5"
                        y1="0"
                        x2="6.5"
                        y2="13"
                        stroke={strokeColor}
                      />
                      <line
                        x1="13"
                        y1="6.5"
                        x2="0"
                        y2="6.5"
                        stroke={strokeColor}
                      />
                    </svg>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      className="-translate-x-1/2 plus"
                    >
                      <line
                        x1="6.5"
                        y1="0"
                        x2="6.5"
                        y2="13"
                        stroke={strokeColor}
                      />
                      <line
                        x1="13"
                        y1="6.5"
                        x2="0"
                        y2="6.5"
                        stroke={strokeColor}
                      />
                    </svg>
                  </div>

                  {/* Mobile/tablet line — plain, no plus icons */}
                  {idx !== cards.length - 1 && (
                    <div className="absolute left-0 bottom-0 w-full h-px md:hidden">
                      {/* bright fill — scaleX 0→1 scrubbed */}
                      <div
                        ref={(el) => {
                          if (el) cardLinesRef.current[idx] = el;
                        }}
                        className="absolute inset-0 h-px w-full"
                        style={{ backgroundColor: lineColor }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stripe overlay */}
        {stripeCount > 0 && (
          <div className="absolute inset-0 pointer-events-none flex flex-col w-full h-full z-30">
            {Array.from({ length: stripeCount }).map((_, index) => (
              <div
                key={index}
                ref={(el) => {
                  stripesRef.current[index] = el!;
                }}
                className="flex-1 w-full"
                style={{
                  backgroundColor: stripeColor,
                  willChange: "transform",
                  transformOrigin: "bottom",
                  marginTop: index > 0 ? "-0.5px" : undefined,
                  paddingBottom: "0.5px",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
