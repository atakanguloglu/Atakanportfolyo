import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

/** GET /api/blogs/slug/[slug] — Tek blog (slug ile, yayınlı olanlar) */
export async function GET(request, { params }) {
  try {
    const slug = params.slug;
    if (!slug) return NextResponse.json({ error: "Slug gerekli." }, { status: 400 });

    const res = await query(
      "SELECT id, title, slug, excerpt, content, image_url, author, published_at, created_at FROM blogs WHERE slug = $1 AND is_published = true",
      [slug]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error("[api/blogs/slug GET]", err);
    return NextResponse.json({ error: "Alınamadı." }, { status: 500 });
  }
}
