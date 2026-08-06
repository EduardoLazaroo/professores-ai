/**
 * Service para extração e parsing automático de escopos colados (texto livre ou planilhas TSV/Excel).
 */

export interface ParsedScopeAula {
  numero: number;
  titulo: string;
  descricao: string;
  objetivo?: string;
  conteudo?: string;
}

export interface ParsedScopeResult {
  disciplina: string;
  competencia: string;
  competenciasSocioemocionais: string;
  unidade: string;
  aulas: ParsedScopeAula[];
  objetivos: string;
  habilidades: string;
  descritores: string;
  conteudo: string;
}

export function sanitizeRawScopeText(rawText: string): string {
  if (!rawText || typeof rawText !== "string") return "";

  let cleaned = rawText.replace(/\r\n/g, "\n");

  // Remove pontos isolados ou tabulados em linhas vazias
  cleaned = cleaned.replace(/\n\s*\.\s*(?=\n|$)/g, "\n");

  // Corrige ponto final deslocado para o início da linha seguinte (ex: "\n. Devem" -> ". Devem")
  cleaned = cleaned.replace(/\n\s*\.\s*([A-ZÀ-Ú])/g, ". $1");

  // Junta linhas com quebra no meio de frase (ex: "ping\npara validação" -> "ping para validação")
  cleaned = cleaned.replace(/([a-zA-Z0-9,])\n\s*([a-zà-ú])/g, "$1 $2");

  return cleaned.trim();
}

