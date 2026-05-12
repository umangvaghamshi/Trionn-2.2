import { BlurTextReveal, FadeInOnScroll } from "@/components/TextAnimation";

export default function Banner() {
  return (
    <section className="pb-20 lg:pb-37.5 relative bg-[#D2D2D2] text-dark-font min-h-dvh flex">
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
            className="max-h-[90dvh] w-full mix-blend-darken block lg:hidden"
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
        <div className="flex items-center absolute bottom-20 left-0 w-full justify-center opacity-50 title pointer-events-none">
          scroll
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4.5 h-4.5 ml-1.5 mt-0.5"
          >
            <circle cx="9" cy="9" r="8.5" stroke="currentColor" />
            <path
              d="M8.64645 12.3536C8.84171 12.5488 9.15829 12.5488 9.35355 12.3536L12.5355 9.17157C12.7308 8.97631 12.7308 8.65973 12.5355 8.46447C12.3403 8.2692 12.0237 8.2692 11.8284 8.46447L9 11.2929L6.17157 8.46447C5.97631 8.2692 5.65973 8.2692 5.46447 8.46447C5.2692 8.65973 5.2692 8.97631 5.46447 9.17157L8.64645 12.3536ZM9 5L8.5 5L8.5 12L9 12L9.5 12L9.5 5L9 5Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
