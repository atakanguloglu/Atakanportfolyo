"use client";

import { useState } from "react";

export default function NewsletterForm({ variant = "footer", className = "" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ type: "success", text: data.message || "Bültene abone oldunuz." });
        setEmail("");
      } else {
        setResult({ type: "error", text: data.error || "Bir hata oluştu." });
      }
    } catch {
      setResult({ type: "error", text: "Bağlantı hatası. Lütfen tekrar deneyin." });
    } finally {
      setLoading(false);
    }
  };

  const isCompact = variant === "footer";

  if (isCompact) {
    return (
      <div className={`max-w-sm w-full ${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            required
            className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-500 bg-navy-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-70 whitespace-nowrap"
          >
            {loading ? "..." : "Abone ol"}
          </button>
        </form>
        {result && (
          <p className={`text-sm mt-2 w-full ${result.type === "success" ? "text-primary-300" : "text-red-300"}`}>
            {result.text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-primary-50/60 to-white dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-primary-100/80 dark:border-gray-700 p-6 sm:p-8 shadow-sm ${className}`}>
      <div className="max-w-lg mx-auto text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Yeni yazılardan haberdar olun</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
          E-posta adresinizi bırakın; yeni yazılar yayınlandığında size haber verelim. Spam göndermiyoruz.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            required
            className="flex-1 min-w-0 h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-6 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 whitespace-nowrap transition text-sm shadow-sm"
          >
            {loading ? "Gönderiliyor…" : "Abone ol"}
          </button>
        </form>
        {result && (
          <p className={`text-sm mt-4 ${result.type === "success" ? "text-primary-600 dark:text-primary-400" : "text-red-600 dark:text-red-400"}`}>
            {result.text}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">E-posta adresiniz yalnızca bülten için kullanılır.</p>
      </div>
    </div>
  );
}
