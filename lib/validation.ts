/**
 * Utilitários de validação para a aplicação
 */

import { GenerateType, GenerateRequest } from "./types";

const VALID_TYPES: GenerateType[] = ["planejamento", "ocorrencia"];

/**
 * Valida a requisição completa
 */
export function validateRequest(
  body: unknown
): { valid: boolean; error?: string; data?: GenerateRequest } {
  // Verificar se é um objeto
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Requisição inválida" };
  }

  const request = body as Record<string, unknown>;

  // Validar tipo
  if (!request.type || typeof request.type !== "string") {
    return { valid: false, error: "Campo 'type' é obrigatório" };
  }

  if (!VALID_TYPES.includes(request.type as GenerateType)) {
    return {
      valid: false,
      error: `Tipo inválido. Use: ${VALID_TYPES.join(", ")}`,
    };
  }

  // Validar conteúdo
  if (!request.content || typeof request.content !== "string") {
    return { valid: false, error: "Campo 'content' é obrigatório" };
  }

  const content = request.content.trim();

  if (content.length < 10) {
    return {
      valid: false,
      error: "Conteúdo deve ter no mínimo 10 caracteres",
    };
  }

  if (content.length > 5000) {
    return {
      valid: false,
      error: "Conteúdo não pode exceder 5000 caracteres",
    };
  }

  return {
    valid: true,
    data: {
      type: request.type as GenerateType,
      content,
    },
  };
}

/**
 * Verifica se a requisição é válida para efeitos de rate limiting
 * Pode ser expandido para implementar rate limiting real no futuro
 */
export function shouldRateLimit(): boolean {
  // Placeholder para lógica de rate limiting futura
  // Por enquanto, sempre retorna false (sem limite)
  return false;
}
