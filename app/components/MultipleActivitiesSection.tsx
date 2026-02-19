/**
 * Componente para exibir múltiplas atividades com abas
 * Permite ao professor escolher entre diferentes opções geradas
 */

"use client";

import { useState, useCallback } from "react";

interface MultipleActivitiesSectionProps {
  result: string;
  error: string;
  loading: boolean;
  onCopy: (content: string) => void;
}

export function MultipleActivitiesSection({
  result,
  error,
  loading,
  onCopy,
}: MultipleActivitiesSectionProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Parse das atividades
  const parseActivities = useCallback((): string[] => {
    if (!result.trim()) return [];

    // Divide por "---" para separar as 3 atividades
    const activities = result.split("---").map((activity) => activity.trim());
    return activities.filter((activity) => activity.length > 0);
  }, [result]);

  const activities = parseActivities();
  const hasContent = activities.length > 0;

  const handleCopy = (content: string, index: number) => {
    onCopy(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-800">
          Atividades Sugeridas
        </label>
        {hasContent && (
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
            {activities.length} opções disponíveis
          </span>
        )}
      </div>

      <div className="relative min-h-[300px] rounded-lg border border-gray-300 bg-white overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center h-full space-x-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"></div>
            <div
              className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
            <span className="ml-2 text-sm text-gray-600">Gerando atividades...</span>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 m-4">
            <p className="text-sm text-red-700 font-medium">Erro</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}

        {hasContent && !loading && (
          <div className="flex flex-col h-full">
            {/* Abas */}
            <div className="flex gap-2 bg-gray-50 p-4 border-b border-gray-200">
              {activities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeTab === index
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  Opção {index + 1}
                </button>
              ))}
            </div>

            {/* Conteúdo da atividade selecionada */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap text-justify leading-relaxed">
                  {activities[activeTab]}
                </div>

                {/* Botão de copiar */}
                <button
                  onClick={() => handleCopy(activities[activeTab], activeTab)}
                  className={`w-full px-4 py-3 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    copiedIndex === activeTab
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
                  }`}
                >
                  {copiedIndex === activeTab ? (
                    <>
                      <span>✓</span>
                      <span>Copiado com sucesso!</span>
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      <span>Copiar Esta Atividade</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !hasContent && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">
              Preencha o formulário acima e clique em &quot;Gerar&quot; para ver as atividades sugeridas
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
