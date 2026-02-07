import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** GET /api/auth/profile — Giriş yapmış kullanıcının profil bilgisi (display_name, avatar_url) */
export async function GET() {
  const auth = await getAuthFromRequest();
  if (!auth?.userId) {
    return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
  }
  try {
    const res = await query(
      "SELECT username, display_name, avatar_url FROM users WHERE id = $1",
      [auth.userId]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }
    const u = res.rows[0];
    return NextResponse.json({
      username: u.username,
      display_name: u.display_name ?? "",
      avatar_url: u.avatar_url ?? "",
    });
  } catch (err) {
    console.error("[api/auth/profile GET]", err);
    return NextResponse.json({ error: "Profil alınamadı." }, { status: 500 });
  }
}

/** PATCH /api/auth/profile — Görünen ad ve profil resmi güncelle (giriş gerekli) */
export async function PATCH(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth?.userId) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const body = await request.json();
    const { display_name, avatar_url } = body;

    const updates = [];
    const params = [];
    let i = 1;

    if (typeof display_name === "string") {
      updates.push(`display_name = $${i++}`);
      params.push(display_name.trim().slice(0, 255));
    }
    if (typeof avatar_url === "string") {
      updates.push(`avatar_url = $${i++}`);
      params.push(avatar_url.trim().slice(0, 500));
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "Güncellenecek alan belirtin (display_name veya avatar_url)." }, { status: 400 });
    }

    params.push(auth.userId);
    await query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${i}`,
      params
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/auth/profile PATCH]", err);
    return NextResponse.json({ error: "Profil güncellenemedi." }, { status: 500 });
  }
}
