"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "primereact/button";

function imageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/clients/${image}`;
}

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ name: "", image: "", sort_order: 0 });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/clients/${id}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            name: data.name || "",
            image: data.image || "",
            sort_order: data.sort_order ?? 0,
          });
        } else setError("Kayıt bulunamadı.");
      })
      .catch(() => setError("Yüklenemedi."))
      .finally(() => setLoading(false));
  }, [id]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      let imageToSave = form.image;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/admin/upload/client-logo", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          setError(uploadData.error || "Dosya yüklenemedi.");
          setSaving(false);
          return;
        }
        imageToSave = uploadData.image;
      }

      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          image: imageToSave,
          sort_order: form.sort_order,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/clients");
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
        <p className="text-gray-500">Yükleniyor…</p>
      </div>
    );
  }

  const currentImageUrl = form.image ? imageSrc(form.image) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/clients" className="text-gray-500 hover:text-gray-700 no-underline">
          ← Listeye dön
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Logoyu düzenle</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marka adı *</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            placeholder="Amazon"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          {currentImageUrl && !preview && (
            <div className="mb-3 flex items-center gap-3">
              <div className="relative w-16 h-16 rounded border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                <Image src={currentImageUrl} alt={form.name} fill className="object-contain p-1" sizes="64px" />
              </div>
              <span className="text-sm text-gray-500 font-mono">{form.image}</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100"
            onChange={onFileChange}
          />
          <p className="text-xs text-gray-500 mt-1">
            Yeni dosya seçerseniz mevcut logo değişir. SVG, PNG, JPG veya WebP. En fazla 2 MB.
          </p>
          {preview && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">Yeni önizleme:</span>
              <div className="w-16 h-16 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-1">
                <img src={preview} alt="Yeni logo" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
          <input
            type="number"
            min={0}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" label="Kaydet" loading={saving} className="bg-primary-500 hover:bg-primary-600 border-primary-500" />
          <Link href="/admin/clients">
            <Button type="button" label="İptal" className="p-button-outlined" />
          </Link>
        </div>
      </form>
    </div>
  );
}
