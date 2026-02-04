import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

/**
 * POST /api/track
 * Site ziyaretini kaydeder (path, referer, user_agent). Çerez onayı sonrası client'tan çağrılır.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path.slice(0, 500) : null;
    const referer = typeof body.referer === "string" ? body.referer.slice(0, 500) : null;
    const userAgent = request.headers.get("user-agent") || null;

    if (!path || path === "") {
      return NextResponse.json({ ok: true });
    }

    await query(
      "INSERT INTO site_visits (path, referer, user_agent) VALUES ($1, $2, $3)",
      [path, referer || null, userAgent]
    ).catch((e) => console.error("[api/track]", e));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/track]", err);
    return NextResponse.json({ ok: true });
  }
}
