import Link from "next/link";
import NewsletterForm from "@/app/_components/NewsletterForm";
import BlogListWithFilters from "./_components/BlogListWithFilters";

export const metadata = {
  title: "Blog",
  description: "Yazılar ve paylaşımlar",
};

async function getBlogs() {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/blogs`
        : "http://localhost:3000/api/blogs",
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <header className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-600 mb-3">
            Yazılar
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Yazılarım ve güncel paylaşımlarım.
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline underline-offset-2 transition"
          >
            <span aria-hidden className="text-base">📡</span>
            RSS ile takip et
          </Link>
        </header>

        <BlogListWithFilters blogs={blogs} />

        <section className="max-w-2xl mx-auto mt-24 pt-16 border-t border-gray-200/80" aria-labelledby="newsletter-heading">
          <h2 id="newsletter-heading" className="sr-only">Bülten aboneliği</h2>
          <NewsletterForm variant="blog" />
        </section>

        <p className="text-center mt-16">
          <Link href="/" className="text-primary-500 hover:underline font-medium">
            ← Ana sayfaya dön
          </Link>
        </p>
      </div>
    </div>
  );
}
