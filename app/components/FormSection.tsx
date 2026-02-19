/**
 * Componente de entrada de dados
 * Responsável por capturar input do usuário
 */

"use client";

interface FormSectionProps {
  title: string;
  placeholder: string;
  content: string;
  onContentChange: (content: string) => void;
  disabled: boolean;
}

export function FormSection({
  title,
  placeholder,
  content,
  onContentChange,
  disabled,
}: FormSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-gray-800">
          {title}
        </label>
        <span className="text-xs text-gray-600 font-medium">
          {content.length} / 5000 caracteres
        </span>
      </div>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value.slice(0, 5000))}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all hover:border-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100 disabled:text-gray-500 md:min-h-[200px] min-h-[150px] resize-none font-medium"
      />
      <p className="text-xs text-gray-600 font-medium">
        Mínimo 10 caracteres • Máximo 5000 caracteres
      </p>
    </section>
  );
}
