"use client";

import { useState, useEffect } from "react";

export default function SiteVisits({ limit = 30 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const l = Math.min(Math.max(parseInt(limit, 10) || 30, 1), 200);
    fetch(`/api/admin/visits?limit=${l}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Site ziyaretleri</h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Site ziyaretleri</h2>
        <p className="text-gray-500 text-sm">Ziyaret verisi yüklenemedi.</p>
      </div>
    );
  }

  const { visits, stats } = data;
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Az önce";
    if (diffMins < 60) return `${diffMins} dk önce`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} saat önce`;
    return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Site ziyaretleri</h2>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">
            Bugün: <strong className="text-gray-900">{stats.today ?? 0}</strong>
          </span>
          <span className="text-gray-500">
            Toplam: <strong className="text-gray-900">{stats.total ?? 0}</strong>
          </span>
        </div>
      </div>
      {visits.length === 0 ? (
        <p className="text-gray-500 text-sm">Henüz ziyaret kaydı yok. (Çerez onayı veren ziyaretçiler kaydedilir.)</p>
      ) : (
        <div className="overflow-auto max-h-[min(70vh,600px)] rounded-lg border border-gray-100">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
              <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                <th className="pb-2 pt-2 pr-4 bg-white">Sayfa</th>
                <th className="pb-2 pt-2 pr-4 hidden sm:table-cell bg-white">Nereden</th>
                <th className="pb-2 pt-2 pr-4 hidden md:table-cell bg-white">Tarayıcı</th>
                <th className="pb-2 pt-2 whitespace-nowrap bg-white">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 pr-4 font-mono text-gray-900">{row.path}</td>
                  <td className="py-3 pr-4 hidden sm:table-cell text-gray-500 max-w-[180px] truncate" title={row.referer || ""}>
                    {row.referer ? (row.referer.length > 40 ? row.referer.slice(0, 40) + "…" : row.referer) : "—"}
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell text-gray-500 max-w-[200px] truncate" title={row.user_agent || ""}>
                    {row.user_agent ? (row.user_agent.length > 45 ? row.user_agent.slice(0, 45) + "…" : row.user_agent) : "—"}
                  </td>
                  <td className="py-3 whitespace-nowrap text-gray-500">{formatDate(row.visited_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
