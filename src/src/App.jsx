import React, { useState } from "react";

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(prompt) {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

const G = {
  bg: "#0a0a0f",
  surface: "#12121a",
  border: "#1e1e2e",
  accent: "#6c47ff",
  text: "#f0f0ff",
  textMuted: "#7070a0",
  green: "#22c55e",
  red: "#ef4444",
};

export default function App() {
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!name) return setError("Entre un nom de produit !");
    setLoading(true);
    setError("");
    setResult("");
    try {
      const text = await callGroq(`Crée une fiche produit complète et professionnelle pour: ${name}. Inclus: description, caractéristiques, avantages, et accroche marketing.`);
      setResult(text);
    } catch (e) {
      setError("Erreur: " + e.message);
    }
    setLoading(false);
  };

  const copy = () => navigator.clipboard.writeText(result);

  return (
    <div style={{ minHeight: "100vh", background: G.bg, color: G.text, fontFamily: "sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 8, fontSize: 28 }}>🛍️ ShopContent AI</h1>
        <p style={{ textAlign: "center", color: G.textMuted, marginBottom: 32 }}>Génère des fiches produit en quelques secondes</p>

        <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 16, padding: 24 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
            placeholder="Nom du produit..."
            style={{ width: "100%", background: "#0a0a0f", border: `1px solid ${G.border}`, borderRadius: 10, padding: "12px 16px", color: G.text, fontSize: 16, marginBottom: 16, outline: "none" }}
          />
          <button
            onClick={generate}
            disabled={loading}
            style={{ width: "100%", background: G.accent, color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "⏳ Génération..." : "✨ Générer la fiche produit"}
          </button>
          {error && <p style={{ color: G.red, marginTop: 12 }}>{error}</p>}
        </div>

        {result && (
          <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 16, padding: 24, marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <strong style={{ fontSize: 16 }}>✅ Fiche générée</strong>
              <button onClick={copy} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, padding: "8px 16px", color: G.text, cursor: "pointer" }}>
                📋 Copier
              </button>
            </div>
            <div style={{ whiteSpace: "pre-wrap", color: G.textMuted, lineHeight: 1.7 }}>{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}
