import Link from "next/link";
import DashboardStats from "./_components/DashboardStats";
import SiteVisitsSummary from "./_components/SiteVisitsSummary";
import RecentLogins from "./_components/RecentLogins";

export const metadata = {
  title: "Panel",
  description: "Admin panel ana sayfa",
};

export default function AdminPage() {
  return (
    <div className="w-full max-w-4xl xl:max-w-none xl:px-8 2xl:px-12 mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Hoş geldiniz
      </h1>
      <p className="text-gray-600 mb-4">
        Bu panelden blog yazılarınızı, projeleri, yorumları ve iletişim mesajlarını yönetebilirsiniz.
      </p>

      <DashboardStats />

      <div className="mb-8">
        <SiteVisitsSummary />
      </div>

      <RecentLogins />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/blogs"
          className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition no-underline"
        >
          <h2 className="text-lg font-medium text-gray-900">Bloglar</h2>
          <p className="text-sm text-gray-500 mt-1">
            Yazı ekle, düzenle veya sil
          </p>
        </Link>
        <Link
          href="/admin/comments"
          className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition no-underline"
        >
          <h2 className="text-lg font-medium text-gray-900">Yorumlar</h2>
          <p className="text-sm text-gray-500 mt-1">
            Blog yorumlarını onayla veya sil
          </p>
        </Link>
        <Link
          href="/admin/contacts"
          className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition no-underline"
        >
          <h2 className="text-lg font-medium text-gray-900">İletişim mesajları</h2>
          <p className="text-sm text-gray-500 mt-1">
            Formdan gelen mesajları görüntüle
          </p>
        </Link>
        <Link
          href="/admin/projects"
          className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition no-underline"
        >
          <h2 className="text-lg font-medium text-gray-900">Projeler</h2>
          <p className="text-sm text-gray-500 mt-1">
            Proje ekle, düzenle veya sil
          </p>
        </Link>
        <Link
          href="/"
          className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition no-underline"
        >
          <h2 className="text-lg font-medium text-gray-900">Siteyi görüntüle</h2>
          <p className="text-sm text-gray-500 mt-1">
            Portfolyo sayfasına git (aynı sekmede)
          </p>
        </Link>
      </div>
    </div>
  );
}
