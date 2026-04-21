'use client';
import parser from 'html-react-parser';
import { useRef, useState } from 'react';
import { FaqItemType } from '@/data/dataType';
import gsap from 'gsap';
import LinePlus from '@/components/LinePlus';
import { BlurTextReveal } from '@/components/TextAnimation';

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
          ease: 'power3.inOut',
        });
      }
    }

    // Toggle clicked item
    if (openIndex === index) {
      gsap.to(current, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });
      setOpenIndex(null);
    } else {
      gsap.set(current, { height: 'auto' });
      const height = current!.scrollHeight;

      gsap.fromTo(
        current,
        { height: 0, opacity: 0 },
        {
          height,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(current, { height: 'auto' });
          },
        }
      );

      setOpenIndex(index);
    }
  };

  return (
    <div className={`accordion ${customClass ?? ''}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index}>
            <div className="accordion__item group">
              {/* TITLE */}
              <div
                className="accordion__title py-8 grid grid-cols-12 gap-x-6 w-full relative cursor-pointer items-center"
                onClick={() => toggleItem(index)}
              >
                <span className="number-small col-span-1">{index + 1}.</span>

                <BlurTextReveal
                  as="h3"
                  html={item.title}
                  animationType="chars"
                  stagger={0.05}
                  className="col-span-8 col-start-5 pr-20"
                />

                {/* + / - */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl font-light">
                  {isOpen ? '−' : '+'}
                </span>
              </div>

              {/* CONTENT */}
              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className="accordion__content grid grid-cols-12 gap-x-6 w-full overflow-hidden"
                style={{
                  height: index === 0 ? 'auto' : 0,
                  opacity: index === 0 ? 1 : 0,
                }}
              >
                <div className="col-span-8 col-start-5 pb-8 pr-20 ">
                  {parser(Array.isArray(item.content) ? item.content.join('') : item.content)}
                </div>
              </div>
            </div>
            <LinePlus
              customClass={''}
              lineClass={'opacity-15 bg-grey-line'}
              plusClass={'col-span-8 col-start-5 -translate-x-1/2'}
              iconColor={'#272727'}
            />
          </div>
        );
      })}
    </div>
  );
}
