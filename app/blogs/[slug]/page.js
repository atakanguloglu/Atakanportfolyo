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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-bl from-primary-50/80 via-gray-50 to-primary-100/80">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TechLogosBackground />
      <article className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        <Link href="/blogs" className="text-primary-500 hover:underline text-sm font-medium mb-6 inline-block no-underline">
          ← Tüm yazılar
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10 xl:p-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            {blog.title}
          </h1>
          <p className="text-gray-500 text-sm mb-2">
            {dateStr}
            {blog.author && ` · ${blog.author}`}
          </p>
          <p className="text-gray-400 text-xs mb-6 font-mono">
            {minutes} dk okuma · ~{words} kelime
            <span className="ml-2">·</span>
            <Link href="/feed" className="ml-2 text-primary-500 hover:underline no-underline" title="RSS 2.0">RSS</Link>
          </p>
          {blog.image_url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100">
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
            <p className="text-lg text-gray-600 mb-6 font-medium border-l-4 border-primary-500 pl-4">
              {blog.excerpt}
            </p>
          )}
          <div className="prose prose-gray max-w-none">
            {blog.content && /<[a-z][\s\S]*>/i.test(blog.content) ? (
              <div
                className="blog-content text-gray-700 leading-relaxed text-[1.0625rem] [word-spacing:0.02em]"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            ) : (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-[1.0625rem] [word-spacing:0.02em]">
                {blog.content || ""}
              </div>
            )}
          </div>
          <BlogComments blogSlug={blog.slug} />
        </div>
        <nav className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/blogs" className="text-primary-500 hover:underline font-medium no-underline">
            ← Tüm yazılar
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/" className="text-primary-500 hover:underline font-medium no-underline">
            Ana sayfa
          </Link>
        </nav>
      </article>
    </div>
  );
}
