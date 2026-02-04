import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/**
 * GET /api/admin/logins
 * Son admin girişlerini döner (sadece giriş yapmış admin).
 */
export async function GET(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "30", 10) || 30, 100);

    const res = await query(
      `SELECT id, user_id, username, ip_address, user_agent, logged_at
       FROM admin_logins
       ORDER BY logged_at DESC
       LIMIT $1`,
      [limit]
    );

    const logins = res.rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      username: row.username,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      logged_at: row.logged_at,
    }));

    return NextResponse.json(logins);
  } catch (err) {
    console.error("[api/admin/logins]", err);
    return NextResponse.json(
      { error: "Giriş geçmişi alınamadı." },
      { status: 500 }
    );
  }
}
