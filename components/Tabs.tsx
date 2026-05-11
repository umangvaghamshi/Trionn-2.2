"use client";

import parser from "html-react-parser";

interface Tab {
  id: string;
  label: string;
  content: string;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
  activeTabId: string;
  onTabChange?: (id: string) => void;
}

export function Tabs({
  tabs,
  className = "",
  activeTabId,
  onTabChange,
}: TabsProps) {
  return (
    <div className={`${className}`}>
      <div className="flex gap-5 lg:gap-8 pb-4 lg:mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`pb-2 title link cursor-pointer transition-all ${
              activeTabId === tab.id
                ? "opacity-100 active"
                : "opacity-40 hover:opacity-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`col-start-1 row-start-1 transition-all duration-500 ${
              activeTabId === tab.id
                ? "opacity-100 visible"
                : "opacity-0 invisible pointer-events-none"
            }`}
          >
            <div className="small tab-content">
              {parser(
                Array.isArray(tab.content) ? tab.content.join("") : tab.content,
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
