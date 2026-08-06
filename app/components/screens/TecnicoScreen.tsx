"use client";

import React from "react";
import { TecnicoFormSection } from "../TecnicoFormSection";
import { TecnicoResultSection } from "../TecnicoResultSection";
import { TecnicoContext } from "@/lib/types";

interface TecnicoScreenProps {
  context: TecnicoContext;
  setContext: React.Dispatch<React.SetStateAction<TecnicoContext>>;
  content: string;
  result: string;
  error: string;
  loading: boolean;
  onContentChange: (content: string) => void;
  onGenerate: (content: string, context: TecnicoContext) => void;
  onReset: () => void;
}

export const TecnicoScreen: React.FC<TecnicoScreenProps> = ({
  context,
  setContext,
  content,
  result,
  error,
  loading,
  onContentChange,
  onGenerate,
  onReset,
}) => {
  return (
    <div className="py-6 px-4">
      {error && (
        <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center justify-between shadow-sm">
          <span>⚠️ {error}</span>
        </div>
      )}

      {result ? (
        <TecnicoResultSection
          context={context}
          resultText={result}
          onReset={onReset}
        />
      ) : (
        <TecnicoFormSection
          context={context}
          setContext={setContext}
          content={content}
          setContent={onContentChange}
          onSubmit={() => onGenerate(content, context)}
          isLoading={loading}
        />
      )}
    </div>
  );
};
