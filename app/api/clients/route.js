import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** Önbellek yok — silinen müşteriler hemen gitsin */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/clients — Ana sayfa için (yayındaki sırayla) veya admin için tümü */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";
    const auth = await getAuthFromRequest();

    if (admin && !auth) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }

    const res = await query(
      "SELECT id, name, image, sort_order, created_at, updated_at FROM clients ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json(res.rows, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("[api/clients GET]", err);
    return NextResponse.json({ error: "Liste alınamadı." }, { status: 500 });
  }
}

/** POST /api/clients — Yeni müşteri logosu (sadece admin) */
export async function POST(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const body = await request.json();
    const { name, image, sort_order } = body;

    if (!name?.trim() || !image?.trim()) {
      return NextResponse.json({ error: "Marka adı ve logo dosya adı zorunludur." }, { status: 400 });
    }

    await query(
      `INSERT INTO clients (name, image, sort_order, updated_at)
       VALUES ($1, $2, $3, NOW())`,
      [name.trim(), image.trim(), typeof sort_order === "number" ? sort_order : 0]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/clients POST]", err);
    return NextResponse.json({ error: "Kayıt eklenemedi." }, { status: 500 });
  }
}
