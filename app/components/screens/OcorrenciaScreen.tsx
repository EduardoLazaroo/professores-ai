/**
 * Tela de Ocorrência Formal
 * Componente para reescrever ocorrências em linguagem formal
 */

"use client";

import { FormSection } from "../FormSection";
import { ResultSection } from "../ResultSection";
import { ActionButton } from "../ActionButton";
import { OcorrenciaContext } from "@/lib/types";
import { useCallback, useState } from "react";

interface OcorrenciaScreenProps {
  content: string;
  result: string;
  error: string;
  loading: boolean;
  onContentChange: (content: string) => void;
  onGenerate: (content: string, context: OcorrenciaContext) => Promise<void>;
}

export function OcorrenciaScreen({
  content,
  result,
  error,
  loading,
  onContentChange,
  onGenerate,
}: OcorrenciaScreenProps) {
  // Estado local para badges
  const [context, setContext] = useState<OcorrenciaContext>({
    tipo: "individual",
    data: new Date().toISOString().split("T")[0],
    turno: "manhã",
    gravidade: "leve",
    encaminhamento: false,
  });

  const handleGenerate = useCallback(async () => {
    await onGenerate(content, context);
  }, [content, context, onGenerate]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      alert("Resultado copiado para área de transferência!");
    } catch {
      alert("Erro ao copiar. Tente novamente.");
    }
  }, [result]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Instruções */}
      <section className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Como usar:</strong> Descreva o ocorrido de forma informal. A IA reescreverá em linguagem formal apropriada para registros escolares. Complete as informações nos campos abaixo para melhor contextualizar.
        </p>
      </section>

      {/* Badges obrigatórios e opcionais */}
      <div className="space-y-4">
        {/* Tipo (obrigatório) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {(["individual", "coletiva"] as const).map((tipo) => (
              <button
                key={tipo}
                onClick={() =>
                  setContext({ ...context, tipo })
                }
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  context.tipo === tipo
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tipo === "individual" ? "Individual" : "Coletiva"}
              </button>
            ))}
          </div>
        </div>

        {/* Data (obrigatório) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data da Ocorrência <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={context.data}
            onChange={(e) => setContext({ ...context, data: e.target.value })}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          />
        </div>

        {/* Turno (opcional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Turno
          </label>
          <div className="flex gap-2 flex-wrap">
            {(["manhã", "tarde", "noite"] as const).map((turno) => (
              <button
                key={turno}
                onClick={() => setContext({ ...context, turno })}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  context.turno === turno
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {turno === "manhã"
                  ? "Manhã"
                  : turno === "tarde"
                    ? "Tarde"
                    : "Noite"}
              </button>
            ))}
          </div>
        </div>

        {/* Gravidade (opcional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gravidade
          </label>
          <div className="flex gap-2 flex-wrap">
            {(["leve", "moderada", "grave"] as const).map((grav) => (
              <button
                key={grav}
                onClick={() => setContext({ ...context, gravidade: grav })}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  context.gravidade === grav
                    ? `${
                        grav === "grave"
                          ? "bg-red-600"
                          : grav === "moderada"
                            ? "bg-yellow-600"
                            : "bg-green-600"
                      } text-white`
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {grav === "leve" ? "Leve" : grav === "moderada" ? "Moderada" : "Grave"}
              </button>
            ))}
          </div>
        </div>

        {/* Encaminhamento (opcional) */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={context.encaminhamento}
              onChange={(e) =>
                setContext({ ...context, encaminhamento: e.target.checked })
              }
              disabled={loading}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            <span className="text-sm font-semibold text-gray-700">
              Necessita encaminhamento?
            </span>
          </label>
        </div>
      </div>

      {/* Formulário de conteúdo */}
      <FormSection
        placeholder="Descreva o ocorrido de forma informal. Ex: O aluno João ficou conversando durante a aula, não entregou a tarefa e ainda desrespeitou a estagiária..."
        content={content}
        onContentChange={onContentChange}
        disabled={loading}
        title="Relato da Ocorrência"
      />

      {/* Botão de ação */}
      <ActionButton
        loading={loading}
        disabled={!content.trim() || loading || !context.tipo || !context.data}
        onClick={handleGenerate}
      />

      {/* Resultado */}
      <ResultSection
        result={result}
        error={error}
        loading={loading}
        onCopy={handleCopy}
      />
    </div>
  );
}
