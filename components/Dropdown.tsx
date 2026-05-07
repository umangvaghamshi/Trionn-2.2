"use client";
import React, { useState, useRef, useEffect } from "react";
import { DropdownOption } from "@/data/dataType";
// Import or define an icon here, e.g., Heroicons

interface DropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = selectedValue !== null;

  return (
    <div className="relative block w-full text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={` relative flex w-full cursor-pointer items-center border p-4 pr-10 text-dark-font transition-all duration-300 ease-in-out bg-[#131415] focus:bg-[#D2D2D2] autofill:bg-[#D2D2D2] focus:outline-none border-none ${
          isOpen ? "rounded-t-sm" : "rounded-sm"
        }
        ${isOpen || isSelected ? "bg-[#D2D2D2]" : "bg-[#131415]"}
          `}
      >
        <span className="truncate">
          {options.find((o) => o.value === selectedValue)?.label || placeholder}
        </span>
        {/* Add a little chevron icon here so users know it's a dropdown */}
        <span
          className={`absolute top-1/2 right-4 h-3 w-3 -translate-y-1/2 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            width="9"
            height="10"
            viewBox="0 0 9 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
          >
            <path
              d="M0 5.47422L2.1 5.47422L4.9 8.33022L3.752 8.33022L6.552 5.47422H8.652L4.816 9.32422L3.836 9.32422L0 5.47422ZM3.542 0.000218391H5.11V8.61022L3.542 8.61022L3.542 0.000218391Z"
              fill="#434343"
            />
          </svg>
        </span>
      </button>
      <div
        className={`absolute z-10 w-full origin-top overflow-hidden rounded-b-sm bg-[#D2D2D2] text-dark-font py-1 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => {
              setSelectedValue(option.value);
              onChange?.(option.value);
              setIsOpen(false);
            }}
            className="hover:bg-dark-font cursor-pointer px-4 py-2 transition-all duration-300 ease-in-out hover:text-light-font"
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};
