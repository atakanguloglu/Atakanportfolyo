"use client";

import { useTranslations } from "@/app/_components/I18nProvider";
import { SUPPORTED_LOCALES } from "@/app/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslations();

  return (
    <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 overflow-hidden text-sm">
      {SUPPORTED_LOCALES.map((loc, i) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          className={`min-w-[2.25rem] px-2.5 py-1.5 font-medium transition-colors ${
            locale === loc
              ? "bg-primary-500 text-white dark:bg-primary-500 dark:text-white"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
          } ${i === 0 ? "rounded-l-xl" : ""} ${i === SUPPORTED_LOCALES.length - 1 ? "rounded-r-xl" : ""}`}
          aria-pressed={locale === loc}
          aria-label={loc === "tr" ? "Türkçe" : "English"}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
