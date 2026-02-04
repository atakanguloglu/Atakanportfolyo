import { NextResponse } from "next/server";
import { getAuthCookieName } from "@/app/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(getAuthCookieName(), "", { maxAge: 0, path: "/" });
  return response;
}
