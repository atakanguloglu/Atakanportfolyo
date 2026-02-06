"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newsletter", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSubscribers(Array.isArray(data) ? data : []))
      .catch(() => setSubscribers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 no-underline">
          ← Panele dön
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Bülten aboneleri</h1>
      </div>

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
        Yeni blog yazısı yayınlandığında tüm abonelere otomatik e-posta gider (Resend).
      </p>
    </div>
  );
}
