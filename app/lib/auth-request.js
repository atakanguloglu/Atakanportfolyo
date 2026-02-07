import { cookies } from "next/headers";
import { getAuthCookieName, verifyToken } from "@/app/lib/auth";
import { query } from "@/app/lib/db";

/**
 * API route'larda kullanım: request'ten cookie okuyup kullanıcıyı döner.
 * Giriş yapmamışsa veya token "tüm oturumları sonlandır" ile geçersiz kılınmışsa null döner.
 */
export async function getAuthFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.userId) return null;
  try {
    const res = await query("SELECT COALESCE(token_version, 0) AS token_version FROM users WHERE id = $1", [payload.userId]);
    const current = res.rows[0]?.token_version ?? 0;
    const tokenVer = payload.tokenVersion ?? 0;
    if (current !== tokenVer) return null;
  } catch (err) {
    if (err.code === "42703") {
      const tokenVer = payload.tokenVersion ?? 0;
      if (tokenVer !== 0) return null;
    } else return null;
  }
  return payload;
}
