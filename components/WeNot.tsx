"use client";
import { useRef } from "react";
import parse from "html-react-parser";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BlurTextReveal } from "@/components/TextAnimation";
import LinePlus from "@/components/LinePlus";
import { WeNotData } from "@/data";

export default function WeNot() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const cards = WeNotData;

  useGSAP(
    () => {
      if (!cardsRef.current.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          markers: false,
        },
      });

      cardsRef.current.forEach((card, idx) => {
        const content = card.querySelector(".content");
        const svgIcon = card.querySelector(".svg-icon");
        const line = card.querySelector(".line");

        gsap.set(line, { scaleX: 0, transformOrigin: "left" });
        gsap.set(svgIcon, { autoAlpha: 0 });
        gsap.set(content, { autoAlpha: 0 });

        tl.addLabel(`start_${idx}_animation`);

        tl.to(
          svgIcon,
          {
            autoAlpha: 1,
            ...(idx !== cards.length - 1 && { rotation: 360 }),
            duration: 0.4,
            ease: "none",
          },
          ">",
        );

        tl.to(
          line,
          {
            scaleX: 1,
            ease: "sine",
          },
          "<",
        );

        tl.to(
          content,
          {
            autoAlpha: 1,
            ease: "sine",
          },
          "<50%",
        );
        tl.addLabel(`end_${idx}_animation`);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="we-not-section  bg-[#F7F7F7] text-dark-font"
    >
      <div className="tr__container relative w-full">
        <div className="grid grid-cols-12 gap-x-6 py-37.5">
          <div className="col-span-9 col-start-3">
            <BlurTextReveal
              as="span"
              html={`Who we're not for`}
              animationType="chars"
              stagger={0.05}
              className="title uppercase mb-10 block"
            />
            <p className="max-w-50 mb-13">
              We&rsquo;re not the right fit for everyone — and that&rsquo;s intentional.
            </p>
            <div className="grid grid-cols-9">
              {cards.map((card, idx) => {
                return (
                  <div
                    ref={(self) => {
                      if (self && cardsRef.current) {
                        cardsRef.current[idx] = self;
                      }
                    }}
                    className="col-span-3 relative pt-20 pr-6 last:pr-0"
                    key={card.id}
                  >
                    <div className="fill-line flex items-center h-[1.188rem] absolute left-0 top-0 w-full">
                      <div className="line absolute top-1/2 left-0 -translate-y-1/2 bg-dark-font/15 h-px w-full" />
                      {card.id == 2 ? (
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="-translate-x-1/2 svg-icon"
                        >
                          <line
                            x1="3.22103"
                            y1="7.16373"
                            x2="0.437826"
                            y2="2.10123"
                            stroke="#272727"
                          />
                          <line
                            x1="2.53917"
                            y1="6.99165"
                            x2="13.6192"
                            y2="0.43013"
                            stroke="#272727"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="-translate-x-1/2 svg-icon"
                        >
                          <line
                            x1="13.7891"
                            y1="4.59574"
                            x2="4.59672"
                            y2="13.7881"
                            stroke="#FF0000"
                          />
                          <line
                            x1="13.789"
                            y1="13.7881"
                            x2="4.59664"
                            y2="4.59574"
                            stroke="#FF0000"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="content small max-w-83">
                      {parse(card.content)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <LinePlus
          lineClass={"opacity-15 bg-grey-line left-1/2! -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto translate-x-0!"}
          iconColor={"#272727"}
        />
      </div>
    </section>
  );
}
