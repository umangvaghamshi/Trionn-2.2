"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

// Swiper
import { WordShiftButton } from "@/components/Button";
import LinePlus from "@/components/LinePlus";
import { BlurTextReveal } from "@/components/TextAnimation";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";

// Components / Data
import { SERVICES_HOLD_VH } from "@/components/Sections/Home/servicesScrollConstants";
import { TestimonialsData } from "@/data";
import { useGSAP } from "@gsap/react";

const ArrowLeft = () => (
  <svg
    width="14"
    height="6"
    viewBox="0 0 14 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-1.5"
  >
    <path
      d="M3.66 5.58C3.48667 5.18 3.30667 4.82667 3.12 4.52C2.93333 4.2 2.74667 3.92667 2.56 3.7H13.94V2.62H2.56C2.74667 2.38 2.93333 2.10667 3.12 1.8C3.30667 1.48 3.48667 1.12667 3.66 0.739999H2.72C1.88 1.71333 0.993333 2.43333 0.0599988 2.9V3.42C0.993333 3.87333 1.88 4.59333 2.72 5.58H3.66Z"
      fill="#434343"
    />
  </svg>
);

const ArrowRight = () => (
  <svg
    width="14"
    height="6"
    viewBox="0 0 14 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-1.5"
  >
    <path
      d="M10.34 5.58C10.5133 5.18 10.6933 4.82667 10.88 4.52C11.0667 4.2 11.2533 3.92667 11.44 3.7H0.0600002V2.62H11.44C11.2533 2.38 11.0667 2.10667 10.88 1.8C10.6933 1.48 10.5133 1.12667 10.34 0.739999H11.28C12.12 1.71333 13.0067 2.43333 13.94 2.9V3.42C13.0067 3.87333 12.12 4.59333 11.28 5.58H10.34Z"
      fill="#434343"
    />
  </svg>
);

interface TestimonialsProps {
  customClass?: string;
  swiperOptions?: SwiperOptions;
  disableScrollEffect?: boolean;
}

export default function Testimonials({
  customClass,
  swiperOptions = {},
  disableScrollEffect = false,
}: TestimonialsProps) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const reviewPrevRef = useRef<HTMLDivElement>(null);
  const reviewNextRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    const swiper = swiperRef.current;

    if (swiper && reviewPrevRef.current && reviewNextRef.current) {
      swiper.params.navigation = {
        ...(typeof swiper.params.navigation === "object"
          ? swiper.params.navigation
          : {}),
        prevEl: reviewPrevRef.current,
        nextEl: reviewNextRef.current,
      };

      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const goToTestimonial = useCallback((index: number) => {
    swiperRef.current?.slideToLoop(index);
  }, []);

  return (
    <section
      className="relative z-20 isolate bg-[linear-gradient(0deg,#C3C3C3_0%,#FFFFFF_100%)] overflow-hidden min-h-screen"
      style={disableScrollEffect ? undefined : { transform: `translateY(-${SERVICES_HOLD_VH}vh)`, marginBottom: `-${SERVICES_HOLD_VH}vh`, willChange: "transform" }}
    >
      <div className="tr__container min-h-screen py-25">
        <div className="grid grid-cols-12 gap-6">
          <BlurTextReveal
            as="h2"
            html="Client stories"
            animationType="chars"
            stagger={0.05}
            className="text-dark-font col-span-6"
          />
          <div className="col-span-6">
            <p className="small text-dark-font max-w-45">
              Great work is built through partnership. Here&apos;s what our
              clients say.
            </p>
          </div>
        </div>
        <LinePlus
          customClass={"my-20"}
          lineClass={"opacity-15 bg-grey-line"}
          plusClass={"col-start-7"}
          iconColor={"#272727"}
        />
        <div className="w-full relative grid grid-cols-12 gap-6 ">
          <div className="flex flex-col justify-between col-span-4 col-start-3">
            <div className="testimonial-company-list flex flex-col gap-4">
              {TestimonialsData.map((item, index) => (
                <button
                  type="button"
                  key={item.companyName}
                  onClick={() => goToTestimonial(index)}
                  aria-current={activeIndex === index ? "true" : undefined}
                  aria-label={`Show testimonial from ${item.companyName}`}
                  className={`h4 uppercase flex gap-4 items-center text-left transition-all duration-500 ease-in-out text-dark-font bg-transparent border-0 p-0 cursor-pointer ${
                    activeIndex === index
                      ? "opacity-100"
                      : "opacity-30 hover:opacity-60"
                  }`}
                >
                  {item.companyName}
                  <span
                    className={`icon shrink-0 transition-opacity duration-500 ${
                      activeIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden
                  >
                    <svg
                      width="10"
                      height="9"
                      viewBox="0 0 10 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-2.5 h-2.5"
                    >
                      <path
                        d="M5.47399 8.65203V6.55203L8.32999 3.75203V4.90003L5.47399 2.10003V2.74181e-05L9.32399 3.83603V4.81603L5.47399 8.65203ZM-6.57886e-06 5.11003V3.54203H8.60999V5.11003H-6.57886e-06Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
            <div className="flex">
              <div ref={reviewPrevRef} className="custom-arrow left">
                <div className="arrow-icon first">
                  <ArrowLeft />
                </div>
                <div className="arrow-icon second">
                  <ArrowLeft />
                </div>
              </div>
              <div ref={reviewNextRef} className="custom-arrow right -ml-px">
                <div className="arrow-icon first">
                  <ArrowRight />
                </div>
                <div className="arrow-icon second">
                  <ArrowRight />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-6 ">
            <Swiper
              {...swiperOptions}
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={600}
              navigation={false} // assigned manually in useEffect
              autoplay={{
                delay: 5000,
                disableOnInteraction: false, // Autoplay won't stop after user swipes
                pauseOnMouseEnter: true, //
              }}
              loop={true}
              onSlideChange={handleSlideChange}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              className={`swiper-row mx-0! max-w-203 ${customClass ? customClass : ""}`}
            >
              {TestimonialsData.map((item, index) => (
                <SwiperSlide
                  key={index}
                  className="testimonial-slide h-auto! text-dark-font"
                >
                  <div className="testimonial-item gap-x-6 h-full">
                    <h4 className="uppercase hidden">{item.companyName}</h4>
                    <div className="flex flex-col justify-between">
                      <h3 className="mb-20">{item.quoteMessage}</h3>
                      <div className="client-info flex justify-between items-end">
                        <div className="left-block flex items-end">
                          <div className="w-20 h-20 overflow-hidden rounded-lg relative transition-all duration-300 ease-in-out mr-6">
                            <Image
                              src={item.clientImage}
                              alt={item.companyName}
                              width={80}
                              height={80}
                              className="absolute w-full h-full object-cover object-center top-0 left-0"
                            />
                          </div>
                          <div className="flex flex-col">
                            <p className="mb-1">{item.clientName}</p>
                            <p className="opacity-60 small">{item.clientDeg}</p>
                          </div>
                        </div>

                        <div className="right-block transition-all duration-300 ease-in-out">
                          <Link
                            href="/"
                            className="flex items-center button-text uppercase text-dark-font"
                          >
                            ▷ Listen to him!
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="mt-25">
              <WordShiftButton text="become a client" href="#" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
