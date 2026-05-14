"use client";

import { WordShiftButton } from "@/components/Button";
import { FooterAtmosphereProvider } from "@/components/Footer/FooterAtmosphere";
import FooterFog from "@/components/Footer/FooterFog";
import TrionnFooterLogo from "@/components/Footer/TrionnFooterLogo";
import { BlurTextReveal } from "@/components/TextAnimation";
import Link from "next/link";
import { HoverBlur } from "@/components/TextAnimation";
import { useEffect, useState } from "react";

import { enquiry, social } from "@/data";

function IstClock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const t = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d);
      setTime(t.replace(/\u202f/g, " "));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="title text-light-font/50 inline-block ml-auto">
      IST → {time}
    </span>
  );
}

function formatEnquiryLabel(label: string) {
  const trimmed = label.trim();
  if (trimmed.endsWith(".")) return trimmed;
  return `${trimmed}.`;
}

export default function Footer() {
  return (
    <FooterAtmosphereProvider>
      <footer
        className="site-footer relative z-2 flex min-h-dvh flex-col overflow-hidden bg-[#040508] text-light-font isolate"
        style={{ marginTop: "-100dvh" }}
      >
        {/* z-[5]: fog draws over wire SVG (z-[2]) like trionn-logo-footer; text stays z-20 */}
        <FooterFog />

        <div className="relative z-20 flex w-full min-h-0 flex-1">
          <div className="tr__container flex w-full flex-col pt-25 pb-6 md:pb-20 md:pt-37.5">
            <div className="grid w-full grid-cols-12 gap-10 md:gap-x-12 lg:gap-y-0 lg:mb-20">
              <div className="flex flex-col justify-between gap-6 col-span-12 md:col-span-6 lg:col-span-7 xl:col-span-8">
                <div>
                  <BlurTextReveal
                    as="span"
                    html={`Let&apos;s build work that inspires.`}
                    animationType="chars"
                    stagger={0.05}
                    className="title mb-4 text-light-font block"
                  />
                  <h2 className="big max-w-200 text-light-font">
                    Ready to build <br />
                    something bold?
                  </h2>
                </div>
              </div>

              <div className="flex flex-col w-full justify-between col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-4">
                <div className="mb-8 w-full hidden md:flex md:items-end ml-auto text-right">
                  <IstClock />
                </div>
                <WordShiftButton
                  text="start a collaboration"
                  href="/contact"
                  customClass="min-w-63"
                  styleVars={{ buttonWrapperColor: "#D8D8D8" }}
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-12 gap-10 lg:gap-x-12 lg:gap-y-0 my-auto">
              <div className="flex flex-col justify-end gap-6 col-span-12 md:col-span-6 lg:col-span-7 xl:col-span-8 order-2 md:order-1">
                <span className="title block text-light-font/50">
                  ©TRIONN® {new Date().getFullYear()}
                </span>
              </div>

              <div className="flex flex-col w-full justify-between col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-4 order-1 md:order-2">
                <div className="flex columns-1 sm:columns-2 flex-wrap justify-between gap-10">
                  <div className="flex flex-col">
                    <span className="mb-6 text-light-font/50 title block">
                      Business enquiry
                    </span>
                    {enquiry.map((item, index) => (
                      <p className="flex gap-2 mb-2 last:mb-0" key={index}>
                        <span className="shrink-0 uppercase text-light-font/50">
                          {formatEnquiryLabel(item.label)}
                        </span>
                        <Link
                          className="relative z-3 block text-light-font"
                          href={item.url}
                        >
                          <HoverBlur>{item.title}</HoverBlur>
                        </Link>
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-col w-full sm:max-w-52">
                    <span className="mb-6 text-light-font/50 title block">
                      Social
                    </span>
                    <div className="flex columns-2 flex-wrap justify-between gap-x-4 gap-y-2">
                      {social.map((item, index) => (
                        <p
                          key={index}
                          className="w-full max-w-[calc(50%-1rem)]"
                        >
                          <Link
                            className="relative z-3 block text-light-font"
                            href={item.url}
                          >
                            <HoverBlur>{item.title}</HoverBlur>
                          </Link>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo: fragment places sound (z-20) above fog, wires (z-[2]) under fog — matches prototype stacking */}
        <TrionnFooterLogo className="w-full" />
      </footer>
    </FooterAtmosphereProvider>
  );
}
