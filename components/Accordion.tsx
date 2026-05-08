"use client";
import parser from "html-react-parser";
import { useRef, useState } from "react";
import { FaqItemType } from "@/data/dataType";
import gsap from "gsap";
import LinePlus from "@/components/LinePlus";
import { BlurTextReveal } from "@/components/TextAnimation";

interface AccordionProps {
  items: FaqItemType[];
  customClass?: string;
}

export default function Accordion({ items, customClass }: AccordionProps) {
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
          <div key={index} className="group">
            <div className="accordion__item py-5 md:py-8">
              {/* TITLE */}
              <div
                className="accordion__title pr-20 w-full relative cursor-pointer items-center"
                onClick={() => toggleItem(index)}
              >
                <BlurTextReveal
                  as="p"
                  html={item.title}
                  animationType="words"
                  stagger={0.05}
                />

                {/* + / - */}
                <span
                  className={`icon absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 delay-200 ${
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
              </div>

              {/* CONTENT */}
              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className="accordion__content w-full overflow-hidden"
                style={{
                  height: index === 0 ? "auto" : 0,
                  opacity: index === 0 ? 1 : 0,
                }}
              >
                <div className="pt-2 small max-w-132">
                  {parser(
                    Array.isArray(item.content)
                      ? item.content.join("")
                      : item.content,
                  )}
                </div>
              </div>
            </div>
            <LinePlus
              customClass={"group-last:hidden"}
              lineClass={"opacity-15 bg-grey-line"}
              plusClass={"hidden"}
            />
          </div>
        );
      })}
    </div>
  );
}
