"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-full max-w-4xl xl:max-w-none xl:px-8 2xl:px-12 mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-lg font-semibold text-gray-900">
          Admin Panel
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Ana sayfa
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Çıkış
          </button>
        </div>
      </div>
    </header>
  );
}