export function parseScopeText(rawText: string): ParsedScopeResult {
  if (!rawText || typeof rawText !== "string") {
    return {
      disciplina: "",
      competencia: "",
      competenciasSocioemocionais: "",
      unidade: "",
      aulas: [],
      objetivos: "",
      habilidades: "",
      descritores: "",
      conteudo: "",
    };
  }

  const cleanText = sanitizeRawScopeText(rawText);

  // --- TRATAMENTO PARA TABELAS (TSV / EXCEL / GOOGLE SHEETS) ---
  if (cleanText.includes("\t")) {
    const lines = cleanText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const aulasExtraidas: ParsedScopeAula[] = [];
    const competenciasSet = new Set<string>();
    const socioemocionaisSet = new Set<string>();
    const objetivosSet = new Set<string>();
    const habilidadesSet = new Set<string>();
    const conteudosSet = new Set<string>();
    let disciplinaEncontrada = "";
    let unidadeEncontrada = "";

    try {
      lines.forEach((line) => {
        const cols = line.split("\t").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length < 2) return;

        let aulaTituloDesc = "";
        let objetivoAula = "";
        let conteudoAula = "";

        cols.forEach((col) => {
          if (!col) return;

          // Disciplina reconhecida
          if (
            !disciplinaEncontrada &&
            /^(Programação|Lógica|Redes|Processos|Carreiras|Modelagem|Versionamento|Inteligência|Projeto|Desenvolvimento|Banco)/i.test(
              col
            )
          ) {
            disciplinaEncontrada = col;
          }

          // Competência Técnica (frase descritiva de habilidades práticas)
          if (
            col.length > 35 &&
            /(Codificar|Levantar|Desenvolver|Prestar|Migrar|Conhecer|estruturas|Criar|Implementar|Configurar)/i.test(
              col
            )
          ) {
            competenciasSet.add(col);
          }

          // Competências Socioemocionais (soft skills)
          if (
            /(Empatia|Cooperação|Persistência|Curiosidade|Tolerância|Resolução|Trabalho em Equipe|Comunicação|Proatividade)/i.test(
              col
            )
          ) {
            socioemocionaisSet.add(col);
          }

          // Unidade Temática
          if (
            !unidadeEncontrada &&
            /^(Fundamentos|Introdução|Acessibilidade|Publicação|Melhoria|Arquitetura|U\d+)/i.test(
              col
            ) &&
            !col.startsWith("Aula")
          ) {
            unidadeEncontrada = col;
          }

          // Aula
          const aulaMatch = col.match(
            /^(?:Aula\s*(\d+)|\b(\d+)\ª?\s*aula)[\s:\-–]+(.*)/i
          );
          if (aulaMatch) {
            aulaTituloDesc = col;
          }

          // Objetivos específicos das aulas
          if (
            col.startsWith("Conhecer") ||
            col.startsWith("Configurar") ||
            col.startsWith("Compreender") ||
            col.startsWith("Analisar") ||
            col.startsWith("Capacitar") ||
            col.startsWith("Desenvolver")
          ) {
            objetivoAula = col;
            objetivosSet.add(col);
          }

          // Conteúdos / Descritores
          if (
            col.match(/^\d+\.\s+/) ||
            col.startsWith("D1") ||
            col.startsWith("D2")
          ) {
            conteudoAula = col;
            conteudosSet.add(col);
          }
        });

        if (aulaTituloDesc) {
          const aulaMatch = aulaTituloDesc.match(
            /^(?:Aula\s*(\d+)|\b(\d+)\ª?\s*aula)[\s:\-–]+(.*)/i
          );
          const num = aulaMatch
            ? parseInt(aulaMatch[1] || aulaMatch[2], 10)
            : aulasExtraidas.length + 1;
          const desc = aulaMatch ? aulaMatch[3].trim() : aulaTituloDesc;

          aulasExtraidas.push({
            numero: num,
            titulo: `Aula ${num}`,
            descricao: desc,
            objetivo: objetivoAula,
            conteudo: conteudoAula,
          });
        }
      });
    } catch (e) {
      console.warn("Erro ao processar tabela TSV:", e);
    }

    if (aulasExtraidas.length > 0 || competenciasSet.size > 0) {
      return {
        disciplina: disciplinaEncontrada || "",
        competencia: Array.from(competenciasSet).join(" "),
        competenciasSocioemocionais: Array.from(socioemocionaisSet).join(" "),
        unidade: unidadeEncontrada || "",
        aulas:
          aulasExtraidas.length > 0
            ? aulasExtraidas
            : [
                {
                  numero: 1,
                  titulo: "Aula 1",
                  descricao: "Conceitos Fundamentais e Teoria Aplicada",
                },
                {
                  numero: 2,
                  titulo: "Aula 2",
                  descricao: "Desenvolvimento Prático no Ambiente de Laboratório",
                },
                {
                  numero: 3,
                  titulo: "Aula 3",
                  descricao: "Exercícios Práticos e Avaliação Formativa",
                },
              ],
        objetivos: Array.from(objetivosSet).join("\n"),
        habilidades: Array.from(habilidadesSet).join(" "),
        descritores: "",
        conteudo: Array.from(conteudosSet).join("\n"),
      };
    }
  }

  // --- TRATAMENTO PARA TEXTO LIVRE ---
  const lines = cleanText.split("\n").map((l) => l.trim()).filter(Boolean);

  const extractByKey = (keywords: string[]) => {
    for (const kw of keywords) {
      const regex = new RegExp(`(?:^|\\b)${kw}\\s*[:\\-–=]?\\s*(.*)`, "i");
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(regex);
        if (match && match[1] && match[1].trim()) {
          let value = match[1].trim();
          let nextIdx = i + 1;
          while (nextIdx < lines.length && !isLabelLine(lines[nextIdx])) {
            value += " " + lines[nextIdx];
            nextIdx++;
          }
          return value.trim();
        }
      }
    }
    return "";
  };

  const isLabelLine = (line: string) => {
    return /^(disciplina|componente|competência|competencias|unidade|módulo|aula|objetivo|habilidade|descritor|conteúdo|socioemocional)/i.test(
      line
    );
  };

  const disciplina = extractByKey([
    "componente curricular",
    "componente",
    "disciplina",
    "matéria",
    "curso",
  ]);
  const competencia = extractByKey([
    "competência técnica",
    "competência",
    "competencias",
  ]);
  const competenciasSocioemocionais = extractByKey([
    "competências socioemocionais",
    "socioemocionais",
    "soft skills",
  ]);
  const unidade = extractByKey(["unidade temática", "unidade", "módulo"]);

  const aulas: ParsedScopeAula[] = [];
  const aulaRegex = /^(?:aula\s*(\d+)|\b(\d+)\ª?\s*aula)[\s:\-–]+(.*)/i;

  lines.forEach((line) => {
    const match = line.match(aulaRegex);
    if (match) {
      const num = match[1] || match[2];
      const desc = match[3].trim();
      aulas.push({
        numero: parseInt(num, 10),
        titulo: `Aula ${num}`,
        descricao: desc,
      });
    }
  });

  if (aulas.length === 0) {
    lines.forEach((line) => {
      const numMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numMatch && numMatch[2].length > 5) {
        aulas.push({
          numero: parseInt(numMatch[1], 10),
          titulo: `Aula ${numMatch[1]}`,
          descricao: numMatch[2].trim(),
        });
      }
    });
  }

  const objetivos = extractByKey([
    "objetivos específicos",
    "objetivos de aprendizagem",
    "objetivos",
    "objetivo",
  ]);
  const habilidades = extractByKey([
    "habilidades priorizadas",
    "habilidades",
    "habilidade",
  ]);
  const descritores = extractByKey(["descritores", "descritor"]);
  const conteudo = extractByKey([
    "conteúdo programático",
    "conteúdos",
    "conteúdo",
    "tema",
  ]);

  return {
    disciplina: disciplina || "",
    competencia: competencia || "",
    competenciasSocioemocionais: competenciasSocioemocionais || "",
    unidade: unidade || "",
    aulas:
      aulas.length > 0
        ? aulas
        : [
            {
              numero: 1,
              titulo: "Aula 1",
              descricao: "Conceitos Teóricos e Fundamentos",
            },
            {
              numero: 2,
              titulo: "Aula 2",
              descricao: "Desenvolvimento Prático no Laboratório de TI",
            },
            {
              numero: 3,
              titulo: "Aula 3",
              descricao: "Resolução de Desafios e Avaliação de Desempenho",
            },
          ],
    objetivos: objetivos || "",
    habilidades: habilidades || "",
    descritores: descritores || "",
    conteudo: conteudo || "",
  };
}
