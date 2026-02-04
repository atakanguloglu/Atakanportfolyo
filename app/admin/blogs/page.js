"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs?admin=true", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else setBlogs([]);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const confirmDelete = (row) => {
    confirmDialog({
      message: `"${row.title}" yazısını silmek istediğinize emin misiniz?`,
      header: "Silme onayı",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sil",
      rejectLabel: "İptal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        const res = await fetch(`/api/blogs/${row.id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) fetchBlogs();
      },
    });
  };

  const publishedBody = (row) =>
    row.is_published ? <Tag value="Yayında" severity="success" /> : <Tag value="Taslak" severity="secondary" />;

  const dateBody = (row) =>
    row.published_at
      ? new Date(row.published_at).toLocaleDateString("tr-TR")
      : new Date(row.created_at).toLocaleDateString("tr-TR");

  const actionsBody = (row) => (
    <div className="flex gap-2">
      <Link href={`/blogs/${row.slug}`}>
        <Button icon="pi pi-eye" className="p-button-text p-button-sm" title="Görüntüle" />
      </Link>
      <Link href={`/admin/blogs/${row.id}/edit`}>
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
    <div className="w-full max-w-5xl xl:max-w-none xl:px-8 2xl:px-12 mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Blog Yazıları</h1>
        <Link href="/admin/blogs/new">
          <Button label="Yeni yazı" icon="pi pi-plus" className="bg-primary-500 hover:bg-primary-600 border-primary-500" />
        </Link>
      </div>
      <ConfirmDialog />
      <div className="admin-datatable-mobile-cards bg-white rounded-xl border border-gray-200 overflow-hidden min-w-0">
        <DataTable
          value={blogs}
          loading={loading}
          emptyMessage="Henüz blog yazısı yok. Yeni yazı ekleyin."
          size="small"
          stripedRows
          responsiveLayout="stack"
          breakpoint="960px"
        >
          <Column field="title" header="Başlık" sortable />
          <Column field="slug" header="Slug" />
          <Column body={publishedBody} header="Durum" />
          <Column body={dateBody} header="Tarih" />
          <Column body={actionsBody} header="" />
        </DataTable>
      </div>
    </div>
  );
}
