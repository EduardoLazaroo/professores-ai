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
    <div className="w-full max-w-4xl mx-auto space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100">
      {/* CABEÇALHO DA SEÇÃO */}
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
                Planejamento Semanal com vinculação da Matriz Curricular (MATERIAL X/Y) e Calendário Escolar.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ Matriz {context.turma} ({getCurriculumData(context.turma).length} Aulas)
            </span>
          </div>
        </div>
      </div>

      {/* BLOCO 1: SELEÇÃO DA MATRIZ CURRICULAR (DISCIPLINA + MATERIAL X/Y) */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-600 pl-3">
          1. Filtro da Matriz Curricular (Conteúdo & Sequência Didática)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Passo 1: Turma / Série */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Turma / Série <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["2º Técnico", "3º Técnico"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTurmaSelect(t)}
                  className={`py-2.5 px-4 rounded-xl font-semibold text-sm border transition flex items-center justify-center space-x-2 ${
                    context.turma === t
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Passo 2: Bimestre */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Bimestre <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["1º", "2º", "3º", "4º"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleBimestreSelect(b)}
                  className={`py-2.5 px-2 rounded-xl font-semibold text-sm border transition flex items-center justify-center ${
                    context.bimestre === b
                      ? "bg-blue-600 text-white border-blue-600 shadow-md font-bold"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{b} Bim</span>
                </button>
              ))}
            </div>
          </div>

          {/* Passo 3: Componente Curricular / Disciplina */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Componente Curricular / Disciplina <span className="text-red-500">*</span>
            </label>
            <select
              value={context.disciplina}
              onChange={(e) => handleDisciplinaSelect(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800 bg-white font-medium text-sm shadow-sm"
            >
              {disciplinasDisponiveis.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Passo 4: Seleção do Material Curricular (MATERIAL X/Y) */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Material Escopo / Sequência Didática <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMaterialSemana}
              onChange={(e) => handleMaterialSelect(parseInt(e.target.value, 10))}
              disabled={materialOptions.length === 0}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800 bg-white font-medium text-sm shadow-sm disabled:bg-slate-100 disabled:text-slate-400"
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
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-blue-600 flex items-center space-x-2">
                <span>Matriz Curricular • {weekDetails.materialLabel}</span>
              </span>
              <h4 className="text-lg font-bold text-slate-800 mt-0.5">
                📌 {weekDetails.lessons[0].tema_semana}
              </h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-200">
                {weekDetails.qtdAulas} Aulas na Semana
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div>
              <span className="font-bold block text-slate-800">Unidade Curricular:</span>
              <span>
                {weekDetails.lessons[0].unidade_curricular} ({weekDetails.lessons[0].codigo_unidade})
              </span>
            </div>
            <div>
              <span className="font-bold block text-slate-800">Competência Técnica:</span>
              <span className="line-clamp-2">
                {weekDetails.lessons[0].competencia_tecnica}
              </span>
            </div>
          </div>

          {/* LISTA DAS AULAS DA SEMANA */}
          <div className="space-y-2 pt-2">
            <span className="font-bold text-xs text-slate-800 block">
              Conteúdo da Sequência Didática ({weekDetails.materialLabel}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weekDetails.lessons.map((aula, i) => (
                <div
                  key={i}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="truncate">{aula.titulo_aula}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-bold ${
                        aula.ch_tp === "P"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
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

      {/* BLOCO 2: DATAS, SEMANA LETIVA ESCOLAR (1 a 40) E OPÇÕES DO PROFESSOR */}
      <div className="space-y-6 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-600 pl-3">
          2. Calendário Escolar (Semana 1 a 40) & Dados do Professor
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Identificação da Semana Letiva Escolar (Item b: dropdown/input de 1 a 40, padrão 20) */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Semana Letiva da Escola (1 a 40) <span className="text-red-500">*</span>
            </label>
            <select
              value={context.semana}
              onChange={(e) => handleFieldChange("semana", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800 bg-white font-medium text-sm shadow-sm"
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

          {/* Item a: Data de Início (próximos 3 dias) */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Data de Início da Semana
            </label>
            <input
              type="text"
              placeholder="DD/MM/AAAA"
              value={context.dataInicio}
              onChange={(e) => handleFieldChange("dataInicio", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm shadow-sm"
            />
          </div>

          {/* Item a: Data de Término (próximos 7 dias) */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Data de Fim da Semana
            </label>
            <input
              type="text"
              placeholder="DD/MM/AAAA"
              value={context.dataFim}
              onChange={(e) => handleFieldChange("dataFim", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Nome do Professor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Nome do Professor(a) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Prof. Eduardo Lazaroo"
              value={context.nomeProf}
              onChange={(e) => handleFieldChange("nomeProf", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800 text-sm shadow-sm"
            />
          </div>

          {/* USO DE LABORATÓRIO / SALA DE AULA - OPÇÃO EXCLUSIVA DO PROFESSOR */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-800 text-xs">
                🖥️ Uso de Laboratório de TI
              </h4>
              <p className="text-[11px] text-slate-500">
                Opção do professor para o local da aula.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleFieldChange("usoLaboratorio", !context.usoLaboratorio)}
              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition shadow-sm whitespace-nowrap ${
                context.usoLaboratorio
                  ? "bg-green-600 text-white shadow-green-600/20"
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
          className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center space-x-2 ${
            isLoading || !context.nomeProf.trim() || !weekDetails
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
