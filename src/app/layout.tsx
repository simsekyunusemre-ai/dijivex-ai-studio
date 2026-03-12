import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <div className="app-shell">
          <aside className="sidebar">
            <div>
              <div className="brand">Dijivex Studio</div>
              <div className="brand-subtitle">AI Reklam Kreatif Platformu</div>
            </div>

            <nav className="sidebar-nav">
              <Link href="/">Ana Sayfa</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/create">Reklam Kreatifi Olustur</Link>
              <Link href="/login">Giris</Link>
            </nav>

            <div className="sidebar-footer">
              <div className="credit-box">
                <div className="credit-label">Kalan Kredi</div>
                <div className="credit-value">24</div>
              </div>
            </div>
          </aside>

          <div className="main-area">
            <header className="topbar">
              <div>
                <h1 className="topbar-title">Dijivex AI Studio</h1>
                <p className="topbar-subtitle">
                  Meta Ads icin reklam kreatifleri uret
                </p>
              </div>

              <div className="topbar-actions">
                <Link href="/create" className="primary-link-btn">
                  Yeni Kreatif
                </Link>
              </div>
            </header>

            <main className="page-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
