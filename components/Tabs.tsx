"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: string;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
}

export function Tabs({ tabs, className = "" }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className={`${className}`}>
      <div className="flex gap-8 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 title link cursor-pointer ${
              activeTab === tab.id
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
            className={`
              col-start-1 row-start-1 transition-all duration-500
              ${
                activeTab === tab.id
                  ? "opacity-100 visible pointer-events-auto"
                  : "opacity-0 invisible pointer-events-none"
              }
            `}
          >
            <p className="small">{tab.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
