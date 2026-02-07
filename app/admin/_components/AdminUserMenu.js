"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminUserMenu() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn && data.user) {
          setUser(data.user);
          setAvatarError(false);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    if (open) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full border bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all duration-200 ${
          open
            ? "border-primary-300 dark:border-primary-500 shadow-md ring-2 ring-primary-500/10"
            : "border-gray-200 dark:border-gray-600 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 hover:shadow"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user.avatar_url && !avatarError ? (
          <span className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-600">
            <img
              src={user.avatar_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
          </span>
        ) : (
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-inner shrink-0">
            {(user.display_name || user.username || "A").charAt(0).toUpperCase()}
          </span>
        )}
        <span className="hidden sm:inline text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[120px] truncate">
          {user.display_name || user.username}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 py-1.5 w-52 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xl z-50 overflow-hidden"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giriş yapıldı</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-0.5">{user.display_name || user.username}</p>
          </div>
          <Link
            href="/admin/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-500/20 no-underline transition-colors"
            role="menuitem"
          >
            <i className="pi pi-user text-primary-500 dark:text-primary-400" />
            Profil
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
            role="menuitem"
          >
            <i className="pi pi-sign-out" />
            Çıkış
          </button>
        </div>
      )}
    </div>
  );
}
