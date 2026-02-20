/**
 * Tela de Ocorrência Formal
 * Componente para reescrever ocorrências em linguagem formal
 */

"use client";

import { FormSection } from "../FormSection";
import { ResultSection } from "../ResultSection";
import { ActionButton } from "../ActionButton";
import { OcorrenciaContext } from "@/lib/types";
import { generateOcorrenciaPDF } from "@/lib/pdf-generator";
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
    nomeProf: "",
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
    } catch {
      // Erro silencioso
    }
  }, [result]);

  const handleGeneratePDF = useCallback(async () => {
    if (!result) return;
    await generateOcorrenciaPDF(context, result);
  }, [result, context]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Instruções */}
      <section className="bg-amber-50 rounded-lg p-5 border border-amber-300">
        <p className="text-sm text-gray-800">
          <strong>⚠️ Como usar:</strong> Descreva o ocorrido de forma informal. A IA reescreverá em linguagem formal apropriada para registros escolares. Complete as informações nos campos abaixo para melhor contextualizar.
        </p>
      </section>

      {/* Nome do Professor (obrigatório) */}
      <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Nome do Professor <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Digite seu nome completo..."
            value={context.nomeProf}
            onChange={(e) => setContext({ ...context, nomeProf: e.target.value })}
            disabled={loading}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100 font-medium"
          />
        </div>
      </div>

      {/* Badges obrigatórios e opcionais */}
      <div className="space-y-4 bg-white rounded-lg p-6 border border-gray-300 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Informações da Ocorrência
        </h3>
        {/* Tipo (obrigatório) */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Tipo <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2">
            {(["individual", "coletiva"] as const).map((tipo) => (
              <button
                key={tipo}
                onClick={() =>
                  setContext({ ...context, tipo })
                }
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                  context.tipo === tipo
                    ? "bg-emerald-600 text-white shadow-md"
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
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Data da Ocorrência <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={context.data}
            onChange={(e) => setContext({ ...context, data: e.target.value })}
            disabled={loading}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100 font-medium"
          />
        </div>

        {/* Turno (opcional) */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Turno
          </label>
          <div className="flex gap-2 flex-wrap">
            {(["manhã", "tarde", "noite"] as const).map((turno) => (
              <button
                key={turno}
                onClick={() => setContext({ ...context, turno })}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  context.turno === turno
                    ? "bg-emerald-600 text-white shadow-md"
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
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Gravidade
          </label>
          <div className="flex gap-2 flex-wrap">
            {(["leve", "moderada", "grave"] as const).map((grav) => (
              <button
                key={grav}
                onClick={() => setContext({ ...context, gravidade: grav })}
                className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all ${
                  context.gravidade === grav
                    ? `${
                        grav === "grave"
                          ? "bg-red-600"
                          : grav === "moderada"
                            ? "bg-amber-600"
                            : "bg-emerald-600"
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
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all">
            <input
              type="checkbox"
              checked={context.encaminhamento}
              onChange={(e) =>
                setContext({ ...context, encaminhamento: e.target.checked })
              }
              disabled={loading}
              className="w-5 h-5 text-emerald-600 rounded border-gray-300 cursor-pointer"
            />
            <span className="text-sm font-bold text-gray-800">
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
        disabled={!content.trim() || loading || !context.tipo || !context.data || !context.nomeProf.trim()}
        onClick={handleGenerate}
      />

      {/* Resultado */}
      <ResultSection
        result={result}
        error={error}
        loading={loading}
        onCopy={handleCopy}
        onGeneratePDF={handleGeneratePDF}
      />
    </div>
  );
}
