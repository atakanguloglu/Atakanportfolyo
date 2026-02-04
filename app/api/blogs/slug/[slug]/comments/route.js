import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

/** GET /api/blogs/slug/[slug]/comments — Yazıya ait onaylı yorumları listele (açık) */
export async function GET(request, { params }) {
  try {
    const slug = params?.slug;
    if (!slug) return NextResponse.json({ error: "Slug gerekli." }, { status: 400 });

    const blogRes = await query("SELECT id FROM blogs WHERE slug = $1 AND is_published = true", [slug]);
    if (blogRes.rows.length === 0) {
      return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
    }
    const blogId = blogRes.rows[0].id;

    const res = await query(
      "SELECT id, author_name, content, created_at FROM comments WHERE blog_id = $1 AND is_approved = true ORDER BY created_at ASC",
      [blogId]
    );
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error("[api/blogs/slug/comments GET]", err);
    return NextResponse.json({ error: "Yorumlar alınamadı." }, { status: 500 });
  }
}

/** POST /api/blogs/slug/[slug]/comments — Yeni yorum ekle (açık, onay bekler) */
export async function POST(request, { params }) {
  try {
    const slug = params?.slug;
    if (!slug) return NextResponse.json({ error: "Slug gerekli." }, { status: 400 });

    const blogRes = await query("SELECT id FROM blogs WHERE slug = $1 AND is_published = true", [slug]);
    if (blogRes.rows.length === 0) {
      return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
    }
    const blogId = blogRes.rows[0].id;

    const body = await request.json();
    const author_name = (body.author_name || "").trim();
    const author_email = (body.author_email || "").trim();
    const content = (body.content || "").trim();

    if (!author_name || !author_email || !content) {
      return NextResponse.json(
        { success: false, error: "Ad, e-posta ve yorum metni gerekli." },
        { status: 400 }
      );
    }

    await query(
      "INSERT INTO comments (blog_id, author_name, author_email, content, is_approved) VALUES ($1, $2, $3, $4, false)",
      [blogId, author_name, author_email, content]
    );

    return NextResponse.json({ success: true, message: "Yorumunuz gönderildi. Onaylandıktan sonra yayınlanacaktır." });
  } catch (err) {
    console.error("[api/blogs/slug/comments POST]", err);
    return NextResponse.json({ success: false, error: "Yorum gönderilemedi." }, { status: 500 });
  }
}
