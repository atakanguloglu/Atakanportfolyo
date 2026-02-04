import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** GET /api/auth/me — Giriş yapılmış mı (cookie ile, sitede nav için) */
export async function GET() {
  const auth = await getAuthFromRequest();
  return NextResponse.json({ loggedIn: !!auth });
}
