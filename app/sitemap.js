import { query } from "@/app/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://atakanguloglu.com.tr";

/** Statik sayfalar */
const staticRoutes = [
  "",
  "/blogs",
  "/projects",
  "/calisma-hayati",
].map((path) => ({
  url: `${BASE_URL}${path}`,
  lastModified: new Date(),
  changeFrequency: path === "" ? "weekly" : "weekly",
  priority: path === "" ? 1 : 0.8,
}));

/**
 * Next.js yerel sitemap — statik + blog + proje URL'leri.
 * /sitemap.xml bu dosyadan üretilir.
 */
export default async function sitemap() {
  const routes = [...staticRoutes];

  try {
    const blogsRes = await query(
      "SELECT slug, published_at, updated_at FROM blogs WHERE is_published = true ORDER BY published_at DESC NULLS LAST"
    );
    const blogRows = blogsRes?.rows || [];

    blogRows.forEach((row) => {
      const lastMod = row.updated_at || row.published_at;
      routes.push({
        url: `${BASE_URL}/blogs/${encodeURIComponent(row.slug)}`,
        lastModified: lastMod ? new Date(lastMod) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  } catch (err) {
    console.error("[sitemap]", err.message);
    // DB yoksa sadece statik URL'ler döner
  }

  return routes;
}
