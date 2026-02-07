import tr from "@/app/locales/tr.json";
import en from "@/app/locales/en.json";

export const messages = { tr, en };
export const SUPPORTED_LOCALES = ["tr", "en"];
export const DEFAULT_LOCALE = "tr";
export const LOCALE_COOKIE = "locale";

/** Sunucu veya istemci: locale'e göre mesaj objesini döndürür */
export function getMessages(locale) {
  const safe = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  return messages[safe] || messages.tr;
}

/** Mesaj objesi ve key ile çeviri (örn. t(messages, 'nav.home')) */
export function t(messagesObj, key) {
  if (!messagesObj || !key) return key;
  const value = key.split(".").reduce((o, k) => o?.[k], messagesObj);
  return value ?? key;
}
