/**
 * Componente de navegação com tabs
 * Sistema de abas para navegação entre ferramentas
 */

"use client";

import { TABS_CONFIG } from "@/lib/types";

type TabId = "home" | "planejamento" | "ocorrencia" | "atividade";

interface TabsNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-300 shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabId)}
              className={`px-5 py-4 min-w-max text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-emerald-700 border-b-3 border-emerald-600 bg-emerald-50"
                  : "text-gray-600 hover:text-gray-900 border-b-3 border-transparent hover:bg-gray-50"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
