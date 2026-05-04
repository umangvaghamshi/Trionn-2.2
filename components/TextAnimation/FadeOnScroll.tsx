'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import SplitText from 'gsap/SplitText';
import { ElementType, useRef } from 'react';
import { useTransitionReady } from '@/components/Transition';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface FadeOnScrollProps {
  text?: string;
  html?: string;
  as?: ElementType;
  className?: string;
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
  const transitionReady = useTransitionReady();

  useGSAP(() => {
    if (!textRef.current || !transitionReady) return;

    const split = new SplitText(textRef.current, {
      type: 'chars',
      aria: 'none',
      charsClass: 'chars',
      smartWrap: true,
    });

    const tl = gsap.to(split.chars, {
      color: '#d8d8d8',
      stagger,
      scrollTrigger: {
        trigger: textRef.current,
        endTrigger: split.chars[split.chars.length - 1],
        scrub,
        start: 'top 80%',
        end: 'bottom center',
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      split.revert();
    };
  }, [transitionReady]);

  return (
    <Tag
      ref={textRef}
      className={`${className} text-[rgba(216,216,216,0.1)]`}
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
    >
      {!html ? text : null}
    </Tag>
  );
};

export default FadeOnScroll;
