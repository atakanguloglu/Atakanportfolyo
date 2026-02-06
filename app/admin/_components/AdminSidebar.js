"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const blogSubItems = [
  { href: "/admin/blogs", label: "Yazılar", icon: "pi-book" },
  { href: "/admin/comments", label: "Yorumlar", icon: "pi-comments" },
];

const navItems = [
  { href: "/admin", label: "Ana sayfa", icon: "pi-home" },
  { href: "/admin/visits", label: "Site ziyaretleri", icon: "pi-chart-line" },
  { href: "/admin/projects", label: "Projeler", icon: "pi-briefcase" },
  { href: "/admin/clients", label: "Mutlu Müşteriler", icon: "pi-building" },
  { href: "/admin/testimonials", label: "Referanslar", icon: "pi-star" },
  { href: "/admin/contacts", label: "İletişim mesajları", icon: "pi-inbox" },
  { href: "/admin/newsletter", label: "Bülten aboneleri", icon: "pi-envelope" },
  { href: "/", label: "Siteyi görüntüle", icon: "pi-globe" },
];

export default function AdminSidebar({ mobileMenuOpen = false, setMobileMenuOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [blogMenuOpen, setBlogMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen?.(false);

  const isBlogSectionActive = pathname === "/admin/blogs" || pathname.startsWith("/admin/blogs/") || pathname === "/admin/comments";
  useEffect(() => {
    if (isBlogSectionActive) setBlogMenuOpen(true);
  }, [isBlogSectionActive]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden
        />
      )}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 md:relative md:z-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-64"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
      <div className="p-3 flex items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 min-h-[56px]">
        <Link
          href="/admin"
          className="flex items-center justify-center min-w-0 flex-1 overflow-hidden"
          onClick={closeMobileMenu}
          title="Admin ana sayfa"
        >
          <span className={`shrink-0 flex items-center overflow-hidden ${collapsed ? "h-8 max-w-10" : "h-9"}`}>
            <Image
              src="/logo.png"
              alt="Admin"
              width={120}
              height={40}
              className="h-full w-auto max-h-full object-contain object-center dark:invert"
            />
          </span>
        </Link>
        <button
          type="button"
          onClick={closeMobileMenu}
          className="md:hidden w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-100 hover:shadow transition-all"
          title="Menüyü kapat"
          aria-label="Menüyü kapat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm items-center justify-center text-primary-600 dark:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/20 hover:shadow transition-all shrink-0"
          title={collapsed ? "Menüyü aç" : "Menüyü kapat"}
          aria-label={collapsed ? "Menüyü aç" : "Menüyü kapat"}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-auto">
        <Link
          href="/admin"
          onClick={closeMobileMenu}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline transition ${
            pathname === "/admin" ? "bg-primary-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <i className="pi pi-home text-lg shrink-0" />
          {!collapsed && <span className="truncate">Ana sayfa</span>}
        </Link>

        {!collapsed ? (
          <>
            <div className="mt-1">
              <button
                type="button"
                onClick={() => setBlogMenuOpen(!blogMenuOpen)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg no-underline border-0 bg-transparent cursor-pointer text-left transition text-base ${
                  isBlogSectionActive ? "bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <i className="pi pi-book text-lg shrink-0" />
                <span className="truncate flex-1 font-normal">Bloglar</span>
                <i className={`pi ${blogMenuOpen ? "pi-chevron-up" : "pi-chevron-down"} text-lg shrink-0`} />
              </button>
              {blogMenuOpen && (
                <div className="pl-5 pr-2 py-1 flex flex-col gap-1">
                  {blogSubItems.map((sub) => {
                    const isActive = pathname === sub.href || (sub.href === "/admin/blogs" && pathname.startsWith("/admin/blogs"));
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline transition ${
                          isActive ? "bg-primary-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <i className={`pi ${sub.icon} text-lg shrink-0`} />
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            {navItems.slice(1).map((item) => {
              const isActive = pathname === item.href;
              const linkClass = `flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline transition ${
                isActive ? "bg-primary-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`;
              return (
                <Link key={item.href} href={item.href} onClick={closeMobileMenu} className={linkClass}>
                  <i className={`pi ${item.icon} text-lg shrink-0`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </>
        ) : (
          <>
            <Link
              href="/admin/blogs"
              onClick={closeMobileMenu}
              className={`flex items-center justify-center p-2.5 rounded-lg no-underline transition ${
                pathname === "/admin/blogs" || pathname.startsWith("/admin/blogs/") ? "bg-primary-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title="Bloglar"
            >
              <i className="pi pi-book text-lg" />
            </Link>
            <Link
              href="/admin/comments"
              onClick={closeMobileMenu}
              className={`flex items-center justify-center p-2.5 rounded-lg no-underline transition ${
                pathname === "/admin/comments" ? "bg-primary-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title="Yorumlar"
            >
              <i className="pi pi-comments text-lg" />
            </Link>
            {navItems.slice(1).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-center p-2.5 rounded-lg no-underline transition ${
                    isActive ? "bg-primary-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title={item.label}
                >
                  <i className={`pi ${item.icon} text-lg`} />
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={() => { closeMobileMenu(); handleLogout(); }}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 dark:hover:bg-red-600 active:bg-red-700 border border-red-600 shadow-sm transition no-underline cursor-pointer"
        >
          <i className="pi pi-sign-out text-lg shrink-0" />
          {!collapsed && <span>Çıkış</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
