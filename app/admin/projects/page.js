"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects?admin=true", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else setProjects([]);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const confirmDelete = (row) => {
    confirmDialog({
      message: `"${row.title}" projesini silmek istediğinize emin misiniz?`,
      header: "Silme onayı",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sil",
      rejectLabel: "İptal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        const res = await fetch(`/api/projects/${row.id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) fetchProjects();
      },
    });
  };

  const publishedBody = (row) =>
    row.is_published ? <Tag value="Yayında" severity="success" /> : <Tag value="Taslak" severity="secondary" />;

  const dateBody = (row) => new Date(row.created_at).toLocaleDateString("tr-TR");

  const actionsBody = (row) => (
    <div className="flex gap-2">
      <Link href={`/admin/projects/${row.id}/edit`}>
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
        <h1 className="text-2xl font-semibold text-gray-900">Projeler</h1>
        <Link href="/admin/projects/new">
          <Button label="Yeni proje" icon="pi pi-plus" className="bg-primary-500 hover:bg-primary-600 border-primary-500" />
        </Link>
      </div>
      <ConfirmDialog />
      <div className="admin-datatable-mobile-cards bg-white rounded-xl border border-gray-200 overflow-hidden">
        <DataTable
          value={projects}
          loading={loading}
          emptyMessage="Henüz proje yok. Yeni proje ekleyin."
          size="small"
          stripedRows
          responsiveLayout="stack"
          breakpoint="960px"
        >
          <Column field="title" header="Başlık" sortable style={{ maxWidth: "280px" }} />
          <Column field="category" header="Kategori" style={{ maxWidth: "140px" }} />
          <Column body={publishedBody} header="Durum" style={{ width: "100px" }} />
          <Column body={dateBody} header="Tarih" style={{ width: "100px" }} />
          <Column body={actionsBody} header="" style={{ width: "120px" }} />
        </DataTable>
      </div>
    </div>
  );
}
