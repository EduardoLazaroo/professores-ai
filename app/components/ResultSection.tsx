/**
 * Componente de resultado
 * Exibe o resultado gerado ou mensagens de erro/carregamento
 */

"use client";

interface ResultSectionProps {
  result: string;
  error: string;
  loading: boolean;
  onCopy: () => void;
}

export function ResultSection({
  result,
  error,
  loading,
  onCopy,
}: ResultSectionProps) {
  const hasContent = result.trim().length > 0;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          Resultado
        </label>
        {hasContent && (
          <button
            onClick={onCopy}
            className="text-xs px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
          >
            Copiar
          </button>
        )}
      </div>

      <div className="relative min-h-[200px] rounded-lg border border-gray-300 bg-gray-50 p-4">
        {loading && (
          <div className="flex items-center justify-center h-full space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"></div>
            <div
              className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
            <span className="ml-2 text-sm text-gray-600">Gerando...</span>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-700 font-medium">Erro</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}

        {hasContent && !loading && (
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap text-justify leading-relaxed">
            {result}
          </div>
        )}

        {!loading && !error && !hasContent && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">
              Preencha o formulário acima e clique em &quot;Gerar&quot; para ver o resultado
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
