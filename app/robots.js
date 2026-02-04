const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://atakanguloglu.com.tr";

/**
 * Next.js yerel robots.txt — /robots.txt bu dosyadan üretilir.
 */
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/auth"] },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
