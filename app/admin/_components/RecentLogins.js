"use client";

import { useState, useEffect } from "react";

export default function RecentLogins() {
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/logins?limit=20", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setLogins(Array.isArray(data) ? data : []))
      .catch(() => setLogins([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Son girişler</h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (logins.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Son girişler</h2>
        <p className="text-gray-500 text-sm">Henüz giriş kaydı yok.</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Az önce";
    if (diffMins < 60) return `${diffMins} dk önce`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} saat önce`;
    return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Son girişler</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
              <th className="pb-2 pr-4">Kullanıcı</th>
              <th className="pb-2 pr-4">IP</th>
              <th className="pb-2 pr-4 hidden sm:table-cell">Tarayıcı / Cihaz</th>
              <th className="pb-2 pr-4 whitespace-nowrap">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {logins.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 last:border-0">
                <td className="py-3 pr-4 font-medium text-gray-900">{row.username}</td>
                <td className="py-3 pr-4 font-mono text-gray-600">{row.ip_address || "—"}</td>
                <td className="py-3 pr-4 hidden sm:table-cell text-gray-500 max-w-[200px] truncate" title={row.user_agent || ""}>
                  {row.user_agent ? (row.user_agent.length > 50 ? row.user_agent.slice(0, 50) + "…" : row.user_agent) : "—"}
                </td>
                <td className="py-3 whitespace-nowrap text-gray-500">{formatDate(row.logged_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
