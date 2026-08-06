"use client";

import React, { useState, useEffect } from "react";
import { TecnicoContext } from "@/lib/types";
import { parseScopeText, ParsedScopeResult } from "@/lib/scopeParser";

interface TecnicoFormSectionProps {
  context: TecnicoContext;
  setContext: React.Dispatch<React.SetStateAction<TecnicoContext>>;
  content: string;
  setContent: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const DISCIPLINAS_2_TECNICO = [
  "Lógica de Programação",
  "Front-End I (HTML, CSS e JS)",
  "Banco de Dados I (SQL)",
  "Versionamento e Git",
  "Modelagem e Análise de Sistemas",
  "Outra Disciplina",
];

const DISCIPLINAS_3_TECNICO = [
  "Desenvolvimento Back-End (APIs & Node.js)",
  "Front-End II (React & Next.js)",
  "Banco de Dados II (NoSQL e ORM)",
  "Inteligência Artificial & Machine Learning",
  "Projetos de TI & Carreiras em EPT",
  "Outra Disciplina",
];

export const TecnicoFormSection: React.FC<TecnicoFormSectionProps> = ({
  context,
  setContext,
  content,
  setContent,
  onSubmit,
  isLoading,
}) => {
  const [customDisciplina, setCustomDisciplina] = useState("");
  const [parsedPreview, setParsedPreview] = useState<ParsedScopeResult | null>(
    null
  );

  // Lista de disciplinas conforme a turma escolhida
  const disciplinasDisponiveis =
    context.turma === "3º Técnico"
      ? DISCIPLINAS_3_TECNICO
      : DISCIPLINAS_2_TECNICO;

  // Atualizar preview do parser sempre que o escopo mudar
  useEffect(() => {
    if (content.trim().length > 10) {
      const parsed = parseScopeText(content);
      setParsedPreview(parsed);
      
      // Auto-preencher disciplina se for detectada e o usuário ainda não tiver escolhido uma customizada
      if (parsed.disciplina && (!context.disciplina || context.disciplina === "Lógica de Programação")) {
        setContext((prev) => ({ ...prev, disciplina: parsed.disciplina }));
      }
    } else {
      setParsedPreview(null);
    }
  }, [content]);

  const handleChange = (
    field: keyof TecnicoContext,
    value: string | number | boolean
  ) => {
    setContext((prev) => {
      const updated = { ...prev, [field]: value };
      // Se mudou a turma, reseta disciplina para a primeira da nova lista se não estiver nela
      if (field === "turma") {
        const novaLista =
          value === "3º Técnico"
            ? DISCIPLINAS_3_TECNICO
            : DISCIPLINAS_2_TECNICO;
        if (!novaLista.includes(prev.disciplina)) {
          updated.disciplina = novaLista[0];
        }
      }
      return updated;
    });
  };

  const handleDisciplinaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "Outra Disciplina") {
      handleChange("disciplina", customDisciplina || "Outra Disciplina");
    } else {
      handleChange("disciplina", val);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100">
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
            💻
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Eixo Técnico (EPT) — EE Monsenhor Bicudo
            </h2>
            <p className="text-sm text-slate-500">
              Plano de Aula Semanal padronizado para a Educação Profissional e Tecnológica (TI).
            </p>
          </div>
        </div>
      </div>

      {/* BLOCO 1: INFORMAÇÕES GERAIS */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-600 pl-3">
          1. Informações Gerais da Turma & Período
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nome do Professor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome do Professor(a) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Prof. Eduardo Lazaroo"
              value={context.nomeProf}
              onChange={(e) => handleChange("nomeProf", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800"
            />
          </div>

          {/* Turma / Série */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Turma / Série <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["2º Técnico", "3º Técnico"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleChange("turma", t)}
                  className={`py-2.5 px-4 rounded-lg font-medium text-sm border transition flex items-center justify-center space-x-2 ${
                    context.turma === t
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Componente / Disciplina */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Componente Curricular / Disciplina <span className="text-red-500">*</span>
            </label>
            <select
              value={
                disciplinasDisponiveis.includes(context.disciplina)
                  ? context.disciplina
                  : "Outra Disciplina"
              }
              onChange={handleDisciplinaSelect}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800"
            >
              {disciplinasDisponiveis.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {!disciplinasDisponiveis.includes(context.disciplina) && (
              <input
                type="text"
                placeholder="Digite o nome da disciplina customizada..."
                value={customDisciplina || context.disciplina}
                onChange={(e) => {
                  setCustomDisciplina(e.target.value);
                  handleChange("disciplina", e.target.value);
                }}
                className="mt-2 w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
              />
            )}
          </div>

          {/* Bimestre */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bimestre <span className="text-red-500">*</span>
            </label>
            <select
              value={context.bimestre}
              onChange={(e) =>
                handleChange("bimestre", e.target.value as TecnicoContext["bimestre"])
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800"
            >
              <option value="1º">1º Bimestre</option>
              <option value="2º">2º Bimestre</option>
              <option value="3º">3º Bimestre</option>
              <option value="4º">4º Bimestre</option>
            </select>
          </div>

          {/* Identificação da Semana */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Identificação da Semana <span className="text-red-500">*</span>
            </label>
            <select
              value={context.semana}
              onChange={(e) => handleChange("semana", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800"
            >
              {Array.from({ length: 40 }, (_, i) => {
                const num = String(i + 1).padStart(2, "0");
                return (
                  <option key={num} value={`Semana ${num}`}>
                    Semana {num}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Quantidade de Aulas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantidade de Aulas na Semana <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={context.qtdAulas}
              onChange={(e) => handleChange("qtdAulas", parseInt(e.target.value, 10) || 1)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800"
            />
          </div>

          {/* Período: Data Início e Fim */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Data de Início da Semana
            </label>
            <input
              type="text"
              placeholder="DD/MM/AAAA"
              value={context.dataInicio}
              onChange={(e) => handleChange("dataInicio", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Data de Fim da Semana
            </label>
            <input
              type="text"
              placeholder="DD/MM/AAAA"
              value={context.dataFim}
              onChange={(e) => handleChange("dataFim", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
        </div>

        {/* Uso de Laboratório Técnico */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">
              🖥️ Uso de Laboratório Técnico de TI
            </h4>
            <p className="text-xs text-slate-500">
              As atividades desta semana necessitam de computadores, IDEs ou softwares práticos?
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleChange("usoLaboratorio", !context.usoLaboratorio)}
            className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition ${
              context.usoLaboratorio
                ? "bg-green-600 text-white shadow"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            {context.usoLaboratorio ? "Sim (Laboratório TI)" : "Não (Sala Comum)"}
          </button>
        </div>
      </div>

      {/* BLOCO 2: ESCOPO DA SEMANA & TSV EXCEL */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-600 pl-3">
            2. Escopo da Semana (Texto Livre ou Planilha Excel / TSV)
          </h3>
          <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
            Parsing TSV Inteligente
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Dica: Você pode copiar e colar linhas diretamente do Excel ou Google Sheets. O sistema identifica autonomamente as Aulas, Objetivos e Competências!
        </p>

        <textarea
          rows={7}
          placeholder="Cole aqui o conteúdo bruto ou linhas da planilha do curso... Exemplo:&#10;Aula 1&#10;Codificar estruturas condicionais e algoritmos em JS&#10;Empatia e Resolução de Problemas&#10;Aula 2&#10;Desenvolvimento de formulários interativos em laboratório"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-slate-800 leading-relaxed"
        />

        {/* Informações extraídas pelo parser em tempo real */}
        {parsedPreview && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-1.5">
            <div className="font-semibold flex items-center space-x-2 text-emerald-800">
              <span>⚡ Extração Automática Detectada:</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-emerald-100 px-2 py-0.5 rounded font-medium">
                {parsedPreview.aulas.length} Aulas Encontradas
              </span>
              {parsedPreview.competencia && (
                <span className="bg-emerald-100 px-2 py-0.5 rounded font-medium">
                  Competência Técnica Mapeada
                </span>
              )}
              {parsedPreview.competenciasSocioemocionais && (
                <span className="bg-emerald-100 px-2 py-0.5 rounded font-medium">
                  Soft Skills Identificadas
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTÃO DE AÇÃO */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !content.trim()}
          className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center space-x-2 ${
            isLoading || !content.trim()
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/25"
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Gerando Plano EPT...</span>
            </>
          ) : (
            <>
              <span>⚡ Gerar Plano de Aula Técnico (EPT)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
