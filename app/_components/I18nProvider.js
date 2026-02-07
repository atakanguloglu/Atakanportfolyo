"use client";

import { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { t as tHelper, LOCALE_COOKIE, DEFAULT_LOCALE } from "@/app/lib/i18n";

const I18nContext = createContext(null);

export function I18nProvider({ locale: initialLocale, messages, children }) {
  const router = useRouter();
  const t = useCallback((key) => tHelper(messages, key), [messages]);
  const setLocale = useCallback(
    (newLocale) => {
      document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
      router.refresh();
    },
    [router]
  );

  const value = {
    locale: initialLocale || DEFAULT_LOCALE,
    messages,
    t,
    setLocale,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslations() {
  const ctx = useContext(I18nContext);
  if (!ctx) return { locale: DEFAULT_LOCALE, t: (k) => k, setLocale: () => {}, messages: {} };
  return ctx;
}
