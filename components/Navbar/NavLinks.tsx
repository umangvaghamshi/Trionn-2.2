"use client";
import Link from "next/link";
import { BlurReveal } from "@/components/TextAnimation";
import { menu } from "@/data";

export default function NavLinks() {
  return (
    <>
      <div className="menu-wrapper">
        <ul className="menu flex items-center justify-end gap-x-3 md:gap-x-6">
          {menu.map((item, index) => (
            <li className="menu-item" key={index}>
              <BlurReveal>
                <Link
                  className="menu block text-white uppercase"
                  href={item.url}
                >
                  {item.title}
                </Link>
              </BlurReveal>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
