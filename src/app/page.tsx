export default function Home() {
  return (
    <div>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 36, margin: 0, marginBottom: 12 }}>
          Dijivex AI Studio
        </h1>

        <p style={{ fontSize: 18, color: "#4b5563", margin: 0 }}>
          Metin, görsel, reklam ve video prompt üretimi için hepsi bir arada AI stüdyo.
        </p>
      </div>

      {/* KART GRID */}
      <div className="card-grid">

        <a
          href="/create"
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            textDecoration: "none",
            color: "#111827",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>AI İçerik</h3>

          <p>
            Instagram post, reklam metni ve kampanya içerikleri üret.
          </p>
        </a>

        <a
          href="/dashboard"
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            textDecoration: "none",
            color: "#111827",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Dashboard</h3>

          <p>
            Kullanım geçmişi, özet bilgiler ve araç erişimi burada olacak.
          </p>
        </a>

        <a
          href="/login"
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            textDecoration: "none",
            color: "#111827",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Giriş</h3>

          <p>
            Kullanıcı hesabı ve üyelik sistemi için giriş alanı.
          </p>
        </a>

      </div>
    </div>
  );
}
