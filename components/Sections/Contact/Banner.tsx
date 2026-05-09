import { BlurTextReveal, FadeInOnScroll } from "@/components/TextAnimation";

export default function Banner() {
  return (
    <section className="pb-20 lg:pb-37.5 relative bg-[#D2D2D2] text-dark-font min-h-screen flex">
      <div className="tr__container flex flex-col items-center text-center">
        <div className="video-block ">
          <video
            src="/video/hanging-lion.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="max-h-[75vh] w-full mix-blend-darken hidden lg:block"
          />
          <video
            src="/video/hanging-lion-mobile.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="max-h-screen w-full mix-blend-darken block lg:hidden"
          />
        </div>
        <div className="flex flex-col gap-6 lg:gap-10 items-center text-center -translate-y-full lg:translate-y-0 -mt-30 lg:-mt-20">
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
      </div>
    </section>
  );
}
