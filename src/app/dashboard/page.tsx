export default function Dashboard() {
  return (
    <div>

      {/* ÜST KARŞILAMA */}
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
          Hoş Geldin
        </h1>

        <p style={{ color: "#6b7280", margin: 0 }}>
          Dijivex AI Studio ile reklam kreatiflerini hızlıca üret.
        </p>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="card-grid">

        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Kalan Kredi</h3>

          <div
            style={{
              fontSize: 40,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            24
          </div>

          <p style={{ color: "#6b7280" }}>
            Kreatif üretmek için kullanılabilir kredi.
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Bu Ay Üretilen</h3>

          <div
            style={{
              fontSize: 40,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            12
          </div>

          <p style={{ color: "#6b7280" }}>
            Bu ay oluşturulan kreatif sayısı.
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Hızlı Başlat</h3>

          <p style={{ color: "#6b7280" }}>
            Yeni bir reklam kreatifi üretmeye başla.
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
              fontWeight: "bold",
            }}
          >
            Yeni Kreatif
          </a>
        </div>

      </div>

      {/* SON TASARIMLAR */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          marginTop: 24,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Son Tasarımlar</h2>

        <p style={{ color: "#6b7280" }}>
          Henüz oluşturulmuş bir kreatif bulunmuyor.
        </p>
      </div>

    </div>
  );
}
