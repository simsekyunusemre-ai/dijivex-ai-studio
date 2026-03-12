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

      if (data.imageBase64) {
        setResultImage(`data:image/png;base64,${data.imageBase64}`);
      }
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
        <h1 style={{ fontSize: 32, marginBottom: 10 }}>
          Reklam Kreatifi Olustur
        </h1>

        <p style={{ color: "#6b7280" }}>
          Marka bilgilerini gir ve AI ile reklam kreatifi olustur.
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
          <h3>Temel Bilgiler</h3>

          <input
            placeholder="Marka adi"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #ddd",
              marginBottom: 14,
            }}
          />

          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #ddd",
              marginBottom: 14,
            }}
          >
            <option>Taki</option>
            <option>Moda</option>
            <option>Mobilya</option>
            <option>Kozmetik</option>
            <option>Diger</option>
          </select>

          <textarea
            placeholder="Kampanya mesaji"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #ddd",
              marginBottom: 14,
            }}
          />

          <input
            placeholder="Hedef kitle"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #ddd",
              marginBottom: 14,
            }}
          />

          <input
            type="file"
            onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
            style={{ marginBottom: 14 }}
          />

          <input
            type="file"
            onChange={(e) => setReferenceFile(e.target.files?.[0] || null)}
            style={{ marginBottom: 20 }}
          />

          <button
            onClick={handleGenerate}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              border: "none",
              background: "#111827",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
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
        <h2>Onizleme Alani</h2>

        {resultImage && (
          <div
            style={{
              position: "relative",
              maxWidth: 620,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <img
              src={resultImage}
              style={{ width: "100%" }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: 30,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >

              <div style={{ display: "flex", justifyContent: "flex-end" }}>

                {logoPreview && (
                  <img
                    src={logoPreview}
                    style={{
                      width: 60,
                      background: "white",
                      padding: 10,
                      borderRadius: 12,
                    }}
                  />
                )}

              </div>

              <div
                style={{
                  maxWidth: "75%",
                  background: "rgba(255,255,255,0.18)",
                  padding: 24,
                  borderRadius: 20,
                  backdropFilter: "blur(10px)",
                  color: "white",
                }}
              >

                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  {parsed.baslik}
                </div>

                <div
                  style={{
                    fontSize: 16,
                    marginBottom: 16,
                  }}
                >
                  {parsed.aciklama}
                </div>

                <div
                  style={{
                    background: "white",
                    color: "#111827",
                    padding: "10px 18px",
                    borderRadius: 999,
                    display: "inline-block",
                    fontWeight: 700,
                  }}
                >
                  {parsed.cagri}
                </div>

              </div>

            </div>

          </div>
        )}

        {parsed.hashtag && (
          <div
            style={{
              marginTop: 20,
              background: "#f3f4f6",
              padding: 14,
              borderRadius: 12,
            }}
          >
            <strong>Hashtag</strong>

            <div style={{ marginTop: 6 }}>
              {parsed.hashtag}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
