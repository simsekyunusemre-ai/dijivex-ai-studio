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

type TemplateType = "campaign" | "premium" | "editorial";

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
  const [templateVariant, setTemplateVariant] = useState<TemplateType>("campaign");

  const backgroundSrc = useMemo(() => {
    if (!result?.background) return "";
    return `data:image/png;base64,${result.background}`;
  }, [result]);

  const posterAspect =
    format === "portrait" ? "4 / 5" : format === "landscape" ? "16 / 9" : "1 / 1";

  const safeTitle = result?.text?.title || slogan || brandName || "Yeni Koleksiyon";
  const safeDesc =
    slogan ||
    result?.text?.description ||
    campaign ||
    "Şimdi keşfedin, yeni sezon fırsatlarını kaçırmayın.";
  const safeCta = result?.text?.cta || "Hemen İncele";
  const safeBrand = result?.meta?.brandName || brandName || "Marka";
  const safeSector = (result?.meta?.sector || sector || "").toLowerCase();

  function pickTemplate(): TemplateType {
    const variants: TemplateType[] = ["campaign", "premium", "editorial"];
    return variants[Math.floor(Math.random() * variants.length)];
  }

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

      setTemplateVariant(pickTemplate());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  const showSoftEffects =
    safeSector.includes("bebek") ||
    safeSector.includes("çocuk") ||
    safeSector.includes("cocuk") ||
    safeSector.includes("kozmetik");

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

        @keyframes floatSoft {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
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

          .poster-title-v2 {
            font-size: 24px !important;
            line-height: 1.05 !important;
          }

          .poster-desc-v2 {
            font-size: 13px !important;
            line-height: 1.45 !important;
          }

          .poster-product-v2 {
            max-width: 74% !important;
            max-height: 44% !important;
          }

          .poster-logo-v2 {
            width: 58px !important;
            height: 58px !important;
          }

          .poster-cta-v2 {
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
              Arka plan AI ile gelir, ürün aynen korunur, yazılar ve reklam düzeni
              profesyonel tasarım katmanı ile eklenir.
            </p>
          </div>
        </div>

        <div className="create-grid-fallback" style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Brief Formu</h2>
            <p style={styles.cardText}>Her oluşturmada yeni sahne ve yeni post düzeni.</p>

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
                  placeholder="Örn: Anneler, yeni evliler, aileler"
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
                        <div style={styles.uploadSub}>Merkezde aynen kullanılacak</div>
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
              Bu sürümde AI’nin sahte yazıları, tasarım panelleri ile örtülür ve post daha temiz görünür.
            </p>

            {!loading && !result && (
              <div style={styles.emptyBox}>
                <div style={styles.emptyTitle}>Henüz kreatif oluşturulmadı</div>
                <div style={styles.emptySub}>
                  Sol taraftan bilgileri girip oluştur butonuna bas.
                </div>
              </div>
            )}

            {loading && (
              <div style={styles.emptyBox}>
                <div style={styles.loader} />
                <div style={styles.emptyTitle}>Yeni kreatif hazırlanıyor...</div>
                <div style={styles.emptySub}>
                  Sahne, ürün yerleşimi ve reklam tasarım panelleri hazırlanıyor.
                </div>
              </div>
            )}

            {result?.success && (
              <div>
                {backgroundSrc ? (
                  <div
                    style={{
                      ...styles.posterWrap,
                      aspectRatio: posterAspect,
                      ...(templateVariant === "campaign"
                        ? styles.posterCampaign
                        : templateVariant === "premium"
                        ? styles.posterPremium
                        : styles.posterEditorial),
                    }}
                  >
                    <img
                      src={backgroundSrc}
                      alt="AI background"
                      style={styles.posterBackground}
                    />

                    <div style={styles.globalDarkOverlay} />

                    <div
                      style={{
                        ...styles.topDesignPanel,
                        ...(templateVariant === "campaign"
                          ? styles.topPanelCampaign
                          : templateVariant === "premium"
                          ? styles.topPanelPremium
                          : styles.topPanelEditorial),
                      }}
                    />

                    <div
                      style={{
                        ...styles.bottomDesignPanel,
                        ...(templateVariant === "campaign"
                          ? styles.bottomPanelCampaign
                          : templateVariant === "premium"
                          ? styles.bottomPanelPremium
                          : styles.bottomPanelEditorial),
                      }}
                    />

                    {showSoftEffects && (
                      <>
                        <div style={styles.fxGlowOne} />
                        <div style={styles.fxGlowTwo} />
                      </>
                    )}

                    {(cutoutImage || referencePreview) && (
                      <div style={styles.productLayer}>
                        <img
                          src={cutoutImage || referencePreview}
                          alt="Gerçek ürün"
                          className="poster-product-v2"
                          style={{
                            ...styles.productImage,
                            ...(templateVariant === "campaign"
                              ? styles.productCampaign
                              : templateVariant === "premium"
                              ? styles.productPremium
                              : styles.productEditorial),
                          }}
                        />
                      </div>
                    )}

                    <div style={styles.topTextWrap}>
                      <div
                        style={{
                          ...styles.topMiniBadge,
                          ...(templateVariant === "campaign"
                            ? styles.topMiniBadgeCampaign
                            : templateVariant === "premium"
                            ? styles.topMiniBadgePremium
                            : styles.topMiniBadgeEditorial),
                        }}
                      >
                        {templateVariant === "campaign"
                          ? "Özel Kampanya"
                          : templateVariant === "premium"
                          ? "Premium Seçim"
                          : "Trend Seri"}
                      </div>

                      <h3 className="poster-title-v2" style={styles.posterTitle}>
                        {safeTitle}
                      </h3>

                      <p className="poster-desc-v2" style={styles.posterDesc}>
                        {safeDesc}
                      </p>
                    </div>

                    <div style={styles.bottomLeftTextPanel}>
                      <div style={styles.bottomPanelHeadline}>{campaign || safeDesc}</div>
                      <div className="poster-cta-v2" style={styles.ctaButton}>
                        {safeCta}
                      </div>
                    </div>

                    <div style={styles.infoBadgeWrap}>
                      <div style={styles.infoBadge}>Merkez Ürün Sunumu</div>
                    </div>

                    {logoPreview ? (
                      <div style={styles.logoWrap}>
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="poster-logo-v2"
                          style={styles.logoImage}
                        />
                      </div>
                    ) : (
                      <div style={styles.logoTextWrap}>
                        <div style={styles.logoTextBrand}>{safeBrand}</div>
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
    borderRadius: "28px",
    marginBottom: "18px",
    border: "1px solid #d1d5db",
    background: "#111827",
    boxShadow: "0 20px 60px rgba(0,0,0,0.14)",
  },
  posterCampaign: {},
  posterPremium: {},
  posterEditorial: {},
  posterBackground: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  globalDarkOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.28) 100%)",
    zIndex: 1,
  },

  topDesignPanel: {
    position: "absolute",
    left: "18px",
    top: "18px",
    right: "18px",
    minHeight: "160px",
    borderRadius: "26px",
    zIndex: 4,
    boxShadow: "0 20px 40px rgba(0,0,0,0.14)",
  },
  topPanelCampaign: {
    background: "linear-gradient(135deg, rgba(252,252,252,0.96) 0%, rgba(244,242,236,0.94) 100%)",
  },
  topPanelPremium: {
    background: "linear-gradient(135deg, rgba(245,239,227,0.96) 0%, rgba(233,223,203,0.94) 100%)",
  },
  topPanelEditorial: {
    background: "linear-gradient(135deg, rgba(248,248,248,0.96) 0%, rgba(236,236,236,0.94) 100%)",
  },

  bottomDesignPanel: {
    position: "absolute",
    left: "18px",
    bottom: "18px",
    width: "44%",
    minHeight: "120px",
    borderRadius: "24px",
    zIndex: 4,
    boxShadow: "0 18px 36px rgba(0,0,0,0.14)",
  },
  bottomPanelCampaign: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(246,246,246,0.94) 100%)",
  },
  bottomPanelPremium: {
    background: "linear-gradient(135deg, rgba(250,246,240,0.96) 0%, rgba(239,232,220,0.94) 100%)",
  },
  bottomPanelEditorial: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(242,242,242,0.94) 100%)",
  },

  fxGlowOne: {
    position: "absolute",
    right: "8%",
    top: "22%",
    width: "130px",
    height: "130px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 72%)",
    zIndex: 2,
    animation: "floatSoft 4s ease-in-out infinite",
  },
  fxGlowTwo: {
    position: "absolute",
    left: "8%",
    bottom: "18%",
    width: "100px",
    height: "100px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 72%)",
    zIndex: 2,
    animation: "floatSoft 3.2s ease-in-out infinite",
  },

  productLayer: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    pointerEvents: "none",
  },
  productImage: {
    objectFit: "contain",
    filter: "drop-shadow(0 22px 40px rgba(0,0,0,0.28))",
  },
  productCampaign: {
    maxWidth: "64%",
    maxHeight: "48%",
    transform: "translate(10%, 8%)",
  },
  productPremium: {
    maxWidth: "62%",
    maxHeight: "48%",
    transform: "translate(10%, 7%) scale(1.02)",
  },
  productEditorial: {
    maxWidth: "63%",
    maxHeight: "48%",
    transform: "translate(10%, 8%)",
  },

  topTextWrap: {
    position: "absolute",
    top: "34px",
    left: "36px",
    zIndex: 6,
    maxWidth: "58%",
  },
  topMiniBadge: {
    display: "inline-block",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
    marginBottom: "14px",
  },
  topMiniBadgeCampaign: {
    background: "#111827",
    color: "#ffffff",
  },
  topMiniBadgePremium: {
    background: "#8b6a36",
    color: "#fffaf0",
  },
  topMiniBadgeEditorial: {
    background: "#111827",
    color: "#ffffff",
  },

  posterTitle: {
    margin: 0,
    color: "#111827",
    fontWeight: 900,
    fontSize: "42px",
    lineHeight: 1.02,
    letterSpacing: "-0.03em",
    maxWidth: "100%",
  },
  posterDesc: {
    marginTop: "12px",
    color: "#374151",
    fontSize: "15px",
    lineHeight: 1.55,
    maxWidth: "92%",
  },

  bottomLeftTextPanel: {
    position: "absolute",
    left: "34px",
    bottom: "34px",
    zIndex: 6,
    width: "34%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "14px",
  },
  bottomPanelHeadline: {
    color: "#111827",
    fontWeight: 900,
    fontSize: "18px",
    lineHeight: 1.28,
    textTransform: "uppercase",
  },
  ctaButton: {
    background: "#111827",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "999px",
    fontWeight: 900,
    fontSize: "14px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
  },

  infoBadgeWrap: {
    position: "absolute",
    right: "24px",
    bottom: "120px",
    zIndex: 6,
  },
  infoBadge: {
    background: "rgba(255,255,255,0.9)",
    color: "#111827",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "12px",
    fontWeight: 800,
    boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
  },

  logoWrap: {
    position: "absolute",
    right: "18px",
    bottom: "18px",
    zIndex: 7,
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
    zIndex: 7,
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
