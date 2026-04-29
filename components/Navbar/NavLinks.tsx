"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menu } from "@/data";

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      <div className="menu-wrapper">
        <ul className="menu flex items-center justify-end gap-x-3 md:gap-x-6">
          {menu.map((item, index) => {
            const isActive = pathname === item.url;
            return (
              <li className="menu-item" key={index}>
                <Link
                  className={`link menu block uppercase text-white py-1 ${isActive ? "active" : ""}`}
                  href={item.url}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
