'use client';

import { ElementType, useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

type BlurRevealProps<T extends ElementType> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

export default function BlurReveal<T extends ElementType = 'span'>({
  as,
  children,
  className,
  ...props
}: BlurRevealProps<T>) {
  const Component = as || 'span';
  const elRef = useRef<HTMLElement | null>(null);
  const splitRef = useRef<SplitText | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!elRef.current) return;

    let hasReverted = false;
    const onEnter = () => tlRef.current?.restart();

    document.fonts.ready.then(() => {
      if (!elRef.current || hasReverted) return;

      // Split ONCE
      splitRef.current = new SplitText(elRef.current, {
        type: 'chars',
        smartWrap: true,
      });

      const chars = splitRef.current.chars;

      gsap.set(chars, {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
      });

      // Timeline
      tlRef.current = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
      });

      tlRef.current
        .to(chars, {
          filter: 'blur(10px)',
          opacity: 0,
          y: -10,
          stagger: {
            each: 0.03,
            from: 'random',
          },
          duration: 0.35,
        })
        .set(chars, { y: 10 })
        .to(chars, {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          stagger: {
            each: 0.03,
            from: 'random',
          },
          duration: 0.4,
        });

      elRef.current.addEventListener('mouseenter', onEnter);
    });

    return () => {
      hasReverted = true;
      elRef.current?.removeEventListener('mouseenter', onEnter);
      splitRef.current?.revert();
      tlRef.current?.kill();
    };
  }, []);

  return (
    <Component ref={elRef} className={className} {...props} style={{ display: 'inline-block' }}>
      {children}
    </Component>
  );
}
