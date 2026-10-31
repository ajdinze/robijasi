import { NextResponse } from "next/server";
import { createSession, findUserByEmail, setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtjev." }, { status: 400 });
  }

  const email = typeof body === "object" && body !== null && "email" in body && typeof body.email === "string" ? body.email : "";
  const password = typeof body === "object" && body !== null && "password" in body && typeof body.password === "string" ? body.password : "";
  const user = await findUserByEmail(email);

  if (!user || user.status !== "ACTIVE" || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Pogrešan email ili lozinka." }, { status: 401 });
  }

  const database = (await import("@/lib/db")).getDatabase();
  await database.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const session = await createSession(user.id);
  const response = NextResponse.json({ ok: true });
  setSessionCookie(response, session.token, session.expiresAt);
  return response;
}
