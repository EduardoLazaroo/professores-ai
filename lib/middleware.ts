/**
 * Middleware placeholder para autenticação futura
 * Arquivo estruturado para ser implementado em V2
 */

import { NextRequest, NextResponse } from "next/server";
import { AuthContext } from "@/lib/auth-types";

/**
 * Valida token JWT (implementação futura)
 */
export async function verifyAuth(): Promise<AuthContext> {
  // Placeholder - será implementado em V2 com NextAuth ou similar
  return {
    authenticated: false, // V1: sempre false
  };
}

/**
 * Verifica rate limit (implementação futura)
 */
export async function checkRateLimit(): Promise<boolean> {
  // Placeholder - será implementado em V2 com Redis ou banco de dados
  return true; // V1: sempre permite
}

/**
 * Middleware para proteger rotas (V2)
 */
export function withAuth(
  handler: (request: NextRequest, auth?: AuthContext) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const auth = await verifyAuth();

    if (!auth.authenticated) {
      // V1: não requer autenticação
      // V2: retornará erro 401
      return handler(request);
    }

    return handler(request, auth);
  };
}

/**
 * Middleware para rate limiting (V2)
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const auth = await verifyAuth();

    if (auth.authenticated && auth.userId) {
      const allowed = await checkRateLimit();

      if (!allowed) {
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          { status: 429 }
        );
      }
    }

    return handler(request);
  };
}
