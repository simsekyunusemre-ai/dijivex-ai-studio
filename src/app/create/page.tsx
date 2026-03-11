"use client";

import { useState } from "react";

export default function CreatePage() {
  const [brandName, setBrandName] = useState("");
  const [sector, setSector] = useState("E-ticaret");
  const [slogan, setSlogan] = useState("");
  const [campaign, setCampaign] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          brandName,
          sector,
          slogan,
          format: "Instagram Post",
          targetAudience,
          campaign
        })
      });

      const data = await res.json();

      if (data.text) {
        setResult(data.text);
      } else {
        setResult("Bir hata oluştu.");
      }
    } catch (error) {
      setResult("Bağlantı hatası oluştu.");
    }

    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto" }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: 32, marginTop: 0, marginBottom: 8 }}>
          AI Instagram Post Generator
        </h1>
        <p style={{ color: "#4b5563", marginBottom: 24 }}>
          Marka bilgilerini gir, kampanyanı yaz ve Instagram post metnini üret.
        </p>

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Marka Adı</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Örn: Dijivex"
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Sektör</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
            >
              <option>E-ticaret</option>
              <option>Takı</option>
              <option>Mobilya</option>
              <option>Bebek Ürünleri</option>
              <option>Reklam Ajansı</option>
              <option>Kozmetik</option>
              <option>Giyim</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Slogan</label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="Örn: Markanı öne çıkar"
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Kampanya / Teklif</label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="Örn: %20 indirim, ücretsiz kargo"
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Hedef Kitle</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Örn: 25-40 yaş kadın girişimciler"
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            style={{
              padding: 14,
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 700,
              background: "#111827",
              color: "white",
            }}
          >
            {loading ? "Instagram post üretiliyor..." : "Instagram Post Üret"}
          </button>

          {result && (
            <div
              style={{
                marginTop: 8,
                padding: 20,
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                whiteSpace: "pre-wrap",
              }}
            >
              <strong>AI Post Metni:</strong>
              <p style={{ marginTop: 12, lineHeight: 1.7 }}>{result}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
