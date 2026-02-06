import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import BlogComments from "./_components/BlogComments";
import TechLogosBackground from "@/app/_components/TechLogosBackground";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://atakanguloglu.com.tr";

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) return { title: "Yazı" };
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/blogs/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: "Yazı" };
    const blog = await res.json();
    const title = blog.title;
    const description = blog.excerpt || (blog.content ? blog.content.replace(/<[^>]+>/g, "").slice(0, 160) : title);
    const url = `${SITE_URL}/blogs/${slug}`;
    const image = blog.image_url
      ? (blog.image_url.startsWith("http") ? blog.image_url : `${SITE_URL}${blog.image_url.startsWith("/") ? "" : "/"}${blog.image_url}`)
      : `${SITE_URL}/og-image.jpg`;

    return {
      title,
      description: description.slice(0, 160),
      openGraph: {
        title,
        description: description.slice(0, 160),
        url,
        siteName: "Atakan Güloğlu",
        images: [{ url: image, width: 1200, height: 630, alt: title }],
        locale: "tr_TR",
        type: "article",
        publishedTime: blog.published_at || undefined,
        authors: blog.author ? [blog.author] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: description.slice(0, 160),
        images: [image],
      },
    };
  } catch {
    return { title: "Yazı" };
  }
}

async function getBlog(slug) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/blogs/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function getReadingStats(content) {
  if (!content || typeof content !== "string") return { words: 0, minutes: 0 };
  const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = plain ? plain.split(" ").length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

export default async function BlogPostPage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  const blog = await getBlog(slug);
  if (!blog) notFound();

  const dateStr = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString("tr-TR", { dateStyle: "long" })
    : new Date(blog.created_at).toLocaleDateString("tr-TR", { dateStyle: "long" });

  const showExcerpt = blog.excerpt && blog.excerpt.trim() !== blog.title?.trim();
  const { words, minutes } = getReadingStats(blog.content);

  const shareUrl = `${SITE_URL}/blogs/${slug}`;
  const shareTitle = blog.title || "";
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || (blog.content ? blog.content.replace(/<[^>]+>/g, "").slice(0, 160) : ""),
    image: blog.image_url ? (blog.image_url.startsWith("http") ? blog.image_url : `${SITE_URL}${blog.image_url.startsWith("/") ? "" : "/"}${blog.image_url}`) : `${SITE_URL}/og-image.jpg`,
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at || blog.published_at || blog.created_at,
    author: { "@type": "Person", name: blog.author || "Atakan Güloğlu" },
    publisher: { "@type": "Organization", name: "Atakan Güloğlu", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blogs/${slug}` },
    wordCount: words,
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-bl from-primary-50/80 via-gray-50 to-primary-100/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TechLogosBackground />
      <article className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        <Link href="/blogs" className="text-primary-500 dark:text-primary-400 hover:underline dark:hover:text-primary-300 text-sm font-medium mb-6 inline-block no-underline">
          ← Tüm yazılar
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 lg:p-10 xl:p-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            {blog.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
            {dateStr}
            {blog.author && ` · ${blog.author}`}
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 text-xs font-medium"
              title={`Yaklaşık ${words} kelime`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {minutes} dk okuma
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-xs">~{words} kelime</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <Link href="/feed" className="text-xs text-primary-500 hover:underline no-underline" title="RSS 2.0">
              RSS ile takip et
            </Link>
          </div>
          <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-100 dark:border-gray-600">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Paylaş:</span>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center transition-colors"
              title="Twitter / X’te paylaş"
              aria-label="Twitter’da paylaş"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-colors"
              title="LinkedIn’de paylaş"
              aria-label="LinkedIn’de paylaş"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
              title="WhatsApp’ta paylaş"
              aria-label="WhatsApp’ta paylaş"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
          {blog.image_url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100 dark:bg-gray-700">
              <Image
                src={blog.image_url.startsWith("/") ? blog.image_url : blog.image_url}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 896px, (max-width: 1280px) 1152px, 1280px"
              />
            </div>
          )}
          {showExcerpt && (
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium border-l-4 border-primary-500 pl-4">
              {blog.excerpt}
            </p>
          )}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {blog.content && /<[a-z][\s\S]*>/i.test(blog.content) ? (
              <div
                className="blog-content text-gray-700 dark:text-gray-300 leading-relaxed text-[1.0625rem] [word-spacing:0.02em]"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            ) : (
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-[1.0625rem] [word-spacing:0.02em]">
                {blog.content || ""}
              </div>
            )}
          </div>
          <BlogComments blogSlug={blog.slug} />
        </div>
        <nav className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/blogs" className="text-primary-500 dark:text-primary-400 hover:underline dark:hover:text-primary-300 font-medium no-underline">
            ← Tüm yazılar
          </Link>
          <span className="text-gray-300 dark:text-gray-500">·</span>
          <Link href="/" className="text-primary-500 dark:text-primary-400 hover:underline dark:hover:text-primary-300 font-medium no-underline">
            Ana sayfa
          </Link>
        </nav>
      </article>
    </div>
  );
}
