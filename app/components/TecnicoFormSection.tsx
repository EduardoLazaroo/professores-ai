"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TecnicoContext } from "@/lib/types";
import { parseScopeText, ParsedScopeResult } from "@/lib/scopeParser";
import {
  getDisciplinasByTurma,
  getSemanasDisponiveis,
  getWeekDetails,
  getCurriculumData,
  CurriculumWeekDetails,
} from "@/lib/curriculumLoader";

interface TecnicoFormSectionProps {
  context: TecnicoContext;
  setContext: React.Dispatch<React.SetStateAction<TecnicoContext>>;
  content: string;
  setContent: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const TecnicoFormSection: React.FC<TecnicoFormSectionProps> = ({
  context,
  setContext,
  content,
  setContent,
  onSubmit,
  isLoading,
}) => {
  const [customDisciplina, setCustomDisciplina] = useState("");
  const [parsedPreview, setParsedPreview] = useState<ParsedScopeResult | null>(null);
  const [autoLoadedInfo, setAutoLoadedInfo] = useState<string | null>(null);

  // Lista de disciplinas dinâmicas conforme a turma
  const disciplinasDisponiveis = getDisciplinasByTurma(context.turma);

  // Semanas disponíveis conforme a disciplina selecionada
  const semanasDisponiveis = getSemanasDisponiveis(context.turma, context.disciplina);

  // Detalhes da semana selecionada no JSON
  const weekDetails: CurriculumWeekDetails | null = getWeekDetails(
    context.turma,
    context.disciplina,
    context.semana
  );

  // Função para aplicar os dados automáticos do JSON no formulário
  const handleLoadCurriculumData = useCallback(
    (details: CurriculumWeekDetails) => {
      setContext((prev) => ({
        ...prev,
        bimestre: details.bimestreFormatted,
        qtdAulas: details.qtdAulas,
        usoLaboratorio: details.usoLaboratorio,
      }));

      setContent(details.formattedScope);

      setAutoLoadedInfo(
        `Carregado automaticamente: ${details.lessons.length} aulas da ${context.semana} (${context.disciplina})`
      );
    },
    [context.semana, context.disciplina, setContext, setContent]
  );

  // Ao trocar de turma, reseta disciplina para a primeira da nova lista se não existir nela
  useEffect(() => {
    const disponiveis = getDisciplinasByTurma(context.turma);
    if (!disponiveis.includes(context.disciplina) && disponiveis.length > 0) {
      setContext((prev) => ({ ...prev, disciplina: disponiveis[0] }));
    }
  }, [context.turma, context.disciplina, setContext]);

  // Atualizar preview do parser de texto sempre que o escopo mudar
  useEffect(() => {
    if (content.trim().length > 10) {
      const parsed = parseScopeText(content);
      setParsedPreview(parsed);
    } else {
      setParsedPreview(null);
    }
  }, [content]);

  const handleChange = (
    field: keyof TecnicoContext,
    value: string | number | boolean
  ) => {
    setContext((prev) => ({ ...prev, [field]: value }));
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
      {/* CABEÇALHO */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
              💻
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Educação Profissional Técnico de Desenvolvimento de Sistemas
              </h2>
              <p className="text-sm text-slate-500">
                Plano de Aula Semanal integrado à Matriz Curricular Oficial (JSON / Excel).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ Matriz {context.turma} Carregada ({getCurriculumData(context.turma).length} Aulas)
            </span>
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
              {semanasDisponiveis.map((num) => {
                const padNum = String(num).padStart(2, "0");
                const semVal = `Semana ${padNum}`;
                return (
                  <option key={num} value={semVal}>
                    Semana {padNum}
                  </option>
                );
              })}
            </select>
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

        {/* BANNER DE CARREGAMENTO AUTOMÁTICO DO CURRÍCULO (JSON) */}
        {weekDetails ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 text-blue-900 font-semibold text-sm">
                <span>⚡ Conteúdo da Matriz Curricular Encontrado!</span>
              </div>
              <p className="text-xs text-blue-700 mt-0.5">
                {weekDetails.lessons.length} aulas cadastradas no JSON para {context.disciplina} ({context.semana}).
                Bimestre {weekDetails.bimestreFormatted} • Prática: {weekDetails.usoLaboratorio ? "Sim" : "Não"}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleLoadCurriculumData(weekDetails)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-1 whitespace-nowrap"
            >
              <span>⚡ Preencher Plano Automaticamente</span>
            </button>
          </div>
        ) : context.turma === "3º Técnico" ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <span>ℹ️ O currículo do 3º Técnico ainda não possui o arquivo JSON de matriz carregado. Você pode digitar o escopo manualmente.</span>
          </div>
        ) : null}

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
            {context.usoLaboratorio ? "Sim (Laboratório: Sala de Leitura)" : "Não (Sala Comum)"}
          </button>
        </div>
      </div>

      {/* BLOCO 2: ESCOPO DA SEMANA & TEXTAREA */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-600 pl-3">
            2. Escopo da Semana (Conteúdo Integrado ou Texto Livre)
          </h3>
          {autoLoadedInfo && (
            <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
              ✓ Dados do JSON Carregados
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500">
          O campo abaixo é alimentado automaticamente ao clicar em &quot;Preencher Plano Automaticamente&quot;, ou pode ser editado livremente por você.
        </p>

        <textarea
          rows={9}
          placeholder="Selecione a Semana e clique em 'Preencher Plano Automaticamente' ou cole o conteúdo do curso..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-slate-800 leading-relaxed"
        />

        {/* Extração Automática Detectada pelo Parser */}
        {parsedPreview && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-1.5">
            <div className="font-semibold flex items-center space-x-2 text-emerald-800">
              <span>⚡ Análise em Tempo Real do Conteúdo:</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-emerald-100 px-2 py-0.5 rounded font-medium">
                {parsedPreview.aulas.length} Aulas Identificadas
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
