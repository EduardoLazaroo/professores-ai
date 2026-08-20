/**
 * Gerador de documentos Word (.docx) para o Plano de Aula Semanal do Eixo Técnico
 * Segue 100% a estrutura, margens, cores (D9E2F3) e layout do modelo oficial PAS_MODELO_2026 (EE Monsenhor Bicudo)
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  PageOrientation,
  BorderStyle,
  ShadingType,
} from "docx";
import { TecnicoContext } from "./types";
import { formatExportFilename } from "./filename-utils";

/**
 * Gera e realiza o download de um arquivo .docx formatado identicamente ao modelo oficial PAS_MODELO_2026
 */
export async function generateTecnicoDocx(
  context: TecnicoContext,
  conteudo: string
): Promise<void> {
  // Extrair seções entre parênteses ex: (APRENDIZAGENS ESSENCIAIS)
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

  const borderStyle = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: "333333",
  };

  const tableBorders = {
    top: borderStyle,
    bottom: borderStyle,
    left: borderStyle,
    right: borderStyle,
    insideHorizontal: borderStyle,
    insideVertical: borderStyle,
  };

  // --- TABELA 1: CABEÇALHO INSTITUCIONAL (GOVERNO DO ESTADO DE SÃO PAULO) ---
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: "FAFAFA", type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "GOVERNO DO ESTADO DE SÃO PAULO",
                    bold: true,
                    size: 20,
                    font: "Arial",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "SECRETARIA DE ESTADO DA EDUCAÇÃO",
                    bold: true,
                    size: 20,
                    font: "Arial",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "UNIDADE REGIONAL DE ENSINO DE MARÍLIA",
                    size: 18,
                    font: "Arial",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'EE "Monsenhor Bicudo"',
                    bold: true,
                    size: 22,
                    font: "Arial",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Av. Rio Branco, 803 - Fone (14) 3433-5163 - 17502-000 - Marília  -  SP",
                    size: 16,
                    font: "Arial",
                    color: "555555",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // --- TABELA 2: MATRIZ DE PLANO DE AULA SEMANAL (ESTRUTURA OFICIAL) ---
  const rows: TableRow[] = [];
  const bimestreLabel = (context.bimestre || "1º").toUpperCase();
  const labText = context.usoLaboratorio
    ? "SIM (Laboratório Técnico / Sala de Leitura)"
    : "NÃO (Sala de aula comum)";

  // Linha 1: Título do Plano e Semana/Período (Preenchimento oficial: D5DCE4)
  rows.push(
    new TableRow({
      children: [
        new TableCell({
          width: { size: 55, type: WidthType.PERCENTAGE },
          shading: { fill: "D5DCE4", type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `PLANO DE AULA SEMANAL — ${bimestreLabel} BIM/2026`,
                  bold: true,
                  size: 20,
                  font: "Arial",
                  color: "000000",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 45, type: WidthType.PERCENTAGE },
          shading: { fill: "D5DCE4", type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `SEMANA ESCOLAR: ${context.semana || "-"} | PERÍODO: ${context.dataInicio || "__/__"} a ${context.dataFim || "__/__"}`,
                  bold: true,
                  size: 18,
                  font: "Arial",
                  color: "000000",
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Linha 2: Professor(a)
  rows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Nome do(a) professor(a): ",
                  bold: true,
                  size: 18,
                  font: "Arial",
                }),
                new TextRun({
                  text: context.nomeProf || "-",
                  size: 18,
                  font: "Arial",
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Linha 3: Disciplina e Ano/Série + Aulas/Lab
  rows.push(
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "DISCIPLINA / COMPONENTE: ",
                  bold: true,
                  size: 18,
                  font: "Arial",
                }),
                new TextRun({
                  text: context.disciplina || "-",
                  size: 18,
                  font: "Arial",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "ANO/SÉRIE: ",
                  bold: true,
                  size: 18,
                  font: "Arial",
                }),
                new TextRun({
                  text: `${context.turma || "-"} (${context.qtdAulas || 4} aulas/semana) | LAB: ${labText}`,
                  size: 18,
                  font: "Arial",
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Seções pedagógicas (10 seções da matriz com preenchimento oficial D9E2F3)
  defaultTitles.forEach((title) => {
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

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            shading: { fill: "D9E2F3", type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 20,
                    font: "Arial",
                    color: "000000",
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    const paragraphs: Paragraph[] = [];
    const lines = (bodyText || "-").split("\n");

    lines.forEach((line) => {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: line,
              size: 18,
              font: "Arial",
              color: "000000",
            }),
          ],
        })
      );
    });

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            children: paragraphs,
          }),
        ],
      })
    );
  });

  const matrixTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: rows,
  });

  // --- DOCUMENTO COMPLETO EM PAISAGEM (COM AS MESMAS MARGENS E SEM FOOTER EXTRA, IGUAL AO MODELO) ---
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              width: 16838, // 29.7cm (A4 Landscape)
              height: 11906, // 21.0cm
            },
            margin: {
              top: 568,
              bottom: 851,
              left: 1417,
              right: 1417,
              header: 708,
              footer: 708,
            },
          },
        },
        children: [
          headerTable,
          new Paragraph({ spacing: { after: 120 }, children: [] }),
          matrixTable,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = formatExportFilename(context.disciplina, context.semana, "docx");

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
}
