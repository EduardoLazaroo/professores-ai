/**
 * Tipos e interfaces para autenticação futura (V2)
 * Mantém a estrutura preparada para quando autenticação for implementada
 */

/**
 * Representa um usuário do sistema (futura implementação)
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contexto de autenticação para requisições (futuro middleware)
 */
export interface AuthContext {
  userId?: string;
  user?: User;
  authenticated: boolean;
}

/**
 * Representa uma geração salva (histórico - futuro)
 */
export interface GenerationRecord {
  id: string;
  userId: string;
  type: string;
  inputContent: string;
  outputResult: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Configurações de rate limit (futuro)
 */
export interface RateLimitConfig {
  maxRequestsPerHour: number;
  maxRequestsPerDay: number;
  maxCharactersPerDay: number;
  cooldownMinutes: number;
}

// Configurações padrão de rate limit para V2
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequestsPerHour: 60,
  maxRequestsPerDay: 500,
  maxCharactersPerDay: 100000,
  cooldownMinutes: 1,
};
