import { CurriculumLesson } from "./types";
import segundoAnoData from "./data/2_ano_tec.json";
import terceiroAnoData from "./data/3_ano_tec.json";

const dataSegunda: CurriculumLesson[] = segundoAnoData as CurriculumLesson[];
const dataTerceira: CurriculumLesson[] = terceiroAnoData as CurriculumLesson[];

export function getCurriculumData(turma: string): CurriculumLesson[] {
  if (turma === "3º Técnico") {
    return dataTerceira;
  }
  return dataSegunda;
}

export function parseBimestreNumber(bimestreStr: string): number {
  const match = bimestreStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

export function getDisciplinasByTurmaEBimestre(
  turma: string,
  bimestreStr: string
): string[] {
  const dataset = getCurriculumData(turma);
  const bimNum = parseBimestreNumber(bimestreStr);

  const setComp = new Set<string>();
  dataset.forEach((item) => {
    if (item.bimestre === bimNum && item.componente) {
      setComp.add(item.componente);
    }
  });

  if (setComp.size === 0) {
    // Se não encontrou restrição por bimestre, retorna todas da turma
    return getDisciplinasByTurma(turma);
  }

  return Array.from(setComp);
}

export function getDisciplinasByTurma(turma: string): string[] {
  const dataset = getCurriculumData(turma);
  const setComp = new Set<string>();
  dataset.forEach((item) => {
    if (item.componente) {
      setComp.add(item.componente);
    }
  });

  return Array.from(setComp);
}

export function getSemanasByTurmaBimestreDisciplina(
  turma: string,
  bimestreStr: string,
  disciplina: string
): number[] {
  const dataset = getCurriculumData(turma);
  const bimNum = parseBimestreNumber(bimestreStr);
  const semanas = new Set<number>();

  dataset.forEach((item) => {
    if (
      item.bimestre === bimNum &&
      item.componente === disciplina &&
      item.semana
    ) {
      semanas.add(item.semana);
    }
  });

  if (semanas.size === 0) {
    // Se não houver filtro estrito por bimestre, busca semanas da disciplina
    return getSemanasDisponiveis(turma, disciplina);
  }

  return Array.from(semanas).sort((a, b) => a - b);
}

export function getSemanasDisponiveis(
  turma: string,
  disciplina: string
): number[] {
  const dataset = getCurriculumData(turma);
  const semanas = new Set<number>();

  dataset.forEach((item) => {
    if (item.componente === disciplina && item.semana) {
      semanas.add(item.semana);
    }
  });

  if (semanas.size === 0) {
    return Array.from({ length: 40 }, (_, i) => i + 1);
  }

  return Array.from(semanas).sort((a, b) => a - b);
}

export function getLessonsByWeek(
  turma: string,
  disciplina: string,
  semanaNum: number
): CurriculumLesson[] {
  const dataset = getCurriculumData(turma);
  return dataset.filter(
    (item) => item.componente === disciplina && item.semana === semanaNum
  );
}

export function formatScopeFromLessons(lessons: CurriculumLesson[]): string {
  if (!lessons || lessons.length === 0) return "";

  const first = lessons[0];
  const lines: string[] = [];

  lines.push(`📌 Tema da Semana: ${first.tema_semana}`);
  lines.push(
    `📚 Unidade Curricular: ${first.unidade_curricular} (${first.codigo_unidade})`
  );
  lines.push(`🎯 Competência Técnica: ${first.competencia_tecnica}`);
  lines.push(
    `💡 Competências Socioemocionais: ${first.competencias_socioemocionais.replace(
      /\n\n/g,
      " | "
    )}`
  );
  lines.push(`---`);
  lines.push(`📝 AULAS DA SEMANA (${lessons.length} aulas):`);

  lessons.forEach((l) => {
    const tipoCH = l.ch_tp === "P" ? "[Prática em Laboratório]" : "[Teórica]";
    lines.push(`\n• ${l.titulo_aula} ${tipoCH}`);
    lines.push(`  - Objetivo: ${l.objetivo_aula}`);
    lines.push(`  - Habilidade Técnica: ${l.habilidades_tecnicas}`);
    lines.push(`  - Habilidade Socioemocional: ${l.habilidades_socioemocionais}`);
    lines.push(`  - Objeto de Conhecimento: ${l.objeto_conhecimento_macro}`);
  });

  return lines.join("\n");
}

export interface CurriculumWeekDetails {
  bimestreFormatted: "1º" | "2º" | "3º" | "4º";
  qtdAulas: number;
  usoLaboratorio: boolean;
  lessons: CurriculumLesson[];
  formattedScope: string;
  isCustom: boolean;
}

export function getWeekDetails(
  turma: string,
  disciplina: string,
  semanaStr: string
): CurriculumWeekDetails | null {
  const semanaMatch = semanaStr.match(/\d+/);
  if (!semanaMatch) return null;
  const semanaNum = parseInt(semanaMatch[0], 10);

  const lessons = getLessonsByWeek(turma, disciplina, semanaNum);
  if (!lessons || lessons.length === 0) return null;

  const first = lessons[0];
  const bimMap: Record<number, "1º" | "2º" | "3º" | "4º"> = {
    1: "1º",
    2: "2º",
    3: "3º",
    4: "4º",
  };

  const temPratica = lessons.some((l) => l.ch_tp === "P");
  const formattedScope = formatScopeFromLessons(lessons);

  return {
    bimestreFormatted: bimMap[first.bimestre] || "1º",
    qtdAulas: lessons.length,
    usoLaboratorio: temPratica,
    lessons,
    formattedScope,
    isCustom: false,
  };
}
