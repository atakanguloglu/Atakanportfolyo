import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** GET /api/projects/[id] — Tek proje */
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    const res = await query(
      "SELECT id, title, category, description, image_url, link, is_published, sort_order, created_at, updated_at FROM projects WHERE id = $1",
      [id]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error("[api/projects/[id] GET]", err);
    return NextResponse.json({ error: "Alınamadı." }, { status: 500 });
  }
}

/** PUT /api/projects/[id] — Güncelle (sadece admin) */
export async function PUT(request, { params }) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    const body = await request.json();
    const { title, category, description, image_url, link, is_published, sort_order } = body;

    const res = await query("SELECT id FROM projects WHERE id = $1", [id]);
    if (res.rows.length === 0) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });

    await query(
      `UPDATE projects SET title = $1, category = $2, description = $3, image_url = $4, link = $5, is_published = $6, sort_order = $7, updated_at = NOW() WHERE id = $8`,
      [
        title?.trim() ?? "",
        category?.trim() || null,
        description?.trim() || null,
        image_url?.trim() || null,
        link?.trim() || null,
        is_published !== undefined ? !!is_published : true,
        typeof sort_order === "number" ? sort_order : 0,
        id,
      ]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/projects/[id] PUT]", err);
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}

/** DELETE /api/projects/[id] — Sil (sadece admin) */
export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    await query("DELETE FROM projects WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/projects/[id] DELETE]", err);
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}
