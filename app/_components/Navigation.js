"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const SECTION_IDS = ["home", "about", "process", "portfolio", "services", "contact"];
const linkClass = "no-underline text-gray-800 hover:text-primary-600 transition-colors font-medium";
const activeClass = "no-underline text-primary-600 font-bold bg-primary-50/80 rounded-lg px-2 py-1 -mx-2";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
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
          Ana Sayfa
        </Link>
        <Link href="/#about" className={isHome && activeSection === "about" ? activeClass : linkClass}>
          Hakkımda
        </Link>
        <Link href="/calisma-hayati" className={isCalismaHayati ? activeClass : linkClass}>
          Çalışma Hayatım
        </Link>
        <Link href="/#process" className={isHome && activeSection === "process" ? activeClass : linkClass}>
          Süreç
        </Link>
        <Link href="/#portfolio" className={isHome && activeSection === "portfolio" ? activeClass : linkClass}>
          Portfolyo
        </Link>
        <Link href="/blogs" className={isBlog ? activeClass : linkClass}>
          Blog
        </Link>
        <Link href="/#services" className={isHome && activeSection === "services" ? activeClass : linkClass}>
          Hizmetler
        </Link>
        <Link
          href="/#contact"
          className={`p-button font-bold no-underline text-white ${
            isHome && activeSection === "contact"
              ? "bg-primary-600 border-primary-600 hover:bg-primary-700"
              : "bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600"
          }`}
        >
          İletişim
        </Link>
        {isLoggedIn ? (
          <>
            <Link
              href="/admin"
              className="p-button font-bold no-underline border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600"
            >
              Admin
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="p-button font-bold no-underline border-2 border-gray-300 text-gray-600 bg-transparent hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 rounded"
            >
              Çıkış
            </button>
          </>
        ) : (
          <Link
            href="/admin/login"
            className="p-button font-bold no-underline border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600"
          >
            Giriş
          </Link>
        )}
      </div>
      <button
        type="button"
        onClick={toggleMenu}
        className="lg:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
              className="nav-mobile-menu fixed top-20 right-4 z-[9999] flex min-w-[240px] max-w-[calc(100vw-2rem)] max-h-[min(calc(100vh-6rem),420px)] flex-col rounded-2xl bg-white py-2 text-base tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/10 overflow-y-auto"
              role="dialog"
              aria-label="Sayfa menüsü"
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/#home" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "home" ? "text-primary-600 font-bold bg-primary-50" : "text-gray-950 hover:bg-gray-100 active:bg-gray-200"}`}>
                Ana Sayfa
              </Link>
              <Link href="/#about" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "about" ? "text-primary-600 font-bold bg-primary-50" : "text-gray-950 hover:bg-gray-100 active:bg-gray-200"}`}>
                Hakkımda
              </Link>
              <Link href="/calisma-hayati" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isCalismaHayati ? "text-primary-600 font-bold bg-primary-50" : "text-gray-950 hover:bg-gray-100 active:bg-gray-200"}`}>
                Çalışma Hayatım
              </Link>
              <Link href="/#process" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "process" ? "text-primary-600 font-bold bg-primary-50" : "text-gray-950 hover:bg-gray-100 active:bg-gray-200"}`}>
                Süreç
              </Link>
              <Link href="/#portfolio" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "portfolio" ? "text-primary-600 font-bold bg-primary-50" : "text-gray-950 hover:bg-gray-100 active:bg-gray-200"}`}>
                Portfolyo
              </Link>
              <Link href="/blogs" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isBlog ? "text-primary-600 font-bold bg-primary-50" : "text-gray-950 hover:bg-gray-100 active:bg-gray-200"}`}>
                Blog
              </Link>
              <Link href="/#services" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "services" ? "text-primary-600 font-bold bg-primary-50" : "text-gray-950 hover:bg-gray-100 active:bg-gray-200"}`}>
                Hizmetler
              </Link>
              <Link href="/#contact" onClick={closeMenu} className={`flex items-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation ${isHome && activeSection === "contact" ? "text-primary-600 font-bold bg-primary-50" : "text-gray-950 hover:bg-gray-100 active:bg-gray-200"}`}>
                İletişim
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href="/admin" onClick={closeMenu} className="flex items-center justify-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation border-2 border-primary-500 text-primary-500 font-bold mx-2 mt-1">
                    Admin
                  </Link>
                  <button
                    type="button"
                    onClick={() => { closeMenu(); handleLogout(); }}
                    className="flex items-center justify-center min-h-[48px] w-full px-4 py-3 rounded-lg no-underline touch-manipulation border-2 border-gray-300 text-gray-600 font-bold bg-transparent hover:bg-gray-50 active:bg-gray-100 mx-2 mt-1"
                  >
                    Çıkış
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center min-h-[48px] px-4 py-3 rounded-lg no-underline touch-manipulation border-2 border-primary-500 text-primary-500 font-bold mx-2 mt-1"
                >
                  Giriş
                </Link>
              )}
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}
