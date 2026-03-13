"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type ApiResponse = {
  success: boolean;
  imageBase64?: string;
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
    const base64 = Buffer.from(buffer).toString("base64");
    return base64;
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

      const res = await fetch("/api/compose-base", {
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

      const data: ApiResponse = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      if (data.imageBase64) {
        setResultImage(data.imageBase64);
      }
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
          <img src={referencePreview} style={{ width: "100%", marginTop: 10 }} />
        )}

        {error && <div style={{ color: "red" }}>{error}</div>}

        <button disabled={loading}>
          {loading ? "Oluşturuluyor..." : "Kreatif Oluştur"}
        </button>
      </form>

      {generatedImageSrc && (
        <div style={{ marginTop: 40 }}>
          <h2>Sonuç</h2>
          <img src={generatedImageSrc} style={{ width: 500 }} />
        </div>
      )}
    </div>
  );
}
