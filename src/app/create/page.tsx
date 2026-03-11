"use client";

import { useState } from "react";

export default function CreatePage() {
  const [brandName, setBrandName] = useState("");
  const [sector, setSector] = useState("E-ticaret");
  const [slogan, setSlogan] = useState("");
  const [campaign, setCampaign] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [result, setResult] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setResult("");
    setImageUrl("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName,
          sector,
          slogan,
          format: "Instagram Post",
          targetAudience,
          campaign,
        }),
      });

      const data = await res.json();

      if (data.text) {
        setResult(data.text);
      } else {
        setResult("Bir hata oluştu.");
      }

      if (data.imageBase64) {
        setImageUrl(`data:image/png;base64,${data.imageBase64}`);
      }
    } catch (error) {
      setResult("Bağlantı hatası oluştu.");
    }

    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto" }}>
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
          Marka bilgilerini gir, kampanyanı yaz ve aynı sayfada hem metin hem görsel üret.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Marka Adı</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Örn: Dijivex"
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Sektör</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                }}
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
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Kampanya / Teklif</label>
              <input
                type="text"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="Örn: %20 indirim, ücretsiz kargo"
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Hedef Kitle</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Örn: 25-40 yaş kadın girişimciler"
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                }}
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
              {loading ? "Post üretiliyor..." : "Post Üret"}
            </button>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div
  <div
  style={{
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 16,
    minHeight: 300,
  }}
>
  <strong>Üretilen Görsel:</strong>

  {imageUrl ? (
    <div
      style={{
        marginTop: 16,
        position: "relative",
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <img
        src={imageUrl}
        alt="AI tarafından üretilen Instagram post görseli"
        style={{
          width: "100%",
          display: "block",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "white",
          textShadow: "0 2px 10px rgba(0,0,0,0.55)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              lineHeight: 1.15,
              maxWidth: "85%",
              marginBottom: 12,
            }}
          >
            {slogan || brandName || "Instagram Post"}
          </div>

          <div
            style={{
              fontSize: 15,
              lineHeight: 1.5,
              maxWidth: "75%",
            }}
          >
            {campaign || "Markanı öne çıkaran güçlü içerikler üret."}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              background: "rgba(0,0,0,0.35)",
              padding: "8px 12px",
              borderRadius: 999,
            }}
          >
            {sector}
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              background: "rgba(0,0,0,0.35)",
              padding: "10px 14px",
              borderRadius: 12,
            }}
          >
            {brandName || "Dijivex"}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p style={{ marginTop: 12, color: "#6b7280" }}>
      Henüz görsel üretilmedi.
    </p>
  )}
</div>
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 16,
                minHeight: 240,
                whiteSpace: "pre-wrap",
              }}
            >
              <strong>AI Post Metni:</strong>
              {result ? (
                <p style={{ marginTop: 12, lineHeight: 1.7 }}>{result}</p>
              ) : (
                <p style={{ marginTop: 12, color: "#6b7280" }}>
                  Henüz metin üretilmedi.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
