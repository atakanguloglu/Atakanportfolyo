"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

function imageSrc(image, cacheBuster) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  const base = `/clients/${image}`;
  return cacheBuster ? `${base}?v=${cacheBuster}` : base;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients?admin=true", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      } else setClients([]);
    } catch {
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const confirmDelete = (row) => {
    confirmDialog({
      message: `"${row.name}" logosunu silmek istediğinize emin misiniz?`,
      header: "Silme onayı",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sil",
      rejectLabel: "İptal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        const res = await fetch(`/api/clients/${row.id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) fetchClients();
      },
    });
  };

  const imageBody = (row) => (
    <div className="relative w-12 h-12 rounded border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
      <Image
        src={imageSrc(row.image, row.updated_at || row.id)}
        alt={row.name}
        fill
        className="object-contain p-1"
        sizes="48px"
        unoptimized={row.image?.endsWith(".svg")}
      />
    </div>
  );

  const actionsBody = (row) => (
    <div className="flex gap-2">
      <Link href={`/admin/clients/${row.id}/edit`}>
        <Button icon="pi pi-pencil" className="p-button-text p-button-sm admin-table-action" title="Düzenle" />
      </Link>
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-sm p-button-danger"
        title="Sil"
        onClick={() => confirmDelete(row)}
      />
    </div>
  );

  return (
    <div className="w-full max-w-5xl xl:max-w-none xl:px-8 2xl:px-12 mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Mutlu Müşteriler</h1>
        <Link href="/admin/clients/new">
          <Button label="Yeni logo ekle" icon="pi pi-plus" className="bg-primary-500 hover:bg-primary-600 border-primary-500" />
        </Link>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Ana sayfadaki &quot;Mutlu Müşteriler&quot; bölümünde görünen logolar. Yeni eklerken veya düzenlerken logo dosyasını yükleyin (SVG, PNG, JPG, WebP).
      </p>
      <ConfirmDialog />
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Yükleniyor…</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Henüz müşteri logosu yok. Yeni logo ekleyin.</div>
        ) : (
          <>
            {/* Mobil: kart listesi */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {clients.map((row) => (
                <div key={row.id} className="p-4 flex items-center gap-3">
                  <div className="shrink-0">{imageBody({ ...row })}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 dark:text-white truncate">{row.name}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs font-mono truncate">{row.image}</div>
                    <div className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Sıra: {row.sort_order}</div>
                  </div>
                  <div className="shrink-0">{actionsBody({ ...row })}</div>
                </div>
              ))}
            </div>
            {/* Masaüstü: tablo */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300 font-medium">
                    <th className="p-3 w-16">Logo</th>
                    <th className="p-3">Marka adı</th>
                    <th className="p-3">Dosya adı</th>
                    <th className="p-3 w-24">Sıra</th>
                    <th className="p-3 w-28"></th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <td className="p-3">{imageBody({ ...row })}</td>
                      <td className="p-3 font-medium text-gray-900 dark:text-white">{row.name}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-300 font-mono text-xs">{row.image}</td>
                      <td className="p-3 text-gray-500 dark:text-gray-400">{row.sort_order}</td>
                      <td className="p-3">{actionsBody({ ...row })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
