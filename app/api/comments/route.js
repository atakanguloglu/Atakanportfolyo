import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** GET /api/comments — Tüm yorumları listele (admin, blog bilgisiyle) */
export async function GET(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const res = await query(
      `SELECT c.id, c.blog_id, c.author_name, c.author_email, c.content, c.is_approved, c.created_at,
              b.title AS blog_title, b.slug AS blog_slug
       FROM comments c
       JOIN blogs b ON b.id = c.blog_id
       ORDER BY c.created_at DESC`
    );
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error("[api/comments GET]", err);
    return NextResponse.json({ error: "Yorumlar alınamadı." }, { status: 500 });
  }
}
