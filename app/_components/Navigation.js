"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const userMenuRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");

  const isBlog = pathname === "/blogs" || pathname?.startsWith("/blogs/");
  const isCalismaHayati = pathname === "/calisma-hayati";
  const isHome = pathname === "/";

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (data.loggedIn && data.user) setUser(data.user);
        else setUser(null);
        setAvatarError(false);
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    if (userMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [userMenuOpen]);

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
    setUserMenuOpen(false);
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
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
        {user ? (
          <div className="relative flex items-center" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all duration-200 ${
                userMenuOpen
                  ? "border-primary-300 dark:border-primary-500 shadow-md ring-2 ring-primary-500/10"
                  : "border-gray-200 dark:border-gray-600 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-gray-300 dark:hover:border-gray-500 hover:shadow"
              }`}
              aria-expanded={userMenuOpen}
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
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[120px] truncate">
                {user.display_name || user.username}
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 py-1.5 w-52 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-xl z-[9999] overflow-hidden"
                role="menu"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("nav.loggedIn")}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-0.5">{user.display_name || user.username}</p>
                </div>
                <Link
                  href="/admin/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-500/20 no-underline transition-colors"
                  role="menuitem"
                >
                  <i className="pi pi-user text-primary-500 dark:text-primary-400" />
                  {t("nav.profile")}
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-500/20 no-underline transition-colors"
                  role="menuitem"
                >
                  <i className="pi pi-cog text-primary-500 dark:text-primary-400" />
                  {t("nav.admin")}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
                  role="menuitem"
                >
                  <i className="pi pi-sign-out" />
                  {t("nav.logout")}
                </button>
              </div>
            )}
          </div>
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
              {user ? (
                <>
                  <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("nav.loggedIn")}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-0.5">{user.display_name || user.username}</p>
                  </div>
                  <Link href="/admin/profile" onClick={closeMenu} className="flex items-center gap-3 min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-500/20">
                    <i className="pi pi-user text-primary-500 dark:text-primary-400" /> {t("nav.profile")}
                  </Link>
                  <Link href="/admin" onClick={closeMenu} className="flex items-center gap-3 min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-500/20">
                    <i className="pi pi-cog text-primary-500 dark:text-primary-400" /> {t("nav.admin")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { closeMenu(); handleLogout(); }}
                    className="flex items-center gap-3 w-full min-h-[48px] px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 touch-manipulation"
                  >
                    <i className="pi pi-sign-out" /> {t("nav.logout")}
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
