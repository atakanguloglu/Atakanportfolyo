"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const SORT_OPTIONS = [
  { value: "newest", label: "En yeni" },
  { value: "oldest", label: "En eski" },
];

function normalizeForSearch(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function BlogListWithFilters({ blogs: initialBlogs }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [author, setAuthor] = useState("");

  const authors = useMemo(() => {
    const set = new Set();
    initialBlogs.forEach((b) => {
      if (b.author?.trim()) set.add(b.author.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
  }, [initialBlogs]);

  const filteredAndSorted = useMemo(() => {
    let list = [...initialBlogs];

    const q = search.trim();
    if (q) {
      const normQ = normalizeForSearch(q);
      list = list.filter((b) => {
        const titleNorm = normalizeForSearch(b.title);
        const excerptNorm = normalizeForSearch(b.excerpt || "");
        return titleNorm.includes(normQ) || excerptNorm.includes(normQ);
      });
    }

    if (author) {
      list = list.filter((b) => (b.author || "").trim() === author);
    }

    const dateKey = (b) => new Date(b.published_at || b.created_at || 0).getTime();
    if (sort === "newest") {
      list.sort((a, b) => dateKey(b) - dateKey(a));
    } else {
      list.sort((a, b) => dateKey(a) - dateKey(b));
    }

    return list;
  }, [initialBlogs, search, sort, author]);

  const hasFilters = Boolean(search.trim() || author);

  if (initialBlogs.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">Henüz yayınlanmış yazı yok.</p>
    );
  }

  const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  return (
    <>
      <div className="mb-10 bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Ara ve filtrele</span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex-1 relative flex items-center">
              <span className="absolute left-3.5 pointer-events-none" aria-hidden>
                <SearchIcon />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Başlık veya özette ara..."
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition text-sm"
                aria-label="Yazı ara"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm font-medium focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition min-w-[120px]"
                aria-label="Sıralama"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {authors.length > 1 && (
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm font-medium focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition min-w-[140px]"
                  aria-label="Yazar"
                >
                  <option value="">Tüm yazarlar</option>
                  {authors.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              )}
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setAuthor("");
                  }}
                  className="h-11 px-4 rounded-xl text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition whitespace-nowrap"
                >
                  Temizle
                </button>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredAndSorted.length === 0
                ? "Bu kriterlere uygun yazı bulunamadı."
                : `${filteredAndSorted.length} yazı`}
            </p>
            {filteredAndSorted.length > 0 && (
              <span className="text-xs text-gray-400 font-medium tabular-nums">{initialBlogs.length} yazı toplam</span>
            )}
          </div>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          Farklı bir arama terimi veya filtre deneyin.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
          {filteredAndSorted.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-500 hover:shadow-lg transition no-underline"
            >
              <div className="relative w-full aspect-video bg-gray-100">
                {blog.image_url ? (
                  <Image
                    src={blog.image_url.startsWith("/") ? blog.image_url : blog.image_url}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-light">
                    {blog.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-500 transition line-clamp-2">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{blog.excerpt}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {blog.published_at
                    ? new Date(blog.published_at).toLocaleDateString("tr-TR")
                    : new Date(blog.created_at).toLocaleDateString("tr-TR")}
                  {blog.author && ` · ${blog.author}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
