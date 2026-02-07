"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const FIELDS = [
  { key: "site_title", label: "Site başlığı", placeholder: "Ana Sayfa | Atakan Güloğlu" },
  { key: "title_template", label: "Sayfa başlık şablonu", placeholder: "%s | Atakan Güloğlu" },
  { key: "meta_description", label: "Meta açıklama (SEO)", placeholder: "Kısa site açıklaması" },
  { key: "contact_email", label: "İletişim e-postası", placeholder: "ornek@email.com" },
  { key: "contact_phone", label: "Telefon", placeholder: "+90 5XX XXX XX XX" },
  { key: "whatsapp_number", label: "WhatsApp numarası (sadece rakam)", placeholder: "905380803023" },
  { key: "linkedin_url", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
  { key: "github_url", label: "GitHub URL", placeholder: "https://github.com/..." },
  { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/..." },
  { key: "twitter_url", label: "Twitter/X URL", placeholder: "https://twitter.com/..." },
  { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/..." },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/site-settings", { credentials: "include" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        } else {
          setError("Ayarlar yüklenemedi.");
        }
      } catch {
        if (!cancelled) setError("Bağlantı hatası.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (key, value) => {
    setSettings((s) => ({ ...s, [key]: value ?? "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "Ayarlar kaydedilemedi.");
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 no-underline"
        >
          ← Panele dön
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Site ayarları</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Genel & SEO</h2>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/20 p-3 rounded-lg mb-4">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/20 p-3 rounded-lg mb-4">
              Ayarlar kaydedildi.
            </p>
          )}
          <div className="grid gap-4">
            {FIELDS.slice(0, 3).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                <InputText
                  value={settings[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">İletişim</h2>
          <div className="grid gap-4">
            {FIELDS.slice(3, 6).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                <InputText
                  value={settings[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sosyal medya linkleri</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Header ve footer’da gösterilecek linkler. Boş bırakırsanız ilgili ikon gösterilmez.
          </p>
          <div className="grid gap-4">
            {FIELDS.slice(6).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                <InputText
                  value={settings[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <Button
            type="submit"
            label="Kaydet"
            icon="pi pi-check"
            loading={saving}
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700"
          />
        </div>
      </form>
    </div>
  );
}
