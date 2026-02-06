"use client";

import { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import Image from "next/image";
import Link from "next/link";

const responsiveOptions = [
  { breakpoint: "1400px", numVisible: 2, numScroll: 1 },
  { breakpoint: "1199px", numVisible: 3, numScroll: 1 },
  { breakpoint: "767px", numVisible: 2, numScroll: 1 },
  { breakpoint: "575px", numVisible: 1, numScroll: 1 },
];

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setBlogs(data.slice(0, 9)))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  const template = (blog) => (
    <div className="bg-white rounded-lg border border-gray-50 mx-3 overflow-hidden">
      <Link href={`/blogs/${blog.slug}`} className="block no-underline">
        <div className="relative w-full h-56 bg-gray-100">
          {blog.image_url ? (
            <Image
              src={blog.image_url.startsWith("/") ? blog.image_url : blog.image_url}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-light">
              {blog.title.charAt(0)}
            </div>
          )}
        </div>
        <div className="p-6">
          <p className="text-gray-400 text-sm">
            {blog.published_at
              ? new Date(blog.published_at).toLocaleDateString("tr-TR")
              : new Date(blog.created_at).toLocaleDateString("tr-TR")}
            {blog.author && ` · ${blog.author}`}
          </p>
          <h3 className="text-gray-900 text-lg font-medium mt-1 line-clamp-2 group-hover:text-primary-500">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{blog.excerpt}</p>
          )}
        </div>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        Yazılar yükleniyor...
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 mb-4">Henüz blog yazısı yok.</p>
        <Link href="/blogs" className="text-primary-500 hover:underline font-medium">
          Blog sayfası →
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <Carousel
        value={blogs}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={template}
      />
      <div className="text-center mt-6">
        <Link
          href="/blogs"
          className="inline-block p-button p-button-outlined text-primary-500 font-bold no-underline dark:!border-primary-400 dark:!text-primary-200 dark:hover:!bg-primary-500/20 dark:hover:!text-primary-100"
        >
          Tüm yazılar →
        </Link>
      </div>
    </div>
  );
}
