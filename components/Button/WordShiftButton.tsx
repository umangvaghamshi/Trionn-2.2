"use client";

import React, { useEffect, useMemo, useRef } from "react";
import clsx from "clsx";

type StyleVars = Partial<{
  buttonWrapperColor: string; // --button_wrapper-color
  step: string; // --step
  baseDur: string; // --base-dur
  durStep: string; // --dur-step
  insetMin: string; // --inset-min
  arrowGap: string; // --arrow-gap
  run: string; // --run
  outTime: string; // --out-time
  inTime: string; // --in-time
  reentryFactor: string; // --reentry-factor
  ulOutTime: string; // --ul-out-time
  ulInTime: string; // --ul-in-time
  padX: string; // --pad-x
  arrowSize: string; // --arrow-size
}>;

type Props = {
  text: string;
  href?: string;
  customClass?: string;
  styleVars?: StyleVars;
};

export default function WordShiftButton({
  text,
  href = "#",
  customClass,
  styleVars,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLAnchorElement | null>(null);

  // Build letters (no inline transform so CSS var wins)
  const letters = useMemo(
    () =>
      [...text].map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="text inline-block select-none will-change-transform"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      )),
    [text],
  );

  /* ----------------------- Scoped CSS var helpers ----------------------- */
  const getVar = (scope: Element, name: string, fallback = "0") => {
    const v = getComputedStyle(scope as HTMLElement)
      .getPropertyValue(name)
      .trim();
    return v || fallback;
  };

  const parseTimeVar = (scope: Element, name: string, fallbackMs = 0) => {
    const v = getVar(scope, name, "");
    if (!v) return fallbackMs;
    if (v.endsWith("ms")) return parseInt(v);
    if (v.endsWith("s")) return Math.round(parseFloat(v) * 1000);
    const n = parseInt(v);
    return Number.isFinite(n) ? n : fallbackMs;
  };

  const forceReflow = (el: Element) => {
    void (el as HTMLElement).offsetWidth;
  };

  const commitAndCancel = (el: Element | null) => {
    if (!el) return;
    (el as HTMLElement).getAnimations().forEach((a) => {
      try {
        a.commitStyles();
      } catch {}
      a.cancel();
    });
  };

  const getCurrentTranslateX = (el: Element) => {
    const t = getComputedStyle(el as HTMLElement).transform;
    if (!t || t === "none") return 0;
    const m = new DOMMatrixReadOnly(t);
    return m.m41;
  };

  const animateTranslateXOpacity = (
    el: Element | null,
    toX: string,
    toOpacity: number,
    duration: number,
    delay = 0,
  ) => {
    if (!el) return;
    (el as HTMLElement).getAnimations().forEach((a) => a.cancel());
    const fromX = getCurrentTranslateX(el);
    const fromOpacity =
      parseFloat(getComputedStyle(el as HTMLElement).opacity) || 0;
    const anim = (el as HTMLElement).animate(
      [
        { transform: `translateX(${fromX}px)`, opacity: fromOpacity },
        { transform: `translateX(${toX})`, opacity: toOpacity },
      ],
      { duration, delay, easing: "ease", fill: "forwards" },
    );
    anim.onfinish = () => {
      (el as HTMLElement).style.transform = `translateX(${toX})`;
      (el as HTMLElement).style.opacity = String(toOpacity);
    };
    return anim;
  };

  const getCurrentScaleX = (el: Element) => {
    const t = getComputedStyle(el as HTMLElement).transform;
    if (!t || t === "none") return 1;
    const m = new DOMMatrixReadOnly(t);
    return Math.hypot(m.m11, m.m12);
  };

  const animateScaleX = (
    el: Element | null,
    origin: "left" | "right",
    toScale: number,
    duration: number,
    delay = 0,
  ) => {
    if (!el) return;
    (el as HTMLElement).style.transformOrigin = `${origin} center`;
    commitAndCancel(el);
    const fromScale = getCurrentScaleX(el);
    const anim = (el as HTMLElement).animate(
      [
        { transform: `scaleX(${fromScale})` },
        { transform: `scaleX(${toScale})` },
      ],
      { duration, delay, easing: "ease", fill: "forwards" },
    );
    anim.onfinish = () => {
      (el as HTMLElement).style.transform = `scaleX(${toScale})`;
    };
    return anim;
  };

  /* ----------------------- Layout/spacing logic ----------------------- */
  const computeUniformMove = (
    wrapper: HTMLElement,
    direction: "in" | "out",
  ) => {
    const EPS = 1;
    const btn = wrapper.querySelector(".btn") as HTMLElement | null;
    const word = wrapper.querySelector(".word") as HTMLElement | null;
    if (!btn || !word) return 0;

    const btnRect = btn.getBoundingClientRect();
    const wordRect = word.getBoundingClientRect();
    const cs = getComputedStyle(btn);
    const padRight = parseFloat(cs.paddingRight) || 0;

    let targetRightEdge: number;
    if (direction === "in") {
      targetRightEdge = btnRect.right - padRight + EPS;
    } else {
      const rightArrow = wrapper.querySelector(
        ".arrow-right",
      ) as HTMLElement | null;
      const arrowWidth = rightArrow
        ? rightArrow.getBoundingClientRect().width
        : 0;
      const gap = parseFloat(getVar(wrapper, "--arrow-gap", "10")) || 10;
      const insetMin = parseFloat(getVar(wrapper, "--inset-min", "8")) || 8;
      const inset = Math.max(insetMin, padRight * 0.5);
      targetRightEdge = btnRect.right - inset - arrowWidth - gap;
    }

    const currentRightEdge = wordRect.right;
    return Math.max(0, targetRightEdge - currentRightEdge);
  };

  const computeTotalWordTime = (
    total: number,
    step: number,
    baseDur: number,
    durStep: number,
  ) => {
    const maxDelay = (total - 1) * step;
    const maxDur = baseDur + (total - 1) * durStep;
    return maxDelay + maxDur;
  };

  const applyPerLetterVars = (
    wrapper: HTMLElement,
    direction: "in" | "out",
  ) => {
    const letters = wrapper.querySelectorAll<HTMLElement>(".text");
    const total = letters.length;

    const step = parseInt(getVar(wrapper, "--step", "50")) || 50;
    const baseDur = parseInt(getVar(wrapper, "--base-dur", "600")) || 600;
    const durStep = parseInt(getVar(wrapper, "--dur-step", "50")) || 50;

    const move = computeUniformMove(wrapper, direction);

    letters.forEach((el, i) => {
      const orderIndex = direction === "in" ? total - i - 1 : i; // mirror order
      const delay = orderIndex * step;
      const dur = baseDur + orderIndex * durStep;

      el.style.setProperty("--group-move", `${move}px`);
      el.style.setProperty("--delay", `${delay}ms`);
      el.style.setProperty("--dur", `${dur}ms`);
    });

    const totalTime = computeTotalWordTime(total, step, baseDur, durStep);
    const factor =
      parseFloat(getVar(wrapper, "--reentry-factor", "0.75")) || 0.75;
    return Math.max(120, Math.round(totalTime * factor));
  };

  /* ----------------------- Arrows & Underline (use inner sprite) ----------------------- */
  const resetArrowStates = (wrapper: HTMLElement) => {
    const ar = wrapper.querySelector(
      ".arrow-right .arrow-sprite",
    ) as HTMLElement | null;
    const al = wrapper.querySelector(
      ".arrow-left .arrow-sprite",
    ) as HTMLElement | null;
    ar?.getAnimations().forEach((a) => a.cancel());
    al?.getAnimations().forEach((a) => a.cancel());
    if (ar) {
      ar.style.opacity = "1";
      ar.style.transform = "translateX(0)";
    }
    if (al) {
      al.style.opacity = "0";
      al.style.transform = "translateX(-120%)";
    }
  };

  const hoverInArrows = (wrapper: HTMLElement, reentryDelay: number) => {
    const run = getVar(wrapper, "--run", "28px");
    animateTranslateXOpacity(
      wrapper.querySelector(".arrow-right .arrow-sprite"),
      run,
      0,
      parseTimeVar(wrapper, "--out-time", 260),
      0,
    );
    animateTranslateXOpacity(
      wrapper.querySelector(".arrow-left .arrow-sprite"),
      "0px",
      1,
      parseTimeVar(wrapper, "--in-time", 420),
      reentryDelay,
    );
  };

  const hoverOutArrows = (wrapper: HTMLElement, reentryDelay: number) => {
    const run = getVar(wrapper, "--run", "28px");
    animateTranslateXOpacity(
      wrapper.querySelector(".arrow-left .arrow-sprite"),
      `calc(-1 * ${run})`,
      0,
      parseTimeVar(wrapper, "--out-time", 260),
      0,
    );
    animateTranslateXOpacity(
      wrapper.querySelector(".arrow-right .arrow-sprite"),
      "0px",
      1,
      parseTimeVar(wrapper, "--in-time", 420),
      reentryDelay,
    );
  };

  const underlineTimers = useRef(
    new WeakMap<Element, { inTimer?: number; outTimer?: number }>(),
  );

  const clearUnderlineTimers = (wrapper: HTMLElement) => {
    const t = underlineTimers.current.get(wrapper);
    if (t?.inTimer) clearTimeout(t.inTimer);
    if (t?.outTimer) clearTimeout(t.outTimer);
    underlineTimers.current.set(wrapper, {});
  };

  const resetUnderlineStates = (wrapper: HTMLElement) => {
    clearUnderlineTimers(wrapper);
    const ur = wrapper.querySelector(".u-right") as HTMLElement | null;
    const ul = wrapper.querySelector(".u-left") as HTMLElement | null;
    commitAndCancel(ur);
    commitAndCancel(ul);
    if (ur) {
      ur.style.transformOrigin = "right center";
      ur.style.transform = "scaleX(1)";
    }
    if (ul) {
      ul.style.transformOrigin = "left center";
      ul.style.transform = "scaleX(0)";
    }
  };

  const hoverInUnderline = (wrapper: HTMLElement, reentryDelay: number) => {
    clearUnderlineTimers(wrapper);
    const ur = wrapper.querySelector(".u-right") as HTMLElement | null;
    const ul = wrapper.querySelector(".u-left") as HTMLElement | null;
    animateScaleX(
      ur,
      "right",
      0,
      parseTimeVar(wrapper, "--ul-out-time", 1900),
      0,
    );
    const inTimer = window.setTimeout(() => {
      animateScaleX(
        ul,
        "left",
        1,
        parseTimeVar(wrapper, "--ul-in-time", 900),
        0,
      );
    }, reentryDelay);
    underlineTimers.current.set(wrapper, { inTimer });
  };

  const hoverOutUnderline = (wrapper: HTMLElement, reentryDelay: number) => {
    clearUnderlineTimers(wrapper);
    const ur = wrapper.querySelector(".u-right") as HTMLElement | null;
    const ul = wrapper.querySelector(".u-left") as HTMLElement | null;
    animateScaleX(
      ul,
      "left",
      0,
      parseTimeVar(wrapper, "--ul-out-time", 1900),
      0,
    );
    const outTimer = window.setTimeout(() => {
      animateScaleX(
        ur,
        "right",
        1,
        parseTimeVar(wrapper, "--ul-in-time", 900),
        0,
      );
    }, reentryDelay);
    underlineTimers.current.set(wrapper, { outTimer });
  };

  /* ----------------------- Init & Events ----------------------- */
  useEffect(() => {
    const wrapper = wrapperRef.current!;
    const btn = btnRef.current!;

    requestAnimationFrame(() => {
      applyPerLetterVars(wrapper, "out");
      resetArrowStates(wrapper);
      resetUnderlineStates(wrapper);
    });

    const enter = () => {
      const reentryDelay = applyPerLetterVars(wrapper, "in");
      forceReflow(wrapper);
      wrapper.classList.add("is-hovered");
      hoverInArrows(wrapper, reentryDelay);
      hoverInUnderline(wrapper, reentryDelay);
    };
    const leave = () => {
      const reentryDelay = applyPerLetterVars(wrapper, "out");
      forceReflow(wrapper);
      wrapper.classList.remove("is-hovered");
      hoverOutArrows(wrapper, reentryDelay);
      hoverOutUnderline(wrapper, reentryDelay);
    };

    btn.addEventListener("mouseenter", enter);
    btn.addEventListener("mouseleave", leave);

    const onTouchStart = () => {
      if (!wrapper.classList.contains("is-hovered")) enter();
    };
    const onDocTouch = (e: TouchEvent) => {
      if (
        !btn.contains(e.target as Node) &&
        wrapper.classList.contains("is-hovered")
      )
        leave();
    };
    btn.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchstart", onDocTouch, { passive: true });

    let rafId: number | null = null;
    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const hovered = wrapper.classList.contains("is-hovered");
        applyPerLetterVars(wrapper, hovered ? "in" : "out");
      }) as unknown as number;
    };
    window.addEventListener("resize", onResize);

    return () => {
      btn.removeEventListener("mouseenter", enter);
      btn.removeEventListener("mouseleave", leave);
      btn.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchstart", onDocTouch);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Component-scoped CSS vars (live on the wrapper)
  const style: React.CSSProperties = {
    ["--button_wrapper-color" as string]:
      styleVars?.buttonWrapperColor ?? "#434343",
    ["--step" as string]: styleVars?.step ?? "30ms",
    ["--base-dur" as string]: styleVars?.baseDur ?? "300ms",
    ["--dur-step" as string]: styleVars?.durStep ?? "30ms",
    ["--inset-min" as string]: styleVars?.insetMin ?? "8px",
    ["--arrow-gap" as string]: styleVars?.arrowGap ?? "10px",
    ["--run" as string]: styleVars?.run ?? "28px",
    ["--out-time" as string]: styleVars?.outTime ?? "200ms",
    ["--in-time" as string]: styleVars?.inTime ?? "320ms",
    ["--reentry-factor" as string]: styleVars?.reentryFactor ?? "0.5",
    ["--ul-out-time" as string]: styleVars?.ulOutTime ?? "1000ms",
    ["--ul-in-time" as string]: styleVars?.ulInTime ?? "500ms",
    ["--pad-x" as string]: styleVars?.padX ?? "0px",
    ["--arrow-size" as string]: styleVars?.arrowSize ?? "10px",
  };

  return (
    <div
      ref={wrapperRef}
      style={style}
      className={clsx(
        "button_wrapper relative w-37.5 xl:w-50 uppercase transition-opacity duration-300 hover:opacity-95",
        customClass,
      )}
    >
      <a
        ref={btnRef}
        href={href}
        className={clsx(
          "btn button-text relative flex w-full min-h-10 cursor-pointer items-center overflow-hidden no-underline",
          "px-[calc(var(--pad-x)*1.2)]",
        )}
        draggable={false}
      >
        {/* Underline */}
        <span className="underline pointer-events-none absolute inset-x-0 bottom-0 h-px">
          <span
            className="u-right absolute inset-x-0 bottom-0 h-px will-change-transform"
            style={{ backgroundColor: "var(--button_wrapper-color)" }}
          />
          <span
            className="u-left absolute inset-x-0 bottom-0 h-px will-change-transform origin-left"
            style={{ backgroundColor: "var(--button_wrapper-color)" }}
          />
        </span>

        {/* Word */}
        <span
          className="word relative inline-flex will-change-transform pr-px"
          style={{ color: "var(--button_wrapper-color)" }}
        >
          {letters}
        </span>

        {/* Arrows (outer centers vertically; inner sprite animates X & opacity) */}
        <span
          className="arrow arrow-right pointer-events-none absolute right-[calc(var(--pad-x)*1.2)] top-1/2 -translate-y-1/2 inline-flex items-center justify-center"
          style={{ width: "var(--arrow-size)", height: "var(--arrow-size)" }}
          aria-hidden="true"
        >
          <span className="arrow-sprite block h-full w-full opacity-0 will-change-[transform,opacity]">
            <svg
              width="10"
              height="9"
              viewBox="0 0 10 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.47372 8.652V6.552L8.32972 3.752V4.9L5.47372 2.1V-3.09944e-06L9.32372 3.836V4.816L5.47372 8.652ZM-0.000281237 5.11V3.542H8.60972V5.11H-0.000281237Z"
                style={{ fill: "var(--button_wrapper-color)" }}
              />
            </svg>
          </span>
        </span>
        <span
          className="arrow arrow-left pointer-events-none absolute left-[calc(var(--pad-x)*1.2)] top-1/2 -translate-y-1/2 inline-flex items-center justify-center"
          style={{ width: "var(--arrow-size)", height: "var(--arrow-size)" }}
          aria-hidden="true"
        >
          <span className="arrow-sprite block h-full w-full opacity-0 will-change-[transform,opacity]">
            <svg
              width="10"
              height="9"
              viewBox="0 0 10 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.47372 8.652V6.552L8.32972 3.752V4.9L5.47372 2.1V-3.09944e-06L9.32372 3.836V4.816L5.47372 8.652ZM-0.000281237 5.11V3.542H8.60972V5.11H-0.000281237Z"
                style={{ fill: "var(--button_wrapper-color)" }}
              />
            </svg>
          </span>
        </span>
      </a>

      {/* Local CSS to mirror your original selectors */}
      <style>{`
        .button_wrapper .word { transform: translateX(0); }
        .button_wrapper .text {
          transform: translateX(0);
          transition-property: transform;
          transition-duration: var(--dur, var(--base-dur));
          transition-timing-function: ease;
          transition-delay: var(--delay, 0ms);
        }
        .button_wrapper.is-hovered .text {
          transform: translateX(var(--group-move, 0px));
        }
      `}</style>
    </div>
  );
}
