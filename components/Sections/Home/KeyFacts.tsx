"use client";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Marquee from "@/components/Marquee";
import { Odometer } from "@/components/Odometer";
import { BlurTextReveal } from "@/components/TextAnimation";

type RowType = "image-logos" | "video-bottom" | "marquee" | "video-popup";

interface RowData {
  id: number;
  label: string;
  description: string;
  value: number;
  digitCount: number;
  suffix: string;
  type: RowType;
  media?: string;
  logos?: string[];
}

const ROWS: RowData[] = [
  {
    id: 1,
    label: "Projects completed",
    description: "90% of our clients seek our services for a second project.",
    value: 999,
    digitCount: 3,
    suffix: "+",
    type: "image-logos",
    logos: [
      "/images/work-kuros.webp",
      "/images/work-luxury-presence.webp",
      "/images/work-willam-jonshan.webp",
    ],
  },
  {
    id: 2,
    label: "Featured & awards",
    description: "90% of our clients seek our services for a second project.",
    value: 50,
    digitCount: 2,
    suffix: "+",
    type: "video-bottom",
    media: "/video/lion-v3.mp4",
  },
  {
    id: 3,
    label: "Brands we work with",
    description: "90% of our clients seek our services for a second project.",
    value: 220,
    digitCount: 3,
    suffix: "+",
    type: "marquee",
  },
  {
    id: 4,
    label: "Our team members",
    description: "90% of our clients seek our services for a second project.",
    value: 20,
    digitCount: 2,
    suffix: "+",
    type: "video-popup",
    media: "/video/rushi.mp4",
  },
];

const MARQUEE_ITEMS = [
  "Brands we work with",
  "220+ Partners",
  "Global Reach",
  "Trusted by leaders",
  "World-class clients",
  "Industry pioneers",
];

const ROW_H = 12;
const CARD_W = 16;
const CARD_H = 15;

