'use client';

import React, { ElementType, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

interface BlurTextRevealProps {
  text?: string;
  html?: string;
  as?: ElementType;
  className?: string;

  animationType?: 'words' | 'lines' | 'chars';
  stagger?: number;
  duration?: number;
  ease?: string;
  delay?: number;
  from?: 'start' | 'center' | 'end' | 'random';

  /** ScrollTrigger */
  start?: string;
  end?: string;
  once?: boolean;
  scrub?: boolean | number;
  flicker?: boolean;
  flickerConfig?: {
    every?: number;
    count?: number;
    blur?: number;
    fade?: number;
    duration?: number;
  };
  onCompleteAnimation?: () => void;
}

const BlurTextReveal = ({
  text,
  html,
  as: Tag = 'h2',
  className = '',

  animationType = 'words',
  stagger = 0.05,
  duration = 0.8,
  ease = 'power2.out',
  delay = 0,
  from = 'random',

  start = 'top 90%',
  end = 'bottom 10%',
  once = false,
  scrub = false,
  flicker = false,
  flickerConfig = {
    every: 2,
    count: 2,
    blur: 8,
    fade: 0.4,
    duration: 0.3,
  },
  onCompleteAnimation
}: BlurTextRevealProps) => {
  const textRef = useRef<HTMLElement | null>(null);

  const randomCharFlicker = (
    chars: HTMLElement[],
    { every = 2, count = 2, blur = 8, fade = 0.4, duration = 0.3, ease = 'power2.out' } = {}
  ) => {
    return gsap
      .timeline({
        repeat: -1,
        repeatDelay: every,
      })
      .call(() => {
        const targets = gsap.utils.shuffle(chars).slice(0, count);

        gsap.fromTo(
          targets,
          {
            autoAlpha: fade,
            filter: `blur(${blur}px)`,
          },
          {
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration,
            stagger: 0.05,
            ease,
          }
        );
      });
  };

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, {
      type: 'chars,words,lines',
      smartWrap: true,
      wordsClass: 'words',
      charsClass: 'chars',
      linesClass: 'lines',
    });

    const targets =
      animationType === 'lines'
        ? split.lines
        : animationType === 'chars'
          ? split.chars
          : split.words;

    gsap.set([textRef.current, targets], {
      autoAlpha: 0,
      filter: 'blur(12px)',
      force3D: true,
    });

    let flickerTl: gsap.core.Timeline | null = null;

    const tl = gsap.timeline({
      delay,
      scrollTrigger: {
        trigger: textRef.current,
        start,
        end,
        scrub,
        once,
      },
      onComplete: () => {

        if (onCompleteAnimation) {
          onCompleteAnimation();
        }
        
        if (flicker) {
          flickerTl = randomCharFlicker(targets as HTMLElement[], flickerConfig);
        }
      },
    });

    tl.to(textRef.current, {
      autoAlpha: 1,
      filter: 'blur(0px)',
      duration: 0.5,
      ease,
    }).to(
      targets,
      {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration,
        stagger: {
          each: stagger,
          from,
        },
        ease,
      },
      0
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      split.revert();
    };
  }, []);

  return (
    <Tag
      ref={textRef}
      className={className}
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
    >
      {!html ? text : null}
    </Tag>
  );
};

export default BlurTextReveal;
