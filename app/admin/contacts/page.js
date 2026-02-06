"use client";

import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/contacts", { credentials: "include" });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setContacts(data);
        } else if (!cancelled) setContacts([]);
      } catch {
        if (!cancelled) setContacts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const dateBody = (row) =>
    new Date(row.created_at).toLocaleString("tr-TR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const openDetail = (row) => {
    setSelectedContact(row);
  };

  const replyMailto = (row) => {
    const subject = encodeURIComponent("Re: " + (row.subject || "İletişim"));
    const body = encodeURIComponent(
      "\n\n---\nGönderen: " +
        (row.name || "") +
        "\nTarih: " +
        new Date(row.created_at).toLocaleString("tr-TR") +
        "\n\nOrijinal mesaj:\n" +
        (row.message || "")
    );
    window.location.href = `mailto:${row.email || ""}?subject=${subject}&body=${body}`;
  };

  const actionsBody = (row) => (
    <Button
      icon="pi pi-eye"
      label="Detay"
      className="p-button-text p-button-sm"
      onClick={() => openDetail(row)}
      title="Mesaj detayını görüntüle"
    />
  );

  const messageBody = (row) => (
    <div
      className="text-gray-800 dark:text-gray-200 line-clamp-2 break-words max-w-[280px]"
      style={{ wordBreak: "break-word", overflow: "hidden" }}
      title={row.message || ""}
    >
      {row.message ? (row.message.length > 120 ? row.message.slice(0, 120) + "…" : row.message) : "—"}
    </div>
  );

  return (
    <div className="w-full max-w-5xl xl:max-w-none xl:px-8 2xl:px-12 mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">İletişim Mesajları</h1>
      <div className="admin-datatable-mobile-cards bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <DataTable
          value={contacts}
          loading={loading}
          emptyMessage="Henüz iletişim mesajı yok."
          size="small"
          stripedRows
          scrollable
          scrollHeight="flex"
          responsiveLayout="stack"
          breakpoint="960px"
        >
          <Column field="name" header="Ad" style={{ minWidth: "120px" }} />
          <Column field="email" header="E-posta" style={{ minWidth: "180px" }} />
          <Column field="subject" header="Konu" style={{ minWidth: "140px" }} />
          <Column body={messageBody} header="Mesaj" style={{ minWidth: "200px", maxWidth: "280px" }} />
          <Column body={dateBody} header="Tarih" style={{ width: "140px" }} />
          <Column body={actionsBody} header="" style={{ width: "100px" }} />
        </DataTable>
      </div>

      <Dialog
        header="Mesaj detayı"
        visible={!!selectedContact}
        onHide={() => setSelectedContact(null)}
        className="w-full max-w-2xl"
        contentClassName="p-0"
        blockScroll
      >
        {selectedContact && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ad</label>
                <p className="text-gray-900 mt-0.5">{selectedContact.name || "—"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">E-posta</label>
                <p className="text-gray-900 mt-0.5">
                  <a href={`mailto:${selectedContact.email}`} className="text-primary-500 hover:underline">
                    {selectedContact.email || "—"}
                  </a>
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Konu</label>
                <p className="text-gray-900 mt-0.5">{selectedContact.subject || "—"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tarih</label>
                <p className="text-gray-900 mt-0.5">
                  {new Date(selectedContact.created_at).toLocaleString("tr-TR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              {selectedContact.location && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Konum</label>
                  <p className="text-gray-900 mt-0.5">{selectedContact.location}</p>
                </div>
              )}
              {selectedContact.budget && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bütçe</label>
                  <p className="text-gray-900 mt-0.5">{selectedContact.budget}</p>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mesaj</label>
              <div
                className="mt-1 p-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-800 min-h-[80px] max-h-[320px] overflow-y-auto break-words whitespace-pre-wrap"
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              >
                {selectedContact.message || "—"}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-2">
              <Button
                icon="pi pi-envelope"
                label="E-posta ile yanıtla"
                className="bg-primary-500 hover:bg-primary-600 border-primary-500"
                onClick={() => replyMailto(selectedContact)}
              />
              <Button
                label="Kapat"
                className="p-button-outlined"
                onClick={() => setSelectedContact(null)}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
