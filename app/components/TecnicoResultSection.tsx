"use client";

import React, { useState, useEffect } from "react";
import { TecnicoContext } from "@/lib/types";
import { generateTecnicoPDF } from "@/lib/pdf-generator";

interface TecnicoResultSectionProps {
  context: TecnicoContext;
  resultText: string;
  onReset: () => void;
}

interface SectionBlock {
  title: string;
  body: string;
}

export const TecnicoResultSection: React.FC<TecnicoResultSectionProps> = ({
  context,
  resultText,
  onReset,
}) => {
  const [sections, setSections] = useState<SectionBlock[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Extrair seções entre parênteses ex: (APRENDIZAGENS ESSENCIAIS)
  useEffect(() => {
    const parsedSections: SectionBlock[] = [];
    const regex = /\(([^)]+)\)\s*([\s\S]*?)(?=\([^)]+\)|$)/g;
    let match;

    while ((match = regex.exec(resultText)) !== null) {
      parsedSections.push({
        title: match[1].trim(),
        body: match[2].trim(),
      });
    }

    if (parsedSections.length > 0) {
      setSections(parsedSections);
    } else {
      setSections([{ title: "PLANO DE AULA SEMANAL", body: resultText }]);
    }
  }, [resultText]);

  const handleSectionBodyChange = (index: number, newBody: string) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], body: newBody };
      return updated;
    });
  };

  // Reconstituir o texto completo para exportar
  const getCompiledText = (): string => {
    return sections
      .map((sec) => `(${sec.title})\n${sec.body}`)
      .join("\n\n");
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const compiled = getCompiledText();
      await generateTecnicoPDF(context, compiled);
    } catch (err) {
      console.error("Erro ao exportar PDF:", err);
      alert("Houve um problema ao gerar o PDF. Tentando download em HTML.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100">
      {/* CABEÇALHO DE RESULTADO E METADADOS */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-blue-400">
              EE Monsenhor Bicudo — EPT
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Plano de Aula Semanal do Eixo Técnico
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onReset}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              ← Novo Plano
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5"
            >
              {isExporting ? (
                <span>Gerando PDF...</span>
              ) : (
                <>
                  <span>📄 Gerar e Baixar PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* METADADOS DA TURMA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-300 pt-2">
          <div>
            <span className="text-slate-400 block">Professor(a):</span>
            <strong className="text-white">{context.nomeProf || "-"}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Turma & Disciplina:</span>
            <strong className="text-white">
              {context.turma} • {context.disciplina}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">Bimestre / Semana:</span>
            <strong className="text-white">
              {context.bimestre} Bim. — {context.semana}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">Laboratório TI:</span>
            <strong
              className={
                context.usoLaboratorio ? "text-emerald-400" : "text-amber-400"
              }
            >
              {context.usoLaboratorio ? "Sim (Lab Prático)" : "Não (Sala Comum)"}
            </strong>
          </div>
        </div>
      </div>

      {/* AVISO DE EDIÇÃO */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 flex items-center justify-between">
        <span>
          ✏️ <strong>Editor Interativo:</strong> Você pode ajustar ou editar o texto das 10 seções abaixo diretamente antes de exportar o PDF.
        </span>
      </div>

      {/* SEÇÕES EDITÁVEIS */}
      <div className="space-y-5">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50/50"
          >
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-blue-900">
                {sec.title}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Seção {idx + 1} de {sections.length}
              </span>
            </div>
            <div className="p-3 bg-white">
              <textarea
                rows={Math.max(3, sec.body.split("\n").length + 1)}
                value={sec.body}
                onChange={(e) => handleSectionBodyChange(idx, e.target.value)}
                className="w-full p-2 text-sm text-slate-800 bg-transparent border-0 focus:ring-0 focus:outline-none font-sans leading-relaxed resize-y"
              />
            </div>
          </div>
        ))}
      </div>

      {/* BOTÃO FINAL DE EXPORTAÇÃO */}
      <div className="pt-4 flex justify-between items-center border-t border-slate-100">
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition"
        >
          Criar Outro Plano
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/25 transition flex items-center space-x-2"
        >
          <span>📥 Baixar PDF Institucional Oficial</span>
        </button>
      </div>
    </div>
  );
};
