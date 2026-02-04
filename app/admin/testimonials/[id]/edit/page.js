"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState({
    text: "",
    user_name: "",
    user_post: "",
    user_company: "",
    sort_order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/testimonials/${id}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            text: data.text || "",
            user_name: data.user_name || "",
            user_post: data.user_post || "",
            user_company: data.user_company || "",
            sort_order: data.sort_order ?? 0,
          });
        } else setError("Referans bulunamadı.");
      })
      .catch(() => setError("Yüklenemedi."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/testimonials");
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
        <Link href="/admin/testimonials" className="text-gray-500 hover:text-gray-700 no-underline">
          ← Listeye dön
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Referansı düzenle</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referans metni *</label>
          <InputTextarea
            className="w-full"
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İsim *</label>
          <InputText
            className="w-full"
            value={form.user_name}
            onChange={(e) => setForm((f) => ({ ...f, user_name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pozisyon</label>
          <InputText
            className="w-full"
            value={form.user_post}
            onChange={(e) => setForm((f) => ({ ...f, user_post: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Şirket</label>
          <InputText
            className="w-full"
            value={form.user_company}
            onChange={(e) => setForm((f) => ({ ...f, user_company: e.target.value }))}
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
        {error && <Message severity="error" text={error} className="w-full" />}
        <div className="flex gap-2">
          <Button type="submit" label={saving ? "Kaydediliyor..." : "Kaydet"} loading={saving} disabled={saving} className="bg-primary-500 hover:bg-primary-600 border-primary-500" />
          <Link href="/admin/testimonials"><Button type="button" label="İptal" className="p-button-outlined" /></Link>
        </div>
      </form>
    </div>
  );
}
