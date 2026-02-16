/**
 * Serviço de integração com OpenAI
 * Centraliza toda a lógica de comunicação com a API
 */

import OpenAI from "openai";
import { OpenAIResponse } from "./types";

// Validar se a chave de API está configurada
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY não está configurada nas variáveis de ambiente"
  );
}

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "User-Agent": "OpenAI/Node",
  },
});

// Configurações para o modelo
const MODEL = "gpt-4o-mini"; // Use gpt-4o-mini para melhor custo/benefício
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.7;

/**
 * Envia um prompt para a OpenAI e retorna o resultado
 * @param systemPrompt - Instrução do sistema
 * @param userPrompt - Prompt do usuário
 * @returns Conteúdo gerado
 * @throws Erro se algo der errado na integração
 */
export async function generateContent(
  systemPrompt: string,
  userPrompt: string
): Promise<OpenAIResponse> {
  try {
    const message = await openai.chat.completions.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Extrair conteúdo da resposta
    const content = message.choices
      .map((choice) => choice.message?.content || "")
      .join("\n");

    if (!content) {
      throw new Error("Resposta vazia da OpenAI");
    }

    return {
      content,
    };
  } catch (error) {
    // Log apenas de informações não-sensíveis
    console.error(
      "Erro ao comunicar com OpenAI:",
      error instanceof Error ? error.message : "Erro desconhecido"
    );

    // Não expor detalhes internos da API ao usuário
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw new Error("Erro de autenticação: chave de API inválida");
      }
      if (error.status === 429) {
        throw new Error("Limite de requisições excedido. Tente novamente em alguns momentos.");
      }
      if (error.status === 500) {
        throw new Error("Serviço temporariamente indisponível. Tente novamente.");
      }
    }

    throw new Error("Erro ao processar solicitação. Tente novamente.");
  }
}

/**
 * Valida a disponibilidade da API (pode ser usado em health checks futuros)
 */
export async function validateAPIKey(): Promise<boolean> {
  try {
    await openai.models.retrieve("gpt-4o-mini");
    return true;
  } catch {
    return false;
  }
}
