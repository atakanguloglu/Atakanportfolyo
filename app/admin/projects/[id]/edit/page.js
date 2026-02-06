"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Message } from "primereact/message";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    image_url: "",
    link: "",
    is_published: true,
    sort_order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            title: data.title || "",
            category: data.category || "",
            description: data.description || "",
            image_url: data.image_url || "",
            link: data.link || "",
            is_published: !!data.is_published,
            sort_order: data.sort_order ?? 0,
          });
        } else setError("Proje bulunamadı.");
      })
      .catch(() => setError("Yüklenemedi."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        setError(data.error || "Güncellenemedi.");
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
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/projects" className="text-gray-500 hover:text-gray-700 no-underline">
          ← Listeye dön
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Projeyi düzenle</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
          <InputText
            className="w-full"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            placeholder="Proje başlığı"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <InputText
            className="w-full"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            placeholder="Örn: UI-UX TASARIM"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <InputTextarea
            className="w-full"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
          <InputText
            className="w-full"
            value={form.image_url}
            onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link (Örnek çalışma)</label>
          <InputText
            className="w-full"
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
          <InputNumber
            value={form.sort_order}
            onValueChange={(e) => setForm((f) => ({ ...f, sort_order: e.value ?? 0 }))}
            min={0}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            inputId="pub"
            checked={form.is_published}
            onChange={(e) => setForm((f) => ({ ...f, is_published: e.checked }))}
          />
          <label htmlFor="pub" className="text-sm text-gray-700">Ana sayfa ve projeler sayfasında göster</label>
        </div>
        {error && <Message severity="error" text={error} className="w-full" />}
        <div className="flex gap-2">
          <Button type="submit" label={saving ? "Kaydediliyor..." : "Kaydet"} loading={saving} disabled={saving} className="bg-primary-500 hover:bg-primary-600 border-primary-500" />
          <Link href="/admin/projects"><Button type="button" label="İptal" className="p-button-outlined" /></Link>
        </div>
      </form>
    </div>
  );
}
