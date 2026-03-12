export default function ProjectsPage() {
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
          Tasarimlarim
        </h1>

        <p style={{ color: "#6b7280", margin: 0 }}>
          Urettigin reklam kreatifleri burada listelenecek.
        </p>
      </div>

      {/* ÖZET KARTLAR */}
      <div className="card-grid">
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Toplam Tasarim</h3>
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 10 }}>0</div>
          <p style={{ color: "#6b7280" }}>Hesabinda kayitli toplam kreatif.</p>
        </div>

        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Bu Ay</h3>
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 10 }}>0</div>
          <p style={{ color: "#6b7280" }}>Bu ay olusturulan kreatif sayisi.</p>
        </div>

        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Hizli Islem</h3>
          <p style={{ color: "#6b7280" }}>
            Yeni reklam kreatifi olusturmaya hemen basla.
          </p>

          <a
            href="/create"
            style={{
              display: "inline-block",
              marginTop: 12,
              padding: "10px 16px",
              background: "#111827",
              color: "white",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Yeni Kreatif
          </a>
        </div>
      </div>

      {/* LİSTE ALANI */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          marginTop: 24,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 10 }}>Kayitli Kreatifler</h2>

        <p style={{ color: "#6b7280", marginBottom: 24 }}>
          Henuz kayitli bir tasarim bulunmuyor.
        </p>

        <div
          style={{
            border: "1px dashed #d1d5db",
            borderRadius: 16,
            padding: 28,
            textAlign: "center",
            color: "#6b7280",
            background: "#f9fafb",
          }}
        >
          Ilk reklam kreatifini olusturdugunda burada gorunecek.
        </div>
      </div>
    </div>
  );
}
