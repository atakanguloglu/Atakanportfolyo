import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { verifyPassword, createToken, getAuthCookieName, getAuthCookieOptions } from "@/app/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username?.trim() || !password) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı adı ve şifre gerekli." },
        { status: 400 }
      );
    }

    const res = await query(
      "SELECT id, username, password_hash, display_name FROM users WHERE username = $1",
      [username.trim()]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı adı veya şifre hatalı." },
        { status: 401 }
      );
    }

    const user = res.rows[0];
    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı adı veya şifre hatalı." },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: user.id,
      username: user.username,
    });

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || null;
    const userAgent = request.headers.get("user-agent") || null;
    await query(
      "INSERT INTO admin_logins (user_id, username, ip_address, user_agent) VALUES ($1, $2, $3, $4)",
      [user.id, user.username, ip, userAgent]
    ).catch((e) => console.error("[api/auth/login] admin_logins insert:", e));

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, display_name: user.display_name },
    });

    response.cookies.set(getAuthCookieName(), token, getAuthCookieOptions());

    return response;
  } catch (err) {
    console.error("[api/auth/login]", err);
    return NextResponse.json(
      { success: false, error: "Giriş yapılamadı." },
      { status: 500 }
    );
  }
}
