/**
 * Prompts estruturados para cada tipo de funcionalidade
 * Mantém a lógica de geração de prompts separada do código de API
 */

import { GenerateType, OcorrenciaContext, AtividadeContext } from "./types";

const SYSTEM_PROMPT = `Você é um assistente especializado em educação, ajudando professores da rede estadual de ensino com suas tarefas administrativas e pedagógicas. Responda sempre de forma clara, profissional, concisa e sem usar markdown ou formatação especial. Use apenas texto estruturado simples com títulos naturais.`;

/**
 * PLANEJAMENTO SEMANAL
 */
const PLANEJAMENTO_SEMANAL_PROMPT = `Com base na seguinte proposta de planejamento semanal, estruture uma resposta com as seguintes seções obrigatoriamente, cada uma iniciada pelo título entre parênteses:

(Objetivos)
Principais objetivos de aprendizagem para a semana.

(Conteúdos)
Tópicos e conteúdos a serem abordados.

(Metodologia)
Estratégias e métodos de ensino a serem utilizados.

(Recursos)
Materiais, ferramentas e recursos necessários.

(Avaliação)
Formas de avaliação e acompanhamento da aprendizagem.

Responda de forma objetiva, sem markdown, sem ##, sem símbolos especiais. Use apenas parágrafos claros e bem estruturados.

Proposta do professor:`;

/**
 * OCORRÊNCIA FORMAL
 */
const OCORRENCIA_FORMAL_PROMPT = `Reescreva o seguinte relato informal em linguagem formal, adequada para registro escolar oficial. Mantenha todos os fatos importantes, mas use uma linguagem profissional e apropriada para documentação pedagógica. Não use markdown ou símbolos especiais. Retorne como um parágrafo único, coeso e bem estruturado.

Contexto da ocorrência:
- Tipo: {tipo}
- Data: {data}
- Turno: {turno}
- Gravidade: {gravidade}
- Necessita encaminhamento: {encaminhamento}

Relato a reescrever:`;

/**
 * CRIADOR DE ATIVIDADES
 */
const ATIVIDADE_CRIADOR_PROMPT = `Você é um especialista em design pedagógico. Com base nas informações fornecidas, crie uma atividade completa e estruturada.

Informações:
- Turma: {turma}
- Disciplina: {disciplina}
- Tópico: {topico}
- Recursos disponíveis: {recursos}

Estruture a resposta com as seguintes seções (cada uma iniciada pelo título entre parênteses):

(Objetivo da Atividade)
Qual é o objetivo específico que os alunos devem alcançar.

(Descrição Passo a Passo)
Descreva os passos de forma clara para que o professor possa executar em sala.

(Recursos Utilizados)
Liste especificamente os recursos que serão utilizados.

(Tempo Estimado)
Informe o tempo necessário para realizar a atividade.

(Forma de Avaliação)
Como o professor avaliará se os alunos atingiram o objetivo.

Responda de forma objetiva, sem markdown, sem símbolos especiais. Use apenas texto estruturado simples.`;

/**
 * Gera prompt completo baseado no tipo
 */
export function generatePrompt(
  type: GenerateType,
  content: string,
  context?: OcorrenciaContext | AtividadeContext
): string {
  switch (type) {
    case "planejamento":
      return `${PLANEJAMENTO_SEMANAL_PROMPT}\n\n${content}`;

    case "ocorrencia":
      const ocorrenciaCtx = context as OcorrenciaContext;
      const ocorrenciaPrompt = OCORRENCIA_FORMAL_PROMPT
        .replace("{tipo}", ocorrenciaCtx.tipo || "")
        .replace("{data}", ocorrenciaCtx.data || "")
        .replace("{turno}", ocorrenciaCtx.turno || "Não especificado")
        .replace("{gravidade}", ocorrenciaCtx.gravidade || "Não especificada")
        .replace(
          "{encaminhamento}",
          ocorrenciaCtx.encaminhamento ? "Sim" : "Não"
        );
      return `${ocorrenciaPrompt}\n\n${content}`;

    case "atividade":
      const atividadeCtx = context as AtividadeContext;
      const recursosStr = atividadeCtx.recursos.join(", ");
      const atividadePrompt = ATIVIDADE_CRIADOR_PROMPT
        .replace("{turma}", atividadeCtx.turma || "")
        .replace("{disciplina}", atividadeCtx.disciplina || "")
        .replace("{topico}", atividadeCtx.topico || "")
        .replace("{recursos}", recursosStr || "Não especificados");
      return atividadePrompt;

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

/**
 * Validações de contexto específico
 */
export function validateOcorrenciaContext(
  context: OcorrenciaContext
): string | null {
  if (!context.tipo) {
    return "Tipo de ocorrência é obrigatório (Coletiva/Individual).";
  }
  if (!context.data) {
    return "Data da ocorrência é obrigatória.";
  }
  return null;
}

export function validateAtividadeContext(
  context: AtividadeContext
): string | null {
  if (!context.turma) {
    return "Turma é obrigatória.";
  }
  if (!context.disciplina) {
    return "Disciplina é obrigatória.";
  }
  if (!context.topico) {
    return "Tópico é obrigatório.";
  }
  return null;
}
