'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import SplitText from 'gsap/SplitText'; // GSAP Club plugin
import { ElementType, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface FadeOnScrollProps {
  text?: string; // plain text
  html?: string; // raw HTML
  as?: ElementType; // h1, h2, p, div, etc.
  className?: string; // styling
  scrub?: boolean;
  stagger?: number;
}

const FadeOnScroll = ({
  text,
  html,
  as: Tag = 'h1',
  className = '',
  scrub = true,
  stagger = 0.03,
}: FadeOnScrollProps) => {
  const textRef = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (!textRef.current) return;

    let split: SplitText | null = null;
    let hasReverted = false;

    document.fonts.ready.then(() => {
      if (!textRef.current || hasReverted) return;
      
      split = new SplitText(textRef.current, {
        type: 'chars',
        aria: 'none',
        charsClass: 'chars',
        autoSplit: true,
        smartWrap: true,
        onSplit: (self) => {
          return gsap.to(self.chars, {
            color: '#d8d8d8',
            stagger,
            scrollTrigger: {
              trigger: self.chars,
              endTrigger: self.chars[self.chars.length - 1],
              markers: false,
              scrub,
              start: 'top 80%',
              end: 'bottom center',
            },
          });
        },
      });
    });

    return () => {
      hasReverted = true;
      if (split) split.revert();
    };
  }, []);

  return (
    <Tag
      ref={textRef}
      className={`${className}  text-[rgba(216,216,216,0.1)]`}
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
    >
      {!html ? text : null}
    </Tag>
  );
};

export default FadeOnScroll;
