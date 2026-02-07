import { cookies } from "next/headers";
import Link from "next/link";
import TimelineWithModal from "./TimelineWithModal";
import { getMessages, LOCALE_COOKIE, DEFAULT_LOCALE } from "@/app/lib/i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value || DEFAULT_LOCALE;
  const messages = getMessages(locale);
  const title = messages.workLife?.page?.title || "Çalışma Hayatım";
  const description = locale === "en" ? "Career and experience timeline" : "Kariyer ve deneyim zaman çizelgesi";
  return {
    title,
    description,
  };
}

export default async function CalismaHayatiPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value || DEFAULT_LOCALE;
  const messages = getMessages(locale);
  const workLife = messages.workLife || {};
  const page = workLife.page || {};
  const timelineData = workLife.items || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
          {page.title || "Çalışma Hayatım"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xl mx-auto mb-16">
          {page.subtitle || "Kariyer ve deneyimlerim, tarih sırasıyla."}
        </p>

        <TimelineWithModal
          timelineData={timelineData}
          modalCloseLabel={workLife.modalClose || "Kapat"}
        />

        <p className="text-center mt-16">
          <Link href="/" className="text-primary-500 hover:underline font-medium">
            {page.backLink || "← Ana sayfaya dön"}
          </Link>
        </p>
      </div>
    </div>
  );
}
