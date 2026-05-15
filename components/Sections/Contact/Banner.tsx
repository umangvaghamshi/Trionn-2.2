import { BlurTextReveal, FadeInOnScroll } from "@/components/TextAnimation";
import ScrollIndicator from "@/components/ScrollIndicator";

export default function Banner() {
  return (
    <section className="pb-20 lg:pb-37.5 relative bg-[#D2D2D2] text-dark-font min-h-dvh flex overflow-hidden">
      <div className="tr__container flex flex-col items-center text-center">
        <div className="video-block ">
          <video
            src="/video/hanging-lion.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="max-h-[75dvh] w-full mix-blend-darken hidden lg:block"
          />
          <video
            src="/video/hanging-lion-mobile.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="max-h-[90dvh] w-full mix-blend-darken block lg:hidden -translate-y-[15dvh]"
          />
        </div>
        <div className="flex flex-col gap-6 lg:gap-10 items-center text-center absolute top-[50dvh] lg:top-[60dvh] xl:top-[65dvh] left-0 w-full">
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
    </section>
  );
}
