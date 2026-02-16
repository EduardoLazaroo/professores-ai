/**
 * Constantes da aplicação
 * Centraliza valores que podem mudar sem necessidade de refatoração
 */

/**
 * Limites de conteúdo
 */
export const CONTENT_LIMITS = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 5000,
};

/**
 * Modelos OpenAI disponíveis
 */
export const OPENAI_MODELS = {
  DEFAULT: "gpt-4o-mini",
  FALLBACK: "gpt-3.5-turbo",
} as const;

/**
 * Configuração de geração
 */
export const GENERATION_CONFIG = {
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  TIMEOUT_MS: 30000,
} as const;

/**
 * Mensagens padrão da API
 */
export const API_MESSAGES = {
  INVALID_METHOD: "Método não permitido",
  INVALID_CONTENT_TYPE: "Content-Type deve ser application/json",
  INVALID_JSON: "JSON inválido no corpo da requisição",
  INVALID_TYPE: "Campo 'type' é obrigatório",
  INVALID_TYPE_VALUE: "Tipo inválido",
  INVALID_CONTENT: "Campo 'content' é obrigatório",
  CONTENT_TOO_SHORT: `Conteúdo deve ter no mínimo ${CONTENT_LIMITS.MIN_LENGTH} caracteres`,
  CONTENT_TOO_LONG: `Conteúdo não pode exceder ${CONTENT_LIMITS.MAX_LENGTH} caracteres`,
  SERVICE_UNAVAILABLE: "Serviço indisponível no momento. Tente novamente mais tarde.",
  PROCESSING_ERROR: "Erro ao processar solicitação",
  EMPTY_RESPONSE: "Resposta vazia da OpenAI",
  AUTH_ERROR: "Erro de autenticação: chave de API inválida",
  RATE_LIMIT: "Limite de requisições excedido. Tente novamente em alguns momentos.",
  RATE_LIMIT_ERROR: "Você atingiu o limite de requisições. Tente novamente depois.",
  SERVER_ERROR: "Serviço temporariamente indisponível. Tente novamente.",
} as const;

/**
 * Códigos de status HTTP
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Nomes de variáveis de ambiente
 */
export const ENV_VARS = {
  OPENAI_API_KEY: "OPENAI_API_KEY",
  NODE_ENV: "NODE_ENV",
  NEXT_PUBLIC_API_URL: "NEXT_PUBLIC_API_URL",
  DATABASE_URL: "DATABASE_URL", // Futuro
} as const;

/**
 * Ambientes suportados
 */
export const ENVIRONMENTS = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  STAGING: "staging",
} as const;

/**
 * Tipos de log
 */
export const LOG_LEVELS = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  CRITICAL: "CRITICAL",
} as const;
