"use client";

import React from "react";
import { TecnicoContext } from "@/lib/types";
import {
  getDisciplinasByTurmaEBimestre,
  getSemanasByTurmaBimestreDisciplina,
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
  // Lista de disciplinas disponíveis para a combinação Turma + Bimestre
  const disciplinasDisponiveis = getDisciplinasByTurmaEBimestre(
    context.turma,
    context.bimestre
  );

  // Lista de semanas disponíveis para Turma + Bimestre + Disciplina
  const semanasDisponiveis = getSemanasByTurmaBimestreDisciplina(
    context.turma,
    context.bimestre,
    context.disciplina
  );

  // Detalhes da semana atualmente selecionada
  const weekDetails: CurriculumWeekDetails | null = getWeekDetails(
    context.turma,
    context.disciplina,
    context.semana
  );

  // --- HANDLERS EVENT-DRIVEN PURA PARA EVITAR QUALQUER LOOP DE ESTADO ---

  const handleTurmaSelect = (novaTurma: "2º Técnico" | "3º Técnico") => {
    const disciplinas = getDisciplinasByTurmaEBimestre(novaTurma, context.bimestre);
    const primDisciplina = disciplinas[0] || "";
    const semanas = getSemanasByTurmaBimestreDisciplina(
      novaTurma,
      context.bimestre,
      primDisciplina
    );
    const primSemana = semanas[0]
      ? `Semana ${String(semanas[0]).padStart(2, "0")}`
      : "";

    const details = getWeekDetails(novaTurma, primDisciplina, primSemana);

    setContext((prev) => ({
      ...prev,
      turma: novaTurma,
      disciplina: primDisciplina,
      semana: primSemana,
      qtdAulas: details ? details.qtdAulas : 4,
    }));

    setContent(details ? details.formattedScope : "");
  };

  const handleBimestreSelect = (novoBimestre: "1º" | "2º" | "3º" | "4º") => {
    const disciplinas = getDisciplinasByTurmaEBimestre(context.turma, novoBimestre);
    const primDisciplina = disciplinas.includes(context.disciplina)
      ? context.disciplina
      : disciplinas[0] || "";

    const semanas = getSemanasByTurmaBimestreDisciplina(
      context.turma,
      novoBimestre,
      primDisciplina
    );
    const primSemana = semanas[0]
      ? `Semana ${String(semanas[0]).padStart(2, "0")}`
      : "";

    const details = getWeekDetails(context.turma, primDisciplina, primSemana);

    setContext((prev) => ({
      ...prev,
      bimestre: novoBimestre,
      disciplina: primDisciplina,
      semana: primSemana,
      qtdAulas: details ? details.qtdAulas : 4,
    }));

    setContent(details ? details.formattedScope : "");
  };

  const handleDisciplinaSelect = (novaDisciplina: string) => {
    const semanas = getSemanasByTurmaBimestreDisciplina(
      context.turma,
      context.bimestre,
      novaDisciplina
    );
    const primSemana = semanas[0]
      ? `Semana ${String(semanas[0]).padStart(2, "0")}`
      : "";

    const details = getWeekDetails(context.turma, novaDisciplina, primSemana);

    setContext((prev) => ({
      ...prev,
      disciplina: novaDisciplina,
      semana: primSemana,
      qtdAulas: details ? details.qtdAulas : 4,
    }));

    setContent(details ? details.formattedScope : "");
  };

  const handleSemanaSelect = (novaSemana: string) => {
    const details = getWeekDetails(context.turma, context.disciplina, novaSemana);

    setContext((prev) => ({
      ...prev,
      semana: novaSemana,
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
                Selecione passo a passo as opções para carregar a matriz oficial.
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

      {/* PASSO A PASSO DE FILTROS DA MATRIZ CURRICULAR */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-600 pl-3">
          1. Filtros Guiados da Matriz Curricular
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Passo 1: Turma / Série */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Passo 1: Turma / Série <span className="text-red-500">*</span>
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
              Passo 2: Bimestre <span className="text-red-500">*</span>
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
              Passo 3: Componente Curricular / Disciplina <span className="text-red-500">*</span>
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

          {/* Passo 4: Identificação da Semana */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Passo 4: Identificação da Semana <span className="text-red-500">*</span>
            </label>
            <select
              value={context.semana}
              onChange={(e) => handleSemanaSelect(e.target.value)}
              disabled={semanasDisponiveis.length === 0}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800 bg-white font-medium text-sm shadow-sm disabled:bg-slate-100 disabled:text-slate-400"
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
        </div>
      </div>

      {/* CARD DE VISUALIZAÇÃO INTERATIVA DA MATRIZ CURRICULAR */}
      {weekDetails && weekDetails.lessons.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-blue-600">
                Matriz Curricular Selecionada ({context.turma} • {context.bimestre} Bimestre)
              </span>
              <h4 className="text-lg font-bold text-slate-800">
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
              Aulas Mapeadas para a {context.semana}:
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

      {/* BLOCO 2: INFORMAÇÕES DO PROFESSOR, USO DE LABORATÓRIO E DATAS */}
      <div className="space-y-6 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-600 pl-3">
          2. Opções Pedagógicas & Dados do Professor
        </h3>

        {/* USO DE LABORATÓRIO / SALA DE AULA - OPÇÃO EXCLUSIVA DO PROFESSOR */}
        <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-slate-800 text-sm flex items-center space-x-1.5">
              <span>🖥️ Ambientes Didáticos (Uso de Laboratório de TI)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecione se as atividades desta semana necessitam de computadores/laboratório ou se serão ministradas em sala de aula comum.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleFieldChange("usoLaboratorio", !context.usoLaboratorio)}
            className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition shadow-sm whitespace-nowrap ${
              context.usoLaboratorio
                ? "bg-green-600 text-white shadow-green-600/20"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {context.usoLaboratorio
              ? "✓ Sim (Laboratório / Sala de Leitura)"
              : "✕ Não (Sala de Aula Comum)"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Nome do Professor */}
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

          {/* Período: Data Início */}
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

          {/* Período: Data Fim */}
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
