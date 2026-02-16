/**
 * Arquivo de configuração para diferentes ambientes
 * Centraliza configurações que variam entre dev/staging/prod
 */

const isDev = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Configurações por ambiente
 */
export const config = {
  app: {
    name: "Professores AI",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },

  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    timeout: 30000,
  },

  openai: {
    model: "gpt-4o-mini",
    maxTokens: 2000,
    temperature: 0.7,
  },

  features: {
    authentication: false, // V1: desabilitado
    rateLimit: false, // V1: desabilitado
    persistData: false, // V1: desabilitado
    logging: isDev ? "verbose" : "minimal",
  },

  security: {
    requireHttps: isProduction,
    corsEnabled: false, // V1: sem CORS
    rateLimitPerHour: 60,
    dataRetention: "none", // V1: não armazena
  },

  database: {
    enabled: false, // V1: sem banco de dados
    // Sera preenchido em V2
  },
};

/**
 * Valida configurações necessárias
 */
export function validateConfig(): string[] {
  const errors: string[] = [];

  if (!process.env.OPENAI_API_KEY) {
    errors.push("OPENAI_API_KEY não está configurada");
  }

  if (isProduction && !process.env.NEXT_PUBLIC_API_URL) {
    errors.push(
      "NEXT_PUBLIC_API_URL é recomendada em produção"
    );
  }

  return errors;
}

/**
 * Retorna configuração segura para o cliente
 */
export function getClientConfig() {
  return {
    apiUrl: config.api.baseUrl,
    version: config.app.version,
  };
}