export default function KeyFacts() {
  const [activeRow, setActiveRow] = useState(-1);
  const [activeLogo, setActiveLogo] = useState(0);
  const [triggerStates, setTriggerStates] = useState<boolean[]>(
    ROWS.map(() => false),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs = useRef<(HTMLDivElement | null)[]>([]);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lineLeftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRightRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeRowRef = useRef(-1);
  const isInsideRef = useRef(false);
  const logoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  /* ── Init State ────────────────────────────────────────── */
  useGSAP(
    () => {
      ROWS.forEach((row, i) => {
        if (row.type !== "marquee") {
          gsap.set(cardRefs.current[i], {
            y: row.type === "video-bottom" ? 120 : 75,
            opacity: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
          });
        }
      });
      gsap.set(marqueeRef.current, { opacity: 0 });
      gsap.set(bgRef.current, { opacity: 0, height: 0 });
      ROWS.forEach((_, i) => {
        gsap.set([lineLeftRefs.current[i], lineRightRefs.current[i]], {
          scaleX: 1,
          backgroundColor: "#9ca3af",
        });
      });
    },
    { scope: containerRef },
  );

  /* ── Animations ───────────────────────────────────── */

  const activateLines = useCallback(
    (i: number) => {
      // We call the contextSafe-wrapped logic here
      contextSafe(() => {
        const left = lineLeftRefs.current[i];
        const right = lineRightRefs.current[i];
        if (left && right) {
          gsap.killTweensOf([left, right]);
          gsap.to([left, right], {
            scaleX: 4,
            backgroundColor: "#000000",
            duration: 0.55,
            ease: "power3.inOut",
          });
        }
      })(); // Execute the returned function immediately
    },
    [contextSafe],
  );

  const deactivateLines = useCallback(
    (i: number) => {
      contextSafe(() => {
        const left = lineLeftRefs.current[i];
        const right = lineRightRefs.current[i];
        if (left && right) {
          gsap.killTweensOf([left, right]);
          gsap.to([left, right], {
            scaleX: 1,
            backgroundColor: "#fff",
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
      })();
    },
    [contextSafe],
  );

  const showRow = useCallback(
    (i: number) => {
      contextSafe(() => {
        const row = ROWS[i];
        const card = cardRefs.current[i];
        const text = textRefs.current[i];
        const num = numRefs.current[i];
        const marquee = marqueeRef.current;

        if (!text || !num) return;
        gsap.killTweensOf([text, num, card]);
        gsap.to([text, num], { color: "#fff", duration: 0.35 });

        setTriggerStates((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });

        if (row.type === "image-logos" && card) {
          gsap.to(card, {
            y: 0,
            opacity: 1,
            rotateZ: 8,
            delay: 0.5,
            duration: 0.55,
            ease: "power3.out",
          });
          if (logoTimerRef.current) clearInterval(logoTimerRef.current);
          let idx = 0;
          logoTimerRef.current = setInterval(() => {
            idx = (idx + 1) % (row.logos?.length ?? 1);
            setActiveLogo(idx);
          }, 1300);
        }

        if (
          (row.type === "video-bottom" || row.type === "video-popup") &&
          card
        ) {
          gsap.to(card, {
            y: 0,
            opacity: 1,
            rotateZ: 8,
            delay: 0.5,
            duration: 0.65,
            ease: "power3.out",
          });
          const v = videoRefs.current[i];
          if (v) {
            v.currentTime = 0;
            v.play().catch(() => {});
          }
        }

        if (row.type === "marquee" && marquee) {
          gsap.to(text, {
            opacity: 0,
            x: -28,
            duration: 0.28,
            ease: "power2.in",
          });
          gsap.to(num, {
            opacity: 0,
            x: 28,
            duration: 0.28,
            ease: "power2.in",
          });
          gsap.to(marquee, {
            opacity: 1,
            duration: 0.45,
            delay: 0.22,
            ease: "power2.out",
          });
        }
      })();
    },
    [contextSafe],
  );

  const hideRow = useCallback(
    (i: number) => {
      contextSafe(() => {
        const row = ROWS[i];
        const card = cardRefs.current[i];
        const text = textRefs.current[i];
        const num = numRefs.current[i];
        const marquee = marqueeRef.current;

        if (!text || !num) return;
        gsap.killTweensOf([text, num, card]);
        gsap.to([text, num], { color: "#434343", duration: 0.4 });

        setTriggerStates((prev) => {
          const next = [...prev];
          next[i] = false;
          return next;
        });

        if (row.type === "image-logos" && card) {
          gsap.to(card, {
            y: 75,
            opacity: 0,
            rotateZ: 0,
            duration: 0.38,
            ease: "power2.in",
          });
          if (logoTimerRef.current) {
            clearInterval(logoTimerRef.current);
            logoTimerRef.current = null;
          }
          setActiveLogo(0);
        }
        if (
          (row.type === "video-bottom" || row.type === "video-popup") &&
          card
        ) {
          gsap.to(card, {
            y: row.type === "video-bottom" ? 120 : 75,
            opacity: 0,
            rotateZ: 0,
            duration: 0.38,
            ease: "power2.in",
          });
          videoRefs.current[i]?.pause();
        }
        if (row.type === "marquee" && marquee) {
          gsap.killTweensOf(marquee);
          gsap.to(text, {
            opacity: 1,
            x: 0,
            color: "#434343",
            duration: 0.38,
            delay: 0.08,
            ease: "power2.out",
          });
          gsap.to(num, {
            opacity: 1,
            x: 0,
            color: "#434343",
            duration: 0.38,
            delay: 0.08,
            ease: "power2.out",
          });
          gsap.to(marquee, { opacity: 0, duration: 0.25, ease: "power2.in" });
        }
      })();
    },
    [contextSafe],
  );

  /* ── Mouse Handlers ────────────────────────────────────── */
  const handleContainerEnter = () => {
    isInsideRef.current = true;
  };

  const handleRowEnter = (index: number) => {
    if (!isInsideRef.current) return;
    const prev = activeRowRef.current;
    if (prev === index) return;

    if (prev !== -1) {
      deactivateLines(prev);
      hideRow(prev);
    }

    activeRowRef.current = index;
    setActiveRow(index);

    const rowEl = rowRefs.current[index];
    const background = bgRef.current;
    if (rowEl && background) {
      gsap.to(background, {
        top: rowEl.offsetTop + 8,
        height: rowEl.offsetHeight - 16,
        opacity: 1,
        duration: 0.48,
        ease: "power3.inOut",
      });
    }

    activateLines(index);
    showRow(index);
  };

  const handleRowLeave = (index: number) => {
    if (activeRowRef.current !== index) return;
    activeRowRef.current = -1;
    setActiveRow(-1);
    deactivateLines(index);
    hideRow(index);

    if (bgRef.current) {
      gsap.to(bgRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    }
  };

  const handleContainerLeave = () => {
    isInsideRef.current = false;
    // Safety check for all lines
    ROWS.forEach((_, i) => deactivateLines(i));

    const prev = activeRowRef.current;
    if (prev === -1) return;

    activeRowRef.current = -1;
    setActiveRow(-1);

    if (bgRef.current) {
      gsap.to(bgRef.current, {
        opacity: 0,
        duration: 0.38,
        ease: "power2.inOut",
      });
    }
    hideRow(prev);
  };

  return (
    <section className="pt-25 pb-37.5 bg-[#D2D2D2] min-h-screen select-none relative z-20">
      <div className="tr__container">
        <div className="w-8/12 mx-auto flex justify-between items-start mb-20">
          <BlurTextReveal
            as="h2"
            html={`Key facts`}
            animationType="chars"
            stagger={0.05}
            className="text-dark-font block"
          />
          <p className="text-dark-font">
            A snapshot of our
            <br />
            experience and impact.
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative group"
        onMouseEnter={handleContainerEnter}
        onMouseLeave={handleContainerLeave}
      >
        <div
          ref={bgRef}
          className="absolute left-1/2 -translate-x-1/2 bg-[#111] pointer-events-none z-0 w-[calc(100%-1rem)] max-w-[calc(66.66%-5rem)] rounded-lg"
          style={{ top: 0, height: 0 }}
        />

        {ROWS.map((row, index) => (
          <div
            key={row.id}
            ref={(el) => {
              rowRefs.current[index] = el;
            }}
            className="relative tr__container"
            style={{
              height: `${ROW_H}rem`,
              zIndex: activeRow === index ? 10 : 1,
            }}
          >
            {/* Left line */}
            <div
              ref={(el) => {
                lineLeftRefs.current[index] = el;
              }}
              className="absolute left-0 w-10 h-px bg-white z-20 origin-left"
              style={{
                top: "calc(50% - 1.5px)",
              }}
            />

            {/* Right line */}
            <div
              ref={(el) => {
                lineRightRefs.current[index] = el;
              }}
              className="absolute right-0 w-10 h-px bg-white z-20 origin-right"
              style={{
                top: "calc(50% - 1.5px)",
              }}
            />

            {/* Card Asset */}
            {row.type !== "marquee" && (
              <div
                style={{ top: `${-CARD_H}rem`, zIndex: 30 }}
                className="absolute left-0 right-0 bottom-0 flex items-end justify-center pointer-events-none overflow-hidden"
              >
                <div
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  style={{ width: `${CARD_W}rem`, height: `${CARD_H}rem` }}
                  className="overflow-hidden relative pointer-events-none rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.55)] shrink-0"
                >
                  {row.type === "image-logos" &&
                    row.logos?.map((src, li) => (
                      <div key={li}>
                        <Image
                          src={src}
                          alt=""
                          width={224}
                          height={240}
                          priority={true}
                          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out"
                          style={{ opacity: activeLogo === li ? 1 : 0 }}
                        />
                      </div>
                    ))}
                  {(row.type === "video-bottom" ||
                    row.type === "video-popup") &&
                    row.media && (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={row.media}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    )}
                </div>
              </div>
            )}

            {/* Row Trigger Area */}
            <div
              onMouseEnter={() => handleRowEnter(index)}
              onMouseLeave={() => handleRowLeave(index)}
              className={`inner-box relative inset-0 z-10 flex items-center pointer-events-auto h-full w-8/12 mx-auto border border-white -mt-px p-10
                ${index === 0 ? "rounded-t-lg" : ""}
                ${index === ROWS.length - 1 ? "rounded-b-lg" : ""}
              `}
            >
              <div
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                className="text-dark-font h-full flex flex-col justify-between"
              >
                <h3>{row.label}</h3>
                <p className="small max-w-55">{row.description}</p>
              </div>

              <div style={{ flex: 2 }} />

              <div
                ref={(el) => {
                  numRefs.current[index] = el;
                }}
                className="flex justify-end items-center text-dark-font"
              >
                <div className="h1 leading-none flex items-start tabular-nums">
                  <Odometer
                    value={row.value}
                    duration={1.8}
                    trigger={triggerStates[index]}
                    className="max-h-12 md:max-h-16 lg:max-h-25"
                  />
                  <span className="text-5xl">{row.suffix}</span>
                </div>
              </div>
            </div>

            {row.type === "marquee" && (
              <div
                className="max-w-[calc(66.66%-5rem)] left-1/2 -translate-x-1/2 w-full absolute top-0 bottom-0 flex items-center pointer-events-none z-15 overflow-hidden"
                ref={marqueeRef}
              >
                <Marquee
                  speed={0.75}
                  gap={0}
                  className="text-white whitespace-nowrap h3 flex"
                >
                  <span>
                    {MARQUEE_ITEMS.map((item, i) => (
                      <span className="" key={i}>
                        {item} &nbsp;&nbsp;—&nbsp;&nbsp;
                      </span>
                    ))}
                  </span>
                </Marquee>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
