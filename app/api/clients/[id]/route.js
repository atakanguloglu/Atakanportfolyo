import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** GET /api/clients/[id] — Tek müşteri */
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    const res = await query(
      "SELECT id, name, image, sort_order, created_at, updated_at FROM clients WHERE id = $1",
      [id]
    );
    if (res.rows.length === 0) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error("[api/clients/[id] GET]", err);
    return NextResponse.json({ error: "Alınamadı." }, { status: 500 });
  }
}

/** PUT /api/clients/[id] — Güncelle (sadece admin) */
export async function PUT(request, { params }) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    const body = await request.json();
    const { name, image, sort_order } = body;

    const res = await query("SELECT id FROM clients WHERE id = $1", [id]);
    if (res.rows.length === 0) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });

    await query(
      `UPDATE clients SET name = $1, image = $2, sort_order = $3, updated_at = NOW() WHERE id = $4`,
      [
        name?.trim() ?? "",
        image?.trim() ?? "",
        typeof sort_order === "number" ? sort_order : 0,
        id,
      ]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/clients/[id] PUT]", err);
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}

/** DELETE /api/clients/[id] — Sil (sadece admin) */
export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    await query("DELETE FROM clients WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/clients/[id] DELETE]", err);
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}
