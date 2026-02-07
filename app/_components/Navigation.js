"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "@/app/_components/I18nProvider";

const SECTION_IDS = ["home", "about", "process", "portfolio", "services", "contact"];
const linkClass = "no-underline text-gray-800 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-300 transition-colors font-medium";
const activeClass = "no-underline text-primary-600 dark:text-primary-200 font-bold bg-primary-50/80 dark:bg-primary-500/40 dark:ring-1 dark:ring-primary-400/70 rounded-lg px-2 py-1 -mx-2";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const isBlog = pathname === "/blogs" || pathname?.startsWith("/blogs/");
  const isCalismaHayati = pathname === "/calisma-hayati";
  const isHome = pathname === "/";

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { loggedIn: false }))
      .then((data) => setIsLoggedIn(!!data.loggedIn))
      .catch(() => setIsLoggedIn(false));
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          if (SECTION_IDS.includes(id)) setActiveSection(id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsLoggedIn(false);
    router.refresh();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };
  return (
    <nav className="relative flex items-center shrink-0">
      <div className="hidden lg:flex lg:items-center lg:gap-x-10 text-sm">
        <Link href="/#home" className={isHome && activeSection === "home" ? activeClass : linkClass}>
          {t("nav.home")}
        </Link>
        <Link href="/#about" className={isHome && activeSection === "about" ? activeClass : linkClass}>
          {t("nav.about")}
        </Link>
        <Link href="/calisma-hayati" className={isCalismaHayati ? activeClass : linkClass}>
          {t("nav.workLife")}
        </Link>
        <Link href="/#process" className={isHome && activeSection === "process" ? activeClass : linkClass}>
          {t("nav.process")}
        </Link>
        <Link href="/#portfolio" className={isHome && activeSection === "portfolio" ? activeClass : linkClass}>
          {t("nav.portfolio")}
        </Link>
        <Link href="/blogs" className={isBlog ? activeClass : linkClass}>
          {t("nav.blog")}
        </Link>
        <Link href="/#services" className={isHome && activeSection === "services" ? activeClass : linkClass}>
          {t("nav.services")}
        </Link>
        <Link
          href="/#contact"
          className={`p-button font-bold no-underline text-white ${
            isHome && activeSection === "contact"
              ? "bg-primary-600 border-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:border-primary-500 dark:hover:bg-primary-400"
              : "bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 dark:bg-primary-500 dark:border-primary-500 dark:hover:bg-primary-400"
          }`}
        >
          {t("nav.contact")}
        </Link>
        {isLoggedIn ? (
          <>
            <Link
              href="/admin"
              className="p-button font-bold no-underline border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600 dark:text-primary-300 dark:border-primary-400 dark:hover:bg-primary-500/20 dark:hover:text-primary-200 dark:hover:border-primary-400"
            >
              {t("nav.admin")}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="p-button font-bold no-underline border-2 border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-200 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-400 rounded"
            >
              {t("nav.logout")}
            </button>
          </>
        ) : (
          <Link
            href="/admin/login"
            className="p-button font-bold no-underline border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600 dark:text-primary-300 dark:border-primary-400 dark:hover:bg-primary-500/20 dark:hover:text-primary-200 dark:hover:border-primary-400"
          >
            {t("nav.login")}
          </Link>
        )}
      </div>
      <button
        type="button"
        onClick={toggleMenu}
        className="lg:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label={isOpen ? t("nav.menuClose") : t("nav.menuOpen")}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9998] lg:hidden" aria-hidden>
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeMenu}
              aria-hidden
            />
            <div
              className="nav-mobile-menu fixed top-20 right-4 z-[9999] flex min-w-[240px] max-w-[calc(100vw-2rem)] max-h-[min(calc(100vh-6rem),420px)] flex-col rounded-2xl bg-white dark:bg-gray-800 py-2 text-base tracking-tight text-slate-900 dark:text-gray-100 shadow-xl ring-1 ring-slate-900/10 dark:ring-gray-700 overflow-y-auto"
              role="dialog"
              aria-label="Sayfa menüsü"
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/#home" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "home" ? "text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-500/20" : "text-gray-950 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"}`}>
                {t("nav.home")}
              </Link>
              <Link href="/#about" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "about" ? "text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-500/20" : "text-gray-950 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"}`}>
                {t("nav.about")}
              </Link>
              <Link href="/calisma-hayati" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isCalismaHayati ? "text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-500/20" : "text-gray-950 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"}`}>
                {t("nav.workLife")}
              </Link>
              <Link href="/#process" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "process" ? "text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-500/20" : "text-gray-950 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"}`}>
                {t("nav.process")}
              </Link>
              <Link href="/#portfolio" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "portfolio" ? "text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-500/20" : "text-gray-950 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"}`}>
                {t("nav.portfolio")}
              </Link>
              <Link href="/blogs" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isBlog ? "text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-500/20" : "text-gray-950 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"}`}>
                {t("nav.blog")}
              </Link>
              <Link href="/#services" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "services" ? "text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-500/20" : "text-gray-950 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"}`}>
                {t("nav.services")}
              </Link>
              <Link href="/#contact" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "contact" ? "text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-500/20" : "text-gray-950 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"}`}>
                {t("nav.contact")}
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href="/admin" onClick={closeMenu} className="flex items-center justify-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation border-2 border-primary-500 text-primary-500 font-bold mx-2 mt-1">
                    {t("nav.admin")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { closeMenu(); handleLogout(); }}
                    className="flex items-center justify-center min-h-[48px] w-full px-4 py-3 rounded-lg no-underline touch-manipulation border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 mx-2 mt-1"
                  >
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation border-2 border-primary-500 text-primary-500 font-bold mx-2 mt-1"
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}
