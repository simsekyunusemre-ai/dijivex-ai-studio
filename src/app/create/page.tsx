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
  background?: string;
  text?: GeneratedText;
  error?: string;
  layout?: {
    productPosition: string;
    textPosition: string;
    ctaPosition: string;
  };
  meta?: {
    brandName: string;
    sector: string;
    format: string;
    slogan?: string;
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
  const [cutoutImage, setCutoutImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ApiResponse | null>(null);

  const backgroundSrc = useMemo(() => {
    if (!result?.background) return "";
    return `data:image/png;base64,${result.background}`;
  }, [result]);

  const posterAspect =
    format === "portrait" ? "4 / 5" : format === "landscape" ? "16 / 9" : "1 / 1";

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : "");
  }

  async function handleReferenceChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    setReferenceImageFile(file);
    setReferencePreview(file ? URL.createObjectURL(file) : "");
    setCutoutImage("");
    setError("");

    if (!file) return;

    try {
      setRemovingBg(true);

      const bgForm = new FormData();
      bgForm.append("image", file);

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: bgForm,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Arka plan kaldırılamadı.");
      }

      setCutoutImage(`data:${data.mimeType};base64,${data.image}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Arka plan kaldırılamadı.");
    } finally {
      setRemovingBg(false);
    }
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

        @media (max-width: 1100px) {
          .create-grid-fallback {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .create-upload-grid-fallback {
            grid-template-columns: 1fr !important;
          }

          .poster-overlay-content {
            max-width: 84% !important;
            padding: 18px !important;
          }

          .poster-title {
            font-size: 22px !important;
            line-height: 1.08 !important;
          }

          .poster-desc {
            font-size: 13px !important;
            line-height: 1.45 !important;
          }

          .poster-product {
            max-width: 66% !important;
            max-height: 54% !important;
          }

          .poster-logo {
            width: 64px !important;
            height: 64px !important;
          }

          .poster-cta {
            font-size: 12px !important;
            padding: 10px 14px !important;
          }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <div style={styles.badge}>Dijivex AI Studio</div>
            <h1 style={styles.title}>AI Reklam Kreatifi Oluştur</h1>
            <p style={styles.subtitle}>
              Referans ürünü bozmadan, merkezde konumlandırılmış reklam sahnesi oluştur.
              Yazılar tasarımlı şekilde görsel üstünde yer alır.
            </p>
          </div>
        </div>

        <div className="create-grid-fallback" style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Brief Formu</h2>
            <p style={styles.cardText}>Ürünü yükle, sistemi çalıştır, yeni tasarım al.</p>

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
                  placeholder="Örn: Bebek, Mobilya, Kozmetik"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Slogan</label>
                <input
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Örn: Ekonomik ve Sağlıklı Seçim"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Hedef Kitle</label>
                <input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Örn: Anneler, genç aileler"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Kampanya Mesajı</label>
                <textarea
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="Örn: Yeni sezon kampanyası ve avantajlı fiyatlar"
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
                        <div style={styles.uploadSub}>Merkezde kullanılacak</div>
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

                  {removingBg ? (
                    <div style={styles.infoBlue}>Arka plan kaldırılıyor...</div>
                  ) : cutoutImage ? (
                    <div style={styles.infoGreen}>Ürün şeffaf PNG olarak hazır.</div>
                  ) : null}
                </div>
              </div>

              {error ? <div style={styles.errorBox}>{error}</div> : null}

              <button
                type="submit"
                disabled={loading || removingBg}
                style={{
                  ...styles.submitBtn,
                  opacity: loading || removingBg ? 0.7 : 1,
                  cursor: loading || removingBg ? "not-allowed" : "pointer",
                }}
              >
                {removingBg
                  ? "Ürün Hazırlanıyor..."
                  : loading
                  ? "Kreatif Oluşturuluyor..."
                  : "Kreatif Oluştur"}
              </button>
            </form>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Oluşturulan Sonuç</h2>
            <p style={styles.cardText}>
              AI sadece sahneyi üretir. Yüklediğin gerçek ürün, bozulmadan merkeze yerleşir.
            </p>

            {!loading && !result && (
              <div style={styles.emptyBox}>
                <div style={styles.emptyTitle}>Henüz kreatif oluşturulmadı</div>
                <div style={styles.emptySub}>
                  Sol taraftan ürününü yükle ve oluştur butonuna bas.
                </div>
              </div>
            )}

            {loading && (
              <div style={styles.emptyBox}>
                <div style={styles.loader} />
                <div style={styles.emptyTitle}>Yeni tasarım hazırlanıyor...</div>
                <div style={styles.emptySub}>
                  Sahne oluşturuluyor, ürün korunuyor, yazılar yerleştiriliyor.
                </div>
              </div>
            )}

            {result?.success && (
              <div>
                {backgroundSrc ? (
                  <div style={{ ...styles.posterWrap, aspectRatio: posterAspect }}>
                    <img
                      src={backgroundSrc}
                      alt="AI background"
                      style={styles.posterBackground}
                    />

                    {(cutoutImage || referencePreview) && (
                      <div style={styles.productLayer}>
                        <img
                          src={cutoutImage || referencePreview}
                          alt="Gerçek ürün"
                          className="poster-product"
                          style={styles.productImage}
                        />
                      </div>
                    )}

                    <div style={styles.topGradient} />
                    <div style={styles.bottomGradient} />

                    <div className="poster-overlay-content" style={styles.overlayContent}>
                      <div className="poster-title" style={styles.overlayTitle}>
                        {result.text?.title || slogan || brandName}
                      </div>

                      <div className="poster-desc" style={styles.overlayDesc}>
                        {slogan || result.text?.description || ""}
                      </div>

                      <div style={styles.badgeRow}>
                        <div style={styles.ribbonBadge}>Yeni Tasarım</div>
                        <div style={styles.ribbonBadge}>Merkez Ürün Sunumu</div>
                      </div>
                    </div>

                    <div style={styles.bottomLeftArea}>
                      <div className="poster-cta" style={styles.ctaPill}>
                        {result.text?.cta || "Hemen İncele"}
                      </div>
                    </div>

                    {logoPreview ? (
                      <div style={styles.logoWrap}>
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="poster-logo"
                          style={styles.logoImage}
                        />
                      </div>
                    ) : (
                      <div style={styles.logoTextWrap}>
                        <div style={styles.logoTextBrand}>
                          {result.meta?.brandName || brandName}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={styles.errorBox}>Background verisi dönmedi.</div>
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
    fontWeight: 700,
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
  infoBlue: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#2563eb",
    fontWeight: 700,
  },
  infoGreen: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#16a34a",
    fontWeight: 700,
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

  posterWrap: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderRadius: "24px",
    background: "#111827",
    marginBottom: "18px",
    border: "1px solid #d1d5db",
  },
  posterBackground: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  productLayer: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
    pointerEvents: "none",
  },
  productImage: {
    maxWidth: "56%",
    maxHeight: "58%",
    objectFit: "contain",
    filter: "drop-shadow(0 18px 38px rgba(0,0,0,0.30))",
  },
  topGradient: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.56) 0%, rgba(0,0,0,0.16) 36%, rgba(0,0,0,0) 56%)",
    zIndex: 4,
    pointerEvents: "none",
  },
  bottomGradient: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.18) 65%, rgba(0,0,0,0.72) 100%)",
    zIndex: 4,
    pointerEvents: "none",
  },
  overlayContent: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 5,
    padding: "26px",
    maxWidth: "64%",
    color: "#fff",
  },
  overlayTitle: {
    fontSize: "34px",
    lineHeight: 1.04,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    marginBottom: "10px",
    textShadow: "0 2px 12px rgba(0,0,0,0.35)",
  },
  overlayDesc: {
    fontSize: "15px",
    lineHeight: 1.55,
    color: "rgba(255,255,255,0.95)",
    textShadow: "0 2px 12px rgba(0,0,0,0.35)",
    marginBottom: "14px",
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  ribbonBadge: {
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.26)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
    backdropFilter: "blur(4px)",
  },
  bottomLeftArea: {
    position: "absolute",
    left: "22px",
    bottom: "22px",
    zIndex: 5,
  },
  ctaPill: {
    background: "#ffffff",
    color: "#111827",
    padding: "12px 18px",
    borderRadius: "999px",
    fontWeight: 900,
    fontSize: "14px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.18)",
  },
  logoWrap: {
    position: "absolute",
    right: "18px",
    bottom: "18px",
    zIndex: 5,
    width: "84px",
    height: "84px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.96)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 26px rgba(0,0,0,0.20)",
    overflow: "hidden",
    padding: "8px",
  },
  logoImage: {
    width: "84px",
    height: "84px",
    objectFit: "contain",
  },
  logoTextWrap: {
    position: "absolute",
    right: "18px",
    bottom: "18px",
    zIndex: 5,
    background: "rgba(255,255,255,0.95)",
    color: "#111827",
    padding: "12px 16px",
    borderRadius: "16px",
    fontWeight: 900,
    boxShadow: "0 12px 26px rgba(0,0,0,0.20)",
  },
  logoTextBrand: {
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
