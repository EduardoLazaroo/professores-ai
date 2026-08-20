"use client";

import { TABS_CONFIG } from "@/lib/types";

type TabId = "home" | "planejamento" | "ocorrencia" | "atividade" | "tecnico";

interface TabsNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {TABS_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as TabId)}
                className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
