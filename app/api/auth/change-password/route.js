import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";
import { verifyPassword, hashPassword } from "@/app/lib/auth";

/** POST /api/auth/change-password — Admin şifre değiştir (giriş gerekli) */
export async function POST(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth?.userId) {
      return NextResponse.json({ success: false, error: "Giriş yapın." }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Mevcut şifre ve yeni şifre gerekli." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Yeni şifre en az 6 karakter olmalı." },
        { status: 400 }
      );
    }

    const res = await query(
      "SELECT id, password_hash FROM users WHERE id = $1",
      [auth.userId]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    const user = res.rows[0];
    if (!verifyPassword(currentPassword, user.password_hash)) {
      return NextResponse.json(
        { success: false, error: "Mevcut şifre hatalı." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await query(
      "UPDATE users SET password_hash = $1 WHERE id = $2",
      [newHash, auth.userId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/auth/change-password]", err);
    return NextResponse.json(
      { success: false, error: "Şifre güncellenemedi." },
      { status: 500 }
    );
  }
}
