/**
 * Tela de Criador de Atividades
 * Componente para criar atividades pedagógicas estruturadas
 */

"use client";

import { MultipleActivitiesSection } from "../MultipleActivitiesSection";
import { ActionButton } from "../ActionButton";
import { AtividadeContext } from "@/lib/types";
import { useCallback, useState } from "react";

interface AtividadeScreenProps {
  result: string;
  error: string;
  loading: boolean;
  onGenerate: (context: AtividadeContext) => Promise<void>;
}

const RECURSOS_DISPONIVEIS = [
  { id: "lousa", label: "Lousa", icon: "📋" },
  { id: "projetor", label: "Projetor", icon: "🎬" },
  { id: "caderno", label: "Caderno", icon: "📓" },
  { id: "notebook", label: "Notebook", icon: "💻" },
];

export function AtividadeScreen({
  result,
  error,
  loading,
  onGenerate,
}: AtividadeScreenProps) {
  const [context, setContext] = useState<AtividadeContext>({
    turma: "",
    disciplina: "",
    topico: "",
    recursos: ["lousa", "caderno"],
  });

  const handleGenerate = useCallback(async () => {
    await onGenerate(context);
  }, [context, onGenerate]);

  const handleCopy = useCallback(async (content: string) => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      // Feedback visual agora é feito no componente MultipleActivitiesSection
    } catch {
      // Silenciosamente falha - o componente já avisa visualmente
    }
  }, []);

  const toggleRecurso = (id: string) => {
    setContext((prev) => ({
      ...prev,
      recursos: prev.recursos.includes(id)
        ? prev.recursos.filter((r) => r !== id)
        : [...prev.recursos, id],
    }));
  };

  const isFormValid =
    context.turma.trim() &&
    context.disciplina.trim() &&
    context.topico.trim();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Instruções */}
      <section className="bg-emerald-50 rounded-lg p-5 border border-emerald-300">
        <p className="text-sm text-gray-800">
          <strong>📚 Como usar:</strong> Preencha as informações obrigatórias (turma, disciplina e tópico) e selecione os recursos disponíveis. A IA criará <strong>3 atividades diferentes</strong> para você escolher a que melhor se adequa à sua aula.
        </p>
      </section>

      {/* Campos obrigatórios */}
      <div className="space-y-4 bg-white rounded-lg p-6 border border-gray-300 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>📋</span>
          Informações Obrigatórias
        </h3>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Turma <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: 2º colegial, 7º ano A, 1º série..."
            value={context.turma}
            onChange={(e) => setContext({ ...context, turma: e.target.value })}
            disabled={loading}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100 font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Disciplina <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Matemática, Português, História..."
            value={context.disciplina}
            onChange={(e) =>
              setContext({ ...context, disciplina: e.target.value })
            }
            disabled={loading}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100 font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Tópico <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Frações, Revolução Francesa, Fotossíntese..."
            value={context.topico}
            onChange={(e) => setContext({ ...context, topico: e.target.value })}
            disabled={loading}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100 font-medium"
          />
        </div>
      </div>

      {/* Recursos disponíveis */}
      <div className="space-y-4 bg-white rounded-lg p-6 border border-gray-300 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>🛠️</span>
          Recursos Disponíveis
        </h3>
        <p className="text-sm text-gray-800 font-medium">
          Marque os recursos que você tem disponível em sala de aula
        </p>

        <div className="grid grid-cols-2 gap-3">
          {RECURSOS_DISPONIVEIS.map((recurso) => (
            <label
              key={recurso.id}
              className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all font-medium"
              style={{
                borderColor: context.recursos.includes(recurso.id)
                  ? "#059669"
                  : "#d1d5db",
                backgroundColor: context.recursos.includes(recurso.id)
                  ? "#ecfdf5"
                  : "transparent",
              }}
            >
              <input
                type="checkbox"
                checked={context.recursos.includes(recurso.id)}
                onChange={() => toggleRecurso(recurso.id)}
                disabled={loading}
                className="w-5 h-5 text-emerald-600 rounded border-gray-300 cursor-pointer"
              />
              <span className="text-lg">{recurso.icon}</span>
              <span className="text-sm font-bold text-gray-800">
                {recurso.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Botão de ação */}
      <ActionButton
        loading={loading}
        disabled={!isFormValid || loading}
        onClick={handleGenerate}
      />

      {/* Resultado */}
      <MultipleActivitiesSection
        result={result}
        error={error}
        loading={loading}
        onCopy={handleCopy}
      />
    </div>
  );
}
