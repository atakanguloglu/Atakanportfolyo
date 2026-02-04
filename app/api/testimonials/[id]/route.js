import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** GET /api/testimonials/[id] — Tek referans */
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    const res = await query(
      "SELECT id, text, user_name, user_post, user_company, sort_order, created_at, updated_at FROM testimonials WHERE id = $1",
      [id]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error("[api/testimonials/[id] GET]", err);
    return NextResponse.json({ error: "Alınamadı." }, { status: 500 });
  }
}

/** PUT /api/testimonials/[id] — Güncelle (sadece admin) */
export async function PUT(request, { params }) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    const body = await request.json();
    const { text, user_name, user_post, user_company, sort_order } = body;

    const res = await query("SELECT id FROM testimonials WHERE id = $1", [id]);
    if (res.rows.length === 0) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });

    await query(
      `UPDATE testimonials SET text = $1, user_name = $2, user_post = $3, user_company = $4, sort_order = $5, updated_at = NOW() WHERE id = $6`,
      [
        text?.trim() ?? "",
        user_name?.trim() ?? "",
        user_post?.trim() || null,
        user_company?.trim() || null,
        typeof sort_order === "number" ? sort_order : 0,
        id,
      ]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/testimonials/[id] PUT]", err);
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}

/** DELETE /api/testimonials/[id] — Sil (sadece admin) */
export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    await query("DELETE FROM testimonials WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/testimonials/[id] DELETE]", err);
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}
