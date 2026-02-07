"use client";

import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";
import { useTranslations } from "./I18nProvider";

const navLinks = [
  { href: "/#home", key: "nav.home" },
  { href: "/#about", key: "nav.about" },
  { href: "/calisma-hayati", key: "nav.workLife" },
  { href: "/#process", key: "nav.process" },
  { href: "/#portfolio", key: "nav.portfolio" },
  { href: "/blogs", key: "nav.blog" },
  { href: "/#services", key: "nav.services" },
  { href: "/#contact", key: "nav.contact" },
];

export default function Page() {
  const { t } = useTranslations();
  return (
    <footer className="bg-navy-900 dark:bg-gray-950 pt-16 pb-6 border-t border-transparent dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Üst bölüm: Logo, menü, bülten */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <Link href="/" className="inline-block">
              <span className="sr-only">Atakan Güloğlu</span>
              <Image src="/logo.png" alt="Atakan Güloğlu - Portföy" width={360} height={112} className="h-20 sm:h-24 md:h-[6rem] lg:h-[7rem] w-auto object-contain" />
            </Link>
          </div>
          <nav className="lg:col-span-4 flex flex-wrap justify-center lg:justify-center gap-x-6 gap-y-1">
            {navLinks.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 no-underline text-sm py-1"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-2">{t("footer.newsletterLabel")}</p>
            <NewsletterForm variant="footer" className="w-full lg:w-auto" />
          </div>
        </div>

        {/* Tech stack — yazılımcı detayı */}
        <div className="mt-10 pt-4 border-t border-navy-700/50 dark:border-gray-800 flex justify-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wide">
            {t("footer.builtWith")} <span className="text-gray-400">Next.js</span> · <span className="text-gray-400">React</span> · <span className="text-gray-400">Tailwind CSS</span> · <span className="text-gray-400">Node</span>
          </p>
        </div>
        <div className="mt-6 pt-6 border-t border-navy-700 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-gray-400 dark:text-gray-500 flex-wrap">
          <span className="font-medium text-gray-300 dark:text-gray-400">TITARA Technology</span>
          <span className="hidden sm:inline text-gray-600 dark:text-gray-600">·</span>
          <span>{t("footer.copyright")}</span>
          <span className="hidden sm:inline text-gray-600 dark:text-gray-600">·</span>
          <Link href="/feed" className="text-gray-500 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 no-underline" title="RSS 2.0">
            RSS
          </Link>
          <span className="hidden sm:inline text-gray-600">·</span>
          <Link href="/gizlilik" className="text-gray-500 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 no-underline">
            {t("footer.privacy")}
          </Link>
          <span className="hidden sm:inline text-gray-600">·</span>
          <Link href="/admin/login" className="text-gray-500 dark:text-gray-400 hover:text-gray-300 no-underline">
            {t("footer.adminLogin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
