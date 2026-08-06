/**
 * Gerador de PDF para Ocorrências
 * Cria um documento PDF estruturado com as informações da ocorrência
 */

import { OcorrenciaContext, TecnicoContext } from "./types";

/**
 * Gera um PDF do Planejamento Técnico usando jsPDF + html2canvas
 */
export async function generateTecnicoPDF(
  context: TecnicoContext,
  conteudo: string
): Promise<void> {
  try {
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;

    const element = document.createElement("div");
    element.innerHTML = createTecnicoHtmlContent(context, conteudo);
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.width = "850px";
    element.style.padding = "40px";
    element.style.backgroundColor = "white";
    element.style.fontFamily = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

    document.body.appendChild(element);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(element);

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210; // A4 mm
    const pageHeight = 297; // A4 mm

    // Margens em mm para visualização impecável
    const marginX = 10;
    const marginTop = 15;
    const marginBottom = 15;

    const printableWidth = pageWidth - marginX * 2; // 190 mm
    const printableHeight = pageHeight - marginTop - marginBottom; // 267 mm

    // Proporção px/mm do canvas gerado
    const pxPerMm = canvas.width / printableWidth;
    const sliceHeightPx = Math.floor(printableHeight * pxPerMm);

    let startYPx = 0;
    let pageIndex = 0;

    while (startYPx < canvas.height) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      const currentSlicePx = Math.min(sliceHeightPx, canvas.height - startYPx);
      const currentSliceMm = currentSlicePx / pxPerMm;

      // Criar canvas temporário da página
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = currentSlicePx;

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          startYPx,
          canvas.width,
          currentSlicePx,
          0,
          0,
          canvas.width,
          currentSlicePx
        );
      }

      const pageImgData = pageCanvas.toDataURL("image/png");
      const destY = pageIndex === 0 ? 10 : marginTop;
      pdf.addImage(
        pageImgData,
        "PNG",
        marginX,
        destY,
        printableWidth,
        currentSliceMm
      );

      startYPx += sliceHeightPx;
      pageIndex++;
    }

    // Rodapé institucional com número de páginas
    const totalPages = pageIndex;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `EE MONSENHOR BICUDO • Dev. Sistemas • Página ${i} de ${totalPages}`,
        105,
        289,
        { align: "center" }
      );
    }

    const filename = `PlanoTecnico_${context.disciplina?.replace(/\s+/g, "_") || "DevSistemas"}_${context.semana?.replace(/\s+/g, "_") || "Semana"}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error("Erro ao gerar PDF do Eixo Técnico:", error);
    fallbackTecnicoHtmlDownload(context, conteudo);
  }
}

function fallbackTecnicoHtmlDownload(context: TecnicoContext, conteudo: string): void {
  const htmlContent = createTecnicoHtmlContent(context, conteudo);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `PlanoTecnico_${context.disciplina || "DevSistemas"}_${context.semana || "Semana"}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

