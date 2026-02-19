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
      className={`w-full rounded-lg px-6 py-4 font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
        disabled || loading
          ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
          : "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      }`}
    >
      {loading ? (
        <>
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Gerando...</span>
        </>
      ) : (
        <>
          <span>✨</span>
          <span>Gerar</span>
        </>
      )}
    </button>
  );
}
