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
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabId)}
              className={`px-4 py-3 min-w-max text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
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
