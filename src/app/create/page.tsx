export default function CreatePage() {
  return (
    <div>
      {/* ÜST ALAN */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 32, margin: 0, marginBottom: 10 }}>
          Reklam Kreatifi Oluştur
        </h1>

        <p style={{ color: "#6b7280", margin: 0 }}>
          Marka bilgilerini gir, görselleri yükle ve Meta Ads için kreatif oluştur.
        </p>
      </div>

      {/* FORM GRID */}
      <div className="card-grid">
        {/* SOL TARAF */}
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>Temel Bilgiler</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Marka Adı
            </label>
            <input
              type="text"
              placeholder="Marka adını gir"
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Sektör
            </label>
            <select
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            >
              <option>Takı</option>
              <option>Mobilya</option>
              <option>Güzellik</option>
              <option>Moda</option>
              <option>Diğer</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Format
            </label>
            <select
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            >
              <option>Instagram Post</option>
              <option>Instagram Story</option>
              <option>Meta Ads Kreatifi</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Kampanya Mesajı
            </label>
            <textarea
              placeholder="Örn: Yeni sezon ürünlerinde özel indirim"
              rows={5}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
                resize: "vertical",
              }}
            />
          </div>
        </div>

        {/* SAĞ TARAF */}
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>Dosyalar ve Üretim</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Logo Yükle
            </label>
            <input
              type="file"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Ürün Görseli
            </label>
            <input
              type="file"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Referans Görsel
            </label>
            <input
              type="file"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>

          <div
            style={{
              background: "#f9fafb",
              borderRadius: 14,
              padding: 16,
              marginBottom: 20,
              color: "#4b5563",
              lineHeight: 1.6,
            }}
          >
            Sistem; marka adı, kampanya mesajı ve yüklediğin görsellere göre reklam kreatifi oluşturacak.
          </div>

          <button
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 14,
              border: "none",
              background: "#111827",
              color: "white",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Kreatif Oluştur
          </button>
        </div>
      </div>

      {/* ALT ÖNİZLEME */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          marginTop: 24,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 10 }}>Önizleme Alanı</h2>

        <p style={{ color: "#6b7280", margin: 0 }}>
          Kreatif üretildikten sonra burada görünecek.
        </p>
      </div>
    </div>
  );
}
