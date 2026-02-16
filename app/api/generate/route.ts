/**
 * API Route para geração de conteúdo
 * POST /api/generate
 *
 * Recebe: { type: "planejamento" | "ocorrencia" | "atividade", content?: string, context?: {...} }
 * Retorna: { success: boolean, result?: string, error?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { generateContent, validateAPIKey } from "@/lib/openai";
import { generatePrompt, getSystemPrompt, validateContent, validateOcorrenciaContext, validateAtividadeContext } from "@/lib/prompts";
import { validateRequest } from "@/lib/validation";
import { GenerateResponse } from "@/lib/types";

/**
 * Handler POST para requisições de geração
 */
export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    // 1. Validar método HTTP
    if (request.method !== "POST") {
      return NextResponse.json(
        {
          success: false,
          error: "Método não permitido",
        },
        { status: 405 }
      );
    }

    // 2. Validar Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          error: "Content-Type deve ser application/json",
        },
        { status: 400 }
      );
    }

    // 3. Parsear body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "JSON inválido no corpo da requisição",
        },
        { status: 400 }
      );
    }

    // 4. Validar estrutura básica da requisição
    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const { type, content, context } = validation.data!;

    // 5. Validação específica por tipo
    if (type === "ocorrencia") {
      if (!context || !("tipo" in context)) {
        return NextResponse.json(
          {
            success: false,
            error: "Contexto de ocorrência é obrigatório",
          },
          { status: 400 }
        );
      }
      const contextError = validateOcorrenciaContext(context);
      if (contextError) {
        return NextResponse.json(
          {
            success: false,
            error: contextError,
          },
          { status: 400 }
        );
      }
    }

    if (type === "atividade") {
      if (!context || !("turma" in context)) {
        return NextResponse.json(
          {
            success: false,
            error: "Contexto de atividade é obrigatório",
          },
          { status: 400 }
        );
      }
      const contextError = validateAtividadeContext(context);
      if (contextError) {
        return NextResponse.json(
          {
            success: false,
            error: contextError,
          },
          { status: 400 }
        );
      }
    }

    // 6. Validar conteúdo (obrigatório para planejamento e ocorrência)
    if (type !== "atividade") {
      const contentError = validateContent(content);
      if (contentError) {
        return NextResponse.json(
          {
            success: false,
            error: contentError,
          },
          { status: 400 }
        );
      }
    }

    // 7. Verificar disponibilidade da API OpenAI
    const apiAvailable = await validateAPIKey();
    if (!apiAvailable) {
      console.error("OpenAI API key validation failed");
      return NextResponse.json(
        {
          success: false,
          error: "Serviço indisponível no momento. Tente novamente mais tarde.",
        },
        { status: 503 }
      );
    }

    // 8. Gerar conteúdo
    const systemPrompt = getSystemPrompt();
    const userPrompt = generatePrompt(type, content || "", context);

    const response = await generateContent(systemPrompt, userPrompt);

    // 9. Retornar sucesso
    return NextResponse.json({
      success: true,
      result: response.content,
    });
  } catch (error) {
    // Log apenas de mensagens de erro (sem dados sensíveis)
    console.error(
      "Erro na rota /api/generate:",
      error instanceof Error ? error.message : "Erro desconhecido"
    );

    // Retornar mensagem genérica ao usuário
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao processar solicitação",
      },
      { status: 500 }
    );
  }
}

/**
 * Handler GET para verificação de saúde (health check)
 */
export async function GET(): Promise<NextResponse<{ status: string }>> {
  const apiAvailable = await validateAPIKey();

  return NextResponse.json(
    {
      status: apiAvailable ? "ok" : "unavailable",
    },
    { status: apiAvailable ? 200 : 503 }
  );
}
