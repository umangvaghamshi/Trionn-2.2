"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LinePlus from "@/components/LinePlus";
import { FooterAtmosphereProvider } from "@/components/Footer/FooterAtmosphere";
import FooterFog from "@/components/Footer/FooterFog";
import TrionnFooterLogo from "@/components/Footer/TrionnFooterLogo";

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
    <span className="text-sm tracking-wide text-white/55">
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
      <footer className="site-footer relative z-2 flex min-h-screen flex-col overflow-hidden bg-[#000000] text-light-font [isolation:isolate]">
        <FooterFog />

        <div className="relative z-10 flex w-full flex-1 flex-col">
          <div className="tr__container flex w-full flex-col pt-24 pb-16 md:pt-37.5">
            <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0">
              <div className="flex flex-col">
                <p className="mb-6 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/50 md:text-xs">
                  Let&apos;s build work that inspires.
                </p>
                <h2 className="h1 max-w-[20ch] text-balance uppercase leading-[0.95] tracking-tighter text-white">
                  Ready to build something bold?
                </h2>
                <p className="mt-16 text-xs uppercase tracking-wide text-white/45 md:mt-24">
                  ©TRIONN® 2026
                </p>
              </div>

              <div className="flex flex-col lg:items-end lg:text-right">
                <div className="mb-8 w-full lg:flex lg:justify-end">
                  <IstClock />
                </div>
                <Link
                  href="#"
                  className="group mb-12 inline-flex w-fit flex-col self-start border-b border-white/90 pb-1 text-sm font-medium uppercase tracking-[0.12em] text-white lg:self-end"
                >
                  <span className="transition-opacity group-hover:opacity-80">
                    Start a collaboration →
                  </span>
                </Link>

                <div className="grid w-full max-w-md grid-cols-1 gap-10 sm:grid-cols-2 lg:ml-auto lg:max-w-lg">
                  <div className="flex flex-col text-left lg:text-left">
                    <h4 className="mb-6 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/45">
                      Business enquiry
                    </h4>
                    {enquiry.map((item, index) => (
                      <div className="mb-3 flex last:mb-0" key={index}>
                        <span className="mr-2 shrink-0 text-sm uppercase text-white/45">
                          {formatEnquiryLabel(item.label)}
                        </span>
                        <Link
                          className="text-button relative z-3 block text-sm text-white transition-opacity hover:opacity-80"
                          href={item.url}
                        >
                          {item.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="mb-6 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/45">
                      Social
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {social.map((item, index) => (
                        <p key={index}>
                          <Link
                            className="text-button relative z-3 inline-block text-sm capitalize text-white transition-opacity hover:opacity-80"
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

          <div className="tr__container w-full pb-8">
            <LinePlus
              customClass="col-span-12 w-full"
              lineClass="opacity-20 left-1/2 -translate-x-1/2"
              plusClass="col-span-12 mx-auto -translate-x-0!"
              iconColor="#D8D8D8"
            />
          </div>

          <div className="relative z-10 mt-auto w-full min-w-0 overflow-x-clip pb-4">
            <TrionnFooterLogo className="w-full" />
          </div>
        </div>
      </footer>
    </FooterAtmosphereProvider>
  );
}
