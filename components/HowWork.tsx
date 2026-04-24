"use client";
import { BlurTextReveal } from "@/components/TextAnimation";
import { HowWorkData } from "@/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function HowWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const cards = HowWorkData;

  useGSAP(
    () => {
      if (!cardsRef.current.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=150%`,
          pin: true,
          scrub: true,
          markers: false,
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
    },
    { scope: sectionRef },
  );

  return (
    <section className="bg-[#040508] relative">
      <div
        ref={sectionRef}
        className="py-37.5 min-h-screen relative text-light-font"
      >
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
            <div className="grid grid-cols-12 text-light-font">
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
                    <span className="title step-no text-light-font mb-9 block">
                      Step - {card.id}
                    </span>

                    <h3 className="work-title block mb-8">{card.title}</h3>
                    <p className="content small max-w-87.5">{card.content}</p>
                    <div className="fill-line absolute left-0 bottom-0 w-full">
                      <div className="line absolute top-1/2 -translate-y-1/2 bg-cream-line/20 h-px w-full"></div>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="plus-follow top-1/2 -translate-1/2 absolute"
                      >
                        <line
                          x1="6.5"
                          y1="-2.18557e-08"
                          x2="6.5"
                          y2="13"
                          style={{ stroke: "#D8D8D8" }}
                        />
                        <line
                          x1="13"
                          y1="6.5"
                          x2="-4.37114e-08"
                          y2="6.5"
                          style={{ stroke: "#D8D8D8" }}
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
                          style={{ stroke: "#D8D8D8" }}
                        />
                        <line
                          x1="13"
                          y1="6.5"
                          x2="-4.37114e-08"
                          y2="6.5"
                          style={{ stroke: "#D8D8D8" }}
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
