'use client';

import { useEffect, useRef, useState, ElementType } from 'react';
import gsap from 'gsap';
import BlurTextReveal from './BlurTextReveal';
import { SplitText } from 'gsap/all';

gsap.registerPlugin(SplitText);

interface BlurTextRotateProps {
  as?: ElementType;
  texts: string[];
  interval?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  stagger?: number;
  delay?: number;
}

const BlurTextRotate = ({
  as: Tag = 'h1',
  texts,
  interval = 3000,
  className = '',
  prefix,
  suffix,
  stagger = 0.05,
  delay = 2,
}: BlurTextRotateProps) => {
  const [index, setIndex] = useState(0);
  const rotateRef = useRef<HTMLSpanElement>(null);

  const splitTextContent = (el: HTMLElement) => {
    const split = new SplitText(el.querySelector('.words-wrapper'), {
      type: 'chars,words,lines',
      smartWrap: true,
      wordsClass: 'words',
      charsClass: 'chars',
      linesClass: 'lines',
    });
    return split;
  };

  const animate = () => {
    if (!rotateRef.current || texts.length <= 1) return;

    const el = rotateRef.current;
    
    document.fonts.ready.then(() => {
      const split = splitTextContent(el);

      const tl = gsap.timeline({
        delay,
        repeat: -1,
        repeatDelay: interval / 1000 - 0.6,
      });

      tl.to(split.chars, {
        autoAlpha: 0,
        filter: 'blur(12px)',
        ease: 'power2.in',
        stagger: {
          each: stagger,
          from: 'random',
        },
        onComplete: () => {
          gsap.to(split.chars, {
            autoAlpha: 0,
            filter: 'blur(12px)',
            ease: 'power2.in',
            stagger: {
              each: stagger,
              from: 'random',
            },
            onComplete: () => {
              setIndex((i) => (i + 1) % texts.length);
              tl.kill();
              split.revert();
            },
          });
        },
      }).to(split.chars, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        stagger: {
          each: stagger,
          from: 'random',
        },
      });
    });
  };

  return (
    <Tag className={`${className}`}>
      {prefix && (
        <BlurTextReveal
          className="inline-block mr-4"
          as="span"
          text={prefix}
          animationType="chars"
          stagger={stagger}
          once
        />
      )}
      <span ref={rotateRef} className="inline-block">
        <BlurTextReveal
          key={index}
          className="words-wrapper inline-block"
          as="span"
          text={texts[index]}
          animationType="chars"
          stagger={stagger}
          once
          onCompleteAnimation={animate}
        />
      </span>

      {suffix && <span className="ml-2">{suffix}</span>}
    </Tag>
  );
};

export default BlurTextRotate;
