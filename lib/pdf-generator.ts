/**
 * Gerador de PDF para Ocorrências
 * Cria um documento PDF estruturado com as informações da ocorrência
 */

import { OcorrenciaContext } from "./types";

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
