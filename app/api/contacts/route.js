import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/** GET /api/contacts — İletişim mesajlarını listele (sadece giriş yapmış admin) */
export async function GET() {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const res = await query(
      `SELECT id, name, email, location, budget, subject, message, created_at
       FROM contacts
       ORDER BY created_at DESC`
    );
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error("[api/contacts GET]", err);
    return NextResponse.json({ error: "Mesajlar alınamadı." }, { status: 500 });
  }
}
