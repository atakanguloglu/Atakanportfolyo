import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://atakanguloglu.com.tr";

/** POST /api/newsletter — Bülten aboneliği (e-posta kaydet) */
export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { success: false, error: "E-posta adresi gerekli." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }

    await query(
      "INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
      [email]
    );

    return NextResponse.json({
      success: true,
      message: "Bültene abone oldunuz. Yeni yazılardan haberdar edileceksiniz.",
    });
  } catch (err) {
    console.error("[api/newsletter POST]", err);
    if (err.code === "42P01") {
      return NextResponse.json(
        { success: false, error: "Sistem hazır değil. Lütfen daha sonra tekrar deneyin." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Abonelik kaydedilemedi. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}

/** GET /api/newsletter — Abone listesi (sadece admin) */
export async function GET(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }

    const res = await query(
      "SELECT id, email, created_at FROM newsletter_subscribers ORDER BY created_at DESC"
    );
    return NextResponse.json(res.rows || []);
  } catch (err) {
    console.error("[api/newsletter GET]", err);
    return NextResponse.json({ error: "Liste alınamadı." }, { status: 500 });
  }
}
