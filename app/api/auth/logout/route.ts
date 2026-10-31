import { NextResponse } from "next/server";
import { clearSession, sessionCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const token = request.headers.get("cookie")?.match(new RegExp(`${sessionCookieName}=([^;]+)`))?.[1];
  await clearSession(token);
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(sessionCookieName);
  return response;
}
