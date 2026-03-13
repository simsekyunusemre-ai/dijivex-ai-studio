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

      setTemplateVariant(pickTemplate());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  const showWaterEffects =
    safeSector.includes("bebek") ||
    safeSector.includes("çocuk") ||
    safeSector.includes("cocuk") ||
    safeSector.includes("kozmetik");

  const showButterflies =
    safeSector.includes("bebek") ||
    safeSector.includes("çocuk") ||
    safeSector.includes("cocuk");

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
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(4deg);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.92;
          }
          50% {
            transform: scale(1.04);
            opacity: 1;
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

          .poster-overlay-wrap {
            padding: 16px !important;
          }

          .poster-title {
            font-size: 24px !important;
            line-height: 1.06 !important;
            max-width: 88% !important;
          }

          .poster-subtitle {
            font-size: 13px !important;
            line-height: 1.45 !important;
            max-width: 86% !important;
          }

          .poster-product {
            max-width: 68% !important;
            max-height: 48% !important;
          }

          .poster-logo {
            width: 58px !important;
            height: 58px !important;
          }

          .poster-badge {
            font-size: 11px !important;
            padding: 8px 12px !important;
          }

          .poster-cta {
            font-size: 12px !important;
            padding: 11px 14px !important;
          }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <div style={styles.badge}>Dijivex AI Studio</div>
            <h1 style={styles.title}>AI Reklam Kreatifi Oluştur</h1>
            <p style={styles.subtitle}>
              Ürünü bozmadan merkeze yerleştir, sahneyi yapay zeka oluştursun, yazılar
              profesyonel post düzeniyle kod tarafından yerleşsin.
            </p>
          </div>
        </div>

        <div className="create-grid-fallback" style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Brief Formu</h2>
            <p style={styles.cardText}>Her oluşturma sonrası yeni bir reklam düzeni gelir.</p>

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
              Sahne AI tarafından, yazı ve reklam düzeni ise kontrollü post sistemi ile oluşturulur.
            </p>

            {!loading && !result && (
              <div style={styles.emptyBox}>
                <div style={styles.emptyTitle}>Henüz kreatif oluşturulmadı</div>
                <div style={styles.emptySub}>
                  Sol taraftan brief gir ve ürünü yükleyip oluştur butonuna bas.
                </div>
              </div>
            )}

            {loading && (
              <div style={styles.emptyBox}>
                <div style={styles.loader} />
                <div style={styles.emptyTitle}>Yeni kreatif hazırlanıyor...</div>
                <div style={styles.emptySub}>
                  Sahne, ürün yerleşimi ve post tasarımı hazırlanıyor.
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

                    <div style={styles.posterOverlayDarkTop} />
                    <div style={styles.posterOverlayDarkBottom} />

                    {templateVariant === "campaign" && (
                      <>
                        <div style={styles.campaignRibbonTopLeft}>
                          <span style={styles.campaignRibbonText}>YENİ SEZON</span>
                        </div>

                        <div style={styles.campaignBottomPanel}>
                          <div style={styles.campaignBottomTitle}>{safeDesc}</div>
                        </div>
                      </>
                    )}

                    {templateVariant === "premium" && (
                      <>
                        <div style={styles.premiumTopLine} />
                        <div style={styles.premiumCircleGlow} />
                      </>
                    )}

                    {templateVariant === "editorial" && (
                      <>
                        <div style={styles.editorialSideBar} />
                        <div style={styles.editorialCornerTag}>TREND</div>
                      </>
                    )}

                    {showWaterEffects && (
                      <>
                        <div style={styles.fxBubbleOne} />
                        <div style={styles.fxBubbleTwo} />
                        <div style={styles.fxBubbleThree} />
                      </>
                    )}

                    {showButterflies && (
                      <>
                        <div style={styles.fxButterflyOne}>✦</div>
                        <div style={styles.fxButterflyTwo}>✦</div>
                        <div style={styles.fxButterflyThree}>✦</div>
                      </>
                    )}

                    {(cutoutImage || referencePreview) && (
                      <div style={styles.productLayer}>
                        <img
                          src={cutoutImage || referencePreview}
                          alt="Gerçek ürün"
                          className="poster-product"
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

                    <div className="poster-overlay-wrap" style={styles.overlayWrap}>
                      <div
                        className="poster-badge"
                        style={{
                          ...styles.mainBadge,
                          ...(templateVariant === "campaign"
                            ? styles.badgeCampaign
                            : templateVariant === "premium"
                            ? styles.badgePremium
                            : styles.badgeEditorial),
                        }}
                      >
                        {templateVariant === "campaign"
                          ? "Özel Kampanya"
                          : templateVariant === "premium"
                          ? "Premium Seçim"
                          : "Yeni Koleksiyon"}
                      </div>

                      <h3 className="poster-title" style={styles.posterTitle}>
                        {safeTitle}
                      </h3>

                      <p className="poster-subtitle" style={styles.posterSubtitle}>
                        {safeDesc}
                      </p>
                    </div>

                    <div style={styles.bottomLeftWrap}>
                      <div className="poster-cta" style={styles.ctaButton}>
                        {safeCta}
                      </div>
                    </div>

                    <div style={styles.bottomRightBadges}>
                      <div style={styles.smallInfoBadge}>Merkez Ürün Sunumu</div>
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
    borderRadius: "26px",
    marginBottom: "18px",
    border: "1px solid #d1d5db",
    background: "#101010",
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
  posterOverlayDarkTop: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 34%, rgba(0,0,0,0) 56%)",
    zIndex: 2,
    pointerEvents: "none",
  },
  posterOverlayDarkBottom: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0) 46%, rgba(0,0,0,0.12) 63%, rgba(0,0,0,0.68) 100%)",
    zIndex: 2,
    pointerEvents: "none",
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
    objectFit: "contain",
    filter: "drop-shadow(0 18px 34px rgba(0,0,0,0.28))",
  },
  productCampaign: {
    maxWidth: "58%",
    maxHeight: "49%",
    transform: "translateY(8%)",
  },
  productPremium: {
    maxWidth: "54%",
    maxHeight: "48%",
    transform: "translateY(6%) scale(1.02)",
  },
  productEditorial: {
    maxWidth: "56%",
    maxHeight: "50%",
    transform: "translateY(4%)",
  },
  overlayWrap: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 5,
    padding: "24px",
    width: "100%",
    boxSizing: "border-box",
  },
  mainBadge: {
    display: "inline-block",
    borderRadius: "999px",
    fontWeight: 800,
    marginBottom: "14px",
    fontSize: "12px",
    backdropFilter: "blur(8px)",
  },
  badgeCampaign: {
    background: "rgba(255,255,255,0.22)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "9px 14px",
  },
  badgePremium: {
    background: "rgba(196, 163, 102, 0.18)",
    color: "#fff8ea",
    border: "1px solid rgba(233, 201, 145, 0.34)",
    padding: "9px 14px",
  },
  badgeEditorial: {
    background: "rgba(255,255,255,0.16)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.26)",
    padding: "9px 14px",
  },
  posterTitle: {
    margin: 0,
    maxWidth: "64%",
    color: "#ffffff",
    fontWeight: 900,
    fontSize: "40px",
    lineHeight: 1.02,
    letterSpacing: "-0.03em",
    textShadow: "0 3px 14px rgba(0,0,0,0.34)",
  },
  posterSubtitle: {
    marginTop: "12px",
    maxWidth: "58%",
    color: "rgba(255,255,255,0.94)",
    fontSize: "15px",
    lineHeight: 1.55,
    textShadow: "0 2px 10px rgba(0,0,0,0.34)",
  },

  campaignRibbonTopLeft: {
    position: "absolute",
    right: "22px",
    top: "20px",
    zIndex: 5,
    background: "rgba(255,255,255,0.88)",
    color: "#111827",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: 900,
    boxShadow: "0 10px 24px rgba(0,0,0,0.16)",
  },
  campaignRibbonText: {
    fontSize: "12px",
    letterSpacing: "0.08em",
  },
  campaignBottomPanel: {
    position: "absolute",
    left: "22px",
    right: "22px",
    bottom: "18px",
    minHeight: "78px",
    background: "rgba(255,255,255,0.9)",
    borderRadius: "20px",
    zIndex: 4,
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    boxSizing: "border-box",
    boxShadow: "0 16px 30px rgba(0,0,0,0.12)",
  },
  campaignBottomTitle: {
    color: "#111827",
    fontWeight: 900,
    fontSize: "18px",
    maxWidth: "76%",
    lineHeight: 1.25,
  },

  premiumTopLine: {
    position: "absolute",
    top: "20px",
    left: "24px",
    width: "120px",
    height: "4px",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #f6deb1 0%, #c4a366 100%)",
    zIndex: 5,
    boxShadow: "0 0 18px rgba(225,190,120,0.32)",
  },
  premiumCircleGlow: {
    position: "absolute",
    right: "8%",
    top: "16%",
    width: "150px",
    height: "150px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(255,220,160,0.18) 0%, rgba(255,220,160,0) 72%)",
    zIndex: 1,
    animation: "pulseGlow 3.2s ease-in-out infinite",
  },

  editorialSideBar: {
    position: "absolute",
    left: "18px",
    top: "92px",
    bottom: "92px",
    width: "6px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.84)",
    zIndex: 5,
  },
  editorialCornerTag: {
    position: "absolute",
    top: "20px",
    right: "22px",
    zIndex: 5,
    background: "#111827",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 900,
    fontSize: "12px",
    letterSpacing: "0.08em",
  },

  fxBubbleOne: {
    position: "absolute",
    right: "20%",
    bottom: "24%",
    width: "72px",
    height: "72px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.06) 65%, rgba(255,255,255,0) 74%)",
    zIndex: 2,
    animation: "floatSoft 3.2s ease-in-out infinite",
  },
  fxBubbleTwo: {
    position: "absolute",
    left: "10%",
    bottom: "18%",
    width: "44px",
    height: "44px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.04) 70%, rgba(255,255,255,0) 78%)",
    zIndex: 2,
    animation: "floatSoft 4s ease-in-out infinite",
  },
  fxBubbleThree: {
    position: "absolute",
    right: "10%",
    top: "24%",
    width: "52px",
    height: "52px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 72%, rgba(255,255,255,0) 80%)",
    zIndex: 2,
    animation: "floatSoft 3.6s ease-in-out infinite",
  },
  fxButterflyOne: {
    position: "absolute",
    top: "20%",
    right: "16%",
    color: "rgba(255,255,255,0.92)",
    fontSize: "28px",
    zIndex: 5,
    animation: "floatSoft 3s ease-in-out infinite",
    textShadow: "0 4px 12px rgba(0,0,0,0.24)",
  },
  fxButterflyTwo: {
    position: "absolute",
    top: "28%",
    left: "12%",
    color: "rgba(255,255,255,0.72)",
    fontSize: "20px",
    zIndex: 5,
    animation: "floatSoft 4s ease-in-out infinite",
    textShadow: "0 4px 12px rgba(0,0,0,0.24)",
  },
  fxButterflyThree: {
    position: "absolute",
    bottom: "25%",
    right: "24%",
    color: "rgba(255,255,255,0.72)",
    fontSize: "18px",
    zIndex: 5,
    animation: "floatSoft 3.4s ease-in-out infinite",
    textShadow: "0 4px 12px rgba(0,0,0,0.24)",
  },

  bottomLeftWrap: {
    position: "absolute",
    left: "22px",
    bottom: "22px",
    zIndex: 6,
  },
  ctaButton: {
    background: "#ffffff",
    color: "#111827",
    padding: "13px 18px",
    borderRadius: "999px",
    fontWeight: 900,
    fontSize: "14px",
    boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
  },
  bottomRightBadges: {
    position: "absolute",
    right: "22px",
    bottom: "122px",
    zIndex: 6,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "flex-end",
  },
  smallInfoBadge: {
    background: "rgba(255,255,255,0.18)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.28)",
    padding: "10px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
    backdropFilter: "blur(8px)",
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
