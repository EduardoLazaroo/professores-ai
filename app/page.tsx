"use client";

import { useState, useCallback } from "react";
import { TabsNavigation } from "@/app/components/TabsNavigation";
import { HomeScreen } from "@/app/components/HomeScreen";
import { PlanejamentoScreen } from "@/app/components/screens/PlanejamentoScreen";
import { OcorrenciaScreen } from "@/app/components/screens/OcorrenciaScreen";
import { AtividadeScreen } from "@/app/components/screens/AtividadeScreen";
import { GenerateResponse, OcorrenciaContext, AtividadeContext } from "@/lib/types";

type TabId = "home" | "planejamento" | "ocorrencia" | "atividade";

interface TabState {
  content: string;
  result: string;
  error: string;
  loading: boolean;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  // Estados isolados por aba
  const [planejamentoState, setPlanejamentoState] = useState<TabState>({
    content: "",
    result: "",
    error: "",
    loading: false,
  });

  const [ocorrenciaState, setOcorrenciaState] = useState<TabState>({
    content: "",
    result: "",
    error: "",
    loading: false,
  });

  const [atividadeState, setAtividadeState] = useState<TabState>({
    content: "",
    result: "",
    error: "",
    loading: false,
  });

  /**
   * Gera conteúdo para Planejamento
   */
  const handlePlanejamentoGenerate = useCallback(
    async (content: string) => {
      setPlanejamentoState((prev) => ({
        ...prev,
        loading: true,
        error: "",
      }));

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "planejamento",
            content: content.trim(),
          }),
        });

        const data: GenerateResponse = await response.json();

        if (!response.ok) {
          setPlanejamentoState((prev) => ({
            ...prev,
            error: data.error || "Erro ao processar solicitação",
            loading: false,
          }));
          return;
        }

        if (data.success && data.result) {
          setPlanejamentoState((prev) => ({
            ...prev,
            result: data.result || "",
            error: "",
            loading: false,
          }));
        } else {
          setPlanejamentoState((prev) => ({
            ...prev,
            error: data.error || "Erro desconhecido",
            loading: false,
          }));
        }
      } catch (err) {
        setPlanejamentoState((prev) => ({
          ...prev,
          error:
            err instanceof Error
              ? err.message
              : "Erro de conexão. Tente novamente.",
          loading: false,
        }));
      }
    },
    []
  );

  /**
   * Gera conteúdo para Ocorrência
   */
  const handleOcorrenciaGenerate = useCallback(
    async (content: string, context: OcorrenciaContext) => {
      setOcorrenciaState((prev) => ({
        ...prev,
        loading: true,
        error: "",
      }));

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "ocorrencia",
            content: content.trim(),
            context,
          }),
        });

        const data: GenerateResponse = await response.json();

        if (!response.ok) {
          setOcorrenciaState((prev) => ({
            ...prev,
            error: data.error || "Erro ao processar solicitação",
            loading: false,
          }));
          return;
        }

        if (data.success && data.result) {
          setOcorrenciaState((prev) => ({
            ...prev,
            result: data.result || "",
            error: "",
            loading: false,
          }));
        } else {
          setOcorrenciaState((prev) => ({
            ...prev,
            error: data.error || "Erro desconhecido",
            loading: false,
          }));
        }
      } catch (err) {
        setOcorrenciaState((prev) => ({
          ...prev,
          error:
            err instanceof Error
              ? err.message
              : "Erro de conexão. Tente novamente.",
          loading: false,
        }));
      }
    },
    []
  );

  /**
   * Gera conteúdo para Atividade
   */
  const handleAtividadeGenerate = useCallback(
    async (context: AtividadeContext) => {
      setAtividadeState((prev) => ({
        ...prev,
        loading: true,
        error: "",
      }));

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "atividade",
            content: "",
            context,
          }),
        });

        const data: GenerateResponse = await response.json();

        if (!response.ok) {
          setAtividadeState((prev) => ({
            ...prev,
            error: data.error || "Erro ao processar solicitação",
            loading: false,
          }));
          return;
        }

        if (data.success && data.result) {
          setAtividadeState((prev) => ({
            ...prev,
            result: data.result || "",
            error: "",
            loading: false,
          }));
        } else {
          setAtividadeState((prev) => ({
            ...prev,
            error: data.error || "Erro desconhecido",
            loading: false,
          }));
        }
      } catch (err) {
        setAtividadeState((prev) => ({
          ...prev,
          error:
            err instanceof Error
              ? err.message
              : "Erro de conexão. Tente novamente.",
          loading: false,
        }));
      }
    },
    []
  );

  /**
   * Handlers para Home
   */
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/18998065592", "_blank");
  };

  const handlePixCopy = () => {
    navigator.clipboard.writeText("18998065592");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navegação em abas */}
      <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conteúdo baseado na aba ativa */}
      <div className="py-6">
        {activeTab === "home" && (
          <HomeScreen
            onWhatsAppClick={handleWhatsAppClick}
            onPixCopy={handlePixCopy}
          />
        )}

        {activeTab === "planejamento" && (
          <PlanejamentoScreen
            content={planejamentoState.content}
            result={planejamentoState.result}
            error={planejamentoState.error}
            loading={planejamentoState.loading}
            onContentChange={(content) =>
              setPlanejamentoState((prev) => ({ ...prev, content }))
            }
            onGenerate={handlePlanejamentoGenerate}
          />
        )}

        {activeTab === "ocorrencia" && (
          <OcorrenciaScreen
            content={ocorrenciaState.content}
            result={ocorrenciaState.result}
            error={ocorrenciaState.error}
            loading={ocorrenciaState.loading}
            onContentChange={(content) =>
              setOcorrenciaState((prev) => ({ ...prev, content }))
            }
            onGenerate={handleOcorrenciaGenerate}
          />
        )}

        {activeTab === "atividade" && (
          <AtividadeScreen
            result={atividadeState.result}
            error={atividadeState.error}
            loading={atividadeState.loading}
            onGenerate={handleAtividadeGenerate}
          />
        )}
      </div>
    </main>
  );
}