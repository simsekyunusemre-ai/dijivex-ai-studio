"use client";

import { useState } from "react";

export default function CreatePage() {
  const [brandName, setBrandName] = useState("");
  const [sector, setSector] = useState("Taki");
  const [format, setFormat] = useState("Meta Ads Kreatifi");
  const [campaign, setCampaign] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [resultImage, setResultImage] = useState("");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setResultText("");
      setResultImage("");

      const formData = new FormData();
      formData.append("brandName", brandName);
      formData.append("sector", sector);
      formData.append("format", format);
      formData.append("campaign", campaign);
      formData.append("targetAudience", targetAudience);

      if (logoFile) {
        formData.append("logoFile", logoFile);
      }

      if (referenceFile) {
        formData.append("referenceFile", referenceFile);
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Bir hata olustu.");
        return;
      }

      setResultText(data.text || "");
      setResultImage(data.imageBase64 ? `data:image/png;base64,${data.imageBase64}` : "");
    } catch (error) {
      console.error(error);
      alert("Bir hata olustu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 32, margin: 0, marginBottom: 10 }}>
          Reklam Kreatifi Olustur
        </h1>

        <p style={{ color: "#6b7280", margin: 0 }}>
          Marka bilgilerini gir, gorselleri yukle ve Meta Ads icin kreatif olustur.
        </p>
      </div>

      <div className="card-grid">
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>Temel Bilgiler</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Marka Adi
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Marka adini gir"
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Sektor
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            >
              <option>Taki</option>
              <option>Mobilya</option>
              <option>Guzellik</option>
              <option>Moda</option>
              <option>Diger</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            >
              <option>Instagram Post</option>
              <option>Instagram Story</option>
              <option>Meta Ads Kreatifi</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Kampanya Mesaji
            </label>
            <textarea
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="Orn: Yeni sezon urunlerinde ozel indirim"
              rows={5}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Hedef Kitle
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Orn: 25-40 yas kadin musteriler"
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>Dosyalar ve Uretim</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Logo Yukle
            </label>
            <input
              type="file"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Referans Gorsel
            </label>
            <input
              type="file"
              onChange={(e) => setReferenceFile(e.target.files?.[0] || null)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>

          <div
            style={{
              background: "#f9fafb",
              borderRadius: 14,
              padding: 16,
              marginBottom: 20,
              color: "#4b5563",
              lineHeight: 1.6,
            }}
          >
            Sistem once metni, sonra da yazi eklenmemis kreatif zeminini uretecek.
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 14,
              border: "none",
              background: "#111827",
              color: "white",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Uretiliyor..." : "Kreatif Olustur"}
          </button>
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          marginTop: 24,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Onizleme Alani</h2>

        {!resultText && !resultImage && (
          <p style={{ color: "#6b7280", margin: 0 }}>
            Kreatif uretildikten sonra burada gorunecek.
          </p>
        )}

        {resultImage && (
          <div style={{ marginBottom: 20 }}>
            <img
              src={resultImage}
              alt="Uretilen kreatif zemini"
              style={{
                width: "100%",
                maxWidth: 560,
                borderRadius: 16,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>
        )}

        {resultText && (
          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              color: "#111827",
              background: "#f9fafb",
              borderRadius: 14,
              padding: 18,
            }}
          >
            {resultText}
          </div>
        )}
      </div>
    </div>
  );
}
