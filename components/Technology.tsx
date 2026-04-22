'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import parse from 'html-react-parser';
import { BlurTextReveal } from '@/components/TextAnimation';
import LinePlus from '@/components/LinePlus';
import Accordion from '@/components/Accordion';
import { faqData } from '@/data';

gsap.registerPlugin(ScrollTrigger);

export default function Technology() {
  return (
    <section className="py-37.5">
      <div className="tr__container relative w-full text-dark-font flex flex-col">
        <div className="grid grid-cols-12 gap-x-6 pb-37.5">
          <BlurTextReveal
            as="h2"
            html="technology"
            animationType="chars"
            stagger={0.08}
            className="mrquee-text leading-[0.8]! uppercase z-2 col-span-10 col-start-3"
          />
          <BlurTextReveal
            as="h2"
            html="stack"
            animationType="chars"
            stagger={0.08}
            className="mrquee-text leading-[0.8]! uppercase z-2 col-span-5 col-start-8"
          />
          <BlurTextReveal
            as="span"
            html="Built with performance-first, scalable front-end architecture."
            animationType="words"
            stagger={0.08}
            className="title z-2 col-span-8 col-start-5 max-w-70 -translate-y-full block"
          />
        </div>
        <LinePlus
          customClass={''}
          lineClass={'opacity-15 bg-grey-line'}
          plusClass={'col-span-8 col-start-5 -translate-x-1/2'}
          iconColor={'#272727'}
        />
        <Accordion items={faqData} customClass={'service-faq'} />
      </div>
    </section>
  );
}
