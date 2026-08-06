/**
 * Tipos e interfaces para a aplicação Professores AI
 */

export type GenerateType = "planejamento" | "ocorrencia" | "atividade" | "tecnico";

export interface GenerateRequest {
  type: GenerateType;
  content: string;
  context?: OcorrenciaContext | AtividadeContext | TecnicoContext;
}

export interface GenerateResponse {
  success: boolean;
  result?: string;
  error?: string;
  message?: string;
}

export interface OpenAIRequest {
  prompt: string;
}

export interface OpenAIResponse {
  content: string;
}

/**
 * Contexto específico para Ocorrência Formal
 */
export interface OcorrenciaContext {
  nomeProf: string;
  tipo: "coletiva" | "individual";
  data: string;
  turno?: "manhã" | "tarde" | "noite";
  gravidade?: "leve" | "moderada" | "grave";
  encaminhamento?: boolean;
}

/**
 * Contexto específico para Criador de Atividades
 */
export interface AtividadeContext {
  turma: string;
  disciplina: string;
  topico: string;
  recursos: string[];
}

/**
 * Contexto específico para Planejamento do Eixo Técnico (Desenvolvimento de Sistemas)
 */
export interface TecnicoContext {
  nomeProf: string;
  turma: "2º Técnico" | "3º Técnico";
  disciplina: string;
  bimestre: "1º" | "2º" | "3º" | "4º";
  semana: string;
  dataInicio: string;
  dataFim: string;
  qtdAulas: number;
  usoLaboratorio: boolean;
}

export const GENERATE_TYPES: Record<GenerateType, string> = {
  planejamento: "Planejamento Semanal",
  ocorrencia: "Ocorrência Formal",
  atividade: "Criador de Atividades",
  tecnico: "Técnico (Dev. Sistemas)",
};

export const TABS_CONFIG: Array<{
  id: GenerateType | "home";
  label: string;
  icon: string;
}> = [
  { id: "home", label: "Início", icon: "🏠" },
  { id: "tecnico", label: "Eixo Técnico", icon: "💻" },
  { id: "planejamento", label: "Planejamento", icon: "📋" },
  { id: "ocorrencia", label: "Ocorrência", icon: "📝" },
  { id: "atividade", label: "Atividades", icon: "🎓" },
];

