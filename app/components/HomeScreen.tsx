/**
 * Tela inicial (Home) da aplicação
 * Contém informações institucionais e de segurança
 */

"use client";

import { useState, useCallback } from "react";

interface HomeScreenProps {
  onWhatsAppClick: () => void;
  onPixCopy: () => void;
}

export function HomeScreen({ onWhatsAppClick, onPixCopy }: HomeScreenProps) {
  const [pixCopied, setPixCopied] = useState(false);

  const handlePixCopyClick = useCallback(() => {
    onPixCopy();
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  }, [onPixCopy]);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">
          Bem-vindo ao Assistente AI para Professores
        </h1>
        <p className="text-lg text-gray-600">
          Ferramenta desenvolvida por professores, para professores
        </p>
      </div>

      {/* Seções de informação */}
      <div className="space-y-6">
        {/* Eixo Técnico (EPT) Novo Highlight */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">💻</span>
            <h2 className="text-xl font-bold text-blue-300">
              Novo: Planejamento Eixo Técnico (EPT)
            </h2>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed mb-3">
            Ferramenta especializada para os cursos de TI da <strong>EE Monsenhor Bicudo</strong> (2º e 3º ano técnico). Suporta cópia e cola direta de planilhas Excel/TSV, extração automática de competências práticas e exportação de PDF institucional oficial!
          </p>
          <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
            Navegue até a aba "Eixo Técnico" no menu superior para experimentar
          </span>
        </section>

        {/* Sobre a ferramenta */}
        <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            Sobre a Ferramenta
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Esta plataforma foi desenvolvida por Eduardo Lázaro, um professor dedicado à educação, para auxiliar colegas professores em suas tarefas administrativas e pedagógicas. O objetivo é oferecer suporte através de inteligência artificial, <strong>nunca substituindo a autonomia profissional e pedagógica do professor</strong>.
          </p>
        </section>

        {/* Segurança e privacidade */}
        <section className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h2 className="text-xl font-semibold text-green-900 mb-3">
            🔒 Segurança e Privacidade
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>✓ Dados seguros:</strong> Sua privacidade é nossa prioridade. Nenhum dado enviado é armazenado em nossos servidores.
            </p>
            <p>
              <strong>✓ Conformidade LGPD:</strong> Cumprimos integralmente a Lei Geral de Proteção de Dados (LGPD) brasileira.
            </p>
            <p>
              <strong>✓ Comunicação criptografada:</strong> Todos os dados são transmitidos via HTTPS.
            </p>
            <p>
              <strong>✓ Sem rastreamento:</strong> Não coletamos dados pessoais ou navegação.
            </p>
          </div>
        </section>

        {/* Sobre os custos */}
        <section className="bg-amber-50 rounded-lg p-6 border border-amber-200">
          <h2 className="text-xl font-semibold text-amber-900 mb-3">
            💡 Como Funciona
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              Cada requisição enviada à nossa plataforma consome tokens da API da OpenAI, gerando um custo operacional. Mantemos a ferramenta <strong>completamente gratuita para todos os professores</strong>, custeando esses gastos por conta própria.
            </p>
            <p>
              Se você utiliza regularmente e deseja contribuir para manter a ferramenta funcionando, contribuições via PIX são bem-vindas e muito apreciadas!
            </p>
          </div>
        </section>

        {/* Contribuição */}
        <section className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-900 mb-3">
            ❤️ Contribuição Opcional
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Contribuições de <strong>R$ 2,00 por semana</strong> já ajudam muito a manter a ferramenta online e em funcionamento. Toda contribuição é 100% voluntária e honra sua confiança neste projeto.
            </p>
            <div className="bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600">Chave PIX (CPF):</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-sm text-gray-900">
                  18998065592
                </code>
                <button
                  onClick={handlePixCopyClick}
                  className={`px-4 py-2 text-white rounded font-medium transition-all text-sm flex items-center gap-2 ${
                    pixCopied
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800 shadow-md hover:shadow-lg"
                  }`}
                >
                  {pixCopied ? (
                    <>
                      <span>✓</span>
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Futuro da plataforma */}
        <section className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
          <h2 className="text-xl font-semibold text-indigo-900 mb-3">
            🚀 Próximos Passos
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Estamos planejando implementar um sistema de login que permitirá controlar seu uso semanal e garantir que a ferramenta seja usufruída equitativamente por todos os professores. Isso garantirá sustentabilidade a longo prazo.
          </p>
        </section>

        {/* Contato */}
        <section className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📞 Entre em Contato
          </h2>
          <p className="text-gray-700 mb-4">
            Tem dúvidas, sugestões ou encontrou um problema? Clique no botão abaixo para abrir uma conversa no WhatsApp comigo.
          </p>
          <button
            onClick={onWhatsAppClick}
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>💬</span>
            Enviar Mensagem via WhatsApp
          </button>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>
            Feito com ❤️ para ajudar professores que, como eu, buscam facilitar suas tarefas administrativas.
          </p>
        </div>
      </div>
    </div>
  );
}
