export default function CreatePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Yeni Tasarim Olustur</h1>
          <p className="mt-2 text-zinc-400">
            Marka bilgilerini gir, format sec ve Dijivex Studio tasarimini hazirlasin.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
            <label className="mb-2 block text-sm text-zinc-300">Marka Adi</label>
            <input
              type="text"
              placeholder="Marka adini gir"
              className="mb-4 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
            />

            <label className="mb-2 block text-sm text-zinc-300">Sektor</label>
            <select className="mb-4 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none">
              <option>Taki</option>
              <option>Bebek</option>
              <option>Mobilya</option>
              <option>Guzellik</option>
              <option>Diger</option>
            </select>

            <label className="mb-2 block text-sm text-zinc-300">Format</label>
            <select className="mb-4 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none">
              <option>Instagram Post</option>
              <option>Instagram Story</option>
            </select>

            <label className="mb-2 block text-sm text-zinc-300">Slogan</label>
            <input
              type="text"
              placeholder="Kampanya veya slogan yaz"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
            />
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
            <label className="mb-2 block text-sm text-zinc-300">Logo Yukle</label>
            <input
              type="file"
              className="mb-4 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
            />

            <label className="mb-2 block text-sm text-zinc-300">Urun Gorseli Yukle</label>
            <input
              type="file"
              className="mb-4 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
            />

            <label className="mb-2 block text-sm text-zinc-300">Referans Gorsel</label>
            <input
              type="file"
              className="mb-6 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
            />

            <button className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black">
              Tasarim Olustur
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
