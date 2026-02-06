"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminUserMenu() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn && data.user) setUser(data.user);
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
        className={`flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full border bg-white text-gray-700 transition-all duration-200 ${
          open
            ? "border-primary-300 shadow-md ring-2 ring-primary-500/10"
            : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-inner shrink-0">
          {(user.username || "A").charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline text-sm font-medium text-gray-800 max-w-[120px] truncate">
          {user.username}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 py-1.5 w-52 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Giriş yapıldı</p>
            <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{user.username}</p>
          </div>
          <Link
            href="/admin/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 no-underline transition-colors"
            role="menuitem"
          >
            <i className="pi pi-lock text-primary-500" />
            Şifre değiştir
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
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
