import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** PATCH /api/comments/[id] — Onayla veya güncelle (sadece admin) */
export async function PATCH(request, { params }) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const id = parseInt(params?.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const is_approved = body.is_approved;

    if (typeof is_approved !== "boolean") {
      return NextResponse.json({ error: "is_approved (true/false) gerekli." }, { status: 400 });
    }

    await query("UPDATE comments SET is_approved = $1 WHERE id = $2", [is_approved, id]);
    const res = await query(
      "SELECT id, blog_id, author_name, author_email, content, is_approved, created_at FROM comments WHERE id = $1",
      [id]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Yorum bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error("[api/comments PATCH]", err);
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}

/** DELETE /api/comments/[id] — Yorumu sil (sadece admin) */
export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const id = parseInt(params?.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });

    const res = await query("DELETE FROM comments WHERE id = $1 RETURNING id", [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Yorum bulunamadı." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/comments DELETE]", err);
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}
