import { BlurTextReveal } from "@/components/TextAnimation";

export default function Banner() {
  return (
    <section className="pb-37.5 relative lg:min-h-screen bg-[#D2D2D2] text-dark-font">
      <div className="tr__container flex flex-col items-center text-center">
        <div className="video-block ">
          <video
            src="/video/hanging-lion.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="max-w-300 w-full mix-blend-darken"
          />
        </div>
        <div className="flex flex-col gap-10 items-center text-center -mt-20">
          <BlurTextReveal
            as="h1"
            html="Let's start something."
            animationType="chars"
            stagger={0.08}
          />
          <p className="small max-w-75">
            We collaborate with teams who value clarity, craft, and long-term
            thinking.
          </p>
        </div>
      </div>
    </section>
  );
}
