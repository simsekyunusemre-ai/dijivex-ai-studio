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

    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview("");
    }
  }

  function handleReferenceChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setReferenceImageFile(file);

    if (file) {
      setReferencePreview(URL.createObjectURL(file));
    } else {
      setReferencePreview("");
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
      const message =
        err instanceof Error ? err.message : "Bir hata oluştu.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            Dijivex AI Studio
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            AI Reklam Kreatifi Oluştur
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
            Marka bilgilerini gir, logo ve ürün görselini yükle, yapay zeka
            senin için reklam metni ve kreatif görsel oluştursun.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold sm:text-xl">
                  Brief Formu
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Tüm alanları doldur ve kreatifi oluştur.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Marka Adı
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Örn: Dijivex"
                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Sektör
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Örn: Mobilya, Takı, Kozmetik"
                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Slogan
                  </label>
                  <input
                    type="text"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    placeholder="Örn: Kaliteyi Tasarımla Buluştur"
                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Hedef Kitle
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Örn: 25-45 yaş arası modern ev kullanıcıları"
                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Kampanya Mesajı
                  </label>
                  <textarea
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    placeholder="Örn: Yeni sezon ürünlerinde özel lansman fırsatı"
                    className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
                  >
                    <option value="square">Kare (Instagram Post)</option>
                    <option value="portrait">Dikey (Story / Reels)</option>
                    <option value="landscape">Yatay (Banner)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-dashed border-white/15 bg-neutral-900/70 p-4">
                    <label className="mb-3 block text-sm font-medium text-white/90">
                      Logo Yükle
                    </label>

                    <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition hover:border-white/20 hover:bg-white/[0.05]">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo önizleme"
                          className="max-h-32 w-auto object-contain"
                        />
                      ) : (
                        <>
                          <span className="text-sm font-medium text-white/85">
                            Logonu seç
                          </span>
                          <span className="mt-2 text-xs text-white/50">
                            PNG önerilir
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>

                    {logoFile && (
                      <p className="mt-3 truncate text-xs text-white/55">
                        {logoFile.name}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-dashed border-white/15 bg-neutral-900/70 p-4">
                    <label className="mb-3 block text-sm font-medium text-white/90">
                      Referans / Ürün Görseli
                    </label>

                    <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition hover:border-white/20 hover:bg-white/[0.05]">
                      {referencePreview ? (
                        <img
                          src={referencePreview}
                          alt="Referans önizleme"
                          className="max-h-32 w-auto rounded-xl object-contain"
                        />
                      ) : (
                        <>
                          <span className="text-sm font-medium text-white/85">
                            Ürün görseli seç
                          </span>
                          <span className="mt-2 text-xs text-white/50">
                            Reklamda temel alınacak görsel
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReferenceChange}
                        className="hidden"
                        required
                      />
                    </label>

                    {referenceImageFile && (
                      <p className="mt-3 truncate text-xs text-white/55">
                        {referenceImageFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Kreatif Oluşturuluyor..." : "Kreatif Oluştur"}
                </button>
              </form>
            </div>
          </section>

          <section className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold sm:text-xl">
                    Oluşturulan Sonuç
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    Görsel ve reklam metni burada görünecek.
                  </p>
                </div>
              </div>

              {!result && !loading && (
                <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-neutral-900/50 p-8 text-center">
                  <div>
                    <p className="text-base font-medium text-white/80">
                      Henüz kreatif oluşturulmadı
                    </p>
                    <p className="mt-2 text-sm text-white/45">
                      Sol taraftaki formu doldurup oluştur butonuna bas.
                    </p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-white/10 bg-neutral-900/50 p-8 text-center">
                  <div>
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                    <p className="text-base font-medium text-white/80">
                      Yapay zeka kreatifi hazırlıyor...
                    </p>
                    <p className="mt-2 text-sm text-white/45">
                      Ürün analiz ediliyor, metin ve görsel oluşturuluyor.
                    </p>
                  </div>
                </div>
              )}

              {result && result.success && (
                <div className="space-y-5">
                  {generatedImageSrc ? (
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
                      <img
                        src={generatedImageSrc}
                        alt="Oluşturulan reklam görseli"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                      Görsel üretildi bilgisi dönmedi.
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/40">
                        Başlık
                      </p>
                      <p className="text-base font-semibold text-white/90">
                        {result.text?.title || "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/40">
                        CTA
                      </p>
                      <p className="text-base font-semibold text-white/90">
                        {result.text?.cta || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/40">
                      Açıklama
                    </p>
                    <p className="text-sm leading-7 text-white/80">
                      {result.text?.description || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/40">
                      Hashtag
                    </p>
                    <p className="break-words text-sm leading-7 text-white/80">
                      {result.text?.hashtags || "-"}
                    </p>
                  </div>

                  {result.meta && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
                        <p className="mb-1 text-xs text-white/40">Marka</p>
                        <p className="text-sm font-medium text-white/85">
                          {result.meta.brandName}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
                        <p className="mb-1 text-xs text-white/40">Sektör</p>
                        <p className="text-sm font-medium text-white/85">
                          {result.meta.sector}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
                        <p className="mb-1 text-xs text-white/40">Format</p>
                        <p className="text-sm font-medium uppercase text-white/85">
                          {result.meta.format}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
