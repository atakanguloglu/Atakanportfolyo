import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** GET /api/auth/me — Giriş yapılmış mı ve kullanıcı bilgisi (header dropdown için) */
export async function GET() {
  const auth = await getAuthFromRequest();
  if (!auth) {
    return NextResponse.json({ loggedIn: false });
  }
  return NextResponse.json({
    loggedIn: true,
    user: { username: auth.username || "Admin" },
  });
}
