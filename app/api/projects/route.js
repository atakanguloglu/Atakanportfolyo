import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** GET /api/projects — Yayındaki projeler (açık) veya admin için tümü */
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
        "SELECT id, title, category, description, image_url, link, is_published, sort_order, created_at, updated_at FROM projects ORDER BY sort_order ASC, created_at DESC"
      );
      return NextResponse.json(res.rows);
    }

    const res = await query(
      "SELECT id, title, category, description, image_url, link, sort_order, created_at FROM projects WHERE is_published = true ORDER BY sort_order ASC, created_at DESC"
    );
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error("[api/projects GET]", err);
    return NextResponse.json({ error: "Liste alınamadı." }, { status: 500 });
  }
}

/** POST /api/projects — Yeni proje (sadece giriş yapmış admin) */
export async function POST(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, description, image_url, link, is_published, sort_order } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Başlık gerekli." }, { status: 400 });
    }

    await query(
      `INSERT INTO projects (title, category, description, image_url, link, is_published, sort_order, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        title.trim(),
        category?.trim() || null,
        description?.trim() || null,
        image_url?.trim() || null,
        link?.trim() || null,
        is_published !== undefined ? !!is_published : true,
        typeof sort_order === "number" ? sort_order : 0,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/projects POST]", err);
    return NextResponse.json({ error: "Kayıt eklenemedi." }, { status: 500 });
  }
}
