"use client";

import { useState, useCallback } from "react";
import { GenerateType, GenerateResponse } from "@/lib/types";
import { FormSection } from "@/app/components/FormSection";
import { ResultSection } from "@/app/components/ResultSection";
import { ActionButton } from "@/app/components/ActionButton";

export default function Home() {
  const [type, setType] = useState<GenerateType>("planejamento");
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Envia requisição para API de geração
   */
  const handleGenerate = useCallback(async () => {
    if (!content.trim()) {
      setError("Por favor, insira um conteúdo válido.");
      return;
    }

    setLoading(true);
    setResult("");
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          content: content.trim(),
        }),
      });

      const data: GenerateResponse = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao processar solicitação");
        return;
      }

      if (data.success && data.result) {
        setResult(data.result);
        setError("");
      } else {
        setError(data.error || "Erro desconhecido");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro de conexão. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }, [type, content]);

  /**
   * Copia resultado para área de transferência
   */
  const handleCopy = useCallback(async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      alert("Resultado copiado para área de transferência!");
    } catch {
      alert("Erro ao copiar. Tente novamente.");
    }
  }, [result]);

  const isFormDisabled = loading;
  const isSubmitDisabled = !content.trim() || loading;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Assistente AI para Professores
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Otimize seu trabalho pedagógico com inteligência artificial
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* Seção de Formulário */}
          <FormSection
            type={type}
            content={content}
            onTypeChange={setType}
            onContentChange={setContent}
            disabled={isFormDisabled}
          />

          {/* Separador Visual */}
          <div className="border-t border-gray-200"></div>

          {/* Botão de Ação */}
          <ActionButton
            loading={loading}
            disabled={isSubmitDisabled}
            onClick={handleGenerate}
          />

          {/* Separador Visual */}
          <div className="border-t border-gray-200"></div>

          {/* Seção de Resultado */}
          <ResultSection
            result={result}
            error={error}
            loading={loading}
            onCopy={handleCopy}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs sm:text-sm text-gray-600">
          <p>
            Dados não são armazenados. Sua privacidade é importante para nós.
          </p>
        </div>
      </div>
    </main>
  );
}