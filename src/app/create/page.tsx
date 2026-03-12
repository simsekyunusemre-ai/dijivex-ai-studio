"use client";

import { useMemo, useState } from "react";

function parseGeneratedText(text: string) {
  const result = {
    baslik: "",
    aciklama: "",
    cagri: "",
    hashtag: "",
  };

  if (!text) return result;

  const baslikMatch = text.match(/BASLIK:\s*([\s\S]*?)(?:ACIKLAMA:|$)/i);
  const aciklamaMatch = text.match(/ACIKLAMA:\s*([\s\S]*?)(?:CAGRI:|$)/i);
  const cagriMatch = text.match(/CAGRI:\s*([\s\S]*?)(?:HASHTAG:|$)/i);
  const hashtagMatch = text.match(/HASHTAG:\s*([\s\S]*?)$/i);

  result.baslik = baslikMatch?.[1]?.trim() || "";
  result.aciklama = aciklamaMatch?.[1]?.trim() || "";
  result.cagri = cagriMatch?.[1]?.trim() || "";
  result.hashtag = hashtagMatch?.[1]?.trim() || "";

  return result;
}

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
  const [logoPreview, setLogoPreview] = useState("");

  const parsed = useMemo(() => parseGeneratedText(resultText), [resultText]);

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

  const handleLogoChange = (file: File | null) => {
    setLogoFile(file);

    if (!file) {
      setLogoPreview("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
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
              placeholder="Orn: 25-40 yas arasi online alisveris yapan kadinlar"
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
              onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
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
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 620,
              marginBottom: 24,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
              background: "#111827",
            }}
          >
            <img
              src={resultImage}
              alt="Uretilen kreatif zemini"
              style={{
                width: "100%",
                display: "block",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.18)",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 700,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {sector || "Marka"}
                </div>

                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "contain",
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.92)",
                      padding: 8,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.85)",
                      color: "#111827",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {brandName || "Marka"}
                  </div>
                )}
              </div>

              <div
                style={{
                  maxWidth: "78%",
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 24,
                  padding: 22,
                  backdropFilter: "blur(10px)",
                  color: "white",
                }}
              >
                <div
                  style={{
                    fontSize: 34,
                    lineHeight: 1.08,
                    fontWeight: 800,
                    marginBottom: 14,
                    textShadow: "0 3px 14px rgba(0,0,0,0.22)",
                  }}
                >
                  {parsed.baslik || "Baslik burada gorunecek"}
                </div>

                <div
                  style={{
                    fontSize: 16,
                    lineHeight: 1.55,
                    color: "rgba(255,255,255,0.94)",
                    marginBottom: 18,
                  }}
                >
                  {parsed.aciklama || "Aciklama burada gorunecek"}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "12px 18px",
                      borderRadius: 999,
                      background: "#ffffff",
                      color: "#111827",
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    {parsed.cagri || "Cagri alani"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {parsed.hashtag && (
          <div
            style={{
              marginTop: 16,
              background: "#f9fafb",
              borderRadius: 14,
              padding: 16,
              color: "#4b5563",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "#111827" }}>Hashtag:</strong>

            <div style={{ marginTop: 8 }}>
              {parsed.hashtag.split("\n").join("  ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
