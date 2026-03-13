"use client";

import { useState } from "react";

export default function CreatePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [productPreview, setProductPreview] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResult(data);

    setLoading(false);
  };

  const handleLogo = (e: any) => {
    const file = e.target.files[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleProduct = (e: any) => {
    const file = e.target.files[0];
    if (file) setProductPreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-6 md:p-10">

      <h1 className="text-2xl font-bold mb-6">
        AI Reklam Kreatifi Oluştur
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-5"
        >

          <div>
            <label className="text-sm font-medium">Marka Adı</label>
            <input
              name="brandName"
              required
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Sektör</label>
            <input
              name="sector"
              required
              placeholder="mobilya, kozmetik, takı..."
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Slogan</label>
            <input
              name="slogan"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Hedef Kitle</label>
            <input
              name="targetAudience"
              required
              placeholder="25-45 yaş"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Kampanya Mesajı
            </label>

            <textarea
              name="campaign"
              required
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Format</label>

            <select
              name="format"
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="square">
                Kare (Instagram Post)
              </option>

              <option value="portrait">
                Dikey (Story)
              </option>

              <option value="landscape">
                Yatay Banner
              </option>
            </select>
          </div>

          {/* LOGO */}
          <div>
            <label className="text-sm font-medium">
              Logo Yükle
            </label>

            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleLogo}
              className="mt-2"
            />

            {logoPreview && (
              <img
                src={logoPreview}
                className="mt-3 h-20 object-contain"
              />
            )}
          </div>

          {/* PRODUCT */}
          <div>
            <label className="text-sm font-medium">
              Referans / Ürün Görseli
            </label>

            <input
              type="file"
              name="referenceImage"
              required
              accept="image/*"
              onChange={handleProduct}
              className="mt-2"
            />

            {productPreview && (
              <img
                src={productPreview}
                className="mt-3 h-28 object-contain"
              />
            )}
          </div>

          <button
            className="w-full bg-black text-white p-3 rounded-lg"
          >
            {loading ? "Oluşturuluyor..." : "Kreatif Oluştur"}
          </button>

        </form>

        {/* RESULT */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-semibold mb-4">
            Oluşturulan Sonuç
          </h2>

          {!result && (
            <p className="text-gray-500">
              Henüz kreatif oluşturulmadı
            </p>
          )}

          {result?.image && (
            <div className="relative">

              <img
                src={`data:image/png;base64,${result.image}`}
                className="rounded-lg"
              />

              {/* OVERLAY */}

              <div className="absolute bottom-6 left-6 text-white">

                <h3 className="text-2xl font-bold drop-shadow">
                  {result.text?.title}
                </h3>

                <p className="mt-2 max-w-sm drop-shadow">
                  {result.text?.description}
                </p>

                <button className="mt-3 bg-white text-black px-4 py-2 rounded">
                  {result.text?.cta}
                </button>

              </div>

            </div>
          )}

          {result?.text && (
            <div className="mt-6 text-sm text-gray-600">

              <p>
                <b>Hashtag:</b>
              </p>

              <p>{result.text.hashtags}</p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
