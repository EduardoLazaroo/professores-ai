/**
 * Prompts estruturados para cada tipo de funcionalidade
 * Mantém a lógica de geração de prompts separada do código de API
 */

import { GenerateType } from "./types";

const SYSTEM_PROMPT = `Você é um assistente especializado em educação, ajudando professores da rede estadual de ensino com suas tarefas administrativas e pedagógicas. Responda sempre de forma clara, profissional e concisa.`;

const PLANEJAMENTO_SEMANAL_PROMPT = `Com base no escopo fornecido, crie um planejamento semanal estruturado. Retorne o resultado em formato markdown com exatamente as seguintes seções:

## Objetivos
[Principais objetivos de aprendizagem para a semana]

## Conteúdos
[Tópicos e conteúdos a serem abordados]

## Metodologia
[Estratégias e métodos de ensino a serem utilizados]

## Recursos
[Materiais, ferramentas e recursos necessários]

## Avaliação
[Formas de avaliação e acompanhamento da aprendizagem]

Espaço fornecido pelos professores:`;

const OCORRENCIA_FORMAL_PROMPT = `Reescreva o relato informal fornecido em linguagem formal, adequada para registro escolar oficial. Mantenha todos os fatos importante, mas use uma linguagem profissional e apropriada para documentação pedagógica. O resultado deve ser um parágrafo coeso e bem estruturado.

Relato a reescrever:`;

export function generatePrompt(type: GenerateType, content: string): string {
  switch (type) {
    case "planejamento":
      return `${PLANEJAMENTO_SEMANAL_PROMPT}\n\n${content}`;
    case "ocorrencia":
      return `${OCORRENCIA_FORMAL_PROMPT}\n\n${content}`;
    default:
      throw new Error(`Tipo desconhecido: ${type}`);
  }
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

/**
 * Validações básicas do conteúdo antes de enviar à API
 */
export function validateContent(content: string): string | null {
  const trimmed = content.trim();

  if (!trimmed) {
    return "Por favor, insira um conteúdo válido.";
  }

  if (trimmed.length < 10) {
    return "O conteúdo é muito curto. Insira pelo menos 10 caracteres.";
  }

  if (trimmed.length > 5000) {
    return "O conteúdo excede o limite de 5000 caracteres.";
  }

  return null;
}
