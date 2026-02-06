import Link from "next/link";
import SiteVisits from "../_components/SiteVisits";

export const metadata = {
  title: "Site Ziyaretleri",
  description: "Site ziyaret geçmişi",
};

export default function AdminVisitsPage() {
  return (
    <div className="w-full max-w-5xl xl:max-w-none xl:px-8 2xl:px-12 mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-primary-500 dark:text-primary-400 hover:underline text-sm font-medium no-underline">
          ← Ana sayfa
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        Site ziyaretleri
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Çerez onayı veren ziyaretçilerin sayfa görüntüleme kayıtları.
      </p>
      <SiteVisits limit={100} />
    </div>
  );
}
