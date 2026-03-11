"use client";

import { useState } from "react";

export default function CreatePage() {
  const [brandName, setBrandName] = useState("");
  const [sector, setSector] = useState("E-ticaret");
  const [slogan, setSlogan] = useState("");
  const [format, setFormat] = useState("Instagram Post");
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
          format
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
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        AI İçerik Oluştur
      </h1>
      <p style={{ marginBottom: 24 }}>
        Marka bilgilerini gir, içerik formatını seç ve AI metin üretsin.
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Marka Adı</label>
          <input
            type="text"
            placeholder="Örn: Dijivex"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            style={{ width: "100%", padding: 12 }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Sektör</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            style={{ width: "100%", padding: 12 }}
          >
            <option>E-ticaret</option>
            <option>Takı</option>
            <option>Mobilya</option>
            <option>Bebek Ürünleri</option>
            <option>Reklam Ajansı</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Slogan</label>
          <input
            type="text"
            placeholder="Örn: Tarzinizi yapay zeka ile one cikarın"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            style={{ width: "100%", padding: 12 }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={{ width: "100%", padding: 12 }}
          >
            <option>Instagram Post</option>
            <option>Instagram Story</option>
            <option>Reklam Görseli</option>
            <option>Video Prompt</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: 14,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {loading ? "Üretiliyor..." : "İçerik Oluştur"}
        </button>

        {result && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              background: "#fff",
              border: "1px solid #ddd",
              whiteSpace: "pre-wrap",
            }}
          >
            <strong>AI Sonucu:</strong>
            <p style={{ marginTop: 12 }}>{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}
