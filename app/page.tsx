"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [type, setType] = useState("planejamento");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content) return;

    setLoading(true);
    setResult("");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, content }),
    });

    const data = await response.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Assistente para Professores
        </h1>

        <div className="mb-4">
          <select
            className="w-full border p-2 rounded-lg"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="planejamento">Planejamento Semanal</option>
            <option value="ocorrencia">Ocorrência Formal</option>
          </select>
        </div>

        <textarea
          className="w-full border p-3 rounded-lg mb-4 min-h-[150px]"
          placeholder="Cole aqui o conteúdo..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Gerando..." : "Gerar"}
        </button>

        {result && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50 whitespace-pre-wrap">
            {result}
          </div>
        )}

        <footer className="mt-6 text-xs text-gray-500 text-center">
          🔒 Nenhum texto é armazenado. Comunicação segura via HTTPS.
        </footer>
      </div>
    </main>
  );
}