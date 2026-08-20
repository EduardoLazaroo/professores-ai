"use client";

import React, { useState, useEffect } from "react";
import { TecnicoContext } from "@/lib/types";
import {
  getDisciplinasByTurmaEBimestre,
  getMaterialOptionsByBimestre,
  getWeekDetails,
  getCurriculumData,
  CurriculumWeekDetails,
  MaterialOption,
} from "@/lib/curriculumLoader";

interface TecnicoFormSectionProps {
  context: TecnicoContext;
  setContext: React.Dispatch<React.SetStateAction<TecnicoContext>>;
  content: string;
  setContent: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

// Helpers para conversão de datas (DD/MM/AAAA <-> YYYY-MM-DD para input date)
const toISOFormat = (dateStr: string): string => {
  if (!dateStr) return "";
  if (dateStr.includes("-")) return dateStr;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return dateStr;
};

const toDisplayFormat = (isoStr: string): string => {
  if (!isoStr) return "";
  if (isoStr.includes("/")) return isoStr;
  const parts = isoStr.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  return isoStr;
};

export const TecnicoFormSection: React.FC<TecnicoFormSectionProps> = ({
  context,
  setContext,
  content,
  setContent,
  onSubmit,
  isLoading,
}) => {
  // Estado local para a Semana do Material Curricular selecionada (ex: 18)
  const [selectedMaterialSemana, setSelectedMaterialSemana] = useState<number>(18);

  // Lista de disciplinas filtradas por Turma e Bimestre
  const disciplinasDisponiveis = getDisciplinasByTurmaEBimestre(
    context.turma,
    context.bimestre
  );

  // Lista de opções de Material Curricular (ex: MATERIAL 18/28 — Tema...)
  const materialOptions: MaterialOption[] = getMaterialOptionsByBimestre(
    context.turma,
    context.bimestre,
    context.disciplina
  );

  // Detalhes da semana do material selecionada
  const weekDetails: CurriculumWeekDetails | null = getWeekDetails(
    context.turma,
    context.disciplina,
    selectedMaterialSemana
  );

  // Inicialização e sincronização inicial do escopo do material
  useEffect(() => {
    if (materialOptions.length > 0) {
      const existe = materialOptions.some((m) => m.semanaNum === selectedMaterialSemana);
      if (!existe) {
        const prim = materialOptions[0].semanaNum;
        setSelectedMaterialSemana(prim);
        const details = getWeekDetails(context.turma, context.disciplina, prim);
        if (details) {
          setContent(details.formattedScope);
          setContext((prev) => ({ ...prev, qtdAulas: details.qtdAulas }));
        }
      } else if (!content && weekDetails) {
        setContent(weekDetails.formattedScope);
        setContext((prev) => ({ ...prev, qtdAulas: weekDetails.qtdAulas }));
      }
    }
  }, [context.turma, context.bimestre, context.disciplina, materialOptions, selectedMaterialSemana, content, weekDetails, setContent, setContext]);

  // --- HANDLERS EVENT-DRIVEN LIMPOS ---

  const handleTurmaSelect = (novaTurma: "2º Técnico" | "3º Técnico") => {
    const disciplinas = getDisciplinasByTurmaEBimestre(novaTurma, context.bimestre);
    const primDisciplina = disciplinas[0] || "";
    const materiais = getMaterialOptionsByBimestre(novaTurma, context.bimestre, primDisciplina);
    const primMatSemana = materiais[0] ? materiais[0].semanaNum : 1;

    const details = getWeekDetails(novaTurma, primDisciplina, primMatSemana);
    setSelectedMaterialSemana(primMatSemana);

    setContext((prev) => ({
      ...prev,
      turma: novaTurma,
      disciplina: primDisciplina,
      qtdAulas: details ? details.qtdAulas : 4,
    }));

    setContent(details ? details.formattedScope : "");
  };

  const handleBimestreSelect = (novoBimestre: "1º" | "2º" | "3º" | "4º") => {
    const disciplinas = getDisciplinasByTurmaEBimestre(context.turma, novoBimestre);
    const primDisciplina = disciplinas.includes(context.disciplina)
      ? context.disciplina
      : disciplinas[0] || "";

    const materiais = getMaterialOptionsByBimestre(context.turma, novoBimestre, primDisciplina);
    const primMatSemana = materiais[0] ? materiais[0].semanaNum : 1;

    const details = getWeekDetails(context.turma, primDisciplina, primMatSemana);
    setSelectedMaterialSemana(primMatSemana);

    setContext((prev) => ({
      ...prev,
      bimestre: novoBimestre,
      disciplina: primDisciplina,
      qtdAulas: details ? details.qtdAulas : 4,
    }));

    setContent(details ? details.formattedScope : "");
  };

  const handleDisciplinaSelect = (novaDisciplina: string) => {
    const materiais = getMaterialOptionsByBimestre(context.turma, context.bimestre, novaDisciplina);
    const primMatSemana = materiais[0] ? materiais[0].semanaNum : 1;

    const details = getWeekDetails(context.turma, novaDisciplina, primMatSemana);
    setSelectedMaterialSemana(primMatSemana);

    setContext((prev) => ({
      ...prev,
      disciplina: novaDisciplina,
      qtdAulas: details ? details.qtdAulas : 4,
    }));

    setContent(details ? details.formattedScope : "");
  };

  const handleMaterialSelect = (semanaNum: number) => {
    setSelectedMaterialSemana(semanaNum);
    const details = getWeekDetails(context.turma, context.disciplina, semanaNum);

    setContext((prev) => ({
      ...prev,
      qtdAulas: details ? details.qtdAulas : 4,
    }));

    setContent(details ? details.formattedScope : "");
  };

  const handleFieldChange = (
    field: keyof TecnicoContext,
    value: string | number | boolean
  ) => {
    setContext((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100/80 transition-all duration-300">
      {/* CABEÇALHO DA SEÇÃO */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/25">
              💻
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                Educação Profissional Técnico em Dev. de Sistemas
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Gere o Plano de Aula Semanal integrado à Matriz Curricular Oficial (PAS 2026).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Matriz {context.turma} ({getCurriculumData(context.turma).length} Aulas)</span>
            </span>
          </div>
        </div>
      </div>

      {/* BLOCO 1: PASSO A PASSO DE FILTROS DA MATRIZ CURRICULAR */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-l-4 border-indigo-600 pl-3">
          <h3 className="text-base md:text-lg font-bold text-slate-800">
            1. Filtros da Matriz Curricular (Conteúdo & Sequência Didática)
          </h3>
        </div>

        {/* LINHA 1: TURMA E BIMESTRE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Passo 1: Turma / Série */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Passo 1: Turma / Série <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["2º Técnico", "3º Técnico"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTurmaSelect(t)}
                  className={`py-3 px-4 rounded-2xl font-bold text-sm border transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${
                    context.turma === t
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.01]"
                      : "bg-slate-50/80 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Passo 2: Bimestre */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Passo 2: Bimestre <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["1º", "2º", "3º", "4º"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleBimestreSelect(b)}
                  className={`py-3 px-2 rounded-2xl font-bold text-sm border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                    context.bimestre === b
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.01]"
                      : "bg-slate-50/80 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <span>{b} Bim</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LINHA 2: PROPORÇÃO EXATA (40% COMPONENTE / 60% MATERIAL ESCOPO) */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Componente Curricular / Disciplina (40%) */}
          <div className="w-full md:w-[40%] space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 truncate">
              Passo 3: Componente Curricular / Disciplina <span className="text-red-500">*</span>
            </label>
            <select
              value={context.disciplina}
              onChange={(e) => handleDisciplinaSelect(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50 font-semibold text-xs md:text-sm shadow-sm truncate cursor-pointer hover:bg-white"
            >
              {disciplinasDisponiveis.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Material Escopo / Sequência Didática (60%) */}
          <div className="w-full md:w-[60%] space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 truncate">
              Passo 4: Material Escopo / Sequência Didática <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMaterialSemana}
              onChange={(e) => handleMaterialSelect(parseInt(e.target.value, 10))}
              disabled={materialOptions.length === 0}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50 font-semibold text-xs md:text-sm shadow-sm disabled:bg-slate-100 disabled:text-slate-400 truncate cursor-pointer hover:bg-white"
            >
              {materialOptions.map((opt) => (
                <option key={opt.semanaNum} value={opt.semanaNum}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CARD DE VISUALIZAÇÃO INTERATIVA DA MATRIZ CURRICULAR */}
      {weekDetails && weekDetails.lessons.length > 0 && (
        <div className="bg-gradient-to-b from-slate-50 to-indigo-50/30 border border-slate-200/90 rounded-3xl p-5 md:p-6 space-y-4 shadow-sm border-t-4 border-t-indigo-600 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-md inline-block mb-1">
                {context.turma} • {context.bimestre} Bimestre • {weekDetails.materialLabel}
              </span>
              <h4 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                📌 {weekDetails.lessons[0].tema_semana}
              </h4>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-indigo-900 border border-slate-200 shadow-sm">
                {weekDetails.qtdAulas} Aulas na Semana
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="font-bold block text-slate-900 text-xs mb-0.5">Unidade Curricular:</span>
              <span className="text-slate-600 font-medium">
                {weekDetails.lessons[0].unidade_curricular} ({weekDetails.lessons[0].codigo_unidade})
              </span>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="font-bold block text-slate-900 text-xs mb-0.5">Competência Técnica:</span>
              <span className="text-slate-600 font-medium line-clamp-2 leading-relaxed">
                {weekDetails.lessons[0].competencia_tecnica}
              </span>
            </div>
          </div>

          {/* LISTA DAS AULAS DA SEMANA */}
          <div className="space-y-2.5 pt-1">
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider block">
              Conteúdo Mapeado ({weekDetails.materialLabel}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weekDetails.lessons.map((aula, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 text-xs space-y-2 shadow-sm hover:border-indigo-300 transition-all duration-200"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 gap-2">
                    <span className="truncate">{aula.titulo_aula}</span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider font-extrabold shrink-0 ${
                        aula.ch_tp === "P"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {aula.ch_tp === "P" ? "Prática" : "Teórica"}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {aula.objetivo_aula}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BLOCO 2: DATAS (CALENDÁRIO), SEMANA ESCOLAR (1 a 40) E OPÇÕES DO PROFESSOR */}
      <div className="space-y-6 pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-2 border-l-4 border-indigo-600 pl-3">
          <h3 className="text-base md:text-lg font-bold text-slate-800">
            2. Calendário Escolar (1 a 40) & Opções do Professor
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Semana Letiva da Escola (Item b: 1 a 40, padrão 20) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Semana Letiva da Escola (1 a 40) <span className="text-red-500">*</span>
            </label>
            <select
              value={context.semana}
              onChange={(e) => handleFieldChange("semana", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50 font-semibold text-sm shadow-sm cursor-pointer hover:bg-white"
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

          {/* Item a: Data de Início da Semana (INPUT FORMATO CALENDÁRIO) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Data de Início da Semana <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={toISOFormat(context.dataInicio)}
              onChange={(e) =>
                handleFieldChange("dataInicio", toDisplayFormat(e.target.value))
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50 font-semibold text-sm shadow-sm cursor-pointer hover:bg-white"
            />
          </div>

          {/* Item a: Data de Fim da Semana (INPUT FORMATO CALENDÁRIO) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Data de Fim da Semana <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={toISOFormat(context.dataFim)}
              onChange={(e) =>
                handleFieldChange("dataFim", toDisplayFormat(e.target.value))
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50 font-semibold text-sm shadow-sm cursor-pointer hover:bg-white"
            />
          </div>
        </div>

        {/* Nome do Professor e Uso de Laboratório */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Nome do Professor(a) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Prof. Eduardo Lazaroo"
              value={context.nomeProf}
              onChange={(e) => handleFieldChange("nomeProf", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50 font-semibold text-sm shadow-sm hover:bg-white"
            />
          </div>

          {/* USO DE LABORATÓRIO / SALA DE AULA - OPÇÃO EXCLUSIVA DO PROFESSOR */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/90 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                <span>🖥️ Uso de Laboratório de TI</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Opção do professor para a semana.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleFieldChange("usoLaboratorio", !context.usoLaboratorio)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap ${
                context.usoLaboratorio
                  ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {context.usoLaboratorio
                ? "Sim (Laboratório)"
                : "Não (Sala Comum)"}
            </button>
          </div>
        </div>
      </div>

      {/* BOTÃO DE AÇÃO DE GERAÇÃO */}
      <div className="pt-4 flex justify-end border-t border-slate-100">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !context.nomeProf.trim() || !weekDetails}
          className={`w-full md:w-auto px-10 py-4 rounded-2xl font-extrabold text-white shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 text-base cursor-pointer ${
            isLoading || !context.nomeProf.trim() || !weekDetails
              ? "bg-slate-300 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] shadow-indigo-500/25"
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
