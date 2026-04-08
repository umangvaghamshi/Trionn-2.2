"use client";
import Link from "next/link";
import { BlurTextReveal, BlurReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";
import LinePlus from "@/components/LinePlus";
import FluteWaveSvg from "@/components/FluteWaveSvg";

import { enquiry, social } from "@/data";
import GuitarWireFooter from "../GuitarWireFooter";

export default function Footer() {
  return (
    <>
      <footer className="site-footer text-light-font min-h-screen pt-37.5 bg-[#000000] relative overflow-hidden z-2 flex flex-col">
        <div className="tr__container w-full flex flex-col justify-between">
          <div className="footer-top-block flex flex-col w-full">
            <div className="footer-title-block grid grid-cols-12 grid-rows-2 gap-x-6 w-full">
              <BlurTextReveal
                as="h2"
                html={`let&apos;s start`}
                animationType="chars"
                stagger={0.05}
                className="h1 uppercase mix-blend-difference text-light-font z-2 col-span-12"
              />
              <BlurTextReveal
                as="h2"
                html={`something`}
                animationType="chars"
                stagger={0.05}
                className="h1 uppercase mix-blend-difference text-light-font z-2 col-span-10 col-start-3"
              />
            </div>
            <div className="footer-subtitle-block grid grid-cols-12 grid-rows-1 gap-x-6 -translate-y-full w-full z-3">
              <span className="title z-3 col-span-6">
                Lett&apos;s build work <br />
                that inspires.
              </span>
              <div className="col-span-6 flex justify-end">
                <WordShiftButton
                  text="start a collobration"
                  href="#"
                  customClass={"min-w-[15.625rem] z-3 relative"}
                  styleVars={{ buttonWrapperColor: "#D8D8D8" }}
                />
              </div>
            </div>
          </div>
          <div className="footer-bottom-block grid grid-cols-12 grid-rows-1 gap-x-6 w-full pt-60">
            <LinePlus
              customClass={"translate-y-1/2 col-span-12"}
              lineClass={"opacity-20 left-1/2 -translate-x-1/2"}
              plusClass={"col-span-12 mx-auto -translate-x-0!"}
              iconColor={"#D8D8D8"}
            />
            <div className="col-span-12 grid grid-cols-12 grid-rows-1 gap-x-6 w-full pt-20">
              <h4 className="z-2 col-span-2 text-light-font opacity-50">
                ©TRIONN® 2026
              </h4>
              <div className="flex flex-col col-span-3">
                <h4 className="z-2 text-light-font opacity-50 uppercase mb-6">
                  Business enquiry
                </h4>
                {enquiry.map((item, index) => (
                  <div className="flex mb-2 last:mb-0" key={index}>
                    <p className="z-2 text-light-font opacity-50 uppercase mr-3">
                      {item.label}
                    </p>
                    <p>
                      <BlurReveal className="relative z-3">
                        <Link
                          className="text-button block text-light-font"
                          href={item.url}
                        >
                          {item.title}
                        </Link>
                      </BlurReveal>
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col col-span-2 col-start-11">
                <h4 className="z-2 text-light-font opacity-50! uppercase mb-6">
                  social
                </h4>
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                  {social.map((item, index) => (
                    <p key={index}>
                      <BlurReveal className="relative z-3" key={index}>
                        <Link
                          className="text-button inline-block text-light-font"
                          href={item.url}
                        >
                          {item.title}
                        </Link>
                      </BlurReveal>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <GuitarWireFooter/>
        </div>
      </footer>
    </>
  );
}
