"use client";
import LinePlus from "@/components/LinePlus";
import { TechFaqItemType } from "@/data/dataType";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import parser from "html-react-parser";
import { useRef, useState } from "react";
gsap.registerPlugin(ScrollTrigger);

interface TechAccordionProps {
  items: TechFaqItemType[];
  customClass?: string;
}

export default function TechAccordion({
  items,
  customClass,
}: TechAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const refreshST = () => {
    window.dispatchEvent(new CustomEvent("accordion-settled"));
  };

  const toggleItem = (index: number) => {
    const current = contentRefs.current[index];

    // Close currently open item
    if (openIndex !== null && openIndex !== index) {
      const openEl = contentRefs.current[openIndex];
      if (openEl) {
        gsap.to(openEl, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: refreshST,
        });
      }
    }

    // Toggle clicked item
    if (openIndex === index) {
      gsap.to(current, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: refreshST,
      });
      setOpenIndex(null);
    } else {
      gsap.set(current, { height: "auto" });
      const height = current!.scrollHeight;

      gsap.fromTo(
        current,
        { height: 0, opacity: 0 },
        {
          height,
          opacity: 1,
          duration: 0.6,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(current, { height: "auto" });
            refreshST();
          },
        },
      );

      setOpenIndex(index);
    }
  };

  return (
    <div className={`accordion ${customClass ?? ""}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index}>
            <div className="accordion__item group">
              {/* TITLE */}
              <div
                className="accordion__title py-10 grid grid-cols-12 gap-x-6 w-full relative cursor-pointer items-center"
                onClick={() => toggleItem(index)}
              >
                <span className="h3 col-span-1">{index + 1}.</span>
                <h3 className="col-span-8 col-start-5 pr-20">{item.title}</h3>

                {/* + / - */}
                <span
                  className={`icon absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 delay-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    width="9"
                    height="10"
                    viewBox="0 0 9 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-2.28882e-05 5.474L2.09998 5.474L4.89998 8.33L3.75198 8.33L6.55198 5.474H8.65198L4.81598 9.324H3.83598L-2.28882e-05 5.474ZM3.54198 0L5.10998 0L5.10998 8.61L3.54198 8.61L3.54198 0Z"
                      fill="#434343"
                    />
                  </svg>
                </span>
                {/* <span className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl font-light">
                  {isOpen ? "−" : "+"}
                </span> */}
              </div>

              {/* CONTENT */}
              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className="accordion__content grid grid-cols-12 gap-x-6 w-full overflow-hidden"
                style={{
                  height: index === 0 ? "auto" : 0,
                  opacity: index === 0 ? 1 : 0,
                }}
              >
                <div className="col-span-8 col-start-5 pb-12 pr-20 grid grid-cols-1 md:grid-cols-2 gap-y-8">
                  {Array.isArray(item.content) &&
                    item.content.map((cat, i) => (
                      <div key={i}>
                        <span className="title text-dark-font/60 mb-4 block">
                          {parser(cat.heading)}
                        </span>
                        <ul className="">
                          {cat.items.map((tech, idx) => (
                            <li
                              key={idx}
                              className="text-base leading-6 text-dark-font"
                            >
                              {parser(tech)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <LinePlus
              customClass={""}
              lineClass={"opacity-15 bg-grey-line"}
              plusClass={"col-span-8 col-start-5 -translate-x-1/2!"}
              iconColor={"#272727"}
              scrub={false}
              duration={1}
            />
          </div>
        );
      })}
    </div>
  );
}
