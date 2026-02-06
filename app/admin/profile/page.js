"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export default function AdminProfilePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Yeni şifre ve tekrarı eşleşmiyor.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalı.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Şifre güncellenemedi.");
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 no-underline">
          ← Panele dön
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Şifre değiştir</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/20 p-3 rounded-lg">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/20 p-3 rounded-lg">
            Şifreniz güncellendi.
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mevcut şifre *</label>
          <Password
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Mevcut şifrenizi girin"
            feedback={false}
            toggleMask
            className="w-full"
            inputClassName="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yeni şifre *</label>
          <Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="En az 6 karakter"
            toggleMask
            className="w-full"
            inputClassName="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yeni şifre (tekrar) *</label>
          <Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Yeni şifreyi tekrar girin"
            feedback={false}
            toggleMask
            className="w-full"
            inputClassName="w-full"
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            label="Şifreyi güncelle"
            loading={loading}
            className="bg-primary-500 hover:bg-primary-600 border-primary-500"
          />
          <Link href="/admin">
            <Button type="button" label="İptal" className="p-button-outlined" />
          </Link>
        </div>
      </form>
    </div>
  );
}
