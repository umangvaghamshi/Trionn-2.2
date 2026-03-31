"use client";
import { BlurTextReveal, FadeOnScroll } from "@/components/TextAnimation";
import LinePlus from "@/components/LinePlus";
import { WordShiftButton } from "@/components/Button";
import BlurTextRotate from "@/components/TextAnimation/BlurTextRotate";

export default function Banner() {
  return (
    <div className="text-light-font relative" id="sticky-wrap">
      <section className="main-banner  min-h-screen pt-37 pb-20 flex w-full">
        <div className="tr__container relative flex flex-col justify-between w-full">
          <div className="banner-top-block flex flex-col w-full">
            <div
              className="banner-title-block grid grid-cols-12 grid-rows-2 gap-x-6 w-full mix-blend-difference"
              id="s1-headline"
            >
              <BlurTextReveal
                as="h1"
                html="Designed to"
                animationType="chars"
                stagger={0.08}
                className="uppercase z-2 col-span-12"
              />
              <BlurTextRotate
                stagger={0.08}
                prefix="mean"
                texts={[
                  "something.",
                  "depth.",
                  "impact.",
                  "purpose.",
                  "intention.",
                ]}
                className="uppercase z-2 col-span-10 col-start-3"
              />
            </div>

            <div className="banner-subtitle-block grid grid-cols-12 grid-rows-1 gap-x-6 -translate-y-full w-full z-3 -mt-0.75">
              <span
                className="title z-2 col-span-6 flex items-end mix-blend-difference"
                id="s1-sub"
              >
                Strategy-led <br />
                digital experiences.
              </span>
              <span
                className="title text-right z-2 col-span-6 flex items-end justify-end mix-blend-difference"
                id="s1-stats"
              >
                13+ years <br />
                shaping digital <br />
                direction.
              </span>
            </div>
          </div>
          <div className="banner-text-block grid grid-cols-12 grid-rows-1 gap-x-6 w-full mix-blend-difference">
            <p className="max-w-60 z-2 col-span-5 title" id="s1-body">
              Websites, Digital products, brands, and systems built for clarity,
              scale, and impact.
            </p>
          </div>
        </div>
      </section>
      <section className="home-about  relative z-3 pt-50 pb-20">
        <div className="tr__container relative w-full">
          <div
            className="about-top-block flex flex-col justify-between"
            id="s2-text"
          >
            <div className="about-title-block grid grid-cols-12 grid-rows-1 gap-x-6">
              <div className="col-span-1 mix-blend-difference">
                <BlurTextReveal
                  as="span"
                  html={`about`}
                  animationType="chars"
                  stagger={0.05}
                  className="title mt-4 block"
                />
              </div>
              <div className="col-span-11 mix-blend-difference">
                <FadeOnScroll
                  as={"h2"}
                  html="<span class='w-1/12 inline-block'></span><span class='pl-3 inline!'><span>Trionn<sup class='inline-block text-[2.75rem] leading-none'>®</sup> is an independent digital studio crafting meaningful brand experiences through strategy, design, and technology.<span></span>"
                  className=""
                />
              </div>
            </div>
            <LinePlus
              customClass={"mt-25 mb-20"}
              lineClass={"opacity-20 col-start-2"}
              plusClass={"col-start-9"}
              iconColor={"#D8D8D8"}
            />
            <div className="about-subtitle-block grid grid-cols-12 grid-rows-1 gap-x-6">
              <div className="col-span-3 col-start-2 max-w-57 mix-blend-difference">
                <BlurTextReveal
                  as="span"
                  html={`We design for longevity — clarity first, craft always, built to scale.`}
                  animationType="chars"
                  stagger={0.05}
                  className="title block"
                />
              </div>
              <div className="col-span-3 col-start-9 flex flex-col mix-blend-difference">
                <p className="mb-20 max-w-100 ">
                  Our mission is to make technology feel human by designing
                  digital products that are intuitive, purposeful, and
                  meaningful to people.
                </p>
                <WordShiftButton
                  text="more about us"
                  href="#"
                  styleVars={{ buttonWrapperColor: "#D8D8D8" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
