/**
 * Gerador de PDF para Ocorrências e Planejamento Técnico
 * Atualizado para seguir a matriz oficial do PAS_MODELO_2026 em orientação Paisagem (Landscape)
 */

import { OcorrenciaContext, TecnicoContext } from "./types";
import { formatExportFilename } from "./filename-utils";
import { IMAGE_BRASAO_GOVERNO_B64, IMAGE_LOGO_ESCOLA_B64 } from "./templateImages";

/**
 * Gera um PDF do Planejamento Técnico usando jsPDF + html2canvas em formato Paisagem (Landscape)
 * Seguindo 100% o modelo institucional PAS_MODELO_2026 (EE Monsenhor Bicudo)
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
    element.style.width = "1100px"; // Largura adequada para Landscape A4
    element.style.padding = "20px";
    element.style.backgroundColor = "white";
    element.style.fontFamily = "Arial, sans-serif";

    document.body.appendChild(element);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(element);

    // --- CONFIGURAÇÃO A4 PAISAGEM (LANDSCAPE) ---
    const pdf = new jsPDF("l", "mm", "a4"); // 'l' = Landscape (297mm x 210mm)
    const pageWidth = 297; // A4 Paisagem mm
    const pageHeight = 210; // A4 Paisagem mm

    // Margens em mm
    const marginX = 10;
    const marginTop = 10;
    const marginBottom = 10;

    const printableWidth = pageWidth - marginX * 2; // 277 mm
    const printableHeight = pageHeight - marginTop - marginBottom; // 190 mm

    // Proporção px/mm
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
      const destY = pageIndex === 0 ? 8 : marginTop;
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

    // Rodapé limpo e discreto
    const totalPages = pageIndex;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `EE MONSENHOR BICUDO • Ensino Técnico em Dev. Sistemas • Página ${i} de ${totalPages}`,
        148.5,
        204,
        { align: "center" }
      );
    }

    const filename = formatExportFilename(context.disciplina, context.semana, "pdf");
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
  link.download = formatExportFilename(context.disciplina, context.semana, "html");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Constrói o HTML da Matriz Oficial em Estilo Tabela Contínua (PAS_MODELO_2026)
 */
