export default function CreatePage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900 md:text-4xl">
            Yeni Tasarim Olustur
          </h1>
          <p className="mt-2 text-sm text-zinc-600 md:text-base">
            Marka bilgilerini gir, dosyalarini yukle ve Dijivex Studio tasarimini hazirlasin.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-xl font-semibold text-zinc-900">
              Temel Bilgiler
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Marka Adi
                </label>
                <input
                  type="text"
                  placeholder="Marka adini gir"
                  className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Sektor
                </label>
                <select className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900">
                  <option>Taki</option>
                  <option>Bebek</option>
                  <option>Mobilya</option>
                  <option>Guzellik</option>
                  <option>Diger</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Format
                </label>
                <select className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900">
                  <option>Instagram Post</option>
                  <option>Instagram Story</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Slogan
                </label>
                <textarea
                  placeholder="Kampanya veya slogan yaz"
                  rows={4}
                  className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-xl font-semibold text-zinc-900">
              Dosyalar
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Logo Yukle
                </label>
                <input
                  type="file"
                  className="block w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Urun Gorseli Yukle
                </label>
                <input
                  type="file"
                  className="block w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Referans Gorsel
                </label>
                <input
                  type="file"
                  className="block w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm text-zinc-600">
                Sistem; marka bilgisi, slogan ve yukledigin gorsellere gore sosyal medya tasarimi uretecek.
              </p>
            </div>

            <button className="mt-6 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black">
              Tasarim Olustur
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
