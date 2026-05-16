"use client";
import LinePlus from "@/components/LinePlus";
import { BlurTextReveal, FadeOnScroll } from "@/components/TextAnimation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Founder() {
  return (
    <section
      className="relative w-full py-20 md:py-30 lg:py-50 bg-[#040508] z-3 overflow-hidden text-light-font bg-[url('/images/founder-mobile.webp')] md:bg-[url('/images/founder.webp')] 
                 bg-cover bg-position-[top_center] bg-no-repeat"
    >
      <div className="tr__container flex flex-col justify-between">
        <div className="title-block grid grid-cols-12 gap-x-6">
          <div className="col-span-8 lg:col-start-2 mb-20 md:mb-30">
            <BlurTextReveal
              as="h2"
              text={`Sunny Rathod`}
              animationType="chars"
              stagger={0.05}
              className="mb-4 md:mb-6"
            />
            <h3 className="text-cream/60">Founder & CEO</h3>
          </div>
          <div className="col-span-4 md:col-span-12 flex flex-col md:flex-row gap-4 items-end md:items-start md:justify-end mb-0 md:mb-60">
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
              className="title max-w-60 hidden md:block"
            />
            <BlurTextReveal
              as="span"
              html={`Awwwards <br/>Jury`}
              animationType="chars"
              stagger={0.02}
              className="title block md:hidden text-right"
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-10 max-w-80 lg:col-start-2">
            <p>
              Award-winning designer & Founder of Trionn® with 27+ yrs of
              experience in UI/UX, web, and brand systems.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 mb-20 mt-[65dvh] sm:mt-[100dvh] md:my-25">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2 ">
            <LinePlus
              customClass="grid-cols-10!"
              lineClass={"opacity-20 bg-cream-line left-1/2! -translate-x-1/2"}
              plusClass={"col-span-12 mx-auto"}
              iconColor={"#D8D8D8"}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <div className="flex justify-between items-start mb-20 md:mb-25 gap-6">
              <FadeOnScroll
                as={"h2"}
                html="True growth is not about adding more, but about becoming more."
                className="w-full max-w-225"
              />
              <h2>”</h2>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-14">
              <p className="small text-light-font max-w-84">
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
