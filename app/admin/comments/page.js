"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/comments", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else setComments([]);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const dateBody = (row) =>
    new Date(row.created_at).toLocaleString("tr-TR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const statusBody = (row) =>
    row.is_approved ? (
      <Tag value="Onaylı" severity="success" />
    ) : (
      <Tag value="Onay bekliyor" severity="warning" />
    );

  const handleApprove = async (row) => {
    const res = await fetch(`/api/comments/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ is_approved: !row.is_approved }),
    });
    if (res.ok) fetchComments();
  };

  const confirmDelete = (row) => {
    confirmDialog({
      message: "Bu yorumu silmek istediğinize emin misiniz?",
      header: "Silme onayı",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sil",
      rejectLabel: "İptal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        const res = await fetch(`/api/comments/${row.id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) {
          setSelectedComment(null);
          fetchComments();
        }
      },
    });
  };

  const actionsBody = (row) => (
    <div className="flex flex-wrap gap-2">
      <Button
        icon={row.is_approved ? "pi pi-times" : "pi pi-check"}
        label={row.is_approved ? "Onayı kaldır" : "Onayla"}
        className="p-button-text p-button-sm admin-table-action"
        onClick={() => handleApprove(row)}
        title={row.is_approved ? "Onayı kaldır" : "Onayla"}
      />
      <Button
        icon="pi pi-eye"
        className="p-button-text p-button-sm admin-table-action"
        title="Detay"
        onClick={() => setSelectedComment(row)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-sm p-button-danger"
        title="Sil"
        onClick={() => confirmDelete(row)}
      />
    </div>
  );

  const blogBody = (row) => (
    <Link href={`/blogs/${row.blog_slug}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-sky-300 hover:underline dark:hover:text-sky-200 no-underline">
      {row.blog_title || "—"}
    </Link>
  );

  return (
    <div className="w-full max-w-5xl xl:max-w-none xl:px-8 2xl:px-12 mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Yorumlar</h1>
      <div className="admin-datatable-mobile-cards bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <DataTable
          value={comments}
          loading={loading}
          emptyMessage="Henüz yorum yok."
          size="small"
          stripedRows
          scrollable
          scrollHeight="flex"
          responsiveLayout="stack"
          breakpoint="960px"
        >
          <Column body={blogBody} header="Yazı" style={{ minWidth: "160px" }} />
          <Column field="author_name" header="Yazan" style={{ minWidth: "120px" }} />
          <Column field="content" header="Yorum" bodyStyle={{ maxWidth: "280px" }} />
          <Column body={statusBody} header="Durum" style={{ width: "120px" }} />
          <Column body={dateBody} header="Tarih" style={{ width: "130px" }} />
          <Column body={actionsBody} header="" style={{ minWidth: "180px" }} />
        </DataTable>
      </div>

      <ConfirmDialog />

      <Dialog
        header="Yorum detayı"
        visible={!!selectedComment}
        onHide={() => setSelectedComment(null)}
        className="w-full max-w-2xl"
        contentClassName="p-0"
        blockScroll
      >
        {selectedComment && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Yazı</label>
                <p className="text-gray-900 dark:text-white mt-0.5">
                  <Link
                    href={`/blogs/${selectedComment.blog_slug}`}
                    className="text-primary-600 dark:text-sky-300 hover:underline no-underline"
                  >
                    {selectedComment.blog_title || "—"}
                  </Link>
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Durum</label>
                <p className="text-gray-900 dark:text-white mt-0.5">{selectedComment.is_approved ? "Onaylı" : "Onay bekliyor"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Yazan</label>
                <p className="text-gray-900 dark:text-white mt-0.5">{selectedComment.author_name || "—"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">E-posta</label>
                <p className="text-gray-900 dark:text-white mt-0.5">{selectedComment.author_email || "—"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tarih</label>
                <p className="text-gray-900 dark:text-white mt-0.5">
                  {new Date(selectedComment.created_at).toLocaleString("tr-TR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Yorum</label>
              <div className="mt-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-200 whitespace-pre-wrap min-h-[80px]">
                {selectedComment.content || "—"}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600 flex flex-wrap gap-2">
              <Button
                icon={selectedComment.is_approved ? "pi pi-times" : "pi pi-check"}
                label={selectedComment.is_approved ? "Onayı kaldır" : "Onayla"}
                className={selectedComment.is_approved ? "p-button-outlined" : "bg-primary-500 hover:bg-primary-600 border-primary-500"}
                onClick={() => {
                  handleApprove(selectedComment);
                  setSelectedComment((c) => (c ? { ...c, is_approved: !c.is_approved } : null));
                }}
              />
              <Button label="Sil" className="p-button-outlined p-button-danger" onClick={() => confirmDelete(selectedComment)} />
              <Button label="Kapat" className="p-button-outlined" onClick={() => setSelectedComment(null)} />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
