/**
 * Tipos e interfaces para a aplicação Professores AI
 */

export type GenerateType = "planejamento" | "ocorrencia";

export interface GenerateRequest {
  type: GenerateType;
  content: string;
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

export const GENERATE_TYPES: Record<GenerateType, string> = {
  planejamento: "Planejamento Semanal",
  ocorrencia: "Ocorrência Formal",
};
