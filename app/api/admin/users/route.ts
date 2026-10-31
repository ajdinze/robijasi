import { NextResponse } from "next/server";
import { getCurrentUser, roles } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const actor = await getCurrentUser();
  if (!actor || actor.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Nemaš dozvolu za upravljanje korisnicima." }, { status: 403 });
  }

  const users = await getDatabase().user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const actor = await getCurrentUser();
  if (!actor || actor.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Samo super admin može dodavati korisnike." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtjev." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const role = input.role;
  if (!name || !email || !password || typeof role !== "string" || !roles.includes(role as typeof roles[number])) {
    return NextResponse.json({ error: "Ime, email, lozinka i ispravna rola su obavezni." }, { status: 400 });
  }
  if (password.length < 10) {
    return NextResponse.json({ error: "Lozinka mora imati najmanje 10 karaktera." }, { status: 400 });
  }

  try {
    const user = await getDatabase().user.create({
      data: { name, email, passwordHash: bcrypt.hashSync(password, 12), role, status: "ACTIVE" },
    });
    await getDatabase().auditLog.create({ data: { actorId: actor.id, action: "USER_CREATED", targetUserId: user.id } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Korisnik sa tim emailom već postoji." }, { status: 409 });
    }
    return NextResponse.json({ error: "Korisnik nije kreiran." }, { status: 500 });
  }
}
