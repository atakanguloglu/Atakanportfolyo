import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

/**
 * GET /api/health
 * Sunucu ve veritabanı sağlık kontrolü (PM2, izleme, load balancer için).
 */
export async function GET() {
  try {
    await query("SELECT 1");
    return NextResponse.json(
      { ok: true, db: "ok", timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/health]", err.message);
    return NextResponse.json(
      { ok: false, db: "error", error: err.message },
      { status: 503 }
    );
  }
}
