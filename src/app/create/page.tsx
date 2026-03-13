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
    slogan?: string;
    customVisualRequest?: string;
  };
  analysis?: {
    productType?: string;
    colors?: string[];
    materials?: string[];
    usageArea?: string;
    sceneSuggestion?: string;
    productLook?: string;
  };
};

export default function CreatePage() {
  const [brandName, setBrandName] = useState("");
  const [sector, setSector] = useState("");
  const [slogan, setSlogan] = useState("");
  const [format, setFormat] = useState("square");
  const [targetAudience, setTargetAudience] = useState("");
  const [campaign, setCampaign] = useState("");
  const [customVisualRequest, setCustomVisualRequest] = useState("");

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
      formData.append("customVisualRequest", customVisualRequest);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (referenceImageFile) {
        formData.append("referenceImage", referenceImageFile);
      }

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
    <>
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1180px) {
          .create-grid-fallback {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .create-upload-grid-fallback {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <div style={styles.badge}>Dijivex AI Studio</div>
            <h1 style={styles.title}>AI Reklam Kreatifi Oluştur</h1>
            <p style={styles.subtitle}>
              Ürünü yükle, kampanya bilgisini gir, istersen sahne isteğini yaz.
              Sistem tam reklam postu oluştursun.
            </p>
          </div>
        </div>

        <div className="create-grid-fallback" style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Brief Formu</h2>
            <p style={styles.cardText}>
              Müşteri isteğini yazabilirsin. Boş bırakırsan AI kendi reklam kurgusunu üretir.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Marka Adı</label>
                <input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Örn: Meg Baby"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Sektör</label>
                <input
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Örn: Bebek ürünleri, Mobilya, Kozmetik"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Slogan</label>
                <input
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Örn: Yıkanabilir bebek bezi"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Hedef Kitle</label>
                <input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Örn: Anneler, aileler, yeni evliler"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Kampanya Mesajı</label>
                <textarea
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="Örn: Bebek bezinde büyük tasarruf"
                  required
                  style={styles.textarea}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Müşteri Görsel İsteği (Opsiyonel)</label>
                <textarea
                  value={customVisualRequest}
                  onChange={(e) => setCustomVisualRequest(e.target.value)}
                  placeholder="Örn: Su efekti olsun, kelebekler uçuşsun, premium ve dikkat çekici bir instagram postu olsun, pastel tonlar kullanılsın"
                  style={styles.textareaSmall}
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

              <div className="create-upload-grid-fallback" style={styles.uploadGrid}>
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
                        <div style={styles.uploadSub}>AI ürünü buna göre çizer</div>
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

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Kreatif Oluşturuluyor..." : "Kreatif Oluştur"}
              </button>
            </form>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Oluşturulan Sonuç</h2>
            <p style={styles.cardText}>
              Bu sürümde AI tam reklam postu üretir. Sonraki adımda edit mode ekleyeceğiz.
            </p>

            {!loading && !result && (
              <div style={styles.emptyBox}>
                <div style={styles.emptyTitle}>Henüz kreatif oluşturulmadı</div>
                <div style={styles.emptySub}>
                  Sol taraftaki formu doldurup oluştur butonuna bas.
                </div>
              </div>
            )}

            {loading && (
              <div style={styles.emptyBox}>
                <div style={styles.loader} />
                <div style={styles.emptyTitle}>AI reklam postu hazırlanıyor...</div>
                <div style={styles.emptySub}>
                  Ürün analiz ediliyor, kampanya metni ve tam post üretiliyor.
                </div>
              </div>
            )}

            {result?.success && (
              <div>
                {generatedImageSrc ? (
                  <div style={styles.resultImageWrap}>
                    <img
                      src={generatedImageSrc}
                      alt="Oluşturulan reklam postu"
                      style={styles.resultImage}
                    />
                  </div>
                ) : (
                  <div style={styles.errorBox}>Görsel verisi dönmedi.</div>
                )}

                <div style={styles.metaGrid}>
                  <div style={styles.metaCard}>
                    <div style={styles.metaLabel}>Başlık</div>
                    <div style={styles.metaValue}>{result.text?.title || "-"}</div>
                  </div>

                  <div style={styles.metaCard}>
                    <div style={styles.metaLabel}>CTA</div>
                    <div style={styles.metaValue}>{result.text?.cta || "-"}</div>
                  </div>

                  <div style={styles.metaCardWide}>
                    <div style={styles.metaLabel}>Açıklama</div>
                    <div style={styles.metaValue}>{result.text?.description || "-"}</div>
                  </div>

                  <div style={styles.metaCardWide}>
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

                  <div style={styles.metaCard}>
                    <div style={styles.metaLabel}>Müşteri İsteği</div>
                    <div style={styles.metaValue}>
                      {result.meta?.customVisualRequest || "Yok"}
                    </div>
                  </div>

                  <div style={styles.metaCardWide}>
                    <div style={styles.metaLabel}>Ürün Analizi</div>
                    <div style={styles.metaValue}>
                      <strong>Tip:</strong> {result.analysis?.productType || "-"}
                      <br />
                      <strong>Kullanım Alanı:</strong> {result.analysis?.usageArea || "-"}
                      <br />
                      <strong>Sahne:</strong> {result.analysis?.sceneSuggestion || "-"}
                      <br />
                      <strong>Görünüm:</strong> {result.analysis?.productLook || "-"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
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
    fontWeight: 800,
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
    fontWeight: 700,
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
  textareaSmall: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "90px",
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
    fontWeight: 800,
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
    fontWeight: 800,
    fontSize: "15px",
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
    fontWeight: 800,
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
    overflow: "hidden",
    borderRadius: "22px",
    border: "1px solid #d1d5db",
    background: "#111827",
    marginBottom: "18px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
  },
  resultImage: {
    width: "100%",
    display: "block",
    objectFit: "cover",
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
  metaCardWide: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
    gridColumn: "1 / -1",
  },
  metaLabel: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "6px",
    fontWeight: 800,
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
