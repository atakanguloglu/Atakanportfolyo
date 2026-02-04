import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function escapeXml(str) {
  if (str == null || str === "") return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRssDate(date) {
  if (!date) return new Date().toUTCString();
  const d = date instanceof Date ? date : new Date(date);
  return d.toUTCString();
}

/** GET /feed — Blog RSS 2.0 feed */
export async function GET() {
  try {
    const res = await query(
      `SELECT id, title, slug, excerpt, content, author, published_at, created_at
       FROM blogs
       WHERE is_published = true
       ORDER BY published_at DESC NULLS LAST, created_at DESC
       LIMIT 50`
    );

    const items = (res.rows || []).map((row) => {
      const link = `${SITE_URL}/blogs/${encodeURIComponent(row.slug)}`;
      const pubDate = formatRssDate(row.published_at || row.created_at);
      const description = row.excerpt?.trim() || (row.content ? row.content.replace(/<[^>]+>/g, "").slice(0, 300) + "…" : "");
      const title = escapeXml(row.title);
      const desc = escapeXml(description);
      const author = escapeXml(row.author || "Atakan Güloğlu");

      return `<item>
  <title>${title}</title>
  <link>${escapeXml(link)}</link>
  <guid isPermaLink="true">${escapeXml(link)}</guid>
  <description>${desc}</description>
  <author>${author}</author>
  <pubDate>${pubDate}</pubDate>
</item>`;
    });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml("Atakan Güloğlu – Blog")}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml("Atakan Güloğlu kişisel portfolyo ve blog yazıları.")}</description>
    <language>tr</language>
    <lastBuildDate>${formatRssDate(new Date())}</lastBuildDate>
    <atom:link href="${escapeXml(SITE_URL + "/feed")}" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("[feed GET]", err);
    return NextResponse.json({ error: "Feed oluşturulamadı." }, { status: 500 });
  }
}
