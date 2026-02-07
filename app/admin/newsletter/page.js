"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkBody, setBulkBody] = useState("");
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  useEffect(() => {
    fetch("/api/newsletter", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSubscribers(Array.isArray(data) ? data : []))
      .catch(() => setSubscribers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleBulkSend = async (e) => {
    e.preventDefault();
    setBulkResult(null);
    if (!bulkSubject.trim() || !bulkBody.trim()) {
      setBulkResult({ error: "Konu ve mesaj gerekli." });
      return;
    }
    setBulkSending(true);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subject: bulkSubject.trim(), body: bulkBody.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setBulkResult({ success: true, sent: data.sent });
        setBulkSubject("");
        setBulkBody("");
      } else {
        setBulkResult({ error: data.error || "Gönderilemedi." });
      }
    } catch {
      setBulkResult({ error: "Bağlantı hatası." });
    } finally {
      setBulkSending(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 no-underline">
          ← Panele dön
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Bülten aboneleri</h1>
      </div>

      {/* Toplu e-posta */}
      <section className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tüm abonelere toplu e-posta gönder</h2>
        {subscribers.length === 0 && !loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Abone yokken e-posta gönderilemez.</p>
        ) : (
          <form onSubmit={handleBulkSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konu</label>
              <InputText
                value={bulkSubject}
                onChange={(e) => setBulkSubject(e.target.value)}
                placeholder="E-posta konusu"
                className="w-full"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mesaj (HTML veya düz metin)</label>
              <InputTextarea
                value={bulkBody}
                onChange={(e) => setBulkBody(e.target.value)}
                placeholder="Merhaba, ..."
                rows={6}
                className="w-full"
              />
            </div>
            {bulkResult?.error && (
              <p className="text-sm text-red-600 dark:text-red-400">{bulkResult.error}</p>
            )}
            {bulkResult?.success && (
              <p className="text-sm text-green-600 dark:text-green-400">{bulkResult.sent} kişiye gönderildi.</p>
            )}
            <Button
              type="submit"
              label={bulkSending ? "Gönderiliyor…" : "Tüm abonelere gönder"}
              icon="pi pi-send"
              loading={bulkSending}
              disabled={bulkSending || subscribers.length === 0}
              className="bg-primary-500 hover:bg-primary-600 border-primary-500"
            />
          </form>
        )}
      </section>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {subscribers.length === 0 ? (
            <p className="p-6 text-gray-500 dark:text-gray-400">Henüz abone yok.</p>
          ) : (
            <>
              {/* Mobil: kart listesi */}
              <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                {subscribers.map((row) => (
                  <div key={row.id} className="px-4 py-3">
                    <div className="text-gray-900 dark:text-white break-all">{row.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(row.created_at).toLocaleString("tr-TR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {/* Masaüstü: tablo */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">E-posta</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">Kayıt tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{row.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(row.created_at).toLocaleString("tr-TR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Yeni blog yazısı yayınlandığında tüm abonelere otomatik e-posta gider (Resend). Yukarıdaki form ile elle toplu e-posta da gönderebilirsiniz.
      </p>
    </div>
  );
}
