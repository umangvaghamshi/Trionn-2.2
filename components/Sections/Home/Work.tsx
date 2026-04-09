"use client";
import React, { useEffect, useRef } from "react";
import LinePlus from "@/components/LinePlus";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";
import WipeImageCard from "@/components/WipeImageCard";

import { workData } from "@/data";

export default function Work() {
  return (
    <section id="work-section" className="bg-white relative z-22">
      <div className="tr__container relative w-full bg-[linear-gradient(0deg,#D2D2D2_0%,#FFFFFF_100%)]">
        <LinePlus
          lineClass={"opacity-15 bg-grey-line left-1/2 -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto translate-x-1/2!"}
          iconColor={"#272727"}
        />
        <div className="py-37.5">
          <div className="title-block mb-20 flex gap-6 justify-between items-end">
            <BlurTextReveal
              as="h2"
              html={`Selected Work`}
              animationType="chars"
              stagger={0.05}
              className=" text-dark-font"
            />
            <WordShiftButton text="view all projects" href="#" />
          </div>
          <div className="home-work-list">
            {workData.map((item, index) => {
              const isEven = index % 2 !== 0;

              const data = {
                ...item,
                isEven,
              };

              return <WipeImageCard key={index} {...data} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
