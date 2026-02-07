"use client";

/**
 * Root layout'ta oluşan hataları yakalar (çok nadir).
 * Kendi <html> ve <body> tanımlamak zorunda.
 */
export default function GlobalError({ error, reset }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f9fafb", color: "#111", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ textAlign: "center", maxWidth: "28rem" }}>
          <p style={{ fontSize: "3rem", fontWeight: 700, color: "#2563eb", marginBottom: "0.5rem" }}>500</p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>Bir hata oluştu</h1>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            Beklenmeyen bir sorun oluştu. Lütfen sayfayı yenileyin veya ana sayfaya gidin.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "0.875rem" }}
            >
              Tekrar dene
            </button>
            <a
              href="/"
              style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", background: "#2563eb", color: "#fff", textDecoration: "none", fontSize: "0.875rem" }}
            >
              Ana sayfaya dön
            </a>
            <a
              href="/admin"
              style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", background: "#fff", color: "#374151", textDecoration: "none", fontSize: "0.875rem" }}
            >
              Panele dön
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
