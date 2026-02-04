"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials?admin=true", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      } else setTestimonials([]);
    } catch {
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const confirmDelete = (row) => {
    confirmDialog({
      message: `"${row.user_name}" referansını silmek istediğinize emin misiniz?`,
      header: "Silme onayı",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sil",
      rejectLabel: "İptal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        const res = await fetch(`/api/testimonials/${row.id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) fetchTestimonials();
      },
    });
  };

  const textBody = (row) => (
    <span className="line-clamp-2 max-w-xs" title={row.text}>{row.text}</span>
  );

  const actionsBody = (row) => (
    <div className="flex gap-2">
      <Link href={`/admin/testimonials/${row.id}/edit`}>
        <Button icon="pi pi-pencil" className="p-button-text p-button-sm" title="Düzenle" />
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
        <h1 className="text-2xl font-semibold text-gray-900">Referanslar</h1>
        <Link href="/admin/testimonials/new">
          <Button label="Yeni referans" icon="pi pi-plus" className="bg-primary-500 hover:bg-primary-600 border-primary-500" />
        </Link>
      </div>
      <ConfirmDialog />
      <div className="admin-datatable-mobile-cards bg-white rounded-xl border border-gray-200 overflow-hidden">
        <DataTable
          value={testimonials}
          loading={loading}
          emptyMessage="Henüz referans yok. Yeni referans ekleyin."
          size="small"
          stripedRows
          responsiveLayout="stack"
          breakpoint="960px"
        >
          <Column body={textBody} header="Metin" style={{ maxWidth: "320px" }} />
          <Column field="user_name" header="İsim" sortable style={{ maxWidth: "140px" }} />
          <Column field="user_post" header="Pozisyon" style={{ maxWidth: "120px" }} />
          <Column field="user_company" header="Şirket" style={{ maxWidth: "120px" }} />
          <Column body={actionsBody} header="" style={{ width: "100px" }} />
        </DataTable>
      </div>
    </div>
  );
}
