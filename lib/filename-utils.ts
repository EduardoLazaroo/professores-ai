/**
 * Utilitário para formatação padronizada de nomes de arquivos exportados (Word / PDF)
 * Formato: [disciplina_curta]_[semana_formatada].[ext]
 * Exemplo: front_semana07.docx
 */

const DISCIPLINE_SLUG_MAP: Record<string, string> = {
  "Lógica de Programação": "logica",
  "Front-End I (HTML, CSS e JS)": "front",
  "Front-End II (React & Next.js)": "front",
  "Banco de Dados I (SQL)": "bd",
  "Banco de Dados II (NoSQL e ORM)": "bd",
  "Desenvolvimento Back-End (APIs & Node.js)": "back",
  "Versionamento e Git": "versionamento",
  "Modelagem e Análise de Sistemas": "modelagem",
  "Inteligência Artificial & Machine Learning": "ia",
  "Projetos de TI & Carreiras em EPT": "projetos",
  "Outra Disciplina": "outra",
};

/**
 * Converte o nome extenso da disciplina em uma chave curta limpa
 */
export function getDisciplineSlug(disciplinaRaw?: string): string {
  if (!disciplinaRaw || !disciplinaRaw.trim()) {
    return "disciplina";
  }

  const trimmed = disciplinaRaw.trim();

  // 1. Mapeamento direto por nome cadastrado
  if (DISCIPLINE_SLUG_MAP[trimmed]) {
    return DISCIPLINE_SLUG_MAP[trimmed];
  }

  // 2. Mapeamento flexível por palavras-chave (case-insensitive)
  const lower = trimmed.toLowerCase();
  if (lower.includes("front")) return "front";
  if (lower.includes("back")) return "back";
  if (lower.includes("banco") || lower.includes("sql") || lower.includes("nosql") || lower.includes("bd")) return "bd";
  if (lower.includes("lógica") || lower.includes("logica")) return "logica";
  if (lower.includes("versionamento") || lower.includes("git")) return "versionamento";
  if (lower.includes("modelagem")) return "modelagem";
  if (lower.includes("inteligência") || lower.includes("inteligencia") || lower.includes("machine") || lower.includes("ia")) return "ia";
  if (lower.includes("projeto")) return "projetos";
  if (lower.includes("outra")) return "outra";

  // 3. Fallback: Slugify para disciplinas customizadas
  return lower
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "disciplina";
}

/**
 * Formata a identificação da semana no padrão "semanaXX" (ex: "semana07")
 */
export function getSemanaSlug(semanaRaw?: string): string {
  if (!semanaRaw || !semanaRaw.trim()) {
    return "semana01";
  }

  const match = semanaRaw.match(/\d+/);
  if (match) {
    const numStr = match[0].padStart(2, "0");
    return `semana${numStr}`;
  }

  const cleanStr = semanaRaw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

  return cleanStr || "semana01";
}

/**
 * Retorna o nome do arquivo final no formato: disciplina_semana.ext
 * Exemplo: front_semana07.docx
 */
export function formatExportFilename(
  disciplina?: string,
  semana?: string,
  extension: "docx" | "pdf" | "html" = "docx"
): string {
  const discSlug = getDisciplineSlug(disciplina);
  const semSlug = getSemanaSlug(semana);
  return `${discSlug}_${semSlug}.${extension}`;
}
