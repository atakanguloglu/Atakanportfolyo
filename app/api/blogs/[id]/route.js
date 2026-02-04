import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";
import { sendNewPostToSubscribers } from "@/app/lib/newsletter-email";

/** GET /api/blogs/[id] — Tek blog (id ile) */
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    const res = await query(
      "SELECT id, title, slug, excerpt, content, image_url, author, is_published, published_at, created_at, updated_at FROM blogs WHERE id = $1",
      [id]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error("[api/blogs/[id] GET]", err);
    return NextResponse.json({ error: "Alınamadı." }, { status: 500 });
  }
}

/** PUT /api/blogs/[id] — Güncelle (sadece admin) */
export async function PUT(request, { params }) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    const body = await request.json();
    const { title, slug, excerpt, content, image_url, author, is_published } = body;

    const res = await query("SELECT id, published_at FROM blogs WHERE id = $1", [id]);
    if (res.rows.length === 0) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });

    const finalSlug = (slug?.trim() || res.rows[0].slug) || "";
    const newPublished = is_published !== undefined ? !!is_published : true;
    const publishedAt = res.rows[0].published_at;
    const setPublishedAt = newPublished && !publishedAt ? ", published_at = NOW()" : "";
    const justPublished = newPublished && !publishedAt;

    await query(
      `UPDATE blogs SET title = $1, slug = $2, excerpt = $3, content = $4, image_url = $5, author = $6, is_published = $7, updated_at = NOW()${setPublishedAt} WHERE id = $8`,
      [
        title?.trim() || "",
        finalSlug,
        excerpt?.trim() || null,
        content?.trim() || null,
        image_url?.trim() || null,
        author?.trim() || null,
        newPublished,
        id,
      ]
    );

    if (justPublished) {
      sendNewPostToSubscribers(
        finalSlug,
        title?.trim() || "",
        excerpt?.trim() || ""
      ).catch((e) => console.error("[api/blogs PUT] Bülten maili:", e));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/blogs/[id] PUT]", err);
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}

/** DELETE /api/blogs/[id] — Sil (sadece admin) */
export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    await query("DELETE FROM blogs WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/blogs/[id] DELETE]", err);
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}
