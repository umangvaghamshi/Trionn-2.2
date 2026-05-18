"use client";
import Marquee from "@/components/Marquee";
import { BlurTextReveal } from "@/components/TextAnimation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const CROSS_ICON = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-10 lg:mx-16 w-6 lg:w-8 h-6 lg:h-8 mt-2"
  >
    <line
      x1="20.2256"
      y1="-2.18557e-08"
      x2="20.2256"
      y2="40"
      stroke="#D8D8D8"
    />
    <line x1="40" y1="20.226" x2="-4.37114e-08" y2="20.226" stroke="#D8D8D8" />
  </svg>
);

const STRIPE_COUNT = 5;
const STRIPE_COLOR = "#D2D2D2";

export default function Vision() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripesRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    const stripes = stripesRef.current;

    /* ── DESKTOP ─────────────────────────────── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=200%`,
        pin: true,
        anticipatePin: 1,
        scrub: true,
        markers: false,
        pinSpacing: true,
      },
      defaults: { ease: "none" },
    });

    const nextSection = document.getElementById("keyfacts-section");
    if (nextSection) {
      gsap.set(nextSection, { marginTop: "-100dvh" });
    }

    if (STRIPE_COUNT > 0) {
      tl.addLabel("stripes_start");

      const staggerAmount = 0.6,
        perStripe = 1 - staggerAmount,
        totalStripeDur = 1.2;
      for (let i = 0; i < STRIPE_COUNT; i++) {
        const staggerIdx = STRIPE_COUNT - 1 - i;
        const offset = (staggerAmount * staggerIdx) / (STRIPE_COUNT - 1 || 1);
        const s = offset * totalStripeDur,
          e = s + perStripe * totalStripeDur;
        tl.to(
          stripes[i]!,
          { scaleY: 1, duration: e - s, ease: "none" },
          `stripes_start+=${s}`,
        );
      }
    }

    return () => {
      tl.scrollTrigger?.refresh();
    };
  });

  return (
    <section
      ref={sectionRef}
      id="vision-section"
      className="relative min-h-dvh h-dvh lg:h-auto lg:min-h-dvh overflow-visible "
    >
      <div
        id="s3-text"
        className="relative z-20 w-full min-h-dvh flex flex-col justify-between bg-transparent text-left overflow-hidden items-center py-50 lg:py-37.5 text-light-font mix-blend-difference"
      >
        <div className="tr__container w-full grid grid-cols-12 gap-x-6">
          <BlurTextReveal
            as="span"
            html={`Focused vision. <br/>Measured execution.`}
            animationType="chars"
            stagger={0.05}
            className="title z-3 lg:col-start-2 col-span-12 lg:col-span-11"
          />
        </div>

        <div className="relative z-3 flex-col flex justify-center items-start pointer-events-none py-20">
          <Marquee gap={0} speed={0.8}>
            <div className="uppercase mrquee-text flex items-center">
              <span className="marquee-text-item">Inspire</span>
              {CROSS_ICON}
              <span className="marquee-text-item">innovate</span>
              {CROSS_ICON}
              <span className="marquee-text-item">Impact</span>
              {CROSS_ICON}
            </div>
          </Marquee>
        </div>

        <div className="tr__container w-full grid grid-cols-12 gap-x-6 pb-10">
          <BlurTextReveal
            as="span"
            text={`✦ From idea to outcome.`}
            animationType="chars"
            stagger={0.05}
            className="title z-3 col-span-12 text-center"
          />
        </div>
      </div>

      {STRIPE_COUNT > 0 && (
        <div className="stripes-container absolute inset-0 pointer-events-none flex flex-col w-full h-dvh z-30">
          {Array.from({ length: STRIPE_COUNT }).map((_, index) => (
            <div
              key={index}
              ref={(el) => {
                stripesRef.current[index] = el!;
              }}
              className="stripe-item flex-1 w-full h-full"
              style={{
                backgroundColor: STRIPE_COLOR,
                willChange: "transform",
                transform: "scaleY(0)",
                transformOrigin: "bottom",
                marginTop: index > 0 ? "-1px" : undefined,
                paddingBottom: "1px",
                // opacity: 0.5,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
