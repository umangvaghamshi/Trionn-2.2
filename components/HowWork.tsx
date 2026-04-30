"use client";
import { BlurTextReveal } from "@/components/TextAnimation";
import { HowWorkData } from "@/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

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

  const cards = HowWorkData;

  useGSAP(
    () => {
      if (!cardsRef.current.length) return;

      const stripes = stripesRef.current;

      gsap.set(stripes, { scaleY: 0, transformOrigin: "bottom" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=350%`,
          pin: true,
          scrub: true,
          markers: false,
          pinSpacing: true,
        },
        defaults: {
          ease: "none",
        },
      });

      cardsRef.current.forEach((card, idx) => {
        const plus = card.querySelector(".plus");
        const line = card.querySelector(".line");
        const content = card.querySelector(".content");
        const title = card.querySelector(".work-title");
        const numbers = card.querySelector(".step-no");
        const plusFollow = card.querySelector(".plus-follow");

        gsap.set([plusFollow, plus], {
          autoAlpha: 0,
        });

        gsap.set(plus, {
          autoAlpha: idx == 0 ? 1 : 0,
        });

        // ---- Card animation block ----
        tl.addLabel(`card_${idx}_start`);

        if (idx == 0) {
          tl.set(
            plusFollow,
            {
              autoAlpha: 1,
            },
            "<0.2",
          );
        } else {
          tl.set(plusFollow, {
            autoAlpha: 1,
          });
        }

        // Plus Follow
        tl.fromTo(
          plusFollow,
          { rotation: 0 },
          { rotation: 360 * 2, right: -12 },
          "<10%",
        );

        // Line draws during entire card
        tl.fromTo(
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

      // ---- Pull next sibling flush — no gap after pin spacer ----
      const nextSection = outerRef.current
        ?.nextElementSibling as HTMLElement | null;
      if (nextSection) {
        if (stripeCount > 0) {
          gsap.set(nextSection, { marginTop: "-100vh", ease: "none" });
        } else {
          tl.to({}, { duration: 1 }); // Hold for 1 sec
          gsap.set(nextSection, { marginTop: "-100vh", ease: "none" });
        }
      }

      // ---- Stripe reveal after all cards are done ----
      if (stripeCount > 0) {
        tl.addLabel("stripes_start");

        // Match stripe phase duration exactly to card phase duration so both
        // consume equal scroll distance.
        const staggerAmount = 0.6;
        const perStripe = 1 - staggerAmount;
        const totalStripeDuration = 1.2; // cards phase length

        for (let i = 0; i < stripeCount; i++) {
          const staggerIdx = stripeCount - 1 - i;
          const stripeOffset =
            (staggerAmount * staggerIdx) / (stripeCount - 1 || 1);
          const start = stripeOffset * totalStripeDuration;
          const end = start + perStripe * totalStripeDuration;

          tl.fromTo(
            stripes[i]!,
            { scaleY: 0 },
            { scaleY: 1, duration: end - start, ease: "none" },
            `stripes_start+=${start}`,
          );
        }
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={outerRef}
      className={`relative ${theme === "dark" ? "bg-[#040508] text-light-font" : "bg-[linear-gradient(0deg,#C3C3C3_0%,#FFFFFF_100%)] text-dark-font"}`}
    >
      <div ref={sectionRef} className="py-37.5 min-h-screen relative">
        <div className="tr__container relative w-full grid grid-cols-12 gap-x-6 h-full">
          <div className="grid grid-cols-12 gap-x-6 mb-20 col-span-12">
            <BlurTextReveal
              as="span"
              html={`Our process`}
              animationType="chars"
              stagger={0.05}
              className="title block col-span-2 pt-4"
            />
            <div className="col-span-10">
              <BlurTextReveal
                as="h2"
                html={`How we work`}
                animationType="chars"
                stagger={0.05}
                className="mb-6"
              />
              <p className="small max-w-50 opacity-50">
                A repeatable method applied across every engagement.
              </p>
            </div>
          </div>
          <div className="col-span-9 col-start-3 gap-x-6 relative">
            <div className="grid grid-cols-12">
              {cards.map((card, idx) => {
                return (
                  <div
                    ref={(self) => {
                      if (self && cardsRef.current) {
                        cardsRef.current[idx] = self;
                      }
                    }}
                    key={idx}
                    className="col-span-4 relative pb-20 pr-6 last:pr-0"
                  >
                    <span className="title step-no mb-9 block">
                      Step - {card.id}
                    </span>

                    <h3 className="work-title block mb-8">{card.title}</h3>
                    <p className="content small max-w-87.5">{card.content}</p>
                    <div className="fill-line absolute left-0 bottom-0 w-full">
                      <div
                        className={`line absolute top-1/2 -translate-y-1/2 h-px w-full ${theme === "dark" ? "bg-[#2F323B]" : "bg-grey-line/15"}`}
                      ></div>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="plus-follow top-1/2 -translate-1/2 absolute z-2"
                      >
                        <line
                          x1="6.5"
                          y1="-2.18557e-08"
                          x2="6.5"
                          y2="13"
                          style={{
                            stroke: theme === "dark" ? "#D8D8D8" : "#272727",
                          }}
                        />
                        <line
                          x1="13"
                          y1="6.5"
                          x2="-4.37114e-08"
                          y2="6.5"
                          style={{
                            stroke: theme === "dark" ? "#D8D8D8" : "#272727",
                          }}
                        />
                      </svg>

                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="-translate-x-1/2 plus"
                      >
                        <line
                          x1="6.5"
                          y1="-2.18557e-08"
                          x2="6.5"
                          y2="13"
                          style={{
                            stroke: theme === "dark" ? "#D8D8D8" : "#272727",
                          }}
                        />
                        <line
                          x1="13"
                          y1="6.5"
                          x2="-4.37114e-08"
                          y2="6.5"
                          style={{
                            stroke: theme === "dark" ? "#D8D8D8" : "#272727",
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stripe overlay — animates in after card timeline completes */}
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
