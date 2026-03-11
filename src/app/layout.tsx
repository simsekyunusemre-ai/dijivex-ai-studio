export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "#f3f4f6",
          color: "#111827",
        }}
      >
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <aside
            style={{
              width: 250,
              background: "#111827",
              color: "white",
              padding: 24,
              boxSizing: "border-box",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 24 }}>Dijivex AI</h2>

            <nav style={{ display: "grid", gap: 12 }}>
              <a href="/" style={{ color: "white", textDecoration: "none" }}>
                Ana Sayfa
              </a>
              <a href="/dashboard" style={{ color: "white", textDecoration: "none" }}>
                Dashboard
              </a>
              <a href="/create" style={{ color: "white", textDecoration: "none" }}>
                AI İçerik
              </a>
              <a href="/login" style={{ color: "white", textDecoration: "none" }}>
                Giriş
              </a>
            </nav>
          </aside>

          <main style={{ flex: 1, padding: 32 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
