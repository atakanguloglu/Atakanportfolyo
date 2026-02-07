"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

const DEFAULT_AVATAR = "/profile.png";

export default function AdminProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({ display_name: "", avatar_url: "" });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [logoutAllLoading, setLogoutAllLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/profile", { credentials: "include" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setProfile({
            display_name: data.display_name ?? "",
            avatar_url: data.avatar_url ?? "",
          });
        }
      } catch {
        if (!cancelled) setProfileError("Profil bilgisi yüklenemedi.");
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onAvatarFileChange = (e) => {
    const f = e.target.files?.[0];
    setAvatarFile(f || null);
    setAvatarPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setProfileError("");
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", avatarFile);
      const uploadRes = await fetch("/api/admin/upload/profile-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        setProfileError(uploadData.error || "Resim yüklenemedi.");
        setAvatarUploading(false);
        return;
      }
      const url = uploadData.url || `/profile/${uploadData.image}`;
      const patchRes = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ avatar_url: url }),
      });
      if (patchRes.ok) {
        setProfile((p) => ({ ...p, avatar_url: url }));
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        setProfileError("Profil resmi kaydedilemedi.");
      }
    } catch {
      setProfileError("Bağlantı hatası.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    setProfileSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ display_name: profile.display_name.trim() }),
      });
      if (res.ok) {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        const data = await res.json();
        setProfileError(data.error || "Profil güncellenemedi.");
      }
    } catch {
      setProfileError("Bağlantı hatası.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) {
      setPasswordError("Yeni şifre ve tekrarı eşleşmiyor.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    setPasswordLoading(true);
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
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.error || "Şifre güncellenemedi.");
      }
    } catch {
      setPasswordError("Bağlantı hatası.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const avatarDisplayUrl = avatarPreview || profile.avatar_url || DEFAULT_AVATAR;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 no-underline"
        >
          ← Panele dön
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Profil</h1>
      </div>

      {profileLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
      ) : (
        <div className="space-y-8">
          {/* Profil bilgileri ve resim */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profil bilgileri</h2>
            {profileError && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/20 p-3 rounded-lg mb-4">
                {profileError}
              </p>
            )}
            {profileSuccess && (
              <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/20 p-3 rounded-lg mb-4">
                Profil güncellendi.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={avatarDisplayUrl}
                    alt="Profil"
                    fill
                    className="object-cover"
                    unoptimized={avatarDisplayUrl.startsWith("blob:")}
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={onAvatarFileChange}
                  className="hidden"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    label="Resim seç"
                    icon="pi pi-upload"
                    className="p-button-outlined p-button-sm"
                    onClick={() => fileInputRef.current?.click()}
                  />
                  {avatarFile && (
                    <Button
                      type="button"
                      label="Yükle"
                      loading={avatarUploading}
                      className="p-button-sm"
                      onClick={handleUploadAvatar}
                    />
                  )}
                </div>
              </div>
              <form onSubmit={handleSaveProfile} className="flex-1 space-y-4 min-w-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Görünen ad
                  </label>
                  <InputText
                    value={profile.display_name}
                    onChange={(e) => setProfile((p) => ({ ...p, display_name: e.target.value }))}
                    placeholder="Örn. Atakan Güloğlu"
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  label="Bilgileri kaydet"
                  loading={profileSaving}
                  className="bg-primary-500 hover:bg-primary-600 border-primary-500"
                />
              </form>
            </div>
          </section>

          {/* Şifre değiştir */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Şifre değiştir</h2>
            {passwordError && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/20 p-3 rounded-lg mb-4">
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/20 p-3 rounded-lg mb-4">
                Şifreniz güncellendi.
              </p>
            )}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mevcut şifre *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yeni şifre *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yeni şifre (tekrar) *
                </label>
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
              <Button
                type="submit"
                label="Şifreyi güncelle"
                loading={passwordLoading}
                className="bg-primary-500 hover:bg-primary-600 border-primary-500"
              />
            </form>
          </section>

          {/* Tüm oturumları sonlandır */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Güvenlik</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Tüm cihazlardan (bilgisayar, telefon vb.) çıkış yapar. Bu cihaz dahil tekrar giriş yapmanız gerekir.
            </p>
            <Button
              type="button"
              label="Tüm oturumları sonlandır"
              icon="pi pi-sign-out"
              loading={logoutAllLoading}
              disabled={logoutAllLoading}
              className="p-button-outlined p-button-warning"
              onClick={async () => {
                if (!confirm("Tüm cihazlardan çıkış yapılacak. Devam edilsin mi?")) return;
                setLogoutAllLoading(true);
                try {
                  const res = await fetch("/api/auth/logout-all", { method: "POST", credentials: "include" });
                  if (res.ok) {
                    router.push("/admin/login");
                    router.refresh();
                  }
                } finally {
                  setLogoutAllLoading(false);
                }
              }}
            />
          </section>
        </div>
      )}
    </div>
  );
}
