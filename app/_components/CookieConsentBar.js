"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "@/app/_components/I18nProvider";

const CONSENT_KEY = "cookie_consent";

export default function CookieConsentBar() {
  const { t } = useTranslations();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accepted = localStorage.getItem(CONSENT_KEY) === "accepted";
    setVisible(!accepted);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      role="banner"
      aria-label="Çerez bildirimi"
    >
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl">
        <p className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
          {t("cookieBar.text")}{" "}
          <Link href="/gizlilik" className="text-primary-600 dark:text-primary-400 hover:underline no-underline">
            {t("cookieBar.learnMore")}
          </Link>
        </p>
        <button
          type="button"
          onClick={accept}
          className="flex-shrink-0 px-5 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
        >
          {t("cookieBar.accept")}
        </button>
      </div>
    </div>
  );
}
