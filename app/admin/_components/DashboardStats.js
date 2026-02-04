"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setStats(data);
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: "İletişim mesajı", value: stats.contacts, href: "/admin/contacts", color: "text-primary-600" },
    { label: "Onay bekleyen yorum", value: stats.commentsPending, href: "/admin/comments", color: stats.commentsPending > 0 ? "text-amber-600" : "text-gray-600" },
    { label: "Blog yazısı", value: stats.blogs, href: "/admin/blogs", color: "text-gray-900" },
    { label: "Proje", value: stats.projects, href: "/admin/projects", color: "text-gray-900" },
    { label: "Referans", value: stats.testimonials ?? 0, href: "/admin/testimonials", color: "text-gray-900" },
    { label: "Bülten abonesi", value: stats.newsletter ?? 0, href: "/admin/newsletter", color: "text-gray-900" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition no-underline"
        >
          <div className="text-sm text-gray-500">{card.label}</div>
          <div className={`text-2xl font-semibold mt-1 ${card.color}`}>{card.value}</div>
        </Link>
      ))}
    </div>
  );
}
