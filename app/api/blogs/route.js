import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";
import { sendNewPostToSubscribers } from "@/app/lib/newsletter-email";

/** GET /api/blogs — Tüm yayınlı blogları listele (açık) veya admin için tümünü */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";
    const auth = await getAuthFromRequest();

    if (admin && !auth) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }

    if (admin && auth) {
      const res = await query(
        "SELECT id, title, slug, excerpt, image_url, author, is_published, published_at, created_at FROM blogs ORDER BY created_at DESC"
      );
      return NextResponse.json(res.rows);
    }

    const res = await query(
      "SELECT id, title, slug, excerpt, image_url, author, published_at, created_at FROM blogs WHERE is_published = true ORDER BY published_at DESC NULLS LAST, created_at DESC"
    );
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error("[api/blogs GET]", err);
    return NextResponse.json({ error: "Liste alınamadı." }, { status: 500 });
  }
}

/** POST /api/blogs — Yeni blog ekle (sadece giriş yapmış admin) */
export async function POST(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, image_url, author, is_published } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Başlık gerekli." }, { status: 400 });
    }

    const finalSlug = (slug || title).trim().toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "blog-" + Date.now();

    const publishedAt = is_published ? new Date() : null;

    await query(
      `INSERT INTO blogs (title, slug, excerpt, content, image_url, author, is_published, published_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        title.trim(),
        finalSlug,
        excerpt?.trim() || null,
        content?.trim() || null,
        image_url?.trim() || null,
        author?.trim() || null,
        !!is_published,
        publishedAt,
      ]
    );

    if (is_published) {
      sendNewPostToSubscribers(finalSlug, title.trim(), excerpt?.trim() || "").catch((e) =>
        console.error("[api/blogs] Bülten maili:", e)
      );
    }

    return NextResponse.json({ success: true, slug: finalSlug });
  } catch (err) {
    console.error("[api/blogs POST]", err);
    if (err.code === "23505") {
      return NextResponse.json({ error: "Bu slug zaten kullanılıyor." }, { status: 400 });
    }
    return NextResponse.json({ error: "Kayıt eklenemedi." }, { status: 500 });
  }
}
