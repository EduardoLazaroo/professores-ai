/**
 * Tela de Planejamento Semanal
 * Componente para criar planejamentos estruturados
 */

"use client";

import { FormSection } from "../FormSection";
import { ResultSection } from "../ResultSection";
import { ActionButton } from "../ActionButton";
import { useCallback } from "react";

interface PlanejamentoScreenProps {
  content: string;
  result: string;
  error: string;
  loading: boolean;
  onContentChange: (content: string) => void;
  onGenerate: (content: string) => Promise<void>;
}

export function PlanejamentoScreen({
  content,
  result,
  error,
  loading,
  onContentChange,
  onGenerate,
}: PlanejamentoScreenProps) {
  const handleGenerate = useCallback(async () => {
    await onGenerate(content);
  }, [content, onGenerate]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
    } catch {
      // Erro silencioso
    }
  }, [result]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Instruções */}
      <section className="bg-emerald-50 rounded-lg p-5 border border-emerald-300">
        <p className="text-sm text-gray-800">
          <strong>📅 Como usar:</strong> Descreva o escopo da semana incluindo conteúdos, temas, nível de ensino e qualquer contexto importante. A IA estruturará um planejamento completo com objetivos, conteúdos, metodologia, recursos e formas de avaliação.
        </p>
      </section>

      {/* Formulário */}
      <FormSection
        placeholder="Ex: Tema da semana - Geometria Básica. Subtemas: triângulos, quadriláteros. Nível: 7º ano. Contexto: alunos com dificuldade em visualização espacial..."
        content={content}
        onContentChange={onContentChange}
        disabled={loading}
        title="Escopo da Semana"
      />

      {/* Botão de ação */}
      <ActionButton
        loading={loading}
        disabled={!content.trim() || loading}
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
