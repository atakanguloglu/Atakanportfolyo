import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/app/lib/auth-request";
import { query } from "@/app/lib/db";

/** GET /api/auth/me — Giriş yapılmış mı ve kullanıcı bilgisi (header dropdown ve profil için) */
export async function GET() {
  const auth = await getAuthFromRequest();
  if (!auth) {
    return NextResponse.json({ loggedIn: false });
  }
  try {
    const res = await query(
      "SELECT username, display_name, avatar_url FROM users WHERE id = $1",
      [auth.userId]
    );
    const u = res.rows[0];
    return NextResponse.json({
      loggedIn: true,
      user: {
        username: u?.username || auth.username || "Admin",
        display_name: u?.display_name ?? "",
        avatar_url: u?.avatar_url ?? "",
      },
    });
  } catch {
    return NextResponse.json({
      loggedIn: true,
      user: { username: auth.username || "Admin", display_name: "", avatar_url: "" },
    });
  }
}
