"use client";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/Transition";
import { menu } from "@/data";

export default function NavLinks() {
  const pathname = usePathname();

  // Map route paths to transition labels
  const labelMap: Record<string, string> = {
    "/": "Home",
    "/about": "About",
    "/work": "Our Work",
    "/services": "Services",
  };

  return (
    <>
      <div className="menu-wrapper">
        <ul className="menu flex items-center justify-end gap-x-3 md:gap-x-6">
          {menu.map((item, index) => {
            const isActive = pathname === item.url;
            return (
              <li className="menu-item" key={index}>
                <TransitionLink
                  className={`link menu block uppercase text-white py-1 ${isActive ? "active" : ""}`}
                  href={item.url}
                  transitionLabel={labelMap[item.url] || item.title}
                >
                  {item.title}
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
