/**
 * Componente de entrada de dados
 * Responsável por capturar input do usuário
 */

"use client";

import { GenerateType, GENERATE_TYPES } from "@/lib/types";

interface FormSectionProps {
  type: GenerateType;
  content: string;
  onTypeChange: (type: GenerateType) => void;
  onContentChange: (content: string) => void;
  disabled: boolean;
}

export function FormSection({
  type,
  content,
  onTypeChange,
  onContentChange,
  disabled,
}: FormSectionProps) {
  const getPlaceholder = () => {
    switch (type) {
      case "planejamento":
        return "Ex: Tema da semana - Geometria Básica. Subtemas: triângulos, quadriláteros. Nível: 7º ano...";
      case "ocorrencia":
        return "Ex: O aluno João não entregou a tarefa de matemática, ficou conversando durante a aula...";
      default:
        return "Cole aqui o conteúdo...";
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-700">
            Tipo de Geração
          </label>
          <span className="text-xs text-gray-500">Obrigatório</span>
        </div>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as GenerateType)}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
        >
          {Object.entries(GENERATE_TYPES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-700">
            {GENERATE_TYPES[type]}
          </label>
          <span className="text-xs text-gray-500">
            {content.length} / 5000 caracteres
          </span>
        </div>
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value.slice(0, 5000))}
          disabled={disabled}
          placeholder={getPlaceholder()}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500 md:min-h-[180px] min-h-[150px] resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Mínimo 10 caracteres • Máximo 5000 caracteres
        </p>
      </div>
    </section>
  );
}
