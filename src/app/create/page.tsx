export default function CreatePage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        AI İçerik Oluştur
      </h1>
      <p style={{ marginBottom: 24 }}>
        Marka bilgilerini gir, logo ve ürün görselini ekle, içerik formatını seç.
      </p>

      <form style={{ display: "grid", gap: 16 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Marka Adı</label>
          <input
            type="text"
            placeholder="Örn: Dijivex"
            style={{ width: "100%", padding: 12 }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Sektör</label>
          <select style={{ width: "100%", padding: 12 }}>
            <option>E-ticaret</option>
            <option>Takı</option>
            <option>Mobilya</option>
            <option>Bebek Ürünleri</option>
            <option>Reklam Ajansı</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Slogan</label>
          <input
            type="text"
            placeholder="Örn: Tarzinizi yapay zeka ile one cikarın"
            style={{ width: "100%", padding: 12 }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Format</label>
          <select style={{ width: "100%", padding: 12 }}>
            <option>Instagram Post</option>
            <option>Instagram Story</option>
            <option>Reklam Görseli</option>
            <option>Video Prompt</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Logo Yükle</label>
          <input type="file" />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Ürün Görseli Yükle</label>
          <input type="file" />
        </div>

        <button
          type="button"
          style={{
            padding: 14,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          İçerik Oluştur
        </button>
      </form>
    </main>
  );
}
