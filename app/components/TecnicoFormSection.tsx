"use client";

import React, { useEffect, useCallback } from "react";
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
  // Lista de disciplinas dinâmicas filtradas por Turma e Bimestre
  const disciplinasDisponiveis = getDisciplinasByTurmaEBimestre(
    context.turma,
    context.bimestre
  );

  // Lista de semanas disponíveis para a combinação Turma + Bimestre + Disciplina
  const semanasDisponiveis = getSemanasByTurmaBimestreDisciplina(
    context.turma,
    context.bimestre,
    context.disciplina
  );

  // Buscar detalhes das aulas da semana selecionada no banco de dados JSON
  const weekDetails: CurriculumWeekDetails | null = getWeekDetails(
    context.turma,
    context.disciplina,
    context.semana
  );

  // Efeito para sincronizar os dados da semana no contexto e no conteúdo automaticamente
  const updateFormFromCurriculum = useCallback(() => {
    if (weekDetails) {
      setContext((prev) => {
        // Apenas atualiza se os valores diferirem para evitar rerenders infinitos
        if (
          prev.qtdAulas === weekDetails.qtdAulas &&
          prev.usoLaboratorio === weekDetails.usoLaboratorio &&
          prev.bimestre === weekDetails.bimestreFormatted
        ) {
          return prev;
        }
        return {
          ...prev,
          bimestre: weekDetails.bimestreFormatted,
          qtdAulas: weekDetails.qtdAulas,
          usoLaboratorio: weekDetails.usoLaboratorio,
        };
      });

      if (content !== weekDetails.formattedScope) {
        setContent(weekDetails.formattedScope);
      }
    }
  }, [weekDetails, content, setContent, setContext]);

  // Executa o preenchimento automático sempre que a semana selecionada mudar
  useEffect(() => {
    updateFormFromCurriculum();
  }, [updateFormFromCurriculum]);

  // Validação do seletor de disciplinas ao mudar de Turma ou Bimestre
  useEffect(() => {
    const disponiveis = getDisciplinasByTurmaEBimestre(
      context.turma,
      context.bimestre
    );
    if (!disponiveis.includes(context.disciplina) && disponiveis.length > 0) {
      setContext((prev) => ({ ...prev, disciplina: disponiveis[0] }));
    }
  }, [context.turma, context.bimestre, context.disciplina, setContext]);

  // Validação do seletor de semanas ao mudar a disciplina
  useEffect(() => {
    const semanas = getSemanasByTurmaBimestreDisciplina(
      context.turma,
      context.bimestre,
      context.disciplina
    );
    if (semanas.length > 0) {
      const padFirst = `Semana ${String(semanas[0]).padStart(2, "0")}`;
      const semanaMatch = context.semana.match(/\d+/);
      const semanaNum = semanaMatch ? parseInt(semanaMatch[0], 10) : null;
      if (semanaNum === null || !semanas.includes(semanaNum)) {
        setContext((prev) => ({ ...prev, semana: padFirst }));
      }
    }
  }, [context.turma, context.bimestre, context.disciplina, context.semana, setContext]);

  const handleChange = (
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
                Filtre os dados oficiais do currículo para gerar o Plano de Aula Semanal.
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

      {/* BLOCO 1: FILTROS DA MATRIZ CURRICULAR (EXCEL / JSON) */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-600 pl-3">
          1. Seleção e Filtros da Matriz Curricular
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          {/* Bimestre */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bimestre <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["1º", "2º", "3º", "4º"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() =>
                    handleChange("bimestre", b as TecnicoContext["bimestre"])
                  }
                  className={`py-2.5 px-2 rounded-lg font-medium text-sm border transition flex items-center justify-center ${
                    context.bimestre === b
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm font-bold"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{b} Bim</span>
                </button>
              ))}
            </div>
          </div>

          {/* Componente Curricular / Disciplina */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Componente Curricular / Disciplina <span className="text-red-500">*</span>
            </label>
            <select
              value={context.disciplina}
              onChange={(e) => handleChange("disciplina", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800 bg-white"
            >
              {disciplinasDisponiveis.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
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
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-800 bg-white"
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

      {/* CARD DE VISUALIZAÇÃO DOS DADOS DA SEMANA CARREGADOS DA MATRIZ */}
      {weekDetails && weekDetails.lessons.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-blue-600">
                Matriz Curricular Carregada ({context.turma} • {context.bimestre} Bimestre)
              </span>
              <h4 className="text-lg font-bold text-slate-800">
                📌 {weekDetails.lessons[0].tema_semana}
              </h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-md bg-blue-100 text-blue-800">
                {weekDetails.qtdAulas} Aulas na Semana
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-md ${
                  weekDetails.usoLaboratorio
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {weekDetails.usoLaboratorio ? "Prática (Laboratório)" : "Teórica"}
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

          {/* LISTA DAS AULAS */}
          <div className="space-y-2 pt-2">
            <span className="font-bold text-xs text-slate-800 block">
              Aulas da Semana:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {weekDetails.lessons.map((aula, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800">
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
                  <p className="text-slate-500 text-[11px] line-clamp-2">
                    {aula.objetivo_aula}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BLOCO 2: INFORMAÇÕES DO PROFESSOR & PERÍODO */}
      <div className="space-y-6 pt-4 border-t border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-600 pl-3">
          2. Dados do Professor & Período Letivo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

          {/* Período: Data Início */}
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

          {/* Período: Data Fim */}
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
              Detectado automaticamente da matriz da semana ({context.usoLaboratorio ? "Aulas práticas inclusas" : "Aulas teóricas"}).
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
