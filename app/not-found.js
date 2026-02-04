import Link from "next/link";

export const metadata = {
  title: "Sayfa Bulunamadı",
  description: "Aradığınız sayfa mevcut değil veya taşınmış olabilir.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-primary-600 mb-2">404</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Sayfa bulunamadı
        </h1>
        <p className="text-gray-500 mb-8">
          Aradığınız sayfa mevcut değil veya adresi değişmiş olabilir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition no-underline"
          >
            Ana sayfaya dön
          </Link>
          <Link
            href="/blogs"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition no-underline"
          >
            Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
