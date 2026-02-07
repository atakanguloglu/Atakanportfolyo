import { cookies } from "next/headers";
import Link from "next/link";
import { getMessages, LOCALE_COOKIE, DEFAULT_LOCALE } from "@/app/lib/i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value || DEFAULT_LOCALE;
  const messages = getMessages(locale);
  const title = messages.privacyPage?.title || (locale === "en" ? "Privacy & Cookies" : "Gizlilik ve Çerezler");
  return { title, description: locale === "en" ? "Privacy and cookie policy." : "Gizlilik ve çerez politikası." };
}

export default async function GizlilikPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value || DEFAULT_LOCALE;
  const messages = getMessages(locale);
  const p = messages.privacyPage || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 lg:py-20 max-w-3xl">
        <Link
          href="/"
          className="inline-block text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 no-underline text-sm mb-8"
        >
          ← {p.backHome || (locale === "en" ? "Back to home" : "Ana sayfaya dön")}
        </Link>
        <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
          {p.title || "Gizlilik ve Çerezler"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-10">{p.intro}</p>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{p.data}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{p.dataText}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{p.cookies}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{p.cookiesText}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{p.rights}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{p.rightsText}</p>
        </section>

        <Link
          href="/#contact"
          className="inline-block px-5 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium no-underline"
        >
          {locale === "en" ? "Contact" : "İletişim"}
        </Link>
      </div>
    </div>
  );
}
