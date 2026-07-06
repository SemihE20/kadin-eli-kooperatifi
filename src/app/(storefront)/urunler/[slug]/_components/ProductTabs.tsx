"use client";

import { useState } from "react";

interface ProductTabsProps {
  description: string | null;
  usage: string | null;
  storage: string | null;
}

export default function ProductTabs({ description, usage, storage }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "usage" | "storage">("description");

  return (
    <div>
      <div className="border-b border-earth-200 mb-4 overflow-x-auto">
        <div className="flex gap-6 w-max">
          {[
            { key: "description" as const, label: "Açıklama" },
            { key: "usage" as const, label: "Kullanım" },
            { key: "storage" as const, label: "Saklama" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? "text-primary-700 border-b-2 border-primary-700"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-muted leading-relaxed whitespace-pre-line">
        {activeTab === "description" && (description || "Açıklama bulunmuyor.")}
        {activeTab === "usage" && (usage || "Kullanım bilgisi bulunmuyor.")}
        {activeTab === "storage" && (storage || "Saklama bilgisi bulunmuyor.")}
      </div>
    </div>
  );
}
