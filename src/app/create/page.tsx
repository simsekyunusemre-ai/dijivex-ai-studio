"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type GeneratedText = {
  title: string;
  description: string;
  cta: string;
  hashtags: string;
};

type ApiResponse = {
  success: boolean;
  image?: string;
  text?: GeneratedText;
  error?: string;
  meta?: {
    brandName: string;
    sector: string;
    format: string;
  };
};

export default function CreatePage() {
  const [brandName, setBrandName] = useState("");
  const [sector, setSector] = useState("");
  const [slogan, setSlogan] = useState("");
  const [format, setFormat] = useState("square");
  const [targetAudience, setTargetAudience] = useState("");
  const [campaign, setCampaign] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [referencePreview, setReferencePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ApiResponse | null>(null);

  const generatedImageSrc = useMemo(() => {
    if (!result?.image) return "";
    return `data:image/png;base64,${result.image}`;
  }, [result]);

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : "");
  }

  function handleReferenceChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setReferenceImageFile(file);
    setReferencePreview(file ? URL.createObjectURL(file) : "");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("brandName", brandName);
      formData.append("sector", sector);
      formData.append("slogan", slogan);
      formData.append("format", format);
      formData.append("targetAudience", targetAudience);
      formData.append("campaign", campaign);

      if (logoFile) formData.append("logo", logoFile);
      if (referenceImageFile) formData.append("referenceImage", referenceImageFile);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>Dijivex AI Studio</div>
          <h1 style={styles.title}>AI Reklam Kreatifi Oluştur</h1>
          <p style={styles.subtitle}>
            Marka bilgilerini gir, logo ve ürün görselini yükle. Sistem senin için
            reklam görseli ve metni oluştursun.
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Brief Formu</h2>
          <p style={styles.cardText}>Tüm alanları doldur ve kreatifi oluştur.</p>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Marka Adı</label>
              <input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Örn: Vira Home"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Sektör</label>
              <input
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Örn: Mobilya, Takı, Kozmetik"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Slogan</label>
              <input
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Örn: Yeni sezon ürünleri"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Hedef Kitle</label>
              <input
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Örn: 25-45 yaş"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Kampanya Mesajı</label>
              <textarea
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="Örn: Yeni sezonda özel indirim fırsatı"
                required
                style={styles.textarea}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                style={styles.input}
              >
                <option value="square">Kare (Instagram Post)</option>
                <option value="portrait">Dikey (Story / Reels)</option>
                <option value="landscape">Yatay (Banner)</option>
              </select>
            </div>

            <div style={styles.uploadGrid}>
              <div style={styles.uploadBox}>
                <div style={styles.label}>Logo Yükle</div>
                <label style={styles.uploadArea}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" style={styles.previewImage} />
                  ) : (
                    <div style={styles.uploadPlaceholder}>
                      <div style={styles.uploadTitle}>Logo seç</div>
                      <div style={styles.uploadSub}>PNG önerilir</div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    style={{ display: "none" }}
                  />
                </label>
                <div style={styles.fileName}>{logoFile?.name || "Dosya seçilmedi"}</div>
              </div>

              <div style={styles.uploadBox}>
                <div style={styles.label}>Referans / Ürün Görseli</div>
                <label style={styles.uploadArea}>
                  {referencePreview ? (
                    <img
                      src={referencePreview}
                      alt="Referans preview"
                      style={styles.previewImage}
                    />
                  ) : (
                    <div style={styles.uploadPlaceholder}>
                      <div style={styles.uploadTitle}>Ürün görseli seç</div>
                      <div style={styles.uploadSub}>Reklamda temel alınacak görsel</div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReferenceChange}
                    style={{ display: "none" }}
                    required
                  />
                </label>
                <div style={styles.fileName}>
                  {referenceImageFile?.name || "Dosya seçilmedi"}
                </div>
              </div>
            </div>

            {error ? <div style={styles.errorBox}>{error}</div> : null}

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Kreatif Oluşturuluyor..." : "Kreatif Oluştur"}
            </button>
          </form>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Oluşturulan Sonuç</h2>
          <p style={styles.cardText}>Görsel ve reklam metni burada görünecek.</p>

          {!loading && !result && (
            <div style={styles.emptyBox}>
              <div style={styles.emptyTitle}>Henüz kreatif oluşturulmadı</div>
              <div style={styles.emptySub}>
                Soldaki formu doldurup oluştur butonuna bas.
              </div>
            </div>
          )}

          {loading && (
            <div style={styles.emptyBox}>
              <div style={styles.loader} />
              <div style={styles.emptyTitle}>Yapay zeka kreatifi hazırlıyor...</div>
              <div style={styles.emptySub}>Ürün analiz ediliyor ve sahne oluşturuluyor.</div>
            </div>
          )}

          {result?.success && (
            <div>
              {generatedImageSrc ? (
                <div style={styles.resultImageWrap}>
                  <img
                    src={generatedImageSrc}
                    alt="Generated creative"
                    style={styles.resultImage}
                  />

                  <div style={styles.overlay}>
                    <div style={styles.overlayContent}>
                      <div style={styles.overlayTitle}>{result.text?.title || ""}</div>
                      <div style={styles.overlayDesc}>{result.text?.description || ""}</div>
                      <div style={styles.overlayBtn}>{result.text?.cta || "Hemen İncele"}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={styles.errorBox}>Görsel üretildi bilgisi dönmedi.</div>
              )}

              <div style={styles.metaGrid}>
                <div style={styles.metaCard}>
                  <div style={styles.metaLabel}>Hashtag</div>
                  <div style={styles.metaValue}>{result.text?.hashtags || "-"}</div>
                </div>

                <div style={styles.metaCard}>
                  <div style={styles.metaLabel}>Marka</div>
                  <div style={styles.metaValue}>{result.meta?.brandName || "-"}</div>
                </div>

                <div style={styles.metaCard}>
                  <div style={styles.metaLabel}>Sektör</div>
                  <div style={styles.metaValue}>{result.meta?.sector || "-"}</div>
                </div>

                <div style={styles.metaCard}>
                  <div style={styles.metaLabel}>Format</div>
                  <div style={styles.metaValue}>{result.meta?.format || "-"}</div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "24px",
    width: "100%",
    boxSizing: "border-box",
    background: "#f3f4f6",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "24px",
  },
  badge: {
    display: "inline-block",
    background: "#e5e7eb",
    color: "#111827",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
    marginBottom: "12px",
  },
  title: {
    margin: 0,
    fontSize: "36px",
    lineHeight: 1.1,
    color: "#111827",
  },
  subtitle: {
    marginTop: "10px",
    color: "#4b5563",
    fontSize: "15px",
    maxWidth: "760px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 460px) minmax(0, 1fr)",
    gap: "24px",
    alignItems: "start",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },
  cardTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#111827",
  },
  cardText: {
    marginTop: "8px",
    marginBottom: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "110px",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
  },
  uploadGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "18px",
  },
  uploadBox: {
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "14px",
    background: "#fafafa",
  },
  uploadArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "180px",
    border: "2px dashed #cbd5e1",
    borderRadius: "14px",
    background: "#fff",
    cursor: "pointer",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    textAlign: "center",
    padding: "16px",
  },
  uploadTitle: {
    fontWeight: 700,
    color: "#111827",
    marginBottom: "6px",
  },
  uploadSub: {
    fontSize: "13px",
    color: "#6b7280",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "160px",
    objectFit: "contain",
    display: "block",
  },
  fileName: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#6b7280",
    wordBreak: "break-word",
  },
  submitBtn: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "none",
    background: "#111827",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
  },
  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "12px 14px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  emptyBox: {
    minHeight: "420px",
    borderRadius: "18px",
    border: "1px dashed #d1d5db",
    background: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "24px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "8px",
  },
  emptySub: {
    fontSize: "14px",
    color: "#6b7280",
    maxWidth: "360px",
  },
  loader: {
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    border: "4px solid #d1d5db",
    borderTop: "4px solid #111827",
    marginBottom: "14px",
    animation: "spin 1s linear infinite",
  },
  resultImageWrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "18px",
    background: "#000",
    marginBottom: "18px",
  },
  resultImage: {
    width: "100%",
    display: "block",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.62) 100%)",
    display: "flex",
    alignItems: "flex-end",
  },
  overlayContent: {
    padding: "26px",
    color: "#fff",
    maxWidth: "70%",
  },
  overlayTitle: {
    fontSize: "30px",
    lineHeight: 1.1,
    fontWeight: 800,
    marginBottom: "10px",
    textShadow: "0 2px 10px rgba(0,0,0,0.35)",
  },
  overlayDesc: {
    fontSize: "15px",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.92)",
    marginBottom: "14px",
    textShadow: "0 2px 10px rgba(0,0,0,0.35)",
  },
  overlayBtn: {
    display: "inline-block",
    background: "#fff",
    color: "#111827",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "14px",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  metaCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
  },
  metaLabel: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "6px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  metaValue: {
    color: "#111827",
    fontSize: "14px",
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
};
