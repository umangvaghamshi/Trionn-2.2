"use client";
import parser from "html-react-parser";
import { useRef, useState } from "react";
import { TechFaqItemType } from "@/data/dataType";
import gsap from "gsap";
import LinePlus from "@/components/LinePlus";
import { BlurTextReveal } from "@/components/TextAnimation";

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
                  className={`icon absolute top-1/2 right-0 h-6 w-6 -translate-y-1/2 transition-transform duration-500 ${
                    isOpen ? "open" : ""
                  }`}
                ></span>
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
              plusClass={"col-span-8 col-start-5 -translate-x-1/2"}
              iconColor={"#272727"}
            />
          </div>
        );
      })}
    </div>
  );
}