function createTecnicoHtmlContent(context: TecnicoContext, conteudo: string): string {
  // Parse sections in parenthesized titles like (APRENDIZAGENS ESSENCIAIS)
  const sections: { title: string; body: string }[] = [];
  const regex = /\(([^)]+)\)\s*([\s\S]*?)(?=\([^)]+\)|$)/g;
  let match;

  while ((match = regex.exec(conteudo)) !== null) {
    sections.push({
      title: match[1].trim(),
      body: match[2].trim(),
    });
  }

  const sectionsHtml =
    sections.length > 0
      ? sections
          .map(
            (sec) => `
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
          <h3 style="font-size: 13px; color: #1e3a8a; background: #eff6ff; padding: 8px 12px; border-left: 4px solid #2563eb; margin-bottom: 6px; text-transform: uppercase; font-weight: bold; border-radius: 4px;">
            ${sec.title}
          </h3>
          <div style="font-size: 13px; color: #334155; line-height: 1.6; white-space: pre-wrap; padding: 0; margin-top: 4px;">
            ${sec.body}
          </div>
        </div>
      `
          )
          .join("")
      : `<div style="font-size: 13px; color: #334155; line-height: 1.6; white-space: pre-wrap; padding: 0;">${conteudo}</div>`;

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Plano de Aula Semanal — Desenvolvimento de Sistemas</title>
    </head>
    <body style="background: white; color: #0f172a; margin: 0; padding: 0;">
      <div style="max-width: 850px; margin: 0 auto; padding: 20px;">
        
        <!-- CABEÇALHO INSTITUCIONAL -->
        <div style="text-align: center; border-bottom: 3px double #1e3a8a; padding-bottom: 12px; margin-bottom: 20px;">
          <h1 style="font-size: 20px; font-weight: 800; color: #1e3a8a; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
            ESCOLA ESTADUAL MONSENHOR BICUDO
          </h1>
          <h2 style="font-size: 14px; font-weight: 600; color: #2563eb; margin: 4px 0 0 0; text-transform: uppercase;">
            EDUCAÇÃO PROFISSIONAL TÉCNICO DE DESENVOLVIMENTO DE SISTEMAS
          </h2>
          <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0; font-weight: bold;">
            PLANO DE AULA SEMANAL
          </p>
        </div>

        <!-- TABELA DE IDENTIFICAÇÃO -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px;">
          <tbody>
            <tr>
              <td style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 8px 12px; font-weight: bold; width: 20%; color: #334155;">PROFESSOR(A):</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; color: #0f172a;" colspan="3">${context.nomeProf || "Não especificado"}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 8px 12px; font-weight: bold; color: #334155;">TURMA / SÉRIE:</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; color: #0f172a;">${context.turma || "-"}</td>
              <td style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 8px 12px; font-weight: bold; width: 20%; color: #334155;">DISCIPLINA:</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; color: #0f172a;">${context.disciplina || "-"}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 8px 12px; font-weight: bold; color: #334155;">BIMESTRE / SEMANA:</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; color: #0f172a;">${context.bimestre || "-"} Bimestre — ${context.semana || "-"}</td>
              <td style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 8px 12px; font-weight: bold; color: #334155;">PERÍODO:</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; color: #0f172a;">${context.dataInicio || "-"} até ${context.dataFim || "-"}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 8px 12px; font-weight: bold; color: #334155;">QTD DE AULAS:</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; color: #0f172a;">${context.qtdAulas || 3} aulas previstas</td>
              <td style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 8px 12px; font-weight: bold; color: #334155;">LABORATÓRIO TÉCNICO:</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 12px; color: #0f172a;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-weight: bold; font-size: 11px; background: ${context.usoLaboratorio ? "#dcfce7" : "#f1f5f9"}; color: ${context.usoLaboratorio ? "#166534" : "#475569"};">
                  ${context.usoLaboratorio ? "SIM (Laboratório: Sala de Leitura)" : "NÃO (Sala Comum)"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- CORPO DO PLANO -->
        <div style="margin-top: 10px;">
          ${sectionsHtml}
        </div>

        <!-- RODAPÉ -->
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: center; font-size: 10px; color: #94a3b8;">
          Plano de Aula Semanal • Educação Profissional Técnico de Desenvolvimento de Sistemas • EE Monsenhor Bicudo
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Gera um PDF da ocorrência usando jsPDF + html2canvas
 */
export async function generateOcorrenciaPDF(
  context: OcorrenciaContext,
  conteudo: string
): Promise<void> {
  try {
    // Importar dinamicamente as bibliotecas
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;

    // Criar elemento temporário com o conteúdo
    const element = document.createElement("div");
    element.innerHTML = createHtmlContent(context, conteudo);
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.width = "800px";
    element.style.padding = "40px";
    element.style.backgroundColor = "white";
    element.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    
    document.body.appendChild(element);

    // Converter para canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Remover elemento temporário
    document.body.removeChild(element);

    // Calcular dimensões para A4
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width em mm
    const pageHeight = 297; // A4 height em mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Criar PDF
    const pdf = new jsPDF("p", "mm", "a4");
    let heightLeft = imgHeight;
    let position = 0;

    // Adicionar primeira página
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Adicionar páginas adicionais se necessário
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Fazer download do PDF
    const filename = `Ocorrencia_${context.data}_${context.nomeProf?.replace(/\s+/g, "_") || "professor"}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    // Fallback para HTML se houver erro
    fallbackHtmlDownload(context, conteudo);
  }
}

/**
 * Fallback para download em HTML caso PDF falhe
 */
function fallbackHtmlDownload(context: OcorrenciaContext, conteudo: string): void {
  const htmlContent = createHtmlContent(context, conteudo);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Ocorrencia_${context.data}_${context.nomeProf?.replace(/\s+/g, "_") || "professor"}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Cria o conteúdo HTML estruturado
 */
function createHtmlContent(context: OcorrenciaContext, conteudo: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Ocorrência</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #059669;
          padding-bottom: 20px;
        }
        
        .header h1 {
          font-size: 28px;
          color: #059669;
          margin-bottom: 10px;
        }
        
        .header p {
          font-size: 12px;
          color: #666;
        }
        
        .info-section {
          margin-bottom: 30px;
          padding: 15px;
          background: #f9fafb;
          border-left: 4px solid #059669;
          border-radius: 4px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .info-label {
          font-weight: bold;
          color: #059669;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        
        .info-value {
          font-size: 14px;
          color: #333;
          padding: 8px;
          background: white;
          border-radius: 3px;
          border: 1px solid #e5e7eb;
        }
        
        .content-section {
          margin-bottom: 30px;
        }
        
        .content-section h2 {
          font-size: 14px;
          color: #059669;
          text-transform: uppercase;
          margin-bottom: 15px;
          border-bottom: 2px solid #059669;
          padding-bottom: 10px;
        }
        
        .content-value {
          font-size: 14px;
          line-height: 1.8;
          color: #333;
          padding: 15px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          text-align: justify;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        
        .footer {
          margin-top: 50px;
          border-top: 2px solid #e5e7eb;
          padding-top: 20px;
          font-size: 11px;
          color: #666;
          text-align: center;
        }
        
        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-right: 8px;
          margin-bottom: 10px;
        }
        
        .badge-tipo {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .badge-gravidade {
          background: #fecaca;
          color: #991b1b;
        }
        
        .badge-gravidade.leve {
          background: #dcfce7;
          color: #166534;
        }
        
        .badge-gravidade.moderada {
          background: #fef08a;
          color: #854d0e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Relatório de Ocorrência Escolar</h1>
          <p>Gerado automaticamente pelo sistema PROFESSORES AI</p>
        </div>
        
        <div class="info-section">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Professor Responsável</span>
              <span class="info-value">${context.nomeProf || "Não especificado"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data da Ocorrência</span>
              <span class="info-value">${formatDate(context.data)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Turno</span>
              <span class="info-value">${capitalizeFirstLetter(context.turno || "Não especificado")}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tipo</span>
              <span class="info-value">${capitalizeFirstLetter(context.tipo || "Não especificado")}</span>
            </div>
          </div>
          
          <div style="margin-top: 15px;">
            <div class="badge badge-tipo">${capitalizeFirstLetter(context.tipo)}</div>
            <div class="badge badge-gravidade ${context.gravidade || 'leve'}">${capitalizeFirstLetter(context.gravidade || "Leve")}</div>
            ${context.encaminhamento ? '<div class="badge" style="background: #ddd6fe; color: #6b21a8;">⚠️ Necessita Encaminhamento</div>' : ''}
          </div>
        </div>
        
        <div class="content-section">
          <h2>Relato Formal da Ocorrência</h2>
          <div class="content-value">${escapeHtml(conteudo)}</div>
        </div>
        
        <div class="footer">
          <p>Este documento foi gerado automaticamente pelo sistema PROFESSORES AI.</p>
          <p>Data de geração: ${new Date().toLocaleString("pt-BR")}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Formata data para o padrão brasileiro
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Capitaliza a primeira letra
 */
function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Escapa HTML para evitar injeção
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}