function createTecnicoHtmlContent(context: TecnicoContext, conteudo: string): string {
  // Extrair seções entre parênteses
  const sections: { title: string; body: string }[] = [];
  const regex = /\(([^)]+)\)\s*([\s\S]*?)(?=\([^)]+\)|$)/g;
  let match;

  while ((match = regex.exec(conteudo)) !== null) {
    sections.push({
      title: match[1].trim(),
      body: match[2].trim(),
    });
  }

  const defaultTitles = [
    "APRENDIZAGENS ESSENCIAIS (AE)",
    "HABILIDADE PRIORIZADA/ HABILIDADES RELACIONADAS",
    "CONTEÚDOS/ DESCRITORES",
    "MATERIAL DIGITAL",
    "OBJETIVOS ESPECÍFICOS",
    "ESTRATÉGIAS/ PROCEDIMENTOS PARA O DESENVOLVIMENTO DOS OBJETIVOS PROPOSTOS (PARA CADA AULA)",
    "RECURSOS/FERRAMENTAS",
    "AVALIAÇÃO",
    "OBSERVAÇÕES",
    "REFERÊNCIAS BIBLIOGRÁFICAS",
  ];

  const mapSections = new Map<string, string>();
  sections.forEach((sec) => {
    mapSections.set(sec.title.toUpperCase(), sec.body);
  });

  const matrixRowsHtml = defaultTitles
    .map((title) => {
      let bodyText = "";
      for (const [k, v] of mapSections.entries()) {
        if (k.includes(title.substring(0, 10)) || title.includes(k.substring(0, 10))) {
          bodyText = v;
          break;
        }
      }

      if (!bodyText) {
        const found = sections.find(
          (s) =>
            s.title.toUpperCase().includes(title.substring(0, 8)) ||
            title.toUpperCase().includes(s.title.substring(0, 8))
        );
        bodyText = found ? found.body : "";
      }

      return `
      <tr style="page-break-inside: avoid; break-inside: avoid;">
        <td colspan="2" style="background: #d9e2f3; padding: 7px 10px; border: 1px solid #475569; font-weight: bold; font-size: 11px; color: #0f172a; text-transform: uppercase;">
          ${title}
        </td>
      </tr>
      <tr style="page-break-inside: avoid; break-inside: avoid;">
        <td colspan="2" style="padding: 9px 12px; border: 1px solid #475569; font-size: 11px; color: #1e293b; line-height: 1.6; white-space: pre-wrap; margin: 0; background: #ffffff;">${bodyText || "-"}</td>
      </tr>
    `;
    })
    .join("");

  const labText = context.usoLaboratorio
    ? "SIM (Laboratório Técnico / Sala de Leitura)"
    : "NÃO (Sala de Aula Comum)";

  const bimestreLabel = (context.bimestre || "1º").toUpperCase();

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Plano de Aula Semanal PAS 2026</title>
    </head>
    <body style="background: white; color: #0f172a; margin: 0; padding: 0; font-family: Arial, sans-serif;">
      <div style="width: 1060px; margin: 0 auto; padding: 10px;">
        
        <!-- 1. CABEÇALHO INSTITUCIONAL GOVERNAMENTAL COM BRASÃO -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #334155; margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">
          <tr>
            <td style="width: 12%; text-align: center; padding: 8px; background: #fafafa; vertical-align: middle;">
              <img src="${IMAGE_BRASAO_GOVERNO_B64}" style="width: 48px; height: auto;" alt="Brasão SP" />
            </td>
            <td style="width: 88%; text-align: center; padding: 12px; background: #fafafa; vertical-align: middle;">
              <div style="font-size: 14px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 0.5px;">GOVERNO DO ESTADO DE SÃO PAULO</div>
              <div style="font-size: 13px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 0.5px;">SECRETARIA DE ESTADO DA EDUCAÇÃO</div>
              <div style="font-size: 12px; color: #333; margin-top: 1px;">UNIDADE REGIONAL DE ENSINO DE MARÍLIA</div>
              <div style="font-size: 16px; font-weight: bold; color: #1e3a8a; margin-top: 3px;">EE "Monsenhor Bicudo"</div>
              <div style="font-size: 10px; color: #555; margin-top: 2px;">Av. Rio Branco, 803 - Fone (14) 3433-5163 - 17502-000 - Marília - SP</div>
            </td>
          </tr>
        </table>

        <!-- 2. ESTRUTURA EM GRADE ÚNICA (MATRIZ PAS 2026) -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #334155; font-size: 11px;">
          <!-- Linha Título do Plano -->
          <tr style="page-break-inside: avoid; break-inside: avoid;">
            <td style="width: 55%; background: #d5dce4; padding: 8px 12px; border: 1px solid #334155; font-weight: bold; font-size: 12px; color: #000;">
              PLANO DE AULA SEMANAL — ${bimestreLabel} BIM/2026
            </td>
            <td style="width: 45%; background: #d5dce4; padding: 8px 12px; border: 1px solid #334155; font-weight: bold; font-size: 11px; color: #0f172a;">
              SEMANA ESCOLAR: ${context.semana || "-"} | PERÍODO: ${context.dataInicio || "__/__"} a ${context.dataFim || "__/__"}
            </td>
          </tr>
          <!-- Linha Professor -->
          <tr style="page-break-inside: avoid; break-inside: avoid;">
            <td colspan="2" style="padding: 7px 12px; border: 1px solid #334155; background: #ffffff;">
              <strong>Nome do(a) professor(a):</strong> ${context.nomeProf || "-"}
            </td>
          </tr>
          <!-- Linha Disciplina & Turma -->
          <tr style="page-break-inside: avoid; break-inside: avoid;">
            <td style="padding: 7px 12px; border: 1px solid #334155; background: #ffffff;">
              <strong>DISCIPLINA / COMPONENTE:</strong> ${context.disciplina || "-"}
            </td>
            <td style="padding: 7px 12px; border: 1px solid #334155; background: #ffffff;">
              <strong>ANO/SÉRIE:</strong> ${context.turma || "-"} (${context.qtdAulas || 4} aulas/semana) | <strong>LAB:</strong> ${labText}
            </td>
          </tr>
          
          <!-- Seções Pedagógicas (Matriz Contínua) -->
          ${matrixRowsHtml}
        </table>

        <!-- 3. RODAPÉ INSTITUCIONAL COM LOGO DA ESCOLA E ASSINATURAS (BLOCO INDIVISÍVEL) -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #334155; margin-top: 14px; font-size: 10px; page-break-inside: avoid; break-inside: avoid;">
          <tr>
            <td style="width: 25%; text-align: center; padding: 10px; background: #fafafa; border: 1px solid #334155; vertical-align: middle;">
              <img src="${IMAGE_LOGO_ESCOLA_B64}" style="width: 95px; height: auto;" alt="Logo Escola" />
            </td>
            <td style="width: 37.5%; text-align: center; padding: 15px 10px; border: 1px solid #334155; vertical-align: bottom;">
              <div style="border-top: 1px solid #555; width: 80%; margin: 0 auto 5px auto;"></div>
              <strong>Assinatura do(a) Professor(a)</strong><br />
              <span style="font-size: 9px; color: #555;">${context.nomeProf || ""}</span>
            </td>
            <td style="width: 37.5%; text-align: center; padding: 15px 10px; border: 1px solid #334155; vertical-align: bottom;">
              <div style="border-top: 1px solid #555; width: 80%; margin: 0 auto 5px auto;"></div>
              <strong>Coordenação Pedagógica / Direção</strong><br />
              <span style="font-size: 9px; color: #555;">EE Monsenhor Bicudo</span>
            </td>
          </tr>
        </table>

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
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;

    const element = document.createElement("div");
    element.innerHTML = createHtmlContent(context, conteudo);
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.width = "800px";
    element.style.padding = "40px";
    element.style.backgroundColor = "white";
    element.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    
    document.body.appendChild(element);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(element);

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF("p", "mm", "a4");
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = `Ocorrencia_${context.data}_${context.nomeProf?.replace(/\s+/g, "_") || "professor"}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    fallbackHtmlDownload(context, conteudo);
  }
}

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

function createHtmlContent(context: OcorrenciaContext, conteudo: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Relatório de Ocorrência</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: white; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px; background: white; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #059669; padding-bottom: 20px; }
        .header h1 { font-size: 28px; color: #059669; margin-bottom: 10px; }
        .header p { font-size: 12px; color: #666; }
        .info-section { margin-bottom: 30px; padding: 15px; background: #f9fafb; border-left: 4px solid #059669; border-radius: 4px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .info-item { display: flex; flex-direction: column; }
        .info-label { font-weight: bold; color: #059669; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
        .info-value { font-size: 14px; color: #333; padding: 8px; background: white; border-radius: 3px; border: 1px solid #e5e7eb; }
        .content-section { margin-bottom: 30px; }
        .content-section h2 { font-size: 14px; color: #059669; text-transform: uppercase; margin-bottom: 15px; border-bottom: 2px solid #059669; padding-bottom: 10px; }
        .content-value { font-size: 14px; line-height: 1.8; color: #333; padding: 15px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; text-align: justify; white-space: pre-wrap; word-wrap: break-word; }
        .footer { margin-top: 50px; border-top: 2px solid #e5e7eb; padding-top: 20px; font-size: 11px; color: #666; text-align: center; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-right: 8px; margin-bottom: 10px; }
        .badge-tipo { background: #dbeafe; color: #1e40af; }
        .badge-gravidade { background: #fecaca; color: #991b1b; }
        .badge-gravidade.leve { background: #dcfce7; color: #166534; }
        .badge-gravidade.moderada { background: #fef08a; color: #854d0e; }
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

function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
