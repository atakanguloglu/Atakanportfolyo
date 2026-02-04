import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/**
 * GET /api/admin/visits
 * Site ziyaret geçmişi (sadece giriş yapmış admin).
 */
export async function GET(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10) || 50, 200);

    const [visitsRes, statsRes] = await Promise.all([
      query(
        `SELECT id, path, referer, user_agent, visited_at
         FROM site_visits
         ORDER BY visited_at DESC
         LIMIT $1`,
        [limit]
      ),
      query(
        `SELECT
           COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE visited_at >= CURRENT_DATE)::int AS today
         FROM site_visits`
      ),
    ]);

    const visits = visitsRes.rows.map((row) => ({
      id: row.id,
      path: row.path,
      referer: row.referer,
      user_agent: row.user_agent,
      visited_at: row.visited_at,
    }));

    const stats = statsRes.rows[0]
      ? { total: statsRes.rows[0].total ?? 0, today: statsRes.rows[0].today ?? 0 }
      : { total: 0, today: 0 };

    return NextResponse.json({ visits, stats });
  } catch (err) {
    console.error("[api/admin/visits]", err);
    return NextResponse.json(
      { error: "Ziyaret geçmişi alınamadı." },
      { status: 500 }
    );
  }
}
