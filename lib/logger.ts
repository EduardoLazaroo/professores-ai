/**
 * Funções utilitárias para logging seguro
 * Evita logging de dados sensíveis
 */

import { LOG_LEVELS } from "./constants";

type LogLevel = keyof typeof LOG_LEVELS;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

/**
 * Logger seguro para a aplicação
 * Não loga dados sensíveis como conteúdo de usuário ou chaves de API
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: this.formatTimestamp(),
      ...(context && { context }),
    };
  }

  private output(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level}]`;

    if (this.isDevelopment) {
      console.log(`${prefix} ${entry.message}`, entry.context || "");
    } else {
      // Em produção, usar um sistema de logging mais robusto
      // Por enquanto, apenas console.error para erros críticos
      if (entry.level === "ERROR" || entry.level === "CRITICAL") {
        console.error(`${prefix} ${entry.message}`);
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatMessage("DEBUG", message, context));
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatMessage("INFO", message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatMessage("WARN", message, context));
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatMessage("ERROR", message, context));
  }

  critical(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatMessage("CRITICAL", message, context));
  }
}

export const logger = new Logger();

/**
 * Sanitiza dados para logging (remove dados sensíveis)
 */
export function sanitizeForLog(data: unknown): unknown {
  if (typeof data !== "object" || data === null) {
    return "[DATA_REDACTED]";
  }

  const obj = data as Record<string, unknown>;

  // Lista de campos sensíveis
  const sensitiveFields = ["content", "apiKey", "password", "token", "secret"];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
