"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Message } from "primereact/message";
import RichTextEditor from "../../../_components/RichTextEditor";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    author: "",
    is_published: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/blogs/${id}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            title: data.title || "",
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            image_url: data.image_url || "",
            author: data.author || "",
            is_published: !!data.is_published,
          });
        } else setError("Yazı bulunamadı.");
      })
      .catch(() => setError("Yüklenemedi."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/blogs");
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
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blogs" className="text-gray-500 hover:text-gray-800 no-underline text-sm font-medium transition-colors flex items-center gap-1">
          <i className="pi pi-arrow-left text-xs" /> Listeye dön
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Blog yazısını düzenle</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Temel bilgiler</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık *</label>
              <InputText
                className="w-full"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                placeholder="Yazı başlığı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL)</label>
              <InputText
                className="w-full"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="url-yazisi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kısa özet</label>
              <InputTextarea
                className="w-full"
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={3}
                placeholder="Liste ve önizlemede görünecek kısa metin"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">İçerik</h2>
          </div>
          <div className="p-4 sm:p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Yazı metni</label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              placeholder="Yazı içeriği — kalın, italik, boyut ve emoji kullanabilirsiniz."
              minHeight={360}
            />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Görsel & yayın</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Görsel URL</label>
              <InputText
                className="w-full"
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="/blogs/gorsel.jpg veya tam URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Yazar</label>
              <InputText
                className="w-full"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Atakan Güloğlu"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                inputId="pub"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.checked }))}
              />
              <label htmlFor="pub" className="text-sm text-gray-700">Yayında göster</label>
            </div>
          </div>
        </section>

        {error && <Message severity="error" text={error} className="w-full" />}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" label={saving ? "Kaydediliyor..." : "Kaydet"} loading={saving} disabled={saving} className="bg-primary-500 hover:bg-primary-600 border-primary-500" icon="pi pi-check" iconPos="left" />
          <Link href="/admin/blogs"><Button type="button" label="İptal" className="p-button-outlined" icon="pi pi-times" iconPos="left" /></Link>
        </div>
      </form>
    </div>
  );
}
