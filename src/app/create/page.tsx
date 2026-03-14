"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type RemoveBgResponse = {
  success: boolean;
  image?: string;
  mimeType?: string;
  error?: string;
};

export default function CreatePage() {
  const [brandName, setBrandName] = useState("");
  const [sector, setSector] = useState("");
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");

  const previewSrc = useMemo(() => referencePreview, [referencePreview]);

  function handleReferenceChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setReferenceImageFile(file);
    setReferencePreview(file ? URL.createObjectURL(file) : "");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!referenceImageFile) {
      setError("Ürün görseli gerekli");
      return;
    }

    setLoading(true);
    setError("");
    setResultUrl("");

    try {
      const formData = new FormData();
      formData.append("image", referenceImageFile);

      const removeRes = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      const removeData: RemoveBgResponse = await removeRes.json();

      if (!removeRes.ok || !removeData.success || !removeData.image) {
        throw new Error(removeData.error || "Arka plan kaldırma başarısız");
      }

      const renderRes = await fetch("/api/render-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName,
          sector,
          productImageBase64: removeData.image,
        }),
      });

      if (!renderRes.ok) {
        const text = await renderRes.text();
        throw new Error(text || "Render başarısız");
      }

      const blob = await renderRes.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultUrl(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      <h1>Dijivex AI Studio</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500, marginBottom: 30 }}>
        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Marka"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            style={{ width: "100%", padding: 12 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Sektör"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            style={{ width: "100%", padding: 12 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleReferenceChange}
            required
          />
        </div>

        {previewSrc && (
          <div style={{ marginBottom: 12 }}>
            <img
              src={previewSrc}
              alt="Ürün önizleme"
              style={{ width: 240, borderRadius: 12 }}
            />
          </div>
        )}

        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 18px",
            borderRadius: 10,
            border: "none",
            background: "#111827",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Oluşturuluyor..." : "Reklamı Oluştur"}
        </button>
      </form>

      {resultUrl && (
        <div>
          <h2>Sonuç</h2>
          <img
            src={resultUrl}
            alt="Reklam sonucu"
            style={{ width: 420, maxWidth: "100%", borderRadius: 16 }}
          />
        </div>
      )}
    </div>
  );
}
