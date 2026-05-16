"use client";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/Transition";
import { HoverBlur } from "@/components/TextAnimation";
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
        <ul className="flex flex-col md:flex-row items-center justify-end gap-2 md:gap-x-6">
          {menu.map((item, index) => {
            const isActive = pathname === item.url;
            return (
              <li className="menu-item" key={index}>
                <TransitionLink
                  className={`menu block uppercase text-white ${isActive ? "active" : ""}`}
                  href={item.url}
                  transitionLabel={item.title || labelMap[item.url]}
                >
                  <HoverBlur>{item.title}</HoverBlur>
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
