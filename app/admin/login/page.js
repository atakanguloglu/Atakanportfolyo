"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import ThemeToggle from "@/app/_components/ThemeToggle";

const LOGIN_IMAGES = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setImageIndex((i) => (i + 1) % LOGIN_IMAGES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Giriş yapılamadı.");
      }
    } catch (err) {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 md:p-6 relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-6xl min-h-[85vh] md:min-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-700">
        {/* Sol: Yazılım / teknoloji temalı geçişli görseller */}
        <div className="relative w-full md:w-[45%] min-h-[220px] md:min-h-full bg-primary-600 overflow-hidden">
          {LOGIN_IMAGES.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-700 ${i === imageIndex ? "opacity-100 z-0" : "opacity-0 z-0"}`}
            >
              <Image
                src={src}
                alt="Yazılım geliştirme"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 45vw"
                priority={i === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-primary-600/50 md:bg-primary-600/35 z-10 pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white">
            <h2 className="text-xl md:text-2xl font-semibold mb-1">Yönetim Paneli</h2>
            <p className="text-white/90 text-sm md:text-base">
              Blog, projeler ve içerik yönetimi
            </p>
          </div>
        </div>

        {/* Sağ: Giriş formu */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Admin Girişi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base md:text-lg">
              Blog ve içerik yönetimi
            </p>

            <form onSubmit={handleSubmit} className="mt-8 md:mt-10 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kullanıcı adı
                </label>
                <InputText
                  className="w-full p-3 text-base"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şifre
                </label>
                <InputText
                  type="password"
                  className="w-full p-3 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <Message severity="error" text={error} className="w-full" />
              )}
              <Button
                type="submit"
                label={loading ? "Giriş yapılıyor..." : "Giriş yap"}
                className="w-full bg-primary-500 hover:bg-primary-600 border-primary-500 py-3 text-base font-medium"
                loading={loading}
                disabled={loading}
              />
            </form>

            <p className="mt-8 text-center">
              <Link
                href="/"
                className="text-primary-600 dark:text-sky-300 hover:underline dark:hover:text-sky-200 text-base font-medium"
              >
                ← Siteye dön
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
