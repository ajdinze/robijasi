import { NextResponse } from "next/server";
import { getCurrentUser, roles } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";

type RouteContext = { params: Promise<{ id: string }> };

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, context: RouteContext) {
  const actor = await getCurrentUser();
  if (!actor || actor.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Samo super admin može uređivati korisnike." }, { status: 403 });
  }
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "Neispravan korisnik." }, { status: 400 });

  const input = await request.json() as Record<string, unknown>;
  const data: { name?: string; role?: string; status?: string; passwordHash?: string } = {};
  if (typeof input.name === "string" && input.name.trim()) {
    data.name = input.name.trim();
  }
  if (typeof input.role === "string" && roles.includes(input.role as typeof roles[number])) {
    data.role = input.role;
  }
  if (input.status === "ACTIVE" || input.status === "INACTIVE") {
    data.status = input.status;
  }
  if (typeof input.password === "string" && input.password) {
    if (input.password.length < 10) return NextResponse.json({ error: "Lozinka mora imati najmanje 10 karaktera." }, { status: 400 });
    data.passwordHash = bcrypt.hashSync(input.password, 12);
  }
  if (!Object.keys(data).length) return NextResponse.json({ error: "Nema izmjena za spremanje." }, { status: 400 });

  const target = await getDatabase().user.findUnique({ where: { id }, select: { id: true, role: true, status: true } });
  if (!target) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (id === actor.id && input.status === "INACTIVE") {
    return NextResponse.json({ error: "Ne možeš deaktivirati vlastiti nalog." }, { status: 400 });
  }
  if (target.role === "SUPER_ADMIN" && (input.role === "ADMIN" || input.role === "EDITOR" || input.status === "INACTIVE")) {
    const count = await getDatabase().user.count({ where: { role: "SUPER_ADMIN", status: "ACTIVE" } });
    if (count <= 1) return NextResponse.json({ error: "Mora postojati barem jedan aktivni super admin." }, { status: 400 });
  }

  await getDatabase().user.update({ where: { id }, data });
  await getDatabase().auditLog.create({ data: { actorId: actor.id, action: "USER_UPDATED", targetUserId: id } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const actor = await getCurrentUser();
  if (!actor || actor.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Samo super admin može obrisati korisnika." }, { status: 403 });
  }
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id || id === actor.id) return NextResponse.json({ error: "Ne možeš obrisati vlastiti nalog." }, { status: 400 });
  const target = await getDatabase().user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!target) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (target.role === "SUPER_ADMIN") {
    const count = await getDatabase().user.count({ where: { role: "SUPER_ADMIN", status: "ACTIVE" } });
    if (count <= 1) return NextResponse.json({ error: "Mora postojati barem jedan aktivni super admin." }, { status: 400 });
  }
  await getDatabase().user.delete({ where: { id } });
  await getDatabase().auditLog.create({ data: { actorId: actor.id, action: "USER_DELETED", targetUserId: id } });
  return NextResponse.json({ ok: true });
}
