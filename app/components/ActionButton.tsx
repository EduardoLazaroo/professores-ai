/**
 * Componente de botão de ação
 * Centraliza o botão de geração com estados de carregamento e validação
 */

"use client";

interface ActionButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function ActionButton({
  loading,
  disabled,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full rounded-lg px-6 py-3 font-semibold text-white transition-all duration-200 ${
        disabled || loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg"
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Gerando...</span>
        </div>
      ) : (
        "Gerar"
      )}
    </button>
  );
}
