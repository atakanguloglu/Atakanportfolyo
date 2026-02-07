"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-2">500</p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Bir hata oluştu
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Beklenmeyen bir sorun oluştu. Lütfen ana sayfaya dönüp tekrar deneyin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Tekrar dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 dark:bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 dark:hover:bg-primary-600 transition no-underline"
          >
            Ana sayfaya dön
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition no-underline"
          >
            Panele dön
          </Link>
        </div>
      </div>
    </div>
  );
}
