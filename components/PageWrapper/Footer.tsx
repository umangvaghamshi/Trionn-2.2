"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LinePlus from "@/components/LinePlus";
import { FooterAtmosphereProvider } from "@/components/Footer/FooterAtmosphere";
import FooterFog from "@/components/Footer/FooterFog";
import TrionnFooterLogo from "@/components/Footer/TrionnFooterLogo";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";

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
    <span className="h4 text-light-font/50 inline-block ml-auto">
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
        className="site-footer relative z-2 flex min-h-screen flex-col overflow-hidden bg-[#000000] text-light-font isolate"
        style={{ marginTop: "-100vh" }}
      >
        {/* z-[5]: fog draws over wire SVG (z-[2]) like trionn-logo-footer; text stays z-20 */}
        <FooterFog />

        <div className="relative z-20 flex w-full min-h-0 flex-1 flex-col">
          <div className="tr__container flex w-full flex-col pt-24 pb-16 md:pt-37.5">
            <div className="grid w-full grid-cols-12 gap-10 lg:gap-x-12 lg:gap-y-0 mb-20">
              <div className="flex flex-col justify-between gap-6 col-span-8">
                <div>
                  <BlurTextReveal
                    as="h4"
                    html={`Let&apos;s build work that inspires.`}
                    animationType="chars"
                    stagger={0.05}
                    className="uppercase mb-4 text-light-font"
                  />
                  <h2 className="h1 max-w-200 text-light-font">
                    Ready to build something bold?
                  </h2>
                </div>
              </div>

              <div className="flex flex-col w-full justify-between col-span-4">
                <div className="mb-8 w-full lg:flex lg:items-end ml-auto text-right">
                  <IstClock />
                </div>
                <WordShiftButton
                  text="start a collaboration"
                  href="#"
                  customClass="min-w-63"
                  styleVars={{ buttonWrapperColor: "#D8D8D8" }}
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-12 gap-10 lg:gap-x-12 lg:gap-y-0">
              <div className="flex flex-col justify-end gap-6 col-span-8">
                <span className="h4 block text-light-font/50">
                  ©TRIONN® {new Date().getFullYear()}
                </span>
              </div>

              <div className="flex flex-col w-full justify-between col-span-4">
                <div className="flex columns-2 flex-wrap justify-between gap-10">
                  <div className="flex flex-col">
                    <h4 className="mb-6 text-light-font/50 uppercase">
                      Business enquiry
                    </h4>
                    {enquiry.map((item, index) => (
                      <p className="flex gap-2 mb-2 last:mb-0" key={index}>
                        <span className="shrink-0 uppercase text-light-font/50">
                          {formatEnquiryLabel(item.label)}
                        </span>
                        <Link
                          className="link relative z-3 block text-light-font"
                          href={item.url}
                        >
                          {item.title}
                        </Link>
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-col max-w-45">
                    <h4 className="mb-6 text-light-font/50 uppercase">
                      Social
                    </h4>
                    <div className="flex columns-2 flex-wrap justify-between gap-x-4 gap-y-2">
                      {social.map((item, index) => (
                        <p key={index}>
                          <Link
                            className="link relative z-3 block text-light-font"
                            href={item.url}
                          >
                            {item.title}
                          </Link>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tr__container w-full pb-12">
            <LinePlus
              lineClass={"opacity-20"}
              plusClass={"col-start-9 translate-x-1/2!"}
              iconColor={"#D8D8D8"}
            />
          </div>
        </div>

        {/* Logo: fragment places sound (z-20) above fog, wires (z-[2]) under fog — matches prototype stacking */}
        <TrionnFooterLogo className="w-full" />
      </footer>
    </FooterAtmosphereProvider>
  );
}
