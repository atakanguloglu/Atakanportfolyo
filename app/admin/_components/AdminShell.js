"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminUserMenu from "./AdminUserMenu";
import ThemeToggle from "@/app/_components/ThemeToggle";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-3 sm:px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 min-h-[56px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Menüyü aç"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-primary-500 shrink-0" aria-hidden />
              <span className="text-base font-semibold tracking-tight">
                <span className="text-gray-600 dark:text-gray-300">Admin</span>
                <span className="text-primary-600 dark:text-primary-400"> Panel</span>
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <AdminUserMenu />
          </div>
        </header>
        <main className="flex-1 min-w-0 overflow-auto pl-3 pr-3 sm:pl-4 sm:pr-4 py-4 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
