"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SiteVisitsSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/visits?limit=1", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="block p-4 bg-white rounded-xl border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-20" />
      </div>
    );
  }

  const stats = data?.stats ?? { today: 0, total: 0 };

  return (
    <Link
      href="/admin/visits"
      className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition no-underline"
    >
      <span className="text-sm font-medium text-gray-500">Site ziyaretleri</span>
      <p className="mt-1 text-lg font-semibold text-gray-900">
        Bugün: {stats.today} · Toplam: {stats.total}
      </p>
      <span className="text-xs text-primary-500 mt-1 inline-block">Detaylar →</span>
    </Link>
  );
}
