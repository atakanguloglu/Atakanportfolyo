import { cookies } from "next/headers";
import { getAuthCookieName, verifyToken } from "@/app/lib/auth";

/**
 * API route'larda kullanım: request'ten cookie okuyup kullanıcıyı döner.
 * Giriş yapmamışsa null döner.
 */
export async function getAuthFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;
  if (!token) return null;
  return verifyToken(token);
}
