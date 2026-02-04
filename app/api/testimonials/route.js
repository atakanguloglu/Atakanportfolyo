import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** GET /api/testimonials — Referanslar (açık) veya admin için tümü */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";
    const auth = await getAuthFromRequest();

    if (admin && !auth) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }

    const sql = "SELECT id, text, user_name, user_post, user_company, sort_order, created_at, updated_at FROM testimonials ORDER BY sort_order ASC, created_at DESC";
    const res = await query(sql);
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error("[api/testimonials GET]", err);
    return NextResponse.json({ error: "Liste alınamadı." }, { status: 500 });
  }
}

/** POST /api/testimonials — Yeni referans (sadece admin) */
export async function POST(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const body = await request.json();
    const { text, user_name, user_post, user_company, sort_order } = body;

    if (!text?.trim() || !user_name?.trim()) {
      return NextResponse.json({ error: "Metin ve isim zorunludur." }, { status: 400 });
    }

    await query(
      `INSERT INTO testimonials (text, user_name, user_post, user_company, sort_order, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        text.trim(),
        user_name.trim(),
        user_post?.trim() || null,
        user_company?.trim() || null,
        typeof sort_order === "number" ? sort_order : 0,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/testimonials POST]", err);
    return NextResponse.json({ error: "Kayıt eklenemedi." }, { status: 500 });
  }
}
