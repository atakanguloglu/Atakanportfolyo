import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/app/lib/auth-request";
import { getAuthCookieName, getAuthCookieOptions } from "@/app/lib/auth";
import { query } from "@/app/lib/db";

/**
 * POST /api/auth/logout-all
 * Tüm cihazlardaki oturumları sonlandırır (token_version artırılır).
 * Bu cihazdaki cookie de temizlenir.
 */
export async function POST() {
  const auth = await getAuthFromRequest();
  if (!auth?.userId) {
    return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
  }
  try {
    await query("UPDATE users SET token_version = COALESCE(token_version, 0) + 1 WHERE id = $1", [auth.userId]);
  } catch (err) {
    console.error("[api/auth/logout-all]", err);
    return NextResponse.json({ error: "İşlem yapılamadı." }, { status: 500 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set(getAuthCookieName(), "", { ...getAuthCookieOptions(), maxAge: 0 });
  return res;
}
