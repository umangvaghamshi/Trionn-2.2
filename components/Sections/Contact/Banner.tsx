"use client";

import { BlurTextReveal, FadeInOnScroll } from "@/components/TextAnimation";
import ScrollIndicator from "@/components/ScrollIndicator";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTransitionReady } from "@/components/Transition";

gsap.registerPlugin(ScrollTrigger);

const STRIPE_COUNT = 5;
const STRIPE_COLOR = "#040508";

export default function Banner() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const stripesRef = useRef<HTMLDivElement[]>([]);
  const transitionReady = useTransitionReady();

  useGSAP(
    () => {
      if (!transitionReady) {
        gsap.set(videoRef.current, { y: "-6rem" });
        return;
      }

      gsap.to(videoRef.current, { y: 0, duration: 1, ease: "back.out(3)" });
    },
    { scope: videoRef, dependencies: [transitionReady] },
  );

  useGSAP(() => {
    const stripes = stripesRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=150%`,
        pin: true,
        scrub: true,
        markers: false,
        pinSpacing: true,
      },
      defaults: { ease: "none" },
    });

    const nextSection = document.getElementById("contact-forms-section");
    if (nextSection) {
      gsap.set(nextSection, { marginTop: "-100dvh" });
    }

    if (STRIPE_COUNT > 0) {
      tl.addLabel("stripes_start");

      const staggerAmount = 0.3;
      const perStripe = (0.6 - staggerAmount) / 1;
      const totalStripeDur = 1;

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

      tl.to({}, { duration: 0.1 });
    }

    return () => {
      tl.scrollTrigger?.refresh();
    };
  });

  return (
    <section
      ref={sectionRef}
      id="contact-banner-section"
      className="pb-20 lg:pb-37.5 relative bg-[#D2D2D2] text-dark-font min-h-dvh h-dvh flex overflow-visible"
    >
      <div className="tr__container flex flex-col items-center text-center">
        <div
          className="video-block mix-blend-darken -translate-y-20"
          ref={videoRef}
        >
          <video
            src="/video/hanging-lion.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="max-h-[75dvh] w-full hidden lg:block"
          />
          <video
            src="/video/hanging-lion-mobile.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="max-h-[90dvh] w-full block lg:hidden -translate-y-[15dvh]"
          />
        </div>
        <div className="flex flex-col gap-6 items-center text-center absolute top-[50dvh] lg:top-[60dvh] xl:top-[65dvh] left-0 w-full">
          <BlurTextReveal
            as="h1"
            html="Let's start something."
            animationType="chars"
            stagger={0.08}
          />
          <FadeInOnScroll delay={1}>
            <p className="small max-w-100 lg:max-w-75">
              We collaborate with teams who value clarity, craft, and long-term
              thinking.
            </p>
          </FadeInOnScroll>
        </div>
        <div className="flex items-center absolute bottom-20 left-0 w-full justify-center opacity-50 pointer-events-none banner-scroll">
          <ScrollIndicator />
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
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
