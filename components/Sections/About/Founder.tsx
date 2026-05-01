"use client";
import Image from "next/image";
import { WordShiftButton } from "@/components/Button";
import LinePlus from "@/components/LinePlus";
import { BlurTextReveal, FadeOnScroll } from "@/components/TextAnimation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Founder() {
  const sectionStyle = {
    backgroundImage: "url('/images/founder.webp')",
    backgroundSize: "cover",
    backgroundPosition: "top center",
    backgroundRepeat: "no-repeat",
  };
  return (
    <section
      className="relative w-full py-50 bg-[#040508] z-3 overflow-hidden text-light-font"
      style={sectionStyle}
    >
      <div className="tr__container flex flex-col justify-between">
        <div className="title-block grid grid-cols-12 gap-x-6 mb-30">
          <div className="col-span-10 col-start-2">
            <BlurTextReveal
              as="h2"
              text={`Sunny Rathod`}
              animationType="chars"
              stagger={0.05}
              className="mb-6"
            />
            <h3 className="text-cream/60">Founder & CEO</h3>
          </div>
        </div>
        <div className="title-block grid grid-cols-12 gap-x-6 mb-60">
          <div className="col-span-2 col-start-10 flex gap-4 items-start">
            <Image
              src="/images/awards-fav.webp"
              className="w-10 h-auto min-w-10 rounded-sm"
              alt="Trionn"
              width={40}
              height={40}
              priority={true}
            />
            <BlurTextReveal
              as="span"
              text={`Awwwards Jury, shaping digital experiences for global brands.`}
              animationType="chars"
              stagger={0.02}
              className="title max-w-50"
            />
          </div>
        </div>
        <div className="title-block grid grid-cols-12 gap-x-6">
          <div className="col-span-10 max-w-80 col-start-2">
            <p>
              Award-winning designer & Founder of Trionn® with 27+ yrs of
              experience in UI/UX, web, and brand systems.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 my-25">
          <div className="col-span-10 col-start-2 ">
            <LinePlus
              customClass="grid-cols-10!"
              lineClass={"opacity-20 bg-cream-line left-1/2! -translate-x-1/2"}
              plusClass={"col-span-12 mx-auto translate-x-0!"}
              iconColor={"#D8D8D8"}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-10 col-start-2">
            <div className="flex justify-between items-start mb-25">
              <FadeOnScroll
                as={"h2"}
                html="True growth is not about adding more, but about becoming more."
                className="w-full max-w-225"
              />
              <h2>“</h2>
            </div>
            <div className="flex justify-between items-start">
              <p className="small text-light-font max-w-75">
                Recognized by global design platforms and trusted by brands
                across industries.
              </p>
              <BlurTextReveal
                as="span"
                text={`This belief shapes how we approach every project.`}
                animationType="chars"
                stagger={0.02}
                className="title max-w-56 pl-4 border-light-font border-l-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
