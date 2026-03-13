"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type ComposeResponse = {
  success: boolean;
  imageBase64?: string;
  error?: string;
};

type LayoutResponse = {
  success: boolean;
  layout?: unknown;
  error?: string;
};

export default function CreatePage() {
  const [brandName, setBrandName] = useState("");
  const [sector, setSector] = useState("");
  const [format, setFormat] = useState("square");
  const [targetAudience, setTargetAudience] = useState("");
  const [campaign, setCampaign] = useState("");
  const [customVisualRequest, setCustomVisualRequest] = useState("");

  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImage, setResultImage] = useState("");

  const generatedImageSrc = useMemo(() => {
    if (!resultImage) return "";
    return `data:image/png;base64,${resultImage}`;
  }, [resultImage]);

  function handleReferenceChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setReferenceImageFile(file);
    setReferencePreview(file ? URL.createObjectURL(file) : "");
  }

  async function fileToBase64(file: File) {
    const buffer = await file.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 8192;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!referenceImageFile) {
      setError("Ürün görseli gerekli");
      return;
    }

    setLoading(true);
    setError("");
    setResultImage("");

    try {
      const base64 = await fileToBase64(referenceImageFile);

      // 1) Base image oluştur
      const composeRes = await fetch("/api/compose-base", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName,
          sector,
          format,
          targetAudience,
          campaign,
          customerVisualRequest: customVisualRequest,
          productImageBase64: base64,
          mimeType: referenceImageFile.type,
        }),
      });

      const composeData: ComposeResponse = await composeRes.json();

      if (!composeRes.ok || !composeData.success || !composeData.imageBase64) {
        throw new Error(composeData.error || "Base image üretilemedi");
      }

      setResultImage(composeData.imageBase64);

      // 2) Layout plan oluştur
      const layoutRes = await fetch("/api/plan-layout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format,
          brandName,
          sector,
          campaign,
          targetAudience,
          imageBase64: composeData.imageBase64,
          mimeType: "image/png",
        }),
      });

      const layoutData: LayoutResponse = await layoutRes.json();

      if (!layoutRes.ok || !layoutData.success) {
        throw new Error(layoutData.error || "Layout plan oluşturulamadı");
      }

      console.log("LAYOUT PLAN:", layoutData.layout);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Dijivex AI Studio</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <input
          placeholder="Marka"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          required
        />

        <input
          placeholder="Sektör"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          required
        />

        <input
          placeholder="Hedef Kitle"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        />

        <textarea
          placeholder="Kampanya mesajı"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
        />

        <textarea
          placeholder="Görsel isteği"
          value={customVisualRequest}
          onChange={(e) => setCustomVisualRequest(e.target.value)}
        />

        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="square">Square</option>
          <option value="portrait">Story</option>
        </select>

        <input type="file" accept="image/*" onChange={handleReferenceChange} required />

        {referencePreview && (
          <img src={referencePreview} alt="Önizleme" style={{ width: "100%", marginTop: 10 }} />
        )}

        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

        <button disabled={loading} style={{ marginTop: 12 }}>
          {loading ? "Oluşturuluyor..." : "Kreatif Oluştur"}
        </button>
      </form>

      {generatedImageSrc && (
        <div style={{ marginTop: 40 }}>
          <h2>Sonuç</h2>
          <img src={generatedImageSrc} alt="Sonuç" style={{ width: 500, maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}
